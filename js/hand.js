

const Suits = {
    BAMBOO: 'bamboo',
    CIRCLE: 'circle',
    CHARACTER: 'character',
    DRAGON: 'dragon',
    WIND: 'wind',
    BONUS: 'bonus',
};

const Dragons = {
    RED: 'red',
    GREEN: 'green',
    WHITE: 'white',
};

const Winds = {
    EAST: 'east',
    WEST: 'west',
    NORTH: 'north',
    SOUTH: 'south',
};

const Bonus = {
    FLOWER1: 'flower1',
    FLOWER2: 'flower2',
    FLOWER3: 'flower3',
    FLOWER4: 'flower4',
    SUMMER: 'summer',
    SPRING: 'spring',
    AUTUMN: 'autumn',
    WINTER: 'winter',
};


class Tile {
    constructor(isSuit, isHonour) {
        this.isSuit = isSuit;
        this.isHonour = isHonour;
    }

    equals(other) {
        if(this.isSuit !== other.isSuit) {
            return false;
        }

        return this.isHonour === other.isHonour;
    }

    toTypeString() {
        `[Tile ${this}]`;
    }
}

class SuitTile extends Tile {
    constructor(suit, number) {
        super(true, number < 2 || number > 8);

        this.suit = suit;
        this.number = number;
    }

    toString() {
        return `[SuitTile ${this.suit}${this.number}]`
    }

    toTypeString() {
        return `suit-${this.suit}-${this.number}`;
    }

    equals(other) {
        if(!super.equals(other)) {
            return false;
        }

        if(this.suit !== other.suit) {
            return false;
        }

        return this.number === other.number;
    }
}

class DragonTile extends Tile {
    constructor(kind) {
        super(false, true);

        this.dragonKind = kind;
    }

    toString() {
        return `[DragonTile ${this.dragonKind}]`
    }

    toTypeString() {
        return `dragon-${this.dragonKind}`;
    }

    equals(other) {
        if(!super.equals(other)) {
            return false;
        }

        return this.dragonKind === other.dragonKind;
    }
}

class WindTile extends Tile {
    constructor(kind) {
        super(false, true);

        this.windKind = kind;
    }

    toString() {
        return `[WindTile ${this.windKind}]`
    }

    toTypeString() {
        return `wind-${this.windKind}`;
    }

    equals(other) {
        if(!super.equals(other)) {
            return false;
        }

        return this.windKind === other.windKind;
    }
}

class BonusTile extends Tile {
    constructor(kind) {
        super(false, false);

        this.bonusKind = kind;
    }

    toTypeString() {
        return `bonus-${this.bonusKind}`;
    }

    equals(other) {
        if(!super.equals(other)) {
            return false;
        }

        return this.bonusKind === other.bonusKind;
    }
}

const Tiles = {
    Circle1: new SuitTile(Suits.CIRCLE, 1),
    Circle2: new SuitTile(Suits.CIRCLE, 2),
    Circle3: new SuitTile(Suits.CIRCLE, 3),
    Circle4: new SuitTile(Suits.CIRCLE, 4),
    Circle5: new SuitTile(Suits.CIRCLE, 5),
    Circle6: new SuitTile(Suits.CIRCLE, 6),
    Circle7: new SuitTile(Suits.CIRCLE, 7),
    Circle8: new SuitTile(Suits.CIRCLE, 8),
    Circle9: new SuitTile(Suits.CIRCLE, 9),

    Bamboo1: new SuitTile(Suits.BAMBOO, 1),
    Bamboo2: new SuitTile(Suits.BAMBOO, 2),
    Bamboo3: new SuitTile(Suits.BAMBOO, 3),
    Bamboo4: new SuitTile(Suits.BAMBOO, 4),
    Bamboo5: new SuitTile(Suits.BAMBOO, 5),
    Bamboo6: new SuitTile(Suits.BAMBOO, 6),
    Bamboo7: new SuitTile(Suits.BAMBOO, 7),
    Bamboo8: new SuitTile(Suits.BAMBOO, 8),
    Bamboo9: new SuitTile(Suits.BAMBOO, 9),

    Character1: new SuitTile(Suits.CHARACTER, 1),
    Character2: new SuitTile(Suits.CHARACTER, 2),
    Character3: new SuitTile(Suits.CHARACTER, 3),
    Character4: new SuitTile(Suits.CHARACTER, 4),
    Character5: new SuitTile(Suits.CHARACTER, 5),
    Character6: new SuitTile(Suits.CHARACTER, 6),
    Character7: new SuitTile(Suits.CHARACTER, 7),
    Character8: new SuitTile(Suits.CHARACTER, 8),
    Character9: new SuitTile(Suits.CHARACTER, 9),

    DragonRed: new DragonTile(Dragons.RED),
    DragonWhite: new DragonTile(Dragons.WHITE),
    DragonGreen: new DragonTile(Dragons.GREEN),

    WindEast: new WindTile(Winds.EAST),
    WindWest: new WindTile(Winds.WEST),
    WindNorth: new WindTile(Winds.NORTH),
    WindSouth: new WindTile(Winds.SOUTH),

    BonusFlower1: new BonusTile(Bonus.FLOWER1),
    BonusFlower2: new BonusTile(Bonus.FLOWER2),
    BonusFlower3: new BonusTile(Bonus.FLOWER3),
    BonusFlower4: new BonusTile(Bonus.FLOWER4),
    BonusSummer: new BonusTile(Bonus.SUMMER),
    BonusSpring: new BonusTile(Bonus.SPRING),
    BonusAutumn: new BonusTile(Bonus.AUTUMN),
    BonusWinter: new BonusTile(Bonus.WINTER),
};

const TileGroups = {
    [Suits.BAMBOO]: [Tiles.Bamboo1, Tiles.Bamboo2, Tiles.Bamboo3, Tiles.Bamboo4, Tiles.Bamboo5, Tiles.Bamboo6, Tiles.Bamboo7, Tiles.Bamboo8, Tiles.Bamboo9],
    [Suits.CIRCLE]: [Tiles.Circle1, Tiles.Circle2, Tiles.Circle3, Tiles.Circle4, Tiles.Circle5, Tiles.Circle6, Tiles.Circle7, Tiles.Circle8, Tiles.Circle9],
    [Suits.CHARACTER]: [Tiles.Character1, Tiles.Character2, Tiles.Character3, Tiles.Character4, Tiles.Character5, Tiles.Character6, Tiles.Character7, Tiles.Character8, Tiles.Character9],
    [Suits.DRAGON]: [Tiles.DragonRed, Tiles.DragonGreen, Tiles.DragonWhite],
    [Suits.WIND]: [Tiles.WindWest, Tiles.WindEast, Tiles.WindNorth, Tiles.WindSouth],
    [Suits.BONUS]: [Tiles.BonusFlower1, Tiles.BonusFlower2, Tiles.BonusFlower3, Tiles.BonusFlower4,
        Tiles.BonusSummer, Tiles.BonusSpring, Tiles.BonusAutumn, Tiles.BonusWinter],
};

const WindOrder = [
    Tiles.WindEast,
    Tiles.WindSouth,
    Tiles.WindWest,
    Tiles.WindNorth,
];

class TileSet {
    constructor(revealed, tiles) {
        this.isRevealed = revealed;
        this.tiles = tiles;

        this.simpleSet = (tiles[0] instanceof SuitTile) && !tiles[0].isHonour;
    }

    getTile() {
        return this.tiles[0];
    }
}

class Chow extends TileSet {
    constructor(revealed, tile1, tile2, tile3) {
        super(revealed, [tile1, tile2, tile3]);
    }
}

class Pung extends TileSet {
    constructor(revealed, tile) {
        super(revealed, [tile, tile, tile]);
    }
}

class Kong extends TileSet {
    constructor(revealed, tile) {
        super(revealed, [tile, tile, tile, tile]);
    }
}

class Pair extends TileSet {
    constructor(tile) {
        super(false, [tile, tile]);
    }
}

class FreeTiles extends TileSet {
    constructor(tiles) {
        super(false, tiles);
    }
}


class Hand {
    constructor() {
        this.tiles = [];
        this.sets = [];
    }

    addTile(tile) {
        this.tiles.push(tile);
    }

    getTileCount(tile) {
        return this.tiles.filter((t) => t.equals(tile)).length;
    }

    addSet(tileSet) {
        this.sets.push(tileSet);
        this.tiles = this.tiles.concat(tileSet.tiles);
    }

    /**
     * @return {Array<TileSet>}
     */
    getSetsOfType(clazz, tileType) {
        let result = this.sets.filter((tileSet) => tileSet instanceof clazz);

        if(tileType) {
            result = result.filter((tileSet) => tileSet.getTile() instanceof tileType)
        }

        return result;
    }

    getTilesOfType(tileType) {
        return this.tiles.filter(tile => tile instanceof tileType);
    }
}

// module.exports = {
//     Hand, Tiles, SuitTile, Suits, Dragons, DragonTile, Winds, WindTile, Bonus, BonusTile,
//     Chow, Kong, Pung, Pair, WindOrder
// };

export {
    Hand, Tiles, SuitTile, Suits, Dragons, DragonTile, Winds, WindTile, Bonus, BonusTile,
    Chow, Kong, Pung, Pair, FreeTiles, WindOrder, TileGroups
};