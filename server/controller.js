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

const { getEverybody, getPastGroups, getPastPairs } = require('./functions.js');
const { Student, Group, Assignment } = require('./models'); //Assignment

module.exports = {
  //Gets a full list of the entries in the Students table
  getList: (req, res) => {
    getEverybody().then((list) => {
      res.status(200).send(list);
    });
  },

  test: (req, res) => {
    console.log('Endpoint set up!');
    const { newName } = req.body;
    console.log(newName);
    (async () => {
      let newStudentName = newName.split(' ');
      await Student.create({ firstName: newStudentName[0], lastName: newStudentName[1] });
    })().then(() => {
      console.log('Added a student');
      res.sendStatus(200);
    });
  },

  getPairings: (req, res) => {
    let everybody = [];
    let groupArr = [];
    let pairArr = [];
    let pairedArr = [];

    getEverybody()
      .then((list) => {
        return (everybody = list);
      })
      .then(async function test() {
        // console.log(`Everybody:`, JSON.stringify(everybody, null, 2));
        let groups = await getPastGroups(everybody[everybody.length - 1].id);
        groupArr = groups.map((a) => a.groupId);
        let pairs = await getPastPairs(groupArr);
        pairs.forEach((ele) => {
          pairArr.push(ele.studentId);
        });
        for (let i = 0; i < everybody.length; i++) {
          if (pairArr.includes(everybody[everybody.length - 2].id)) {
            let temp = everybody[everybody.length - 2];
            everybody[everybody.length - 2] = everybody[i];
            everybody[i] = temp;
            console.log(`Broke infinite loop!?!!?`);
          } else {
            break;
          }
        }
      })
      .then(() => {
        (async function loop() {
          do {
            // console.log(`Everybody else:`, JSON.stringify(everybody, null, 2));
            //get the past groups for the current student
            let groups = await getPastGroups(everybody[0].id);
            groupArr = groups.map((a) => a.groupId);
            // use past groups to get all previous pairs
            let pairs = await getPastPairs(groupArr);
            // console.log('pairs array: ', JSON.stringify(pairs, null, 2));
            pairs.forEach((element) => {
              pairArr.push(element.studentId);
            });
            for (let i = 1; i < everybody.length; i++) {
              if (!pairArr.includes(everybody[i].id)) {
                let newPair = [everybody[0].getFullName(), everybody[i].getFullName()];
                pairedArr.push(newPair);
                everybody.splice(i, 1);
                everybody.splice(0, 1);
                groupArr = [];
                pairArr = [];
                break;
              }
            }
            // console.log(pairedArr);
          } while (everybody.length > 0);
        })()
          .then(() => {
            // console.log(JSON.stringify(groups[0], null, 2));
          })
          .then(() => {
            res.status(200).send(pairedArr);
          });
      });
  },

  //Randomly assigns pairings between entries in the Students table (no history considered)
  // getPairings: (req, res) => {
  //   let pairedArr = [];
  //   // let priorPairs = [];

  //   getEverybody().then((studentArr) => {
  //     // console.log(JSON.stringify(studentArr, null, 2));
  //     for (let i = 0; i < studentArr.length; i += 2) {
  //       pairedArr.push(
  //         `1. ${studentArr[i].firstName} ${studentArr[i].lastName} 2. ${
  //           studentArr[i + 1].firstName
  //         } ${studentArr[i + 1].lastName}`
  //       );
  //     }
  //     // console.log(JSON.stringify(pairedArr, null, 2));
  //     res.status(200).send(pairedArr);
  //   });
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
        // { firstName: 'Gilbert', lastName: 'Grape' },
        // { firstName: 'Harry', lastName: 'Hambone' },
        // { firstName: 'India', lastName: 'Illmatic' },
        // { firstName: 'Julie', lastName: 'July' },
        // { firstName: 'Kelly', lastName: 'Kapowski' },
        // { firstName: 'Leslie', lastName: 'Lamour' },
      ]);

      await Group.bulkCreate([
        { group_name: 'Group 1' },
        { group_name: 'Group 2' },
        { group_name: 'Group 3' },
        { group_name: 'Group 4' },
        { group_name: 'Group 5' },
        { group_name: 'Group 6' },
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
        { groupId: 2, studentId: 3 },
        { groupId: 2, studentId: 4 },
        { groupId: 3, studentId: 5 },
        { groupId: 3, studentId: 6 },
        // { groupId: 4, studentId: 7 },
        // { groupId: 4, studentId: 8 },
        // { groupId: 5, studentId: 9 },
        // { groupId: 5, studentId: 10 },
        // { groupId: 6, studentId: 11 },
        // { groupId: 6, studentId: 12 },
        // { groupId: 7, studentId: 2 },
        // { groupId: 7, studentId: 3 },
        // { groupId: 8, studentId: 4 },
        // { groupId: 8, studentId: 5 },
        // { groupId: 9, studentId: 6 },
        // { groupId: 9, studentId: 7 },
        // { groupId: 10, studentId: 8 },
        // { groupId: 10, studentId: 9 },
        // { groupId: 11, studentId: 10 },
        // { groupId: 11, studentId: 11 },
        // { groupId: 12, studentId: 12 },
        // { groupId: 12, studentId: 1 },
      ]);
    })().then(() => {
      console.log('DB seeded!');
      res.sendStatus(200);
    });
    // .catch((err) => console.log('error seeding DB'), err);
  },
};
