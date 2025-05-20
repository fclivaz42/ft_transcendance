import hardhat from "hardhat";
const { ethers } = hardhat;
import dotenv from "dotenv";

dotenv.config();

export async function interact() {
	const contractAddress = process.env.CURRENT_CONTRACT;
	const { ethers } = hardhat;

	const ContractFactory = await ethers.getContractFactory("TournamentScores");
	const contract = await ContractFactory.attach(contractAddress);

	const nickname = "darix";

	const scores = await contract.getScores(nickname);

	console.log(`Scores for nickname "${nickname}":`);

	scores.forEach((score: any, i: number) => {
		const tournamentId = score.tournamentId ?? score[0];
		const wins        = score.wins ?? score[1];
		const losses      = score.losses ?? score[2];
		const draws       = score.draws ?? score[3];

		console.log(`#${i + 1} - tournamentId: ${tournamentId}, wins: ${wins}, losses: ${losses}, draws: ${draws}`);
	});
	return "Interaction finish";
}

interact();
