
## Challenge Overview: Token and Parameter Pollution Exploit

This challenge involves earning as much pollution points as possible to get the flag. Normally, this is impossible, as there is a 24 hour cooldown for polluting.
<div class = "flex flex-wrap w-[90vw] gap-4">
    <img src="/static/writeups/photos/babalovespollution.png" alt="Home Page"/>
    <img src="/static/writeups/photos/babalovespollution2.png" alt="Pollute Page"/>
</div>


This challenge involves two parts: exploiting the token system and leveraging [parameter pollution](https://book.hacktricks.xyz/pentesting-web/parameter-pollution) to bypass restrictions.

## Part 1: Token Exploitation

Each user is assigned a unique token, and the system is designed to prevent users from requesting another token within a 24-hour period. The relevant code is as follows:

```python
def has_polluted(uuid):
    # Pollution has a cooldown of a day!
    if last_polluted.get(uuid) is None:
        return False
    if time.time() - last_polluted[uuid] > 86400:
        return False
    return True
... 

if has_polluted(uuid):
    return Response("You have already polluted today!", status=400)
response = requests.get(f"{PHP_SERVER}/get_token.php?uuid={uuid}")
...
def pollute():
    ...
    last_polluted[uuid] = time.time()
```

## Bypassing the Token Check

The `has_polluted` function checks if a user (identified by `uuid`) has already polluted in the past 24 hours. However, this check can be bypassed by passing a modified `uuid` like `{your_uuid}&` into the `has_polluted` function. This creates a different key in Python, but when sent as a request to the PHP server, it looks like:

```
{PHP_SERVER}/get_token.php?uuid={your_uuid}& 
```

This still retrieves a token for the provided `uuid`, bypassing the cooldown period.

## Part 2: Parameter Pollution

The second part of the challenge involves [parameter pollution](https://book.hacktricks.xyz/pentesting-web/parameter-pollution) to manipulate the `pollute` function.

```python
@app.route("/pollute", methods = ["POST"])
def pollute():
    data = request.get_data()
    uuid = request.form.get("uuid")
    if has_polluted(uuid):
        return jsonify({"success":False,"error":"You've already polluted today!"})
    last_polluted[uuid] = time.time()
    response = requests.post(f"{PHP_SERVER}/pollute.php", headers={"content-type": request.headers.get("content-type")},data = data)
    return response.text
```

## Exploiting Parameter Pollution

The `pollute` function checks if the `uuid` has already polluted by using `request.form.get('uuid')`. In Flask, this retrieves the first instance of the `uuid` key in the parameters. However, when the data is sent to the PHP server, PHP uses the last instance of the `uuid` parameter.

This discrepancy allows us to craft a payload like:

```uri
uuid={vary_this}&uuid={your_uuid}&token={your_token}&amount=10000
```

This payload allows your account's `uuid` to be updated while still passing the checks in the Python code.

## Steps to Exploit

1. **Request a Token**: Use the modified `uuid` to bypass the token cooldown.
2. **Pollute the Parameters**: Use the crafted payload to pass the Python checks while updating your `uuid` in the PHP server.
3. **Repeat**: Repeat the process of requesting the token and updating the token three times to get your flag.

## Afterword
I thought i made this challenge too difficult at first, but more people were able to solve it than anticipated. A few solution found other ways to bypass the token check.

## Additional Resources
[Parameter Pollution](https://book.hacktricks.xyz/pentesting-web/parameter-pollution)