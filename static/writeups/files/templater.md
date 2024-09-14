## Solve Process
(I accidentally solved this one while just playing around with it, but ill try to explain why it worked)  
This is a website which replaces Flask’s Jinja with its own Jinja renderer   
```python
template_keys = {
    'flag': flag,
    'title': 'my website',
    'content': 'Hello, {{name}}!',
    'name': 'player'
}
```
The source code contains some default variables you can use.

For instance, if i wanted to access the title variable:  
![image97](/static/writeups/photos/image97.png)  
Renders as:  
![image98](/static/writeups/photos/image98.png)  
The “flag” variable is what we want to render, but typing that in we get:  
![image99](/static/writeups/photos/image99.png)

```python
s = template(s)

if flag in s[0]:
    return 'No flag for you!', 403
else:
    return s
```
Looking at the source code we can verify that there is a simple filter for the flag. If the flag string appears in your rendered code, it will reject your request.

```python
def template(s):
    while True:
        m = re.match(r'.*({{.+?}}).*', s, re.DOTALL)
        if not m:
            break

        key = m.group(1)[2:-2]

        if key not in template_keys:
            return f'Key {key} not found!', 500

        s = s.replace(m.group(1), str(template_keys[key]))

    return s, 200
```
This is the key renderer we will need to use. Basically, it finds every instance of **{{key}}** inside the string, gets the **key**, checks if the **key** exists, and if it does, inserts the **key** into the corresponding place.   
However, if the **key doesn’t exist**, it simply gets the **key** and returns that it was not found. **Crucially,** the key is visible to the user even if it doesn’t exist

Since we know the flag format is **tjctf{...}**, we can make use of the fact that there already exists a {} inside the flag. By passing **{{{{flag}}}** as the payload, we are able to retrieve the flag ![image102](/static/writeups/photos/image102.png)

## Why does this work?  
{{**{{flag}}**}  
First, the parse looks at the innermost most {{}}, which is bolded above. It then replaces it with the actual value of flag thats been stored. Now it looks like this (bolded is the flag that’s been replaced):  
{{**tjctf{t3mpl4t3r\_1\_h4rdly\_kn0w\_h3r\_bf644616}**}

Next the parser looks at the next {{}} and tries to replace it  
{{**tjctf{t3mpl4t3r\_1\_h4rdly\_kn0w\_h3r\_bf644616**}}  
It find’s that **tjctf{t3mpl4t3r\_1\_h4rdly\_kn0w\_h3r\_bf644616** is not a valid key, and returns the above string.