import Highlight from "../components/Highlight"
import { Writeup } from "../misc/types"
const writeupDetails: Array<Writeup> = [
    {
        title: "ProtoGrader",
        desc: "ProtoGrader was one of the difficult web challenges in Grey CTF finals. The challenge was a fun application of prototype pollution.",
        image: "protograder1.png",
        writeupFile: "protograder.md",
        datePosted: new Date("2024-07-29"),
        competition: "Greyhats CTF",
        category: "Web",
        difficulty: "Hard",
        solves: 2,
        points:500,
        sourceCode: "https://github.com/NUSGreyhats/greyctf24-challs-public/tree/main/finals/web/proto_grader",
        id: 0
    },
    {
        title: "Sea Scavenger",
        desc: "Take a tour of the deep sea! Explore the depths of webpage secrets and find the hidden treasure. Pro tip: Zoom out!",
        image: "image2.png",
        solves: 589,
        datePosted: new Date("2024-06-12"),
        competition: "BCACTF",
        category: "Web",
        difficulty: "Easy",
        writeupFile: "sea_scavenger.md",
        points: 50,
        sourceCode: null,
        id: 1
    },
    {
        title:"Phone Number",
        desc:"I was trying to sign into this website, but now it's asking me for a phone number. The way I'm supposed to input it is strange. Can you help me sign in?",
        image:"image14.png",
        solves: 528,
        datePosted: new Date("2024-06-12"),
        competition: "BCACTF",
        category: "Web",
        difficulty: "Easy",
        writeupFile: "phonenumber.md",
        points: 50,
        sourceCode: null,
        id: 2
    },
    {
        title: "Tic Tac Toe",
        desc: "My friend wrote this super cool game of tic-tac-toe. It has an AI he claims is unbeatable. I've been playing the game for a few hours and I haven't been able to win. Do you think you could beat the AI?",
        image: "image18.png",
        solves: 328,
        datePosted: new Date("2024-06-12"),
        competition: "BCACTF",
        category: "Web",
        difficulty: "Easy",
        writeupFile: "tictactoe.md",
        points: 50,
        sourceCode: null,
        id: 3
    },
    {
        title: "NoSQL",
        desc: "I found this database that does not use SQL, is there any way to break it?",
        image: "image26.png",
        hints: ["Ricardo Olsen has an ID of 1"],
        sourceCode: "https://drive.google.com/file/d/1vyXAC0Bcm2-11AWZPg8kOIq1zjBx-PFa/view?usp=sharing",
        solves: 200,
        datePosted: new Date("2024-06-12"),
        competition: "BCACTF",
        category: "Web",
        difficulty: "Medium",
        writeupFile: "nosql.md",
        points: 50,
        id: 4

    },
    {
        title: "JSLearning.com",
        desc: "Hey, can you help me with this Javascript problem? Making strings is hard.",
        hints:["Do you know any ways to run JS with just those select characters?","Do you notice anything vulnerable about the server?"],
        image: "image31.png",
        solves: 157,
        datePosted: new Date("2024-06-12"),
        points: 50,
        competition: "BCACTF",
        category: "Web",
        difficulty: "Medium",
        writeupFile: "jslearning.md",
        sourceCode: "https://drive.google.com/file/d/1db9AEn1CuUWm4THxLfzCLP8cmOoS6MLt/view?usp=drive_link",
        id: 5
    },
    {
        title: "MOC, INC.",
        desc: "Towards the end of last month, we started receiving reports about suspicious activity coming from a company called MOC, Inc. Our investigative team has tracked down their secret company portal and cracked the credentials to the admin account, but could not bypass the advanced 2FA system. Can you find your way in?",
        image: "image44.png",
        solves: 144,
        points:100,
        datePosted: new Date("2024-06-12"),
        competition: "BCACTF",
        category: "Web",
        difficulty: "Medium",
        writeupFile: "moc.md",
        sourceCode: "https://drive.google.com/file/d/1Hu171_ErKvuc9B8sZfvA1c0tx3zBj9iS/view?usp=sharing",
        id: 6
    },
    {
        title: "Cookie Clicker",
        desc: "You need to get 1e20 cookies, hope you have fun clicking!",
        image: "image50.png",
        solves: 100,
        points:100,
        datePosted: new Date("2024-06-12"),
        competition: "BCACTF",
        category: "Web",
        difficulty: "Medium",
        writeupFile: "cookie.md",
        sourceCode: "https://drive.google.com/file/d/1WO9noBDDHUXILEkHXYXSl317azurj7T2/view?usp=sharing",
        id: 7
    },
    {
        title: "Duck Finder",
        desc: "This old service lets you make some interesting queries. It hasn't been updated in a while, though.",
        image: "image58.png",
        solves: 74,
        points:100,
        datePosted: new Date("2024-06-12"),
        competition: "BCACTF",
        category: "Web",
        difficulty: "Medium",
        writeupFile: "duckfinder.md",
        sourceCode: "https://drive.google.com/file/d/1Hu171_ErKvuc9B8sZfvA1c0tx3zBj9iS/view?usp=sharing",
        id: 8
    },
    {
        title: "Fogblaze",
        desc: "Can you bypass this website's new stateless CAPTCHA system?",
        image: "image66.png",
        solves: 61,
        points:125,
        hints: ["The challengeId for \"SCLN\" would be 1e8298221a767bb37c01eb0cc61d1775"],
        datePosted: new Date("2024-06-12"),
        competition: "BCACTF",
        category: "Web",
        difficulty: "Medium",
        writeupFile: "fogblaze.md",
        sourceCode: null,
        id: 9
    },
    {
        title:"Michaelsoft Gring",
        desc:"From the makers of famous operating system Binbows comes a new search engine to rival the best: Gring. The sqlite database is super secure and has only the best search results picked by our custom AI (we forgot to train it but that's not important).",
        hints: ["I think the server is splitting by spaces - how do I put spaces in my \"search\"?"],
        image:"image75.png",
        solves: 53,
        points:100,
        datePosted: new Date("2024-06-12"),
        competition: "BCACTF",
        category: "Web",
        difficulty: "Medium",
        writeupFile: "michaelsoftgring.md",
        sourceCode: null,
        id: 10
    },
    {
        title: "User #1",
        desc: `I was working on this website and wanted you to check it out. The code is a bit of a mess, since it's only an extremely early version. In fact, you're the very first user, with ID 1!\n\nPLEASE NOTE: What you do should, in theory, not affect other solvers. Please let us know if this is not the case.`,
        hints: ["The form is vulnerable to SQL injection (it uses an UPDATE statement).","You will always have user ID 1."],
        image: "image80.png",
        solves: 38,
        points:150,
        datePosted: new Date("2024-06-12"),
        competition: "BCACTF",
        category: "Web",
        difficulty: "Hard",
        writeupFile: "user1.md",
        sourceCode: null,
        id: 11
    },
    {
        title: "Frog",
        desc: "A website about frogs. Ribbit",
        image: "image83.png",
        solves: null,
        points:null,
        datePosted: new Date("2024-05-20"),
        competition: "TJCTF",
        category: "Web",
        difficulty: "Easy",
        writeupFile: "frog.md",
        sourceCode: null,
        id: 12
    },
    {
        title: "Reader",
        desc: "A simple site reader website",
        image: "image86.png",
        solves: null,
        points:null,
        datePosted: new Date("2024-05-20"),
        competition: "TJCTF",
        category: "Web",
        difficulty: "Easy",
        writeupFile: "reader.md",
        sourceCode: null,
        id: 13
    },
    {
        title: "Fetcher",
        desc: "A simple site fetcher website",
        image: "image91.png",
        solves: null,
        points:null,
        datePosted: new Date("2024-05-20"),
        competition: "TJCTF",
        category: "Web",
        difficulty: "Easy",
        writeupFile: "fetcher.md",
        sourceCode: null,
        id: 14
    },
    {
        title:"Templater",
        desc:"A simple site template rendering website",
        image:"image97.png",
        solves: null,
        points:null,
        datePosted: new Date("2024-05-20"),
        competition: "TJCTF",
        category: "Web",
        difficulty: "Easy",
        writeupFile: "templater.md",
        sourceCode: null,
        id: 15
    },
    {
        title: "Music Checkout",
        desc: "Website to render music playlists",
        image: "image103.png",
        solves: null,
        points:null,
        datePosted: new Date("2024-05-20"),
        competition: "TJCTF",
        category: "Web",
        difficulty: "Medium",
        writeupFile: "music_checkout.md",
        sourceCode: null,
        id : 16
    },
    {
        title: "Kaboot",
        desc: "A Kahoot Ripoff",
        image: "image110.png",
        solves: null,
        points:null,
        datePosted: new Date("2024-05-20"),
        competition: "TJCTF",
        category: "Web",
        difficulty: "Hard",
        writeupFile: "kaboot.md",
        sourceCode: null,
        id: 17
    },
    {
        title:"Eat Flag Leh",
        desc:"Baba got tired of his friends not knowing where to eat, so he made a website just for that. His friends kept trying to eat his flags though, instead of the food, so Baba masterfully hid them! Can you find the flag?",
        image:"eatwhereleh.png",
        solves: 6,
        points:400,
        datePosted: new Date("2024-09-09"),
        competition: "ISC2 Singapore Chapter CTF",
        category: "Web",
        difficulty: "Easy",
        writeupFile: "eatflagleh.md",
        sourceCode: null,
        id: 18

    },
    {
        title:"View Source",
        desc:`Baba hates blind web challenges! He loves reading code, and wants other people to read code as well. So, he crafted this website to share his love!

There are some bugs that Baba is still working on fixing, but he trusts that his coding abilities are decent enough to not have accidentally created a major vulnerability in his website.
Can you prove how bad of a programmer Baba is?`,
        image:"viewsource.png",
        solves: 5,
        points:400,
        datePosted: new Date("2024-09-09"),
        competition: "ISC2 Singapore Chapter CTF",
        category: "Web",
        difficulty: "Easy",
        writeupFile: "viewsource.md",
        sourceCode: null,
        id: 19

    },
    {
        title:"Baba Loves Pollution",
        desc:`Baba loves polluting the environment so much! Everyday, he throws straws into the Ocean, he burns orphanages simply to contribute to the environmental pollution, and even takes showers of more than 25 hours a day simply to spite the children in Africa! 

In fact, he loves pollution so much that he even made a website to advertise his ideals. He has a high score of 29999kg of pollution. Do you think you can beat his high score?`,
        image:"babalovespollution.png",
        solves: 3,
        points:450,
        datePosted: new Date("2024-09-09"),
        competition: "ISC2 Singapore Chapter CTF",
        category: "Web",
        difficulty: "Easy",
        writeupFile: "babalovespollution.md",
        sourceCode: null,
        id: 20

    },
    {
        title:"Formhub",
        desc:`Baba does a form every single day, but need other people to help him fill in forms for him! So, he created a simple website to spread forms to everyone!

NOTE: ADMIN_CREDS have been set in production. No need to worry about a cheese!`,
        image:"formhub.png",
        solves: 1,
        points:500,
        datePosted: new Date("2024-09-09"),
        competition: "ISC2 Singapore Chapter CTF",
        category: "Web",
        difficulty: "Medium",
        writeupFile: "formhub.md",
        sourceCode: null,
        id: 21

    },
    {
        title:"1048576",
        desc:`Baba got too good at 2048, so he decided to create his own 2048 game. Can you beat his high score?`,
        image:"1048576.png",
        solves: 1,
        points:500,
        datePosted: new Date("2024-09-09"),
        competition: "ISC2 Singapore Chapter CTF",
        category: "Web",
        difficulty: "Medium",
        writeupFile: "1048576.md",
        sourceCode: null,
        id: 22

    },
    {
        title:"Circuitous Vertex Enigma",
        desc:`Baba got too good at 2048, so he decided to create his own 2048 game. Can you beat his high score?`,
        image:"CVE.png",
        solves: 0,
        points:500,
        datePosted: new Date("2024-09-09"),
        competition: "ISC2 Singapore Chapter CTF",
        category: "Web",
        difficulty: "Medium",
        writeupFile: "Circuitous Vertex Engima.md",
        sourceCode: null,
        id: 23

    },
    {
        title:"Baba is Lost",
        desc:`Baba went to visit the glorious nation of North Korea! However, while there, he got very lost. Now the North Korean officials are after him, because of the several war crimes he has committed in the country. He needs to navigate his way back to Singapore, but he doesn’t remember where it is! Thankfully, he has a GPS, which he can use to determine the direction Singapore is in. Can you help Baba find Singapore?`,
        image:"babaislost.png",
        solves: 6,
        points:400,
        datePosted: new Date("2024-09-09"),
        competition: "ISC2 Singapore Chapter CTF",
        category: "Misc",
        difficulty: "Easy",
        writeupFile: "baba is lost.md",
        sourceCode: "https://github.com/ISC2SG-YW/ISC2CTF-Public/tree/master/challenges/misc/Baba%20is%20lost",
        id: 24

    },
    {
        title:"Kaboom",
        desc:`Baba has learnt his lesson from last time, so he isn’t going to North Korea anymore. Unfortunately for Baba, the North Korean’s found out where he was hiding in Singapore. Determined to punish Baba for his heinous war crime of making fun of their supreme leader, they decide to drop nuclear bombs near his location. Thankfully for Baba, he managed to avoid the nuclear bombs thanks to his brilliant anti-nuclear bomb device. Unfortunately for Baba, the rest of the country is not as fortunate. Baba, being the hero he is, wants to save the remaining survivors. Can you help Baba save as many people as possible?`,
        image:"kaboom.jpg",
        solves: 0,
        points:500,
        datePosted: new Date("2024-09-09"),
        competition: "ISC2 Singapore Chapter CTF",
        category: "Misc",
        difficulty: "Medium",
        writeupFile: "kaboom.md",
        sourceCode: "https://github.com/ISC2SG-YW/ISC2CTF-Public/tree/master/challenges/misc/Kaboom",
        id: 25

    },
    {
        title:"Artistic Odyssey",
        desc:`Established in 1990, Artistic Hymn Pte. Ltd. continually updates and refreshes its webpage with the latest security measures. Help us identify any potential vulnerabilities

Challenge Created By Ensign`,
        image:"image120.png",
        solves: null,
        points:null,
        datePosted: new Date("2024-03-25"),
        competition: "Whitehacks CTF 2024",
        category: "Web",
        difficulty: "Medium",
        writeupFile: "Artisitic Odyessy Writeup.md",
        sourceCode: null,
        id: 26

    },
    {
        title:"Language, Labyrinth and (Graphics)Magick",
        desc:`Good job on identifying the source of the attack! We are one step closer to identifying the mysterious entity, but there's still much we do not know.

Beyond Discord and Uber H3, seems like our enemies are super excited about AI and using it for image transformation. Your fellow agents have managed to gain access to their image transformation app. Is there anyyy chance we could find some vulnerabilities to identify the secrets they are hiding?`,
        image:"llgm1.png",
        solves: null,
        points:null,
        datePosted: new Date("2024-09-29"),
        competition: "TISC 2024",
        category: "Web",
        difficulty: "Medium",
        writeupFile: "llgm.md",
        sourceCode: null,
        id: 27

    },
    {
        title:"Hardware isnt that Hard!",
        desc:`Shucks... it seems like our enemies are making their own silicon chips??!? They have decided to make their own source of trust, a TPM (Trusted Platform Module) or I guess their best attempt at it.

Your fellow agent smuggled one out for us to reverse engineer. Don't ask us how we did it, we just did it, it was hard ...

All we know so far is that their TPM connects to other devices using the i2c bus and does some security stuff inside. Agent! Your mission, should you choose to accept it, is to get us unparalleled intel by finding their TPM's weakness and exfiltrating its secrets.

You will be provided with the following compressed flash dump:
- MD5 (flash_dump.bin.xz) = fdff2dbda38f694111ad744061ca2f8a

Flash was dumped from the device using the command:
esptool.py -p /dev/REDACTED -b 921600 read_flash 0 0x400000 flash_dump.bin

You can perform your attack on a live TPM module via the i2c implant device hosted behind enemy lines`,
        image:"hith1.png",
        solves: null,
        points:null,
        datePosted: new Date("2024-09-29"),
        competition: "TISC 2024",
        category: "Hardware",
        difficulty: "Hard",
        writeupFile: "hith.md",
        sourceCode: null,
        id: 28

    },
    {
        title:"Noncevigator",
        desc:`I guess their Trusted Platform Modules were not so trusted afterall. What about blockchain? Blockchain is secure by design, right?

It seems like our enemies may have hidden some of their treasures somewhere along in our little island, all secured by this blockchain technology.

We have heard rumours that to access the treasure, you must navigate to the correct location and possess the correct value of the "number used only once". This unique code is essential for unlocking the fortified gate guarding the treasure!

Ensure your wallet is sufficiently funded for travel and any potential challenges you may encounter. Your journey begins now. It's your mission now - crack the code and see what treasures they are hiding!`,
        image:"noncevigator.png",
        solves: null,
        points:null,
        datePosted: new Date("2024-09-30"),
        competition: "TISC 2024",
        category: "BlockChain",
        difficulty: "Hard",
        writeupFile: "noncevigator.md",
        sourceCode: null,
        id: 29

    },
    {
        title:"Baby Flagchecker",
        desc:`You've come so far, brave agents! Let us continue our mission to identify our threats, and retrieve the crucial information that they are hiding from the world.

While scanning their network, your fellow agents chanced upon a tool used by the adversary that checks for the validity of a secret passphrase.

We know that they use this phrase for establishing communications between one another, but the one we have is way outdated... It's time for an update.`,
        image:"babyflagchecker.png",
        solves: null,
        points:null,
        datePosted: new Date("2024-09-30"),
        competition: "TISC 2024",
        category: "BlockChain",
        difficulty: "Hard",
        writeupFile: "Baby FlagChecker.md",
        sourceCode: null,
        id: 30

    },
    {
        title:"Wallfacer",
        desc:`Breaking news! We've managed to seize an app from their device.

It seems to be an app that stores user data, but doesn’t seem to do much other than that... The other agent who recovered this said he heard them say something about parts of the app are only loaded during runtime, hiding crucial details.

It's up to you now! Can you break through the walls and unveil the hidden secrets within this app?`,
        image:"wallfacer1.png",
        solves: null,
        points:null,
        datePosted: new Date("2024-10-02"),
        competition: "TISC 2024",
        category: "Reverse Engineering",
        difficulty: "Hard",
        writeupFile: "wallfacer.md",
        sourceCode: null,
        id: 31

    }

]

export default writeupDetails