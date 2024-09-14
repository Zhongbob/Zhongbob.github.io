## Solve Process  
We are greeted with this webpage  
![image75](/static/writeups/photos/image75.png)

Inputting a search term into the input, we get the following   
![image76](/static/writeups/photos/image76.png)

So it seems this is a google/microsoft search rip off, where our search term is split by spaces, and each term is searched independently. 

From here we can try the following:

1. Jinja Injection  
- The web server uses python, so maybe JINJA injection is possible. However trying the payload {{1+1}} doesn’t work  
2. SQL Injection

SQL Injection  
Since the server is splitting by spaces, lets test a payload without spaces first  
**‘--**  
If the above payload returns all the data, then SQL Injection is possible.  
![image77](/static/writeups/photos/image77.png)  
And we can see all the data in the database is returned. I created a script to sift through each data entry, just in case the flag was in one of them, but it didn’t seem to be the case.

So we need to further explore SQL Injection. We know the database system used is sqlite, from the task description, so we need to explore the database by performing the UNION operator together with the sqlite\_master table, to find out all the other tables in the database  
*`<randomStringToPreventSearchResultsFromAppearing>' UNION SELECT sql FROM sqlite_master WHERE type='table'--`* 

However, our query is split by spaces. In sqlite, it is necessary to have a space between the UNION, and the SELECT. The only way around this is to find another way to put spaces in our search.  
[This](https://websec.wordpress.com/2010/12/04/sqli-filter-evasion-cheat-sheet-mysql/) Website provides a few ways to bypass whitespace filters.

The most common is to use comments /\*\*/ as a replacement for whitespaces. However, the search is using a **dynamic url endpoint**  
*`http://challs.bcactf.com:32280/search/<data>`*  
From my research, dynamic url endpoints do not allow for any **/** in the data. Double URL encoding also did not seem to work.

After some trial and error, %09 seems to work as a replacement for whitespaces. %09 stands for a **horizontal tab**, and since the server is searching strictly for spaces, it makes sense that this would work.  
*`dahdasohdshdahdls'%09UNION%09SELECT%09sql%09FROM%09sqlite\_master%09WHERE%09type='table'--`*

Submitting this into the search, we get  
![image78](/static/writeups/photos/image78.png)

Thus, simply query the flag from the flag table  
*`dahdasohdshdahdls'%09UNION%09SELECT%09flag%09FROM%09flag--`*  
![image79](/static/writeups/photos/image79.png)
