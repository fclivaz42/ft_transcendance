import { getTournamentScore } from "./interact.ts"
import { getMatchScore } from "./interact.ts"
import { addScore } from "./interact.ts"
import { deploy } from "./deploy.ts"

const contract: string = await deploy();
// const contract: string | any = process.env.CURRENT_CONTRACT;
const id = "12";
await addScore(contract, id, "Fabien", 42, "ilkay", 10);
await addScore(contract, id, "Abi", 42422424, "ilkay", 1);
await addScore(contract, id, "elenay", 5, "proute", 1);
console.log(await getTournamentScore(contract, id));
console.log(await getMatchScore(contract, id, 0));
