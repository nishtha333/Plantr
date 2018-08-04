const expect = require("chai").expect;
const db = require("../models");
const {Vegetable, Gardener, Plot} = db.models;

describe("Sequelize DB Relationship", () => {
    beforeEach(() => {
        return db.sync()
                 .then(() => db.seed());
    });
    it("There are 4 vegetables", () => {
        return Vegetable.findAll()
                        .then(((result) => {
                            expect(result.length).to.equal(4);
                        } ));
    });
    it("Moe's favorite vegetable is Tomato and has plot size of 100", () => {
        return Gardener.findOne({
                                    where: {name: "Moe"},
                                    include: [
                                        { model: Vegetable,
                                        as: "favorite_vegetable"
                                        }
                                    ]
                                })
                                .then(((moe) => {
                                    expect(moe.favorite_vegetable.name).to.equal("Tomato");
                                } ));
    });
    it("Plot of size 100 belongs to Moe and has 2 Vegetables", () => {
        return Plot.findOne({
                                where: {size: 100},
                                include: [ Gardener, Vegetable]
                            })
                            .then(((plot) => {
                                expect(plot.gardener.name).to.equal("Moe");
                                expect(plot.vegetables.length).to.equal(2);
                            } ));
    });
    it("Larry's plot has eggplant", () => {
        return Plot.findOne({
                            include: [ 
                                        {
                                            model: Gardener,
                                            where: {name: "Larry"}
                                        },
                                        {
                                            model: Vegetable
                                        }
                                    ]
                            })
                            .then(((plot) => {
                                expect(plot.gardener.name).to.equal("Larry");
                                expect(plot.vegetables[0].name).to.equal("Eggplant");
                            } ));
    });
    it("Potato is planted on Moe's plot'", () => {
        return Vegetable.findOne({  
                                    where: {name: "Potato"},
                                    include: {
                                                model: Plot,
                                                include: [Gardener]
                                            }
                                })
                        .then(((potato) => {
                            expect(potato.plots.length).to.equal(1);
                            expect(potato.plots[0].gardener.name).to.equal("Moe");
                        } ));
    });
});