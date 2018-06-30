
import * as h from './hand.js';


function calcPungKongValue(baseValue, tileSet) {
    if(!tileSet.simpleSet) {
        baseValue *= 2;
    }

    if(!tileSet.isRevealed) {
        baseValue *= 2;
    }

    return baseValue;
}

function applyMultipliers(numMultipliers, value) {
    for(let i = 0; i < numMultipliers; i++) {
        value *= 2;
    }

    return value;
}

class ScoreCalculator {
    constructor(pointsRules, multipliersForAll, multipliersForWinner) {
        this.pointsRules = pointsRules;
        this.multiplierRulesForAll = multipliersForAll;
        this.multiplierRulesForWinner = multipliersForWinner;
    }

    calculateScore(round, player) {
        let hand = round.getHand(player).hand;

        if(hand === null) {
            return 0;
        }

        let appliedPoints = [];
        let appliedMultipliers = [];

        let points = this.pointsRules.reduce((value, rule) => {
            let p = rule.getPoints(hand, round, player);
            if(p) {
                appliedPoints.push({rule: rule, amount: p});
            }
            return value + (p || 0)
        }, 0);

        let multipliers = this.multiplierRulesForAll.reduce((value, rule) => {
            let mult = rule.getMultipliers(hand, round, player);

            if(mult) {
                appliedMultipliers.push({rule: rule, amount: mult});
            }

            return value + (mult || 0)
        }, 0);

        if(round.winner === player) {
            multipliers = this.multiplierRulesForWinner.reduce((value, rule) => {
                let mult = rule.getMultipliers(hand, round, player);

                if(mult) {
                    appliedMultipliers.push({rule: rule, multiplier: mult});
                }

                return value + (mult || 0)
            }, multipliers);
        }

        console.log('FFFFF', appliedPoints, '::', appliedMultipliers);

        return applyMultipliers(multipliers, points);
    }

    static createDefaultScoreCalculator() {
        let pointsRules = [
            new BonusTilePoints(),
            new PointsForPairOfRoundWindRule(),
            new PointsForPairOfOwnWindRule(),
            new PointsForPairOfDragonsRule(),
            new PointsForPungRule(),
            new PointsForKongRule(),
            new PointsForMahjong(),
            new PointsForLastAvailableTile(),
            new PointsForLastTileFromWall(),
        ];
        let multiplierRulesForAll = [
            new DragonSetMultiplier(),
            new RoundWindSetMultiplier(),
            new OwnWindSetMultiplier(),
            new ThreeConcealedPungsMultiplier(),
            new ThreeLittleSagesMultiplier(),
            new ThreeGrandSagesMultiplier(),
            new FourLittleBlessingsMultiplier(),
            new FourGrandBlessingsMultiplier(),
        ];
        let multiplierRulesForWinner = [
            new PureChowsMultiplier(),
            new NoChowsMultiplier(),
            new HalfColorMultiplier(),
        ];

        return new ScoreCalculator(pointsRules, multiplierRulesForAll, multiplierRulesForWinner);
    }
}

//#region Rules for points

class PointsRule {
    getPoints(hand, round, player) {}
}

class PointsForTilesetRule extends PointsRule {

    getPoints(hand, round, player) {
        return hand.sets.reduce((value, tileSet) => value + (this.getTilesetValue(tileSet, round, player) || 0), 0);
    }

    getTilesetValue(tileSet, round, player) {return 0}
}

class PointsForTileRule extends PointsRule {

    getPoints(hand, round, player) {
        return hand.tiles.reduce((value, tile) => value + (this.getTileValue(tile) || 0), 0);
    }

    getTileValue(tile) {return 0}
}

class BonusTilePoints extends PointsForTileRule {
    getTileValue(tile) {
        if(tile instanceof h.BonusTile) {
            return 4;
        }
    }
}

class PointsForPairOfDragonsRule extends PointsForTilesetRule {

    getTilesetValue(tileSet, round, player) {
        if(!(tileSet instanceof h.Pair)) {
            return
        }

        if(tileSet.getTile() instanceof h.DragonTile) {
            return 2;
        }
    }
}

class PointsForPairOfRoundWindRule extends PointsForTilesetRule {

    getTilesetValue(tileSet, round) {
        if(!(tileSet instanceof h.Pair)) {
            return
        }

        if(round.windIndicator.equals(tileSet.getTile())) {
            return 2;
        }
    }
}

class PointsForPairOfOwnWindRule extends PointsForTilesetRule {

    getTilesetValue(tileSet, round, player) {
        if(!(tileSet instanceof h.Pair)) {
            return
        }

        if(round.getPlayerWind(player).equals(tileSet.getTile())) {
            return 2;
        }
    }
}

class PointsForPungRule extends PointsForTilesetRule {

    getTilesetValue(tileSet, round, player) {
        if(tileSet instanceof h.Pung) {
            return calcPungKongValue(2, tileSet);
        }
    }
}

class PointsForKongRule extends PointsForTilesetRule {

    getTilesetValue(tileSet, round, player) {
        if(tileSet instanceof h.Kong) {
            return calcPungKongValue(8, tileSet);
        }
    }
}

class PointsForMahjong extends PointsRule {

    getPoints(hand, round, player) {
        if(round.winner === player) {
            return 20;
        }
    }
}

class PointsForLastAvailableTile extends PointsRule {

    getPoints(hand, round, player) {
        if(round.winner === player && round.lastAvailableTile) {
            return 2;
        }
    }
}

class PointsForLastTileFromWall extends PointsRule {

    getPoints(hand, round, player) {
        if(round.winner === player && round.lastTileFromWall) {
            return 2;
        }
    }
}

//#endregion

//#region Rules for multipliers

class MultiplierRule {
    getMultipliers(hand, round, player) {}
}

class DragonSetMultiplier extends MultiplierRule {
    getMultipliers(hand) {

        return hand.getSetsOfType(h.Kong, h.DragonTile).concat(hand.getSetsOfType(h.Pung, h.DragonTile)).length;
    }
}

class RoundWindSetMultiplier extends MultiplierRule {
    getMultipliers(hand, round) {
        let windSets = hand.getSetsOfType(h.Kong, h.WindTile).concat(hand.getSetsOfType(h.Pung, h.WindTile));

        return windSets.filter(tileSet => tileSet.getTile().equals(round.windIndicator)).length;
    }
}

class OwnWindSetMultiplier extends MultiplierRule {
    getMultipliers(hand, round, player) {
        let windSets = hand.getSetsOfType(h.Kong, h.WindTile).concat(hand.getSetsOfType(h.Pung, h.WindTile));

        return windSets.filter(tileSet => tileSet.getTile().equals(round.getPlayerWind(player))).length;
    }
}

class ThreeConcealedPungsMultiplier extends MultiplierRule {

    getMultipliers(hand, round, player) {
        let pungs = hand.getSetsOfType(h.Pung).filter(tileSet => !tileSet.isRevealed);

        if(pungs.length >= 3) {
            return 1;
        }
    }
}

class ThreeLittleSagesMultiplier extends MultiplierRule {

    getMultipliers(hand, round, player) {
        let dragonSets = hand.getSetsOfType(h.Kong, h.DragonTile).concat(hand.getSetsOfType(h.Pung, h.DragonTile));
        let dragonPairs = hand.getSetsOfType(h.Pair, h.DragonTile);

        if(dragonSets.length >= 2 && dragonPairs.length >= 1) {
            return 1;
        }
    }
}

class ThreeGrandSagesMultiplier extends MultiplierRule {

    getMultipliers(hand, round, player) {
        let dragonSets = hand.getSetsOfType(h.Kong, h.DragonTile).concat(hand.getSetsOfType(h.Pung, h.DragonTile));

        if(dragonSets.length >= 3) {
            return 2;
        }
    }
}

class FourLittleBlessingsMultiplier extends MultiplierRule {

    getMultipliers(hand, round, player) {
        let windSets = hand.getSetsOfType(h.Kong, h.WindTile).concat(hand.getSetsOfType(h.Pung, h.WindTile));
        let windPairs = hand.getSetsOfType(h.Pair);

        if(windSets.length >= 3 && windPairs.length >= 1) {
            return 1;
        }
    }
}

class FourGrandBlessingsMultiplier extends MultiplierRule {

    getMultipliers(hand, round, player) {
        let windSets = hand.getSetsOfType(h.Kong, h.WindTile).concat(hand.getSetsOfType(h.Pung, h.WindTile));

        if(windSets.length >= 4) {
            return 2;
        }
    }
}

class PureChowsMultiplier extends MultiplierRule {

    constructor() {
        super();

        this.pointRules = [
            new PointsForPairOfDragonsRule(),
            new PointsForPairOfOwnWindRule(),
            new PointsForPairOfRoundWindRule(),
            new BonusTilePoints(),
        ]
    }

    getMultipliers(hand, round, player) {
        let kongsAndPungs = hand.getSetsOfType(h.Kong).concat(hand.getSetsOfType(h.Pung));

        let points = this.pointRules.reduce((value, rule)=> value + (rule.getPoints(hand, round, player) || 0), 0);

        if(kongsAndPungs.length === 0 && points === 0) {
            return 1;
        }
    }
}

class NoChowsMultiplier extends MultiplierRule {

    getMultipliers(hand, round, player) {
        let chows = hand.getSetsOfType(h.Chow).length;
        let pungs = hand.getSetsOfType(h.Pung).length;
        let kongs = hand.getSetsOfType(h.Kong).length;

        if(chows === 0 && (pungs + kongs) > 0) {
            return 1;
        }
    }
}

class HalfColorMultiplier extends MultiplierRule {

    getMultipliers(hand, round, player) {
        let charTiles = hand.getTilesOfType(h.SuitTile).filter(tile => tile.suit === h.Suits.CHARACTER);
        let bambooTiles = hand.getTilesOfType(h.SuitTile).filter(tile => tile.suit === h.Suits.BAMBOO);
        let circleTiles = hand.getTilesOfType(h.SuitTile).filter(tile => tile.suit === h.Suits.CIRCLE);

        let hasCharTiles = charTiles.length > 0;
        let hasBambooTiles = bambooTiles.length > 0;
        let hasCircleTiles = circleTiles.length > 0;

        if(hasCharTiles + hasBambooTiles + hasCircleTiles === 1) {
            return 1;
        }
    }
}

//#endregion

// module.exports = {ScoreCalculator};
export {ScoreCalculator};