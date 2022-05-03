require('dotenv').config();
const { Sequelize, DataTypes, Model } = require('sequelize');

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

const { shuffle, getEverybody } = require('./functions.js');
const { Student, Pair } = require('./models');

// const getEverybody = new Promise((resolve, reject) => {
//   let fullList = Student.findAll({
//     attributes: ['id', 'firstName', 'lastName'],
//   });
//   resolve(fullList);
// });

const getPairList = new Promise((resolve, reject) => {
  let pairList = Pair.findAll({
    attributes: ['studentTwo'],
    where: {
      studentOne: 1,
    },
  });
  resolve(pairList);
});

module.exports = {
  //Gets a full list of the entries in the Students table
  getList: (req, res) => {
    getEverybody().then((list) => {
      res.status(200).send(list);
    });
  },

  onePair: (req, res) => {
    console.log('Endpoint set up');
    getEverybody().then(console.log('Everybody, everybody'));
    getPairList.then((pairs) => {
      // console.log(`Pair list: `, JSON.stringify(pairs, null, 2));
      console.log(pairs.includes(2));
    });
    // console.log('All students: ', JSON.stringify(fullList, null, 2));
  },

  //Randomly assigns pairings between entries in the Students table
  getPairings: (req, res) => {
    let pairedArr = [];
    let priorPairs = [];

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
  },

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
      await Pair.bulkCreate([
        { studentOne: 1, studentTwo: 2 },
        { studentOne: 1, studentTwo: 3 },
        { studentOne: 1, studentTwo: 4 },
        { studentOne: 1, studentTwo: 5 },
        { studentOne: 1, studentTwo: 6 },
        { studentOne: 1, studentTwo: 7 },
        { studentOne: 1, studentTwo: 8 },
        { studentOne: 1, studentTwo: 9 },
        { studentOne: 1, studentTwo: 10 },
        { studentOne: 2, studentTwo: 3 },
        { studentOne: 2, studentTwo: 4 },
        { studentOne: 2, studentTwo: 5 },
      ]);
    })().then(() => {
      console.log('DB seeded!');
      res.sendStatus(200);
    });
    // .catch((err) => console.log('error seeding DB'), err);
  },
};
