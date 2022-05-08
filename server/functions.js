const { Sequelize, DataTypes, Model, Op } = require('sequelize');

const sequelize = require('./controller');
const { Student, Group, Assignment } = require('./models'); //Assignment

// Student.belongsToMany(Group, { through: Assignment });
// Group.belongsToMany(Student, { through: Assignment });

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
        order: sequelize.random(),
      });
      resolve(fullList);
    });
    return everybody;
  },

  getPastGroups: (idnum) => {
    let pairQuery = new Promise((resolve, reject) => {
      let pairedList = Assignment.findAll({
        attributes: ['groupId'],
        where: {
          [Op.and]: [{ studentId: idnum }, { ishidden: false }],
        },
      });
      resolve(pairedList);
    });
    return pairQuery;
  },

  getPastPairs: (arr) => {
    // console.log(arr);
    let pairQuery = new Promise((resolve, reject) => {
      let pastList = Assignment.findAll({
        attributes: ['studentId'],
        where: {
          groupId: {
            [Op.in]: arr,
            [Op.not]: null,
          },
          ishidden: false,
        },
        group: 'studentId',
      });
      resolve(pastList);
    });
    return pairQuery;
  },

  storeTriples: (arr, arr2, studentId) => {
    arr.push(studentId);
    let deadly = +arr
      .sort((a, b) => {
        return a - b;
      })
      .join('');
    arr2.push(deadly);
  },

  storeHiddenGroups: (arr, arr2) => {
    arr.push(...arr2);
    console.log(`to be hidden: `, arr);
  },
};
