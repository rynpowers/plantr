const { db } = require('./models');
const {
  initializeGardenerPlotVegetable,
  createGardenerVegetablePlotRelationship,
  massCreateRandomVegetables,
  createPlotVegetableRelationship,
} = require('./seedConfig');

db.sync({ force: true })
  .then(initializeGardenerPlotVegetable)
  .then(createGardenerVegetablePlotRelationship)
  .then(massCreateRandomVegetables)
  .then(createPlotVegetableRelationship)
  .then(() => db.sync())
  .then(() => db.close())
  .catch(e => {
    console.log(e);
    db.close();
  });
