## About the Challenge

This is a **JWT** challenge about gaining admin access through changing the **JWT token**. We are greeted with a simple home page, with an admin panel. There's nothing worth noting about the home page.

![fanpage](/static/writeups/photos/fanpage1.png)

Visiting the admin page, we see that we are being rejected as we are not the admin user.

![admin page](/static/writeups/photos/fanpage2.png)

Since verification is involved, cookies are most likely being used to verify the identity of the user. We can inspect the cookies to find a cookie called **`token`**:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1ZXN0IiwiZXhwIjoxNzMyNjQyMDY5fQ.elYdjQKmr2uxC6r7EGLwat0939yIGiOiFN8pisioFwg
```

This is a [JWT Token](https://en.wikipedia.org/wiki/JSON_Web_Token), as there are two dots separating the three chunks of data: the header, payload, and signature. We can use a website like [jwt.io](https://jwt.io) or simply use Burp Suite's JSON Web Token Extension to decode the token:

```json
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "username": "guest",
  "exp": 1732642069
}
```

## Solve Process

Blind JWT token spoofing is usually limited to the following (for simple challenges):

1. Invalid/No Signature Checks
2. None Type Headers
3. JWT Secret Bruting

## Invalid/No Signature Checks

We can test this by using Burp Suite to modify the payload and giving it a random key to generate the signature. JWT works by using a secret password (**JWT Secret**) and parsing it with the payload to form a signature.

However, if the backend does not check whether a signature is valid or not, we will be able to change our payload to whatever we want.

We can take a guess that the username should be **`admin`**. When we do this, we are greeted by this screen:

```html
<h1>You are STILL not the admin! Go away hacker!!!</h1>
```

<br/>

## None Type Headers

Some vulnerable applications will not check the signature if we set the header algorithm to `None`. We can once again use Burp Suite to test this vulnerability:

![fanpage3](/static/writeups/photos/fanpage3.png)

This returns the same error and does not work.

## JWT Secret Bruting

Lastly, we can try brute-force guessing the JWT secret used in the signing of the signature. If the secret chosen was a common one, then we would easily be able to find the key and thus sign our own payloads.

You can use a variety of tools to do this. I used [jwt-cracker](https://github.com/lmammino/jwt-cracker). You will also need a wordlist, which will be our guesses for the JWT secret. The most common wordlist used is [rockyou.txt](https://www.kaggle.com/datasets/wjburns/common-password-list-rockyoutxt). This is my command (assuming `rockyou.txt` is in the same directory):

```sh
jwt-cracker -t eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1ZXN0IiwiZXhwIjoxNzMyNjQyMDY5fQ.elYdjQKmr2uxC6r7EGLwat0939yIGiOiFN8pisioFwg -d rockyou.txt
```

Running this, we will get our JWT Secret to be **`i-love-shark`**. We can now use this to sign our JWT token to set the username to **`admin`**.

## Flag

```
blahaj{Jwt_BrUt3f0Rc3_9291}
```

## Resources

- [JWT Cracker](https://github.com/lmammino/jwt-cracker)  
- [What is JWT?](https://en.wikipedia.org/wiki/JSON_Web_Token)  
- [JWT (HackTricks)](https://book.hacktricks.xyz/pentesting-web/hacking-jwt-json-web-tokens)