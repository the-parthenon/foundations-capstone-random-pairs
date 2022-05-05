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

  onePair: (req, res) => {
    let everybody = [];
    let groupArr = [];
    let pairArr = [];
    let pairedArr = [];

    getEverybody()
      .then((list) => {
        return (everybody = list);
        // console.log(`Target pair: `, JSON.stringify(everybody[0], null, 2));
      })
      .then(() => {
        //get all past groups for student at front of array
        let groups = getPastGroups(everybody[0].id);
        return groups;
      })
      .then((groups) => {
        //populate groups array with all past groups for student at front of array
        //then use the groups array to get all studentids that match those groups
        // console.log(`Group list: `, JSON.stringify(groups, null, 2));
        groups.forEach((element) => {
          groupArr.push(element.groupId);
        });
        // console.log(groupArr);
        return getPastPairs(groupArr);
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
            everybody.splice(i, 1);
            everybody.splice(0, 1);
            break;
          }
        }
        return pairedArr;
      })
      .then(() => {
        console.log(`Everybody Else: `, JSON.stringify(everybody, null, 2));
        console.log(pairedArr);
        res.status(200).send(pairedArr);
      });
  },

  test: (req, res) => {
    let everybody = [];
    let groupArr = [];
    let pairArr = [];
    let pairedArr = [];

    getEverybody()
      .then((list) => {
        return (everybody = list);
      })
      .then(() => {
        (async function loop() {
          do {
            let groups = await getPastGroups(everybody[0].id);
            // console.log(JSON.stringify(groups, null, 2));
            groups.forEach((element) => {
              groupArr.push(element.groupId);
            });
            // console.log(groupArr);
            let pairs = await getPastPairs(groupArr);
            // console.log(JSON.stringify(pairs, null, 2));
            pairs.forEach((element) => {
              pairArr.push(element.studentId);
            });
            for (let i = 1; i < everybody.length; i++) {
              if (!pairArr.includes(everybody[i].id)) {
                pairedArr.push(
                  `1. ${everybody[0].firstName} ${everybody[0].lastName} 2. ${everybody[i].firstName} ${everybody[i].lastName}`
                );
                everybody.splice(i, 1);
                everybody.splice(0, 1);
                groupArr = [];
                pairArr = [];
                break;
              }
            }
            console.log(pairedArr);
          } while (everybody.length > 0);
        })()
          .then(() => {
            // console.log(JSON.stringify(groups[0], null, 2));
          })
          .then(() => {
            res.status(200).send(pairedArr);
          });
        // console.log('Endpoint set up');
      });
  },

  //Randomly assigns pairings between entries in the Students table (no history considered)
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
        { groupId: 4, studentId: 7 },
        { groupId: 4, studentId: 8 },
        { groupId: 5, studentId: 9 },
        { groupId: 5, studentId: 10 },
        { groupId: 6, studentId: 11 },
        { groupId: 6, studentId: 12 },
        { groupId: 7, studentId: 2 },
        { groupId: 7, studentId: 3 },
        { groupId: 8, studentId: 4 },
        { groupId: 8, studentId: 5 },
        { groupId: 9, studentId: 6 },
        { groupId: 9, studentId: 7 },
        { groupId: 10, studentId: 8 },
        { groupId: 10, studentId: 9 },
        { groupId: 11, studentId: 10 },
        { groupId: 11, studentId: 11 },
        { groupId: 12, studentId: 12 },
        { groupId: 12, studentId: 1 },
      ]);
    })().then(() => {
      console.log('DB seeded!');
      res.sendStatus(200);
    });
    // .catch((err) => console.log('error seeding DB'), err);
  },
};
