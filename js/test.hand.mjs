import * as hand from './hand.mjs';

describe('hand tests', () => {
    it('tiles equality', () => {
        chai.expect(hand.Tiles.Bamboo1.equals(new hand.SuitTile(hand.Suits.BAMBOO, 1))).to.equal(true);
    });

    it('test hand tile counts', () => {
        let h = new hand.Hand();
        h.addTile(hand.Tiles.Bamboo1);
        h.addTile(hand.Tiles.Bamboo2);
        h.addTile(hand.Tiles.Bamboo2);
        h.addTile(hand.Tiles.Bamboo2);
        h.addTile(hand.Tiles.WindEast);

        chai.expect(h.getTileCount(hand.Tiles.Bamboo2)).to.equal(3);
        chai.expect(h.getTileCount(hand.Tiles.Bamboo1)).to.equal(1);
        chai.expect(h.getTileCount(hand.Tiles.WindEast)).to.equal(1);
        chai.expect(h.getTileCount(hand.Tiles.Circle1)).to.equal(0);

        chai.expect(h.getTileCount(new hand.SuitTile(hand.Suits.BAMBOO, 2))).to.equal(3);
    });

    it('add pung to hand', () => {
        let h = new hand.Hand();

        h.addSet(new hand.Pung(false, hand.Tiles.Bamboo2));

        chai.expect(h.getTileCount(hand.Tiles.Bamboo2)).to.equal(3);
    });

    it('add kong to hand', () => {
        let h = new hand.Hand();

        h.addSet(new hand.Kong(false, hand.Tiles.Bamboo2));

        chai.expect(h.getTileCount(hand.Tiles.Bamboo2)).to.equal(4);
    });

    it('add chow to hand', () => {
        let h = new hand.Hand();

        h.addSet(new hand.Chow(false, hand.Tiles.Bamboo1, hand.Tiles.Bamboo2, hand.Tiles.Bamboo3));

        chai.expect(h.getTileCount(hand.Tiles.Bamboo1)).to.equal(1);
        chai.expect(h.getTileCount(hand.Tiles.Bamboo2)).to.equal(1);
        chai.expect(h.getTileCount(hand.Tiles.Bamboo3)).to.equal(1);
    });
})