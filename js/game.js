import * as hand from './hand.js';
import * as score from './scoring.js';

class Player {
    constructor(seatNumber, name) {
        this.seatNumber = seatNumber;
        this.name = name;
    }
}

class Round {
    constructor(players, roundIndex) {
        this.roundNumber = roundIndex + 1;
        this.roundIndex = roundIndex;

        this.balanceCalculator = new RoundBalanceCalculator();
        this.scoreCalculator = score.ScoreCalculator.createDefaultScoreCalculator();

        this.windPhase = Math.floor(this.roundIndex/4);
        this.windIndicator = hand.WindOrder[this.windPhase % 4];

        this.eastWindPlayer = players[this.roundIndex % 4];

        this.winner = null;
        this.lastAvailableTile = false;
        this.lastTileFromWall = false;

        this.hands = [
            {player: players[0], hand: null},
            {player: players[1], hand: null},
            {player: players[2], hand: null},
            {player: players[3], hand: null},
        ];

        this.players = players;
        this.roundScores = [0, 0, 0, 0];
    }

    setHand(player, hand) {
        this.hands[player.seatNumber].hand = hand;

        this.roundScores[player.seatNumber] = this.scoreCalculator.calculateScore(this, player);
    }

    setWinner(player, lastAvailableTile, lastTileFromWall) {
        this.winner = player;
        this.lastAvailableTile = lastAvailableTile || false;
        this.lastTileFromWall = lastTileFromWall || false;

        this.players.forEach((player, index) => {
            this.roundScores[index] = this.scoreCalculator.calculateScore(this, player);
        });
    }

    getHand(player) {
        return this.hands[player.seatNumber];
    }

    getPlayerWind(player) {
        let playerIndex = (this.windPhase + player.seatNumber - (this.roundIndex + this.windPhase) % 4) % 4;

        if(playerIndex < 0) {
            return hand.WindOrder[hand.WindOrder.length + playerIndex];
        }

        return hand.WindOrder[playerIndex];
    }

    getRoundBalance() {
        return this.balanceCalculator.getBalance(this, this.players, this.roundScores);
    }
}

class RoundBalanceCalculator {
    getBalance(round, players, scores) {

        let result = [0, 0, 0, 0];

        for(let i = 0; i < players.length; i++) {
            for(let j = i+1; j < players.length; j++) {
                let p1 = players[i];
                let p2 = players[j];

                let srcIdx = p1.seatNumber;
                let otherIdx = p2.seatNumber;

                let score = 0;
                let mult = 1;

                let dealsWithEastWind = (p1 === round.eastWindPlayer || p2 === round.eastWindPlayer);
                let dealsWithWinner = (p1 === round.winner || p2 === round.winner);

                if(dealsWithEastWind) {
                    mult = 2;
                }

                let gainer, loser;

                if(dealsWithWinner) {
                    gainer = (p1 === round.winner) ? p1 : p2;
                    loser = (p1 !== round.winner) ? p1 : p2;

                    score = scores[gainer.seatNumber];
                }
                else {
                    gainer = (scores[srcIdx] >= scores[otherIdx]) ? p1 : p2;
                    loser = (scores[srcIdx] < scores[otherIdx]) ? p1 : p2;

                    score = scores[gainer.seatNumber] - scores[loser.seatNumber];
                }

                result[gainer.seatNumber] += score * mult;
                result[loser.seatNumber] -= score * mult;

            }
        }

        return result;
    }
}

class Game {
    constructor(p1, p2, p3, p4) {
        this.players = [p1, p2, p3, p4];

        this.rounds = [];
    }

    /**
     * @return {Round}
     */
    createRound() {
        let round = new Round(this.players, this.rounds.length);

        this.rounds.push(round);

        return round;
    }

    getTotalBalance(maxRoundNumber) {
        let result = [0, 0, 0, 0];

        maxRoundNumber = (maxRoundNumber === undefined) ? this.rounds.length : maxRoundNumber;

        this.rounds.slice(0, maxRoundNumber+1).forEach(round => {
            let roundBalance = round.getRoundBalance();

            result[0] += roundBalance[0];
            result[1] += roundBalance[1];
            result[2] += roundBalance[2];
            result[3] += roundBalance[3];
        });

        return result;
    }
}

// module.exports = {Game, Round, Player, RoundBalanceCalculator};
export {Game, Round, Player, RoundBalanceCalculator};