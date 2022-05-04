const { Sequelize, DataTypes, Model, Op } = require('sequelize');

const sequelize = require('./controller');
const { Student, Group, Assignment } = require('./models'); //Assignment

// Student.belongsToMany(Group, { through: Assignment });
// Group.belongsToMany(Student, { through: Assignment });

module.exports = {
  // This function will shuffle the elements of an array, using the Fisher-Yates Shuffle Algorithm
  // shuffle: (arr) => {
  //   let back = arr.length;
  //   let elem = 0;
  //   let temp = 0;

  //   while (back) {
  //     elem = Math.floor(Math.random() * back--);
  //     temp = arr[back];
  //     arr[back] = arr[elem];
  //     arr[elem] = temp;
  //   }
  //   return arr;
  // },

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
        where: { studentId: idnum },
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
            [Op.or]: arr,
          },
        },
        group: 'studentId',
      });
      resolve(pastList);
    });
    return pairQuery;
  },
};
