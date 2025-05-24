import dotenv from "dotenv";
import type eth from "ethers";
import { ContractFactory, ethers } from "ethers";
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const abiPath = path.resolve(__dirname, '../artifacts/srcs/contracts/TournamentScores.sol/TournamentScores.json');
const jsonString = fs.readFileSync(abiPath, 'utf-8');
const contractData = JSON.parse(jsonString);

export async function deploy() {
	const privateKey = process.env.PRIVATE_KEY;

	if (!privateKey)
		throw ("PRIVATE_KEY not defined");

	try {
		const provider: eth.JsonRpcProvider = new ethers.JsonRpcProvider(process.env.PROVIDER);
		const wallet = new ethers.Wallet(privateKey, provider);
		const factory: ContractFactory = new ethers.ContractFactory(contractData.abi, contractData.bytecode, wallet);

		const contract: eth.BaseContract = await factory.deploy();
		await contract.waitForDeployment();

		const deployed: eth.ContractTransactionResponse | null = contract.deploymentTransaction();

		if (!deployed)
			throw ("Contract Error: could not be deployed");

		contract.deploymentTransaction()?.wait;
		const address = await contract.getAddress();
		console.log("[ Contract deployed at: ", address, " ]\n");

		const receipt: eth.ContractTransactionReceipt | null = await deployed.wait();
		if (!receipt)
			throw ("Contract Error: no receipt");

		console.log("\n[ DEPLOYED ]");
		console.log("Is Mined: ", deployed.isMined);
		console.log("JSON: ", deployed.toJSON);
		console.log("Number of confirmation: ", deployed.confirmations);
		console.log("From: ", deployed.from);
		console.log("Hash: ", deployed.hash);
		console.log("Index: ", deployed.index);
		console.log("ChainId", deployed.chainId);
		console.log("Provider: ", deployed.provider);
		console.log("BlockNumber: ", deployed.blockNumber);
		console.log("BlockHash: ", deployed.blockHash);

		console.log("\n\n[ RECEIPT ]");
		console.log("FROM: ", receipt.from);
		console.log("BlockNumber", receipt.blockNumber);
		console.log("BlockHash: ", receipt.blockHash);

		return address;
	} catch (error) {
		return ("Error with contract interaction");
	}
}
