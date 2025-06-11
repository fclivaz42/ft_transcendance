require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
	solidity: "0.8.20",
	paths: {
		sources: "./srcs/contracts",
		artifacts: "./srcs/artifacts"
	},
	networks: {
		fuji: {
			url: process.env.PROVIDER,
			accounts: [process.env.PRIVATE_KEY],
		},
	},
};
