## Solve Process
We are provided the source code for this website. Accessing the website we are met with this:  
![image86](/static/writeups/photos/image86.png)  
A simple site reader website. Likely, a link is to be set to the web servers, which then launches the link we send it. We can verify this by looking at the source code.

**app.py (Home Page)**  
```python
@app.route("/")
def index():
    global log, log_count
    site_to_visit = request.args.get("site") or ""
    url = urlparse(site_to_visit)
    if not site_to_visit:
        return render_template("index.html")
    else:
        parser = etree.HTMLParser()
        try:
            response = get(site_to_visit).text
            tree = etree.fromstring(response, parser).getroottree()
            content = get_text_repr(tree, url.scheme + "://" + url.netloc)
        except Exception as e:
            print(e)
            log_count += 1
            if log_count >= MAX_LOGS:
                log.pop(0)
                log_count = MAX_LOGS
            log.append(str(e))
            tree = etree.fromstring("<body>failed to load page</body>", parser).getroottree()
            content = get_text_repr(tree, "")
    return render_template("site_view.html", content=content)
```
**site\_view.html**  
```html
{% extends "base.html" %}

{% block title %}Site View{% endblock %}

{% block body %}
    {{ content|safe }}
{% endblock %}
```
The website fetches the website we send it, then renders the content for us to view. The rest of the code is irrelevant to the challenge. 

**app.py (monitor)**  
```python
@app.route("/monitor")
def monitor():
    if request.remote_addr in ("localhost", "127.0.0.1"):
        return render_template(
            "admin.html", message=flag, errors="".join(log) or "No recent errors"
        )
    else:
        return render_template("admin.html", message="Unauthorized access", errors="")
```

This is the endpoint we want to get to, which will contain our flag. Basically, it checks if the server is the one accessing the website. The goal of the challenge is to get the server to get the data at this directory, and then return it to the user.

Looking at the docker file, we see that the port the server is running on is **5000**

As such, simply enter **http://localhost:5000/monitor** into the view site input. The **get** function from the requests library in python will fetch the data from the endpoint, and since the request method is being done on the server, request.remote\_addr will be set to localhost, and thus the data will be sent through

![image90](/static/writeups/photos/image90.png)