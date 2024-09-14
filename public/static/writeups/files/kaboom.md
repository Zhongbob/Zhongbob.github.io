## Full Challenge Description
Baba has learnt his lesson from last time, so he isn’t going to North Korea anymore. Unfortunately for Baba, the North Korean’s found out where he was hiding in Singapore. Determined to punish Baba for his heinous war crime of making fun of their supreme leader, they decide to drop nuclear bombs near his location.

Thankfully for Baba, he managed to avoid the nuclear bombs thanks to his brilliant anti-nuclear bomb device.

Unfortunately for Baba, the rest of the country is not as fortunate. Baba, being the hero he is, wants to save the remaining survivors. 

Baba starts at (0,0), on a n x n grid. His destination is (n-1, n-1). 

However, Baba only has E stamina, meaning he can only make E number of moves. He can move to the right, down or diagonally to the bottom right square. He will pick up any survivors that are on the cell he steps on. What’s the maximum number of survivors that Baba can pick up? 

## Input/Output Format
The first line will be the n, the size of the grid Baba is on. <br/>

The second line will be E, the amount of stamina Baba has. <br/>

The next n lines will contain n values, which indicate the number of survivors on each cell. Note that the number of survivors can be negative, such that he loses survivors by stepping on that cell. <br/>

The next line will ask for an input, the maximum number of survivors Baba can pick up. <br/>
## Example
The below example is for an instance where *n = 3*, *E = 4* 
```text
Test Case 1
3
4
0 1 2
2 3 1
1 2 3
10
Correct!
Test Case 2
….
```

## Explanation
The best path is *DRDR* as this picks up the most people. Note that since (0,0) was the starting point and not stepped on, it is not counted.

There will be a total of 10 test cases with randomly generated grids. The maximum time allocated per test case is 60 seconds. 

The flag will be printed instead of the final test case if you pass the final test case. 

You may assume that Baba can always make it to the end with the given amount of Energy. Baba does not need to use up all his energy.

## Constraints
*n <= 200*

## Solution
One can solve this using dynamic programming. 

In this case, our sub problem is to make it to grid point *x*, *y* with *z* having being used. 
To link one sub problem to the previous ones, we can either:

have came from *`(x-1,y)`* (Move right) with z-1 energy

have came from *`(x,y-1)`* (Move Down) with z-1 energy

have came for *`(x-1,y-1)`* (Move Diagonally Down and to the Right) with z-1 energy

The maximum score at the point *x*,*y*,*z* will then be the maximum of the above 3 cases added with the score at that point

In addition, since we can make it to the last grid with any energy level, we must take the maximum score for *x* ,*y* with any energy level *z*.

Use memoisation to ensure the code runs quickly in n**3 time 

in addition, limit E to 2*(n-1)+1 since that is the maximum path one can take from the top left to the bottom right square.

## Code
```python
from pwn import * 

r = remote('127.0.0.1', 323)
def findPath(grid,E):
    
    n = len(grid)
    E = min(E + 1 ,2*(n-1)+1) # Since we are starting from 0, and maximum energy that can be used to reach the end is 2n -1 (i put 2n to be safe)
    dp = [[[0 if j == 0 and k == 0 else -float('inf') for i in range(E+1)] for j in range(n+1)] for k in range(n+1)]
    
    for i in range(1,n+1):
        for j in range(1,n+1):
            for k in range(1,E+1):
                dp[i][j][k] = max(dp[i-1][j][k-1],dp[i][j-1][k-1],dp[i-1][j-1][k-1])+grid[i-1][j-1]
    return max(dp[n][n])

def answer():
    print(r.recvline())
    n = int(r.recvline().strip().decode())
    e = int(r.recvline().strip().decode())
    grid = []
    for _ in range(n):
        grid.append(list(map(int,r.recvline().strip().decode().split(" "))))
    answerOf = findPath(grid,e)
    print(answerOf)
    r.sendline(str(answerOf))
    print(r.recvline())
    
    
for _ in range(10):
    answer()
print(r.recvall().decode())
```

## Afterword
The fact that noone solved this either meant i made this too hard or I have a skill issue in my code ;-; 

Oh well