


## Solve Process 
![image120](/static/writeups/photos/image120.png)  
When visiting the landing page, we see that it’s a relatively normal company page. We start by investigating the different subpages. 

There are only 2 pages which seem to have some sort of user input, the Login Page and the Enquire with us page. These will be the pages we will investigate

### Login Page
![image121](/static/writeups/photos/image121.png)  
There are usually 2 things we can do on a login page.

1. SQL/NoSQL Injections  
2. Editing HTTP request headers

![image122](/static/writeups/photos/image122.png)  
We attempt a basic SQL injection, assuming the SQL statement is something like:  
```sql
SELECT * FROM users WHERE username = '$username' AND password = '$password'
```

The above payload will result in the SQL statements becoming:  
```sql
SELECT * FROM users WHERE username = '' OR '1' = '1' AND password = '' OR '1' = '1'
```

Which would allow us to sign in successfully. 

![image123](/static/writeups/photos/image123.png)  
We are encountered with this error. Thus, we simply remove the spaces in our payload.

![image124](/static/writeups/photos/image124.png)  
This allows us to successfully log in. There are 2 additional pages which appear, the Dashboard and the Admin Dashboard. Typically, any admin page would probably have the flag, so we visit that first  
![image125](/static/writeups/photos/image125.png)  
However, it appears we are not an admin user. Let's check out the dashboard.

![image126](/static/writeups/photos/image126.png)  
It seems this user is just a regular employee, with an User Id 1\. This is probably because our above SQL injection returned all the users, and the resulting user used is the first one, which would have a user id of 1\. Lets try to select a different user instead.

![image127](/static/writeups/photos/image127.png)  
```sql
SELECT * FROM users WHERE username = '$username' AND password = '$password'
```

The above payload will result in the SQL statements becoming:  
```sql
SELECT * FROM users WHERE username = '' OR`user_id` = '2' AND password = '' OR`user_id` = '2'
```

This would select the user with user\_id 2\.  
Here, I guessed and checked the probable column names for the user Id. Usually it’s one of the following:

1. user\_id  
2. userId  
3. id

![image128](/static/writeups/photos/image128.png)  
We encountered another problem. The website now detects the SQL Injection and rejects it. This is probably because I added a \`\` to filter by a column. Typically, \`\` are not required for column names, by simply doing **‘ OR user\_id \= 2** However, this query has spaces.   
Thus, we can bypass spaces by using comments instead. /\*\*/ is a comment in SQL, and mimics a space separator. Thus, the above query should allow me to login as the person with user\_id 2\.

![image129](/static/writeups/photos/image129.png)  
We then have access to the admin panel, which reveals the flag.

## Comments  
![image130](/static/writeups/photos/image130.png)  
There is also an enquiry with us page, however, this was likely a red herring, as the form it was in does not have a destination, nor was there any type of request sent to the backend on submit.

I found out how to bypass spaces using this link:  
[https://portswigger.net/support/sql-injection-bypassing-common-filters](https://portswigger.net/support/sql-injection-bypassing-common-filters)

## TLDR  
SQL Injection on the Login Page. Use SQL injection Bypasses to bypass the space filter and select the 2nd user\_id instead of the 1st.
