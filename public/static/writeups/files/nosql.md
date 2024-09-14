## Solve Process  
Visiting the website we are greeted with a “Not a valid query” screen. We are provided with the source code, so it’s best to take a look at that first

```javascript
app.get('/', (req, res) => {
  if (!req.query.name) {
    res.send("Not a valid query :(")
    return;
  }

  let goodLines = []

  text.forEach(line => {
    if (line.match('^' + req.query.name + '$')) {
      goodLines.push(line)
    }
  });

  res.json({ "rtnValues": goodLines })
})
```
This is the endpoint we will look at first. The server looks for a query named “name”, and uses that query to iterate through each name to match all names in the text file database that match the query. Importantly, line.match uses [**regex**](https://regexone.com) to match each name. The ^ matches for the start of the string, and the $ matches for the end of the string. Ideally, this will find names that exactly match the query. We can verify this by putting the first user, Ricardo Olsen as the search query. *`http://challs.bcactf.com:30390/?name=Ricardo%20Olsen`* 
![image27](/static/writeups/photos/image27.png)

Since the query is using regex, and there’s no filtering of the query, we can insert **our own regex** into the query. If I wanted to see all the users in the database, I can set the search query to **.\***. This is a regular expression pattern that matches any sequence of characters (including none).   
*`http://challs.bcactf.com:30390/?name=.\*`*
![image28](/static/writeups/photos/image28.png)

Interestingly, we see a user called “Flag Holder”. Now we can take a look at the other parts of the code  
![image29](/static/writeups/photos/image29.png)  
This is probably where we get our flag. We probably need to query Flag Holder with the correct id.   
Remembering the hint which said that **Ricardo Olsen has an id of 1**? We can take a guess that the id’s correspond to each name’s line position in the text file (1 indexed).

This would mean that Flag Holder’s id would be 51\. His first name would be Flag and last Name would be Holder.  
*`http://challs.bcactf.com:30390/51/Flag/Holder`*

## Flag
bcactf{R3gex_WH1z_5d4fa9cdba13}
