import hardhat from "hardhat";
import dotenv from "dotenv";
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

const abiPath = path.resolve(__dirname, '../abi.json');
const jsonString = fs.readFileSync(abiPath, 'utf-8');
const abi = JSON.parse(jsonString);


export async function addScore(id: string, winnerName: string, wins: number, loserName: string, losses: number) {
	const contractAddress = process.env.CURRENT_CONTRACT;
	const privateKey = process.env.PRIVATE_KEY;

	if (!contractAddress || !privateKey)
		throw ("CURRENT_CONTRACT or PRIVATE_KEY not defined");

	const provider = new ethers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
	const wallet = new ethers.Wallet(privateKey, provider);
	const contract = new ethers.Contract(contractAddress, abi.abi, wallet);

	try{
		const tx = await contract.addScore(id, winnerName, wins, loserName, losses);

		const reponse = await tx.wait();
		console.log("[REQUEST]\n: ", " Hash: ", tx.hash, "\n");
		console.log("[RESPONSE]\nBlock: ", reponse.blockNumber, " Hash: ",
			reponse.blockHash, "\nconfirmation: ", reponse.confirmations, "\n");
		return ("Tournament has been set");
	}
	catch (error){
		return ("Error with contract interaction");
	}
}

export async function getTournamentScore(id: string) {
	const contractAddress = process.env.CURRENT_CONTRACT;
	if (!contractAddress)
		throw ("CURRENT_CONTRACT is not defined");

	const provider = new ethers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
	const contract = new ethers.Contract(contractAddress, abi.abi, provider);

	try{
		const score = await contract.getTournamentScore(id);
		// console.log(score);
		return score;
	}
	catch (error){
		console.log("Error to get Tournament score, bad tournament id");
	}
}

export async function getMatchScore(id: string, index: number) {
	const contractAddress = process.env.CURRENT_CONTRACT;
	if (!contractAddress)
		throw ("CURRENT_CONTRACT is not defined");

	const provider = new ethers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
	const contract = new ethers.Contract(contractAddress, abi.abi, provider);

	try{
		return (await contract.getMatchScore(id, index));
	}
	catch (error){
		console.log("Error to get Match score, bad tournament id or index");
	}
}
