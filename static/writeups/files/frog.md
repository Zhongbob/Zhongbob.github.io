## Solve Process
Visiting the webpage we get this  
![image83](/static/writeups/photos/image83.png)  
Inspecting elements finds no useful information in the website. As such, we visit /**robots.txt** to find any hidden directories within the website.  
![image84](/static/writeups/photos/image84.png)  
We find a hidden directory **/secret-frogger-78570618/**  
Visiting this directory leads us to a bunch of frogs. Inspecting element, we find an anchor tag containing the flag  
![image85](/static/writeups/photos/image85.png)  
**tjctf{fr0gg3r\_1\_h4rdly\_kn0w\_h3r\_3e1c574f}**