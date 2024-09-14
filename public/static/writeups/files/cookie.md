## Solve Process  
We are presented with what seems to be a cookie clicker rip off  
![image50](/static/writeups/photos/image50.png)

Clicking the cookie increases the points each time. We can see what’s going on under the hood via burpsuite  
*Client*  
![image51](/static/writeups/photos/image51.png)  
*Server*  
![image52](/static/writeups/photos/image52.png)

A websocket is being used, and it seems a JSON is being sent over, with a power and value level. Our goal is to achieve a high number of clicks, so manually clicking is out of the question. Lets look at the source code  
```javascript
if (json.value != sessions[socket.id]) {
  socket.emit("error", "previous value does not match")
}

let oldValue = sessions[socket.id]
let newValue = Math.floor(Math.random() * json.power) + 1 + oldValue

sessions[socket.id] = newValue
socket.emit('recievedScore', JSON.stringify({"value": newValue}));

if (json.power > 10) {
  socket.emit("error", JSON.stringify({"value": oldValue}));
}

errors[socket.id] = oldValue;
```
So it seems the current value is being increased by one, and then increased by a random number according the the value of the power provided.

A few things to note:

1. We cannot provide our own “value” in the JSON, as it is being checked with the one stored in the backend.  
2. An error value is used to keep track of the previous value, which is the value it will be reverted to on error.  
3. It seems the power cannot exceed 10, if it is, it will try to revert the value back to the old value.  
4. However on closer inspection, it seems the new value is still updated in the backend, even if the power exceeds 10

```javascript
socket.on('receivedError', (msg) => {
  sessions[socket.id] = errors[socket.id]
  socket.emit('recievedScore', JSON.stringify({"value": sessions[socket.id]}));
});
```
This is the other key part of the code, if the server receives an error from the client, it will try to revert the score back to it’s original value. However the key part is that this is done **by the client**. If the client does not send the receivedError message, then the score will not be reverted. Heres a simple diagram to illustrate this

The server has yet to revert the cookie value yet.

So the problem is, since the revert command is instructed by the client, we can simply drop this command so that the revert command never reaches the server. This is done either by doing the “DROP” command in burpsuite. 

As such, in burpsuite’s interceptor, set the power value of the initial command to a very high value  
![image55](/static/writeups/photos/image55.png)

When the error is received, drop it so it never makes it to the client, so the client never processes and tells the server to revert the score  
![image56](/static/writeups/photos/image56.png)

Then click the cookie again to get the flag  
![image57](/static/writeups/photos/image57.png)