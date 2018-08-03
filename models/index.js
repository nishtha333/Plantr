const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL);

const Gardener = db.define('gardener', {
    name: Sequelize.STRING,
    age: Sequelize.INTEGER
});

const Plot = db.define('plot', {
    size: Sequelize.INTEGER,
    shaded: Sequelize.BOOLEAN
});

const Vegetable = db.define('vegetable', {
    name: Sequelize.STRING,
    color: Sequelize.STRING,
    planted_on: Sequelize.DATEONLY
});

Plot.belongsTo(Gardener);
Plot.belongsToMany(Vegetable, {through: "plot_vegetable"});
Vegetable.belongsToMany(Plot, {through: "plot_vegetable"});
Gardener.belongsTo(Vegetable, {as: "favorite_vegetable"});

const sync = () => {
    return db.sync({force: true});
}

const close = () => {
    db.close();
}

const seed = () => {
    //Order Creation: Vegetable, Gardener, Plot, Plot_Vegetable
    return Promise.all([
        Vegetable.create({name: "Tomato", color: "Red", planted_on: "2018-01-01"}),
        Vegetable.create({name: "Potato", color: "Brown", planted_on: "2018-02-01"}),
        Vegetable.create({name: "Eggplant", color: "Purple", planted_on: "2018-03-01"}),
        Vegetable.create({name: "Carrot", color: "Red", planted_on: "2018-04-01"}),
    ]).then(([tomato, potato, eggplant, carrot]) => {
        return Promise.all([
            Gardener.create({name: "Moe", age: 30, favoriteVegetableId: tomato.id}),
            Gardener.create({name: "Larry", age: 32, favoriteVegetableId: carrot.id}),
            Gardener.create({name: "Curly", age: 33, favoriteVegetableId: eggplant.id})
        ]).then(([moe, larry, curly]) => {
            return Promise.all([
                Plot.create({size:100, shaded:true, gardenerId:moe.id}),
                Plot.create({size:200, shaded:true, gardenerId:larry.id}),
                Plot.create({size:300, shaded:true, gardenerId:curly.id}),
            ])
        }).then(([plot_moe, plot_larry, plot_curly]) => {
            return Promise.all([
                plot_moe.addVegetable(carrot),
                plot_moe.addVegetable(potato),
                plot_larry.addVegetable(eggplant),
                plot_curly.addVegetable(carrot)
            ])
        })
    });
};

module.exports = {
    sync,
    seed,
    close,
    models: {
        Gardener,
        Plot,
        Vegetable
    }
}