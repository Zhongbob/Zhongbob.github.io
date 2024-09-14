## Solve Process  
This Challenge involves beating a tic tac toe AI. We are greeted by the following screen  
![image18](/static/writeups/photos/image18.png)

We can click the squares to place our move, then the AI responds.  
![image19](/static/writeups/photos/image19.png)

The AI plays perfectly (I think), so there’s no way to actually **legally** beat the AI.  
Lets inspect what’s happening when we play a move using burpsuite  
```json
{
  "packetId": "move",
  "position": 6
}
```

The website uses a Websocket. Everytime we click a move, it sends the above JSON to tell the server what our move is. 
The server responds by sending us the new state of the board  
```json
{
  "packetId": "board",
  "board": [
    "X",
    "",
    "",
    "O",
    "",
    "O",
    "X",
    "",
    ""
  ]
}
```
An idea would be to try placing our move on a tile that already has a circle placed by the AI.

Of course, the front end wont let us do this, but maybe the backend doesn’t check it? We can test this by editing the JSON sent from the client via burp suite.  
Inspecting the HTML allows us to determine which button is which  
```html
<button class="btn btn-primary game-btn" id="cell10">X</button>
<button class="btn btn-primary game-btn" id="cell11"></button>
<button class="btn btn-primary game-btn" id="cell12"></button>
<button class="btn btn-primary game-btn" id="cell13">O</button>
<button class="btn btn-primary game-btn" id="cell14">O</button>
<button class="btn btn-primary game-btn" id="cell15"></button>
<button class="btn btn-primary game-btn" id="cell16">X</button>
<button class="btn btn-primary game-btn" id="cell17"></button>
<button class="btn btn-primary game-btn" id="cell18"></button>
```

Then, for the following board, we just need to place our tile at the circled tile, which is *cell 3*\.  
![image23](/static/writeups/photos/image23.png)

Just edit the request as such:  
```json
{
  "packetId": "move",
  "position": 3
}
```
And we are able to win the game and get the flag.  
![image25](/static/writeups/photos/image25.png)