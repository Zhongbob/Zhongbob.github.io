
## Challenge Overview: XSS + SQL Injection (SQLI)

The challenge involved a "Formhub" Website in which users were able to login to post their own forms! An admin bot will visit their forms if they clicked the report button. 

<div class = "flex flex-wrap w-[90vw] gap-4">
    <img src="/static/writeups/photos/formhub.png" alt="Home Page"/>
    <img src="/static/writeups/photos/formhub2.png" alt="Welcome Page"/>
    <img src="/static/writeups/photos/formhub3.png" alt="SignIn Page"/>
    <img src="/static/writeups/photos/formhub5.png" alt="Form Page" />
    <img src="/static/writeups/photos/formhub4.png" alt="Post Form Page"/>
</div>

With admin bots being involved, it should hint at either CSRF or XSS. 

This challenge involves both XSS and SQL injection vulnerabilities, which can be exploited as follows:

## SQL Injection

The following code snippet is vulnerable to SQL injection:

```python
cursor.executescript(f"INSERT INTO forms (formName, formLink, creatorId, formDescription) VALUES ('{formName}', '{formLink}', '{userId}', '{formDescription}')")
```

This line allows the execution of multiple SQL queries by injecting malicious SQL into the `formDescription` field. For example, setting `formDescription` to `'; {SQL} --` allows for arbitrary SQL execution.

## Cross-Site Scripting (XSS)

The `welcome` page contains a vulnerability that can be exploited for XSS:

```html
{{username | safe}}
```

The `|safe` filter indicates that the `username` will not be escaped or filtered, making it susceptible to XSS attacks. If you can change the `username` of the admin user to your XSS payload via SQL injection, you can trigger the XSS when the admin user visits the `/welcome` page.

## Bypassing Filters

There is a simple filter implemented for reporting pages:

```python
if "forms" not in url:
    url = url + "/forms"
```

This can be bypassed by setting the URL to something like `/welcome?forms`, effectively bypassing the filter.

## Exploitation Steps

1. **SQL Injection:** Use SQL injection to modify the admin user's username to your XSS payload.
2. **XSS Execution:** Get the admin user to visit the `welcome` page, where your XSS payload will execute.

To exfiltrate cookies or other sensitive information via the XSS payload, you can use a webhook (e.g., RequestBin) to capture the data.

## Afterword
Surprised there was only 1 solve on this. I figured I made this too easy for a medium challenge. Making this challenge was fun tho :P


## Additional Resources
[SQLI](https://book.hacktricks.xyz/pentesting-web/sql-injection)
[XSS](https://book.hacktricks.xyz/pentesting-web/xss-cross-site-scripting)