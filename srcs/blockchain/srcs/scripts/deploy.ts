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

		console.log("Trying to deploy contract...");
		const contract: eth.BaseContract = await factory.deploy();
		await contract.waitForDeployment();

		const deployed: eth.ContractTransactionResponse | null = contract.deploymentTransaction();

		if (!deployed)
			throw ("Contract Error: could not be deployed");

		contract.deploymentTransaction()?.wait;
		const address = await contract.getAddress();
		console.log("\n╔════════════════════════════════════");
		console.log("║ Deployed.");
		console.log("║");
		console.log("╠═    Contract deployed at:[", address, "]");
		console.log("║");

		const receipt: eth.ContractTransactionReceipt | null = await deployed.wait();
		if (!receipt)
			throw ("║\tContract Error: no receipt");

		console.log("╠═    [ RESPONSE ]");
		console.log("║\t From: ", deployed.from);
		console.log("║\t Hash: ", deployed.hash);
		console.log("║\t ChainId: ", deployed.chainId);
		console.log("║");
		console.log("╠═    [ RECEIPT ]");
		console.log("║\t BlockNumber: ", receipt.blockNumber);
		console.log("║\t BlockHash: ", receipt.blockHash);
		console.log("║");
		console.log("╚══════════════════════════════════════\n");

		return address;
	} catch (error) {
		return ("Error with contract interaction");
	}
}
