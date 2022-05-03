const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = require('./controller');
const { Student } = require('./models');

module.exports = {
  // This function will shuffle the elements of an array, using the Fisher-Yates Shuffle Algorithm
  shuffle: (arr) => {
    let back = arr.length;
    let elem = 0;
    let temp = 0;

    while (back) {
      elem = Math.floor(Math.random() * back--);
      temp = arr[back];
      arr[back] = arr[elem];
      arr[elem] = temp;
    }
    return arr;
  },

  getEverybody: () => {
    const everybody = new Promise((resolve, reject) => {
      let fullList = Student.findAll({
        attributes: ['id', 'firstName', 'lastName'],
      });
      resolve(fullList);
    });
    return everybody;
  },
};
