## Solve Process  
This challenge is a simple inspect element challenge. We are greeted with this landing page  
![Landing Page](/static/writeups/photos/image1.png)

Following the pro tip, we zoom out to see a bunch of sea creatures we can click on  
![image2](/static/writeups/photos/image2.png)

Alternatively, you can **inspect element** to figure out which pages to go to  
```html
<a href="/shark">...</a>
<a href="/squid">...</a>
<a href="/clam">...</a>
<a href="/shipwreck">...</a>
<a href="/whale">...</a>
<a href="/treasure">...</a>
```
Each of these endpoints bring us to a different page where different parts of the flag are hidden, with hints on where to find them. I will just briefly outline the solutions to each one  
### /shark  
Inspect element and look at the HTML  
```html
<div class="notFlagPartTrust">
  <!-- You found the shark! Part 1 of the flag: "bcactf{b3}" -->
</div>
```
### /squid
Inspect element and look at the javascript being loaded, or open the console.  
```text
You found it! Here's the second part of the flag: "t_y0u_d1"
```
### /clam  
We are given a hint in the console:  
```text
Hint: how do websites remember you? Where do websites store things?
```
Website’s store things in a few places: 

1. Databases \- On the Server  
2. Cookies \- Locally  
3. Local/Session Storage \- Locally

We can check these places by going to **inspect** \=\> **application**  
We can check both the cookies and local and session storages, to find the flag part 3 in the cookies.  
![image7](/static/writeups/photos/image7.png)

### /shipwreck
We are given a hint in the console  
![image8](/static/writeups/photos/image8.png)  
To check the response headers, we go to **Network** tab of our inspector  
![image9](/static/writeups/photos/image9.png)  
Here we can take a look at the response headers, to find the 4th part of the flag

### /whale  
No direct hints given here, so we take a look at the javascript. You can do this via the **network** tab, and double clicking **whale.js**, or simply find it under the sources tab.  
```javascript
// Part 5 of the flag: "e4sur3"
```

### /treasure  
The hint given here is   
![image11](/static/writeups/photos/image11.png)  
robots.txt is a special file which tells search engine crawlers which URLs the crawler can access on your site. Usually, it might house hidden endpoints, but for some ctfs, they just store the flag there. So, we navigate to **/treasure/robots.txt** to see it’s contents.  
![image12](/static/writeups/photos/image12.png)

The final flag is **bcactf{b3t\_y0u\_d1dnt\_f1nd\_th3\_tre4sur3\_t336e3}**