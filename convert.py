import os 
import sys
import base64
filename = "files/Artisitic Odyessy Writeup.md"
data = []
# read the file relative to current directory
with open(os.path.join(os.path.dirname(__file__), filename), "r", encoding="latin1") as f:
    data = f.read().split("\n")
    for i in range(1, 12):
        toFind = f"[image{i}]:"
        corresImage = list(filter(lambda x: toFind in x, data))[0]
        imageDataBase64 = corresImage.split("<data:image/png;base64,")[1].split(">")[0]
        with open(os.path.join(os.path.dirname(__file__),f"image{i+119}.png"), "wb") as img:
            img.write(base64.b64decode(imageDataBase64))
        for j in range(len(data)):
            data[j] = data[j].replace(f"![][image{i}]", f"![image{i+119}](/static/writeups/photos/image{i+119}.png)")

with open(os.path.join(os.path.dirname(__file__), "new2.md"), "w", encoding="latin1") as f:
    f.write("\n".join(data))
