## Full Challenge Description
This Challenge is a competitive programming question. 

Baba went to visit the glorious nation of North Korea! However, while there, he got very lost. Now the North Korean officials are after him, because of the several war crimes he has committed in the country. He needs to navigate his way back to Singapore, but he doesn’t remember where it is! Thankfully, he has a GPS, which he can use to determine the direction Singapore is in. Can you help Baba find Singapore?

Baba knows he is on a n x n square grid, and that he is currently located at (x¬¬1, y1). He only has log2 n tries to get to Singapore, before he’s caught.

For each input, Baba will tell you which direction Singapore is in.

If Singapore is located on a perfectly vertical or horizontal axis, then he will output the following:

“N” represents North, “S” represents South, “E” represents East, and “W” represents West. 
If Singapore is not perfectly on a vertical or horizontal, then Baba will tell you more specifically which direction Singapore is in:

“NE” represents North East, “NW” represents North West, “SE” represents South East, and “SW” represents South West.

## Input/Output Format
The first line will be the n, the size of the grid Baba is on. 
The second line is the x1, y1 coordinate that baba is on, seperated by a space. 0 0 represents the top left corner of the grid.
The third line is direction Singapore is in. 
The following lines require an input, which is the new coordinate (x,y) Baba should navigate to. It will then output the direction Singapore is in.

## Example
The below example is for an instance where n = 5. Baba is at (2,2), and Singapore is at (3,4)<br/>
```text
Test Case 1
5
2 2
NE
Your Guess: 2 3
NE
Your Guess: 2 4
E
Your Guess: 3 4 
You have arrived at Singapore!
Test Case 2
… 
```


There will be a total of 10 test cases with randomly generated coordinates. You have to pass all test cases in at most log2(n) attempts. n will range from 10 to 10^10, and increases by a factor of 10 for each test case. 
The flag will be printed instead of the final test case if you pass the final test case. 

## Solution
The query limitations of log2(n) should hint at a binary search solution, as binary search takes log2(n) time. 
We are given a 2D Grid. We are given all 8 directions each time we query a point. 

Each time we query a point, we can definitely split our search area in at least a quarter, between the **top left** (NW), **top right** (NE), **bottom left** (SW), **bottom right** (SE) rectangle.

Afterwards, we binary search by **halving both** the x and y coordinates we are searching through. This essentially places us in the middle of the rectangle, optimising our search

This will get us the location we want in at most log2(n) queries.

## Code
```python
from pwn import * 

r = remote('127.0.0.1', 12345)
def answer():
    print(r.recvline())
    n = int(r.recvline().strip().decode())
    x,y = r.recvline().strip().decode().split()
    x = int(x)
    y = int(y)
    lx,ty,rx,by = 0,0,n,n
    direction = r.recvline().decode().strip()
    if "N" in direction:
        by = y 
    if "S" in direction:
        ty = y
    if "E" in direction:
        lx = x
    if "W" in direction:
        rx = x
    while True:
        x = (lx+rx)//2
        y = (ty+by)//2
        r.sendline(f"{x} {y}")
        direction = r.recvline().decode().strip()
        if "Singapore" in direction:
            print("Success!",direction)
            break
        if "N" in direction:
            by = y - 1 
        if "S" in direction:
            ty = y + 1
        if "E" in direction:
            lx = x + 1
        if "W" in direction:
            rx = x - 1
for _ in range(10):
    answer()
print(r.recvall().decode())
```

## Resources
[Binary Search](https://www.geeksforgeeks.org/binary-search/)
