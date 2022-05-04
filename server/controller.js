require('dotenv').config();
const { Sequelize, DataTypes, Model, Op } = require('sequelize');

const { CONNECTION_STRING } = process.env;

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;

const { shuffle, getEverybody, getPastGroups, getPastPairs } = require('./functions.js');
const { Student, Group, Assignment } = require('./models'); //Assignment

module.exports = {
  //Gets a full list of the entries in the Students table
  getList: (req, res) => {
    getEverybody().then((list) => {
      res.status(200).send(list);
    });
  },

  onePair: (req, res) => {
    let everybody = [];
    let groupArr = [];
    let pairArr = [];
    let pairedArr = [];

    getEverybody().then((list) => {
      everybody = list;
      console.log(`Everybody: `, JSON.stringify(everybody, null, 2));
    });
    getPastGroups()
      .then((groups) => {
        console.log(`Group list: `, JSON.stringify(groups, null, 2));
        groups.forEach((element) => {
          groupArr.push(element.groupId);
        });
        console.log(groupArr);
        return groupArr;
      })
      .then((arr) => {
        return getPastPairs(arr);
      })
      .then((pairs) => {
        console.log(`Pair list: `, JSON.stringify(pairs, null, 2));
        pairs.forEach((element) => {
          pairArr.push(element.studentId);
        });
        for (let i = 1; i < everybody.length; i++) {
          if (!pairArr.includes(everybody[i].id)) {
            pairedArr.push(
              `1. ${everybody[0].firstName} ${everybody[0].lastName} 2. ${everybody[i].firstName} ${everybody[i].lastName}`
            );
            break;
          }
        }
        return pairedArr;
      })
      .then((final) => {
        console.log(pairedArr);
      });
    // let pastPairs = new Promise((resolve, reject) => {
    //   let pastList = Assignment.findAll({
    //     attributes: ['studentId'],
    //     where: {
    //       groupId: {
    //         [Op.or]: groupArr,
    //       },
    //     },
    //   });
    //   resolve(pastList);
    // });
    // console.log(`Past pairs are ${pastPairs}`);
    // console.log('All students: ', JSON.stringify(fullList, null, 2));
  },

  //Randomly assigns pairings between entries in the Students table
  getPairings: (req, res) => {
    let pairedArr = [];
    // let priorPairs = [];

    getEverybody().then((studentArr) => {
      shuffle(studentArr);
      // console.log(JSON.stringify(studentArr, null, 2));
      for (let i = 0; i < studentArr.length; i += 2) {
        pairedArr.push(
          `1. ${studentArr[i].firstName} ${studentArr[i].lastName} 2. ${
            studentArr[i + 1].firstName
          } ${studentArr[i + 1].lastName}`
        );
      }
      // console.log(JSON.stringify(pairedArr, null, 2));
      res.status(200).send(pairedArr);
    });
  },
  //     // for (let i = 0; studentArr.length > 0; i++) {
  //     sequelize
  //       .query(
  //         `
  //           SELECT student_two, student_one FROM pairs
  //           WHERE student_one = 1 OR student_two = 1;
  //         `
  //       )
  //       .then((res) => {
  //         console.log(res[0]);
  //         // for (let j = 0; j < res[0].length; j++) {
  //         //   if (res[0][j].student_two != 1) {
  //         //     priorPairs.push(res[0][j].student_two);
  //         //   } else {
  //         //     priorPairs.push(res[0][j].student_one);
  //         //   }
  //         // }
  //         // for (let k = 0; k < studentArr.length; k++) {
  //         //   if (!priorPairs.includes(studentArr[k])) {
  //         //     pairedArr.push('1. ' + rawArr[0].first_name + '2. ' + studentArr[k]);
  //         //     break;
  //         //   }
  //         // }
  //       });
  //     // }

  //     // }
  //   })
  //   .then(() => {
  //     res.status(200).send(pairedArr);
  //   });
  //   // .catch((err) => console.log(err));
  // },

  seed: (req, res) => {
    (async () => {
      await sequelize.sync({ force: true });
      await Student.bulkCreate([
        { firstName: 'Amy', lastName: 'Adams' },
        { firstName: 'Billy', lastName: 'Body' },
        { firstName: 'Chester', lastName: 'Cheetah' },
        { firstName: 'Davey', lastName: 'Dillups' },
        { firstName: 'Edmund', lastName: 'Everly' },
        { firstName: 'Frankie', lastName: 'Fivetimes' },
        { firstName: 'Gilbert', lastName: 'Grape' },
        { firstName: 'Harry', lastName: 'Hambone' },
        { firstName: 'India', lastName: 'Illmatic' },
        { firstName: 'Julie', lastName: 'July' },
        { firstName: 'Kelly', lastName: 'Kapowski' },
        { firstName: 'Leslie', lastName: 'Lamour' },
      ]);
      // await Pair.bulkCreate([
      //   { studentOne: 1, studentTwo: 2 },
      //   { studentOne: 1, studentTwo: 3 },
      //   { studentOne: 1, studentTwo: 4 },
      //   { studentOne: 1, studentTwo: 5 },
      //   { studentOne: 1, studentTwo: 6 },
      //   { studentOne: 1, studentTwo: 7 },
      //   { studentOne: 1, studentTwo: 8 },
      //   { studentOne: 1, studentTwo: 9 },
      //   { studentOne: 1, studentTwo: 10 },
      //   { studentOne: 2, studentTwo: 3 },
      //   { studentOne: 2, studentTwo: 4 },
      //   { studentOne: 2, studentTwo: 5 },
      // ]);
      await Group.bulkCreate([
        { group_name: 'Group 1' },
        { group_name: 'Group 2' },
        { group_name: 'Group 3' },
        { group_name: 'Group 4' },
        { group_name: 'Group 5' },
        { group_name: 'Group 6' },
      ]);
      await Assignment.bulkCreate([
        { groupId: 1, studentId: 1 },
        { groupId: 1, studentId: 2 },
        { groupId: 1, studentId: 3 },
        { groupId: 1, studentId: 4 },
        { groupId: 1, studentId: 5 },
        { groupId: 1, studentId: 6 },
        { groupId: 1, studentId: 7 },
        { groupId: 1, studentId: 8 },
        { groupId: 1, studentId: 9 },
        { groupId: 1, studentId: 10 },
      ]);
    })().then(() => {
      console.log('DB seeded!');
      res.sendStatus(200);
    });
    // .catch((err) => console.log('error seeding DB'), err);
  },
};
