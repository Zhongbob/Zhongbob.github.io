## Solve Process
This is relatively similar to **reader**.   
![image91](/static/writeups/photos/image91.png)  
We are allowed to input a url and, presumably, the server fetches the url we give it. 

**app.js (/fetch)**  
```javascript
try {
  const checkURL = new URL(url);

  if (checkURL.host.includes('localhost') || checkURL.host.includes('127.0.0.1')) {
    return res.send('invalid url');
  }
} catch (e) {
  return res.send('invalid url');
}

const r = await fetch(url, { redirect: 'manual' });

const fetched = await r.text();

res.send(fetched);
```
The web application is coded in express.js instead of python, and there is a check for whether the url includes localhost, or 127.0.0.1. If so, it returns a invalid url to the user, instead of executing the fetch request.

**app.js (/flag)**  
```javascript
app.get('/flag', (req, res) => {
  if (req.ip !== '::ffff:127.0.0.1' && req.ip !== '::1' && req.ip !== '127.0.0.1') {
    return res.send('bad ip');
  }

  res.send(`hey myself! here's your flag: ${flag}`);
});

```
And here's our endpoint. The similar checks as [reader](/writeups/13) are being performed. Other than *`127.0.0.1`* however, this time the server also checks if the ip is *`::1`* or *`::ffff:127.0.0.1`*. These are hints as to what we can do. *`127.0.0.1`* is an ipv4 address, while *`::1`* and *`::ffff:127.0.0.1`* are both ipv6 addresses. What if we used an IPV6 Address instead of an IPV4 address to access the website?

```javascript
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```
Also, the last line of the code tells us which port the server is running on

As such, instead of using *`http://localhost`* as we did previously, we can visit *`http://\[::\]:3000/flag`*, which is the **IPV6** method of accessing a URL. You can read up on other ways to bypass such checks [here](https://highon.coffee/blog/ssrf-cheat-sheet/). 

![image95](/static/writeups/photos/image95.png)