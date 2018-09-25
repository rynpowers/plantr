const { Gardener, Plot, Vegetable } = require('./models');

const randomDate = () => {
  let [start, end] = [new Date(2018, 5, 1), new Date()];
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const Gardeners = [
  ['Ryan', 33],
  ['Hillary', 30],
  ['Daisy', 8],
  ['Fred', 80],
  ['Gwen', 47],
];

const Vegetables = [
  ['Carrot', 'Orange', randomDate()],
  ['Tomato', 'Red', randomDate()],
  ['Cabbage', 'Purple', randomDate()],
  ['Kale', 'Green', randomDate()],
  ['Potato', 'Brown', randomDate()],
  ['Celary', 'Green', randomDate()],
  ['Zucchini', 'Green', randomDate()],
  ['Squash', 'Yellow', randomDate()],
  ['Romaine', 'Green', randomDate()],
  ['Beet', 'Purple', randomDate()],
  ['Eggplant', 'Purple', randomDate()],
];

// generate some random input for object instances
const randomNumber = () => Math.floor(Math.random() * 11);
const randomBool = () => Math.random() > 0.5;
const veggieIndex = () => Math.floor(Math.random() * Vegetables.length);

// Use function to create object instances so we can call function.apply() with array of arguments

// creates an instance of Gardener
const createGardener = (name, age) => Gardener.create({ name, age });
// creates and instance of Vegetable
const createVegetable = (name, color, planted_on) =>
  Vegetable.create({ name, color, planted_on });

// creates an instance of a gardener, vegetable and plot
module.exports.initializeGardenerPlotVegetable = () => {
  const gardeners = [];
  const plots = [];
  const vegetables = [];

  Gardeners.forEach(gardener => {
    gardeners.push(createGardener.apply(this, gardener));
    plots.push(Plot.create({ size: randomNumber(), shaded: randomBool() }));
    vegetables.push(createVegetable.apply(this, Vegetables[veggieIndex()]));
  });

  return Promise.all([
    Promise.all(gardeners),
    Promise.all(plots),
    Promise.all(vegetables),
  ]);
};

// sets relationships between each instance
// Only including single vegetable to assign favorite vegetable to gardener
// gardener => vegetable
// plot => gardener
// vegetable <=> plot
module.exports.createGardenerVegetablePlotRelationship = data => {
  const [gardeners, plots, vegetables] = data;

  gardeners.forEach((gardener, i) => {
    let [plot, vegetable] = [plots[i], vegetables[i]];

    gardener.setVegetable(vegetable);
    plot.setGardener(gardener);
    plot.addVegetable(vegetable);
  });

  return plots;
};

// create 50 vegetables to seed the db
module.exports.massCreateRandomVegetables = plots => {
  const promises = [Promise.resolve(plots)];
  const length = Gardeners.length * 10;

  for (let i = 0; i < length; i++) {
    promises.push(createVegetable.apply(this, Vegetables[veggieIndex()]));
  }
  return Promise.all(promises);
};

// fill association table with plot <=> vegetable relationship
// many <=> many
module.exports.createPlotVegetableRelationship = data => {
  const plots = data.shift();
  const promises = [];

  while (data[0]) {
    const plot = plots[Math.floor(Math.random() * plots.length)];
    const vegetable = data.pop();

    plot.addVegetable(vegetable);
  }

  return Promise.all(promises);
};
