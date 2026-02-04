const { ethers } = require("ethers");
const contractJson = require("../blockchain/ReputationContract.json");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// paste ONE private key from hardhat node
const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const wallet = new ethers.Wallet(privateKey, provider);

// paste deployed contract address
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const contract = new ethers.Contract(
    contractAddress,
    contractJson.abi,
    wallet
);

async function updateReputation(hash, suspicious) {
    const tx = await contract.updateReputation(hash, suspicious);
    await tx.wait();
}

async function getReputation(address) {
    return await contract.getReputation(address);
}

module.exports = { updateReputation, getReputation, wallet };
