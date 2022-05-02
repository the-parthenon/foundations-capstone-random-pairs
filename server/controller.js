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

// This function will shuffle the elements of an array, using the Fisher-Yates Shuffle
const shuffle = (arr) => {
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
};

const Student = sequelize.define('Student', {
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
});

module.exports = {
  getList: (req, res) => {
    let fullList = [];
    (async () => {
      fullList = await Student.findAll({
        attributes: ['id', 'firstName', 'lastName'],
      });
      console.log('All students: ', JSON.stringify(fullList, null, 2));
    })().then(() => {
      res.status(200).send(fullList);
    });
  },

  // getPairings: (req, res) => {
  //   const studentArr = [];
  //   const pairedArr = [];
  //   let rawArr = [];
  //   const priorPairs = [];
  //   sequelize
  //     .query(
  //       `
  //         SELECT * FROM students;
  //       `
  //     )
  //     .then((res) => {
  //       // console.log(res[0].toJSON());
  //       // rawArr = JSON.parse(res[0]);
  //       // res[0].forEach((elem) => {
  //       //   rawArr.push(elem);
  //       // });
  //       console.log(`The raw Arr is ${rawArr}`);
  //       res[0].forEach((elem) => {
  //         let studentId = elem['student_id'];
  //         studentArr.push(studentId);
  //       });

  //       shuffle(studentArr);
  //       console.log(`Student array is ${studentArr}`);

  //       // for (let i = 0; studentArr.length > 0; i++) {
  //       sequelize
  //         .query(
  //           `
  //             SELECT student_two, student_one FROM pairs
  //             WHERE student_one = 1 OR student_two = 1;
  //           `
  //         )
  //         .then((res) => {
  //           console.log(res[0]);
  //           // for (let j = 0; j < res[0].length; j++) {
  //           //   if (res[0][j].student_two != 1) {
  //           //     priorPairs.push(res[0][j].student_two);
  //           //   } else {
  //           //     priorPairs.push(res[0][j].student_one);
  //           //   }
  //           // }
  //           // for (let k = 0; k < studentArr.length; k++) {
  //           //   if (!priorPairs.includes(studentArr[k])) {
  //           //     pairedArr.push('1. ' + rawArr[0].first_name + '2. ' + studentArr[k]);
  //           //     break;
  //           //   }
  //           // }
  //         });
  //       // }
  //       // for (let i = 0; i < studentArr.length; i += 2) {
  //       //   pairedArr.push('1. ' + studentArr[i] + ' 2. ' + studentArr[i + 1]);
  //       // }
  //     })
  //     .then(() => {
  //       res.status(200).send(pairedArr);
  //     });
  //   //   // .catch((err) => console.log(err));
  // },

  seed: (req, res) => {
    // const Student = sequelize.define('Student', {
    //   firstName: {
    //     type: DataTypes.STRING,
    //   },
    //   lastName: {
    //     type: DataTypes.STRING,
    //   },
    // });

    const Pair = sequelize.define('pair_history', {
      studentOne: {
        type: DataTypes.INTEGER,

        references: {
          model: Student,
          key: 'id',
        },
      },
      studentTwo: {
        type: DataTypes.INTEGER,

        references: {
          model: Student,
          key: 'id',
        },
      },
    });
    (async () => {
      await sequelize.sync({ force: true });
      const startingStudents = await Student.bulkCreate([
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
    })().then(() => {
      console.log('DB seeded!');
      res.sendStatus(200);
    });
    // .catch((err) => console.log('error seeding DB'), err);
  },
};
