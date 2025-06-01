# README - Solidity Blockchain Module


Welcome to the Solidity module of the project! This module integrates a complete blockchain infrastructure into the system, enabling smart contract deployment and interaction via a RESTful API. Everything runs inside Docker, and all components are tested and functional.

---

## 🚀 Quick Start

Make sure Docker is running, then:

```bash
make up
```

This will build and start the blockchain service. Once it's up, the API will be available at `http://127.0.0.1:8080`.

---

## ✅ API Endpoints

All routes are exposed via Fastify and run on **port 8080**.

### 🔹 Deploy the Smart Contract

```bash
curl -X POST http://127.0.0.1:8080/deploy
```

Returns the **address hash** of the deployed contract.

### 🔹 Add a Score

Create a file named `file.json` with the following format:

```json
{
  "id": "12345",
  "winner": "Ilkay",
  "winnerScore": 142,
  "loser": "Fabien",
  "loserScore": 13
}
```

Send the data:

```bash
curl -X POST -H "Content-Type: application/json" --data @file.json http://127.0.0.1:8080/addscore
```

### 🔹 Retrieve a Match Score

```bash
curl http://127.0.0.1:8080/match-score/id/:id/index/:index
```

* `:id`: Tournament ID
* `:index`: Match number (0-indexed)

### 🔹 Retrieve Full Tournament Scores

```bash
curl http://127.0.0.1:8080/tournament-score/id/:id
```

* `:id`: Tournament ID

---

## 📦 Project Structure & Features

### 🛠 Infrastructure Setup

* `Makefile` with `build`, `start`, and `stop` commands for containers
* Dedicated Docker Compose file: `srcs/blockchain/docker-compose.yml`
* Integrated into the main Docker system: `srcs/docker-compose.yml`

### 🧾 Smart Contract

* Solidity contract: `TournamentScores.sol`
* Functions:

  * Add score
  * Retrieve all scores by tournament ID
  * Retrieve individual match by index

### 🧪 Hardhat Environment

* Configured with `hardhat.config.cjs`
* Dependencies in `package.json`:

  * `hardhat`
  * `ethers`
  * `typescript`

### 🌐 API (Fastify)

Located in `srcs/blockchain/srcs/scripts/routes/`:

* `deploy.ts` - deploys the smart contract
* `addscore.ts` - adds a match result
* `tournament-score.ts` - fetches all scores from a tournament
* `match-score.ts` - fetches one specific match from a tournament

---

## ✅ Status

All systems are functional and operational.

* API is live at `http://127.0.0.1:8080`
* Docker containers run successfully
* Smart contract deploys and interacts as expected

Feel free to test it, extend it, and integrate it with the rest of the application!
