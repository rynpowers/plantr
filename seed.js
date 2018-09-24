const { db, Gardener, Plot, Vegetable } = require('./models');

const createNewGardener = (name, age) => Gardener.create({ name, age });
const createNewPlot = (size, shaded) => Plot.create({ size, shaded });
const createNewVegetable = (name, color, planted_on) =>
  Vegetable.create({ name, color, planted_on });

const createConnection = () => {
  return Promise.all([
    createNewGardener('Ryan', 33),
    createNewPlot(5, true),
    createNewVegetable('Carrot', 'Orange', '5/15/2018'),
  ]);
};

function syncDb() {
  return db
    .sync()
    .then(() => {
      console.log('connected');
      db.close();
    })
    .catch(error => {
      console.log(error);
      db.close();
    });
}

function setInstanceFns(data) {
  const [gardener, plot, vegetable] = data;
  // need to figure out setter fns ex. setOwner()
  // gardener.setVegetable(vegetable);
  // plot.setGardener(gardener);
  // vegetable.setPlot(plot);
  return data;
}

db.sync({ force: true })
  .then(() => createConnection())
  .then(setInstanceFns)
  .then(() => syncDb())
  .then(() => db.close())
  .catch(e => {
    db.close();
    console.log(e);
  });
