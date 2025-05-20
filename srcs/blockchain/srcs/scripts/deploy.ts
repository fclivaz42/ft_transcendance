import hardhat from "hardhat";
import dotenv from "dotenv";
const { ethers } = hardhat;

dotenv.config();

async function deploy() {
	const ContractFactory = await ethers.getContractFactory("TournamentScores");
	const contract = await ContractFactory.deploy();

	await contract.waitForDeployment();

	console.log("Contract deployed to: ", await contract.getAddress());
}
