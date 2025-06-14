import hardhat from "hardhat";
import dotenv from "dotenv";
import type eth from "ethers";
import { ethers } from "ethers";
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

interface Score {
	tournamentId: string;
	wins: number;
	losses: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const abiPath = path.resolve(__dirname, '../artifacts/srcs/contracts/TournamentScores.sol/TournamentScores.json');
const jsonString = fs.readFileSync(abiPath, 'utf-8');
const abi = JSON.parse(jsonString);


export async function addScore(contractAddress: string, id: string, winnerName: string, wins: number, loserName: string, losses: number) {
	const privateKey = process.env.PRIVATE_KEY;

	if (!privateKey)
		throw ("PRIVATE_KEY not defined");

	const provider: eth.JsonRpcProvider = new ethers.JsonRpcProvider(process.env.PROVIDER);
	const wallet: eth.Wallet = new ethers.Wallet(privateKey, provider);
	const contract: eth.Contract = new ethers.Contract(contractAddress, abi.abi, wallet);

	try {
		console.log("Add Score to contract...");
		const tx: eth.ContractTransactionResponse = await contract.addScore(id, winnerName, wins, loserName, losses);

		if (!tx)
			throw ("tx null");
		const receipt: eth.TransactionReceipt | null = await tx.wait();
		if (!receipt)
			throw ("receipt null");
		console.log("\n╔════════════════════════════════════");
		console.log("║ AddScore.");
		console.log("║");
		console.log("╠═    [ RESPONSE ]");
		console.log("║\t Hash:\t", tx.hash);
		console.log("║\t From:\t", tx.from);
		console.log("║\t To:\t", tx.to);
		console.log("║");
		console.log("╠═    [RECEIPT]");
		console.log("║\t Block:\t", receipt.blockNumber);
		console.log("║\t Hash:\t", receipt.blockHash);
		console.log("║\t Confirmation:\t", await receipt.confirmations());
		console.log("║");
		console.log("║\t -- [ Score added successfully ] --");
		console.log("║");
		console.log("╚══════════════════════════════════════\n");
		return (await contract.getAddress());
	}
	catch (error) {
		return ("Error with contract interaction");
	}
}

export async function getTournamentScore(contractAddress: string, id: string) {

	const provider: eth.JsonRpcProvider = new ethers.JsonRpcProvider(process.env.PROVIDER);
	const contract: eth.Contract = new ethers.Contract(contractAddress, abi.abi, provider);

	try {
		const tx = await contract.getTournamentScore(id);
		return (tx);
	}
	catch (error) {
		console.log("Error to get Tournament score, bad tournament id");
	}
}

export async function getMatchScore(contractAddress: string, id: string, index: number) {

	const provider: eth.JsonRpcProvider = new ethers.JsonRpcProvider(process.env.PROVIDER);
	const contract: eth.Contract = new ethers.Contract(contractAddress, abi.abi, provider);

	try {
		return (await contract.getMatchScore(id, index));
	}
	catch (error) {
		console.log("Error to get Match score, bad tournament id or index");
	}
}
