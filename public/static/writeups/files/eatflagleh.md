## Solve Process
This is an inspector element.
![Website](/static/writeups/photos/eatwhereleh.png)

*Flag Part 1* requires inspecting the html of the website. The flag is hidden inside a hidden label
```html
<label hidden>Flag Part 1: ISC2CTF{nOm</label>
<label hidden>Who needs frameworks when you have good old plain css</label>
```

*Flag Part 2* is hinted to by the hint. It is found in the index.css file
```javascript
/* Flag part 2: _Nom_f1a9*/
/* Js do it */
```

*Flag Part 3* is in the javascript, as per the hint. The function is a caesar cipher, so one either needs to decrypt it, or simply run the javascript and log the result.
```javascript
function flagPart3(str, shift) {
    if (shift < 0) return flagPart3(str, shift + 26);
    let result = '';
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char.match(/[a-z]/i)) {
            const code = str.charCodeAt(i);
            if (code >= 65 && code <= 90) {
                result += String.fromCharCode(((code - 65 + shift) % 26) + 65);
            } else if (code >= 97 && code <= 122) {
                result += String.fromCharCode(((code - 97 + shift) % 26) + 97);
            }
        } else {
            result += char;
        }
    }
}

flagPart3("_Mw_CYQ",-4)
```

*Flag part 4* is located in the restaurants.json file. It is found by inspecting the requests. 
```json
{
    "id": "1516",
    "mall": "Jurong Point",
    "title": "Flag Part 4",
    "storeNumber": "#JP69",
    "websiteLink": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "directoryLink": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "price": "0",
    "cuisineType": "[\"Include Unlabelled Data\"]",
    "description": "Heres the flag: __36Tg,\nBeep beep Boop boop",
    "img": "[\"https://cdn-icons-png.flaticon.com/512/608/608675.png\"]",
    "gpted": "0",
    "food": "[\"Include Unlabelled Data\"]",
    "broadFoodCategory": "",
    "openingHours": "",
    "checked": "1"
}
```

*Flag part 5* is located in the robots.txt file
```text
Flag Part 5 (Final Part): )3*d9<*}
```

## Final Flag
```text
ISC2CTF{nOm_Nom_f1a9_Is_YUM__36Tg,)3*d9<*}
```

## Afterword
I was the original author for this challenge. Was not expecting people to be confused over the flag format. I apologise if it was unclear. The code was taken from one of my existing projects, Eat Where Leh. You can visit the actual website [here](https://eatwhereleh.x10.mx). It is a website to help you decide where to eat when you are indecisive.