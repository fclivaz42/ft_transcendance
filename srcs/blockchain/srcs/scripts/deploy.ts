import hardhat from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function deploy() {
	const ContractFactory = await hardhat.ethers.getContractFactory("TournamentScores");
	const contract = await ContractFactory.deploy();

	await contract.waitForDeployment();

	console.log("Contract deployed to: ", await contract.getAddress());
}
deploy();
