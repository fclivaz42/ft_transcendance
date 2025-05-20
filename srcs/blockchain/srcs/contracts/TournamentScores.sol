// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TournamentScores {
    struct Score {
        uint256 tournamentId;
        uint256 wins;
        uint256 losses;
        uint256 draws;
    }

    mapping(string => Score[]) private nicknameToScores;

    function addScore(
        string memory nickname,
        uint256 tournamentId,
        uint256 wins,
        uint256 losses,
        uint256 draws
    ) public {
        Score memory newScore = Score(tournamentId, wins, losses, draws);
        nicknameToScores[nickname].push(newScore);
    }

    function getScores(string memory nickname) public view returns (Score[] memory) {
        return nicknameToScores[nickname];
    }
}

