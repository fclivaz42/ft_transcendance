// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TournamentScores {
	struct Player{
		string player;
		uint256 score;
	}

	struct Score {
		Player wins;
		Player losses;
    }

    mapping(string => Score[]) private scores;

    function addScore(string memory tournamentId, string memory winnerName,
					  uint256 wins, string memory loserName, uint256 losses) public {
		Player memory winner = Player(winnerName, wins);
		Player memory loser = Player(loserName, losses);
        Score memory newScore = Score(winner, loser);
        scores[tournamentId].push(newScore);
    }

    function getTournamentScore(string memory id) public view returns (Score[] memory) {
        return scores[id];
    }
	function getMatchScore(string memory id, uint index) public view returns (string memory winnerName,
						uint256 winnerScore, string memory loserName, uint256 loserScore) {
		Score storage score = scores[id][index];
		return (score.wins.player, score.wins.score, score.losses.player, score.losses.score);
	}
}
