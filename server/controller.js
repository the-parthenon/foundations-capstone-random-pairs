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

const { getEverybody, getPastGroups, getPastPairs, shuffle } = require('./functions.js');
const { Student, Group, Assignment } = require('./models'); //Assignment

module.exports = {
  //Gets a full list of the entries in the Students table
  getList: (req, res) => {
    getEverybody().then((list) => {
      res.status(200).send(list);
    });
  },

  addStudent: (req, res) => {
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
    let groupsCount = 1;
    let oddOneOut;
    let iterator = 1;
    let tripleCheck = false;
    let deadlyPattern = [];
    let fullArr = [];

    getEverybody()
      .then((list) => {
        fullArr = list.map((a) => a.id);
        // console.log(fullArr);
        return (everybody = list);
      })
      .then(async () => {
        // console.log(everybody.length);
        // console.log(`Everybody :`, JSON.stringify(everybody, null, 2));
        if (everybody.length % 2 !== 0) {
          console.log('Uh-oh, odd number of students!');
          // oddOneOut = everybody.splice(everybody.length - 1, 1);
          // console.log(everybody.length);
          let groups = await getPastGroups(everybody[0].id);
          groupArr = groups.map((a) => a.groupId);
          let pairs = await getPastPairs(groupArr);
          pairs.forEach((element) => {
            pairArr.push(element.studentId);
          });

          for (let i = 1; i < everybody.length; i++) {
            if (!pairArr.includes(everybody[i].id)) {
              let groups = await getPastGroups(everybody[i].id);
              groupArr = groups.map((a) => a.groupId);
              let pairs = await getPastPairs(groupArr);
              pairs.forEach((element) => {
                pairArr.push(element.studentID);
              });
              for (let j = i + 1; j < everybody.length; j++) {
                let newGroup = await Group.create({
                  group_name: `Group ${groupsCount}`,
                });
                groupsCount++;
                await Assignment.bulkCreate([
                  { groupId: newGroup.id, studentId: everybody[0].id },
                  { groupId: newGroup.id, studentId: everybody[i].id },
                  { groupId: newGroup.id, studentId: everybody[j].id },
                ]);
                pairedArr.push([
                  newGroup.group_name,
                  everybody[0].getFullName(),
                  everybody[i].getFullName(),
                  everybody[j].getFullName(),
                ]);
                everybody.splice(j, 1);
                everybody.splice(i, 1);
                everybody.splice(0, 1);
                groupArr = [];
                pairArr = [];
                break;
              }
            }
            break;
          }
        }
      })
      .then(() => {
        let everybodyBackup = everybody.slice();
        // console.log(`Backup: `, JSON.stringify(everybodyBackup, null, 2));
        (async function loop() {
          do {
            // console.log(`Everybody else:`, JSON.stringify(everybody, null, 2));
            if (pairArr.length > 0) {
              console.log('oops, bad shuffle');
              iterator++;
              console.log('iterator', iterator);
              groupArr.length = 0;
              // console.log('groupArr', groupArr);
              pairArr.length = 0;
              // console.log('pairArr', pairArr);
              pairedArr.length = 0;
              // console.log('pairedArr', pairedArr);
              deadlyPattern.length = 0;
              groupsCount = 1;
              everybody = everybodyBackup.slice();
              shuffle(everybody);
              // console.log('Everybody ', JSON.stringify(everybody, null, 2));

              // break;
            }
            //get the past groups for the current student
            groupArr = await getPastGroups(everybody[0].id);
            // console.log(`groups: `, JSON.stringify(groups, null, 2));
            groupArr = groupArr.map((a) => a.groupId);
            // console.log('groupArr: ', groupArr);
            // use past groups to get all previous pairs
            pairArr = await getPastPairs(groupArr);
            // console.log('pairs array from group: ', JSON.stringify(pairs, null, 2));
            pairArr = pairArr.map((a) => a.studentId);

            // console.log(`Pair array after push, before for loop `, pairArr);
            let remainingPairs = fullArr.filter((x) => !pairArr.includes(x));
            // console.log(`remainingPairs before new match`, remainingPairs);

            for (let i = 1; i < everybody.length; i++) {
              // console.log('everybody[i]', everybody[i].id);
              if (remainingPairs.includes(everybody[i].id)) {
                pairedArr.push([
                  `Group ${groupsCount}`,
                  everybody[0].id,
                  everybody[i].id,
                  everybody[0].getFullName(),
                  everybody[i].getFullName(),
                ]);
                remainingPairs = remainingPairs.filter((x) => x !== everybody[i].id);
                remainingPairs.push(everybody[0].id);
                console.log(`remainingPairs after new match: `, remainingPairs);
                let studentTwoGroup = await getPastGroups(everybody[i].id);
                studentTwoGroup = studentTwoGroup.map((a) => a.groupId);
                let studentTwoPair = await getPastPairs(studentTwoGroup);
                studentTwoPair = studentTwoPair.map((a) => a.studentId);
                let studentTwoRemain = fullArr.filter((x) => !studentTwoPair.includes(x));
                studentTwoRemain = studentTwoRemain.filter((x) => x !== everybody[0].id);
                studentTwoRemain.push(everybody[i].id);
                console.log(`student two remaining `, studentTwoRemain);
                if (remainingPairs.length === 3 || studentTwoRemain === 3) {
                  tripleCheck = true;
                  let deadly = +remainingPairs
                    .sort((a, b) => {
                      return a - b;
                    })
                    .join('');
                  let deadly2 = +studentTwoRemain
                    .sort((a, b) => {
                      return a - b;
                    })
                    .join('');
                  deadlyPattern.push(deadly, deadly2);
                }
                everybody.splice(i, 1);
                everybody.splice(0, 1);
                groupArr.length = 0;
                pairArr.length = 0;
                groupsCount++;
                // console.log('pairArr after clear', pairArr);
                // console.log('groupArr after clear', groupArr);
                break;
              }
            }
            // console.log(pairedArr);
            if (everybody.length === 0 && tripleCheck === true) {
              console.log('Time for triple check!!', deadlyPattern);
              const getOccurrence = (array, value) => {
                return array.filter((v) => v === value).length;
              };

              const tripleCheck = (test) => {
                for (let i = 0; i < test.length; i++) {
                  if (getOccurrence(test, test[i]) === 3) {
                    return true;
                  }
                }
                return false;
              };
              if (tripleCheck(deadlyPattern) === true) {
                console.log('Deadly pattern detected!');
                everybody = everybodyBackup.slice();
                shuffle(everybody);
                pairedArr.length = 0;
                deadlyPattern.length = 0;
                iterator++;
              }
            }
          } while (everybody.length > 0);
        })()
          .then(async () => {
            console.log(`Iterations: ${iterator}`);
            groupsCount = 1;
            for (let i = 0; i < pairedArr.length; i++) {
              let newGroup = await Group.create({ group_name: `Group ${groupsCount}` });
              groupsCount++;
              await Assignment.bulkCreate([
                { groupId: newGroup.id, studentId: pairedArr[i][1] },
                { groupId: newGroup.id, studentId: pairedArr[i][2] },
              ]);
            }
            // console.log(JSON.stringify(groups[0], null, 2));
          })
          .then(() => {
            res.status(200).send(pairedArr);
          });
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

      // await Group.bulkCreate([
      // { group_name: 'Group 1' },
      // { group_name: 'Group 2' },
      // { group_name: 'Group 3' },
      //   // { group_name: 'Group 4' },
      //   // { group_name: 'Group 5' },
      //   // { group_name: 'Group 6' },
      // { group_name: 'Group 1' },
      // { group_name: 'Group 2' },
      // { group_name: 'Group 3' },
      //   // { group_name: 'Group 4' },
      //   // { group_name: 'Group 5' },
      //   // { group_name: 'Group 6' },
      // ]);
      // await Assignment.bulkCreate([
      //   { groupId: 1, studentId: 1 },
      //   { groupId: 1, studentId: 2 },
      //   { groupId: 2, studentId: 3 },
      //   { groupId: 2, studentId: 4 },
      //   { groupId: 3, studentId: 5 },
      //   { groupId: 3, studentId: 6 },

      //   { groupId: 4, studentId: 1 },
      //   { groupId: 4, studentId: 3 },
      //   { groupId: 5, studentId: 2 },
      //   { groupId: 5, studentId: 5 },
      //   { groupId: 6, studentId: 4 },
      //   { groupId: 6, studentId: 6 },

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
      // ]);
    })().then(() => {
      console.log('DB seeded!');
      res.sendStatus(200);
    });
    // .catch((err) => console.log('error seeding DB'), err);
  },
};
