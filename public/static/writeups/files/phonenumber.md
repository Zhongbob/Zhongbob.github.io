## Solve Process
We are brought to a website, where we have to key in our phone number by rolling a dice  
![image13](/static/writeups/photos/image13.png)  
![image14](/static/writeups/photos/image14.png)

Our goal is to key in the phone number in the question description, **1234567890\.** It should be noted that the text input cannot be edited, since it is set to read only, and some funny javascript is preventing you from changing it. Of course, you can probably just override the javascript, but i found it easier to just intercept the request.

I used [**burpsuite**](https://portswigger.net/burp/communitydownload) to better inspect and edit the requests being sent to the server.

This is request being sent  
![image15](/static/writeups/photos/image15.png)

The body of the request seems to be the phone number sent to the server.

As such, in burpsuite, we can easily edit the request being sent, to directly send our desired phone number  
![image16](/static/writeups/photos/image16.png)  
![image17](/static/writeups/photos/image17.png)
