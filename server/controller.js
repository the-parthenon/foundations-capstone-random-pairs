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

const {
  getEverybody,
  shuffle,
  storeTriples,
  storeHiddenGroups,
} = require('./functions.js');
const { getRemainingPairs } = require('./secondaryfunctions');
const { Student, Group, Assignment } = require('./models'); //Assignment

module.exports = {
  //Gets a full list of the entries in the Students table
  getList: (req, res) => {
    getEverybody().then((list) => {
      res.status(200).send(list);
    });
  },

  addStudent: (req, res) => {
    // console.log('Endpoint set up!');
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
    let pairedArr = [];
    let groupsCount = 1;
    let iterator = 1;
    let tripleCheck = false;
    let deadlyPattern = [];
    let fullArr = [];
    let toBeHidden = [];
    let everybodyBackup = [];
    let checkLength = 0;

    getEverybody()
      .then((list) => {
        fullArr = list.map((a) => a.id);
        everybodyBackup = list.slice();
        return (everybody = list);
      })
      .then(() => {
        (async function loop() {
          do {
            console.log(`Everybody else:`, JSON.stringify(everybody, null, 2));

            let { group: groupArr, remain: remainingPairs } = await getRemainingPairs(
              fullArr,
              everybody[0].id
            );
            console.log(`remainingPairs before new match`, remainingPairs);

            storeHiddenGroups(remainingPairs, fullArr, toBeHidden, groupArr);

            for (let i = 1; i < everybody.length; i++) {
              // console.log(`remainingPairs `, remainingPairs);
              console.log('everybody[i]', everybody[i].id);
              if (remainingPairs.includes(everybody[i].id)) {
                let { group: studentTwoGroup, remain: studentTwoRemain } =
                  await getRemainingPairs(fullArr, everybody[i].id);

                storeHiddenGroups(studentTwoRemain, fullArr, toBeHidden, studentTwoGroup);

                if (everybody.length % 2 !== 0) {
                  console.log('uh-oh, odd number of students!');
                  for (let j = i + 1; j < everybody.length; j++) {
                    console.log('everybody[j]', everybody[j].id);
                    if (
                      remainingPairs.includes(everybody[j].id) &&
                      studentTwoRemain.includes(everybody[j].id)
                    ) {
                      let { group: studentThreeGroup, remain: studentThreeRemain } =
                        await getRemainingPairs(fullArr, everybody[j].id);

                      storeHiddenGroups(
                        studentThreeRemain,
                        fullArr,
                        toBeHidden,
                        studentThreeGroup
                      );

                      studentThreeRemain = studentThreeRemain.filter(
                        (x) => x !== everybody[i].id && x !== everybody[0].id
                      );
                      if (studentThreeRemain.length % 2 === 0) {
                        storeTriples(studentThreeRemain, deadlyPattern, everybody[j].id);
                        tripleCheck = true;
                      }

                      pairedArr.push([
                        `Group ${groupsCount}`,
                        everybody[0].id,
                        everybody[i].id,
                        everybody[j].id,
                        everybody[0].getFullName(),
                        everybody[i].getFullName(),
                        everybody[j].getFullName(),
                      ]);

                      remainingPairs = remainingPairs.filter(
                        (x) => x !== everybody[i].id && x !== everybody[j].id
                      );
                      studentTwoRemain = studentTwoRemain.filter(
                        (x) => x !== everybody[0].id && x !== everybody[j].id
                      );
                      everybody.splice(j, 1);
                      break;
                    }
                  }
                  if (pairedArr.length === 0) {
                    console.log('new bad shuffle logic (with a triple!)');
                    deadlyPattern.length = 0;
                    iterator++;
                    groupsCount = 1;
                    everybody = everybodyBackup.slice();
                    shuffle(everybody);
                    break;
                  }
                } else {
                  pairedArr.push([
                    `Group ${groupsCount}`,
                    everybody[0].id,
                    everybody[i].id,
                    everybody[0].getFullName(),
                    everybody[i].getFullName(),
                  ]);
                  remainingPairs = remainingPairs.filter((x) => x !== everybody[i].id);
                  studentTwoRemain = studentTwoRemain.filter(
                    (x) => x !== everybody[0].id
                  );
                }
                //If active student has two pairs remaining, store those pairs for later verification that we have not created a deadly pattern
                console.log('pairs left after match', remainingPairs);
                if (remainingPairs.length < fullArr.length / 2) {
                  tripleCheck = storeTriples(
                    remainingPairs,
                    deadlyPattern,
                    everybody[0].id
                  );
                  console.log(deadlyPattern);
                  checkLength = remainingPairs.length;
                }

                console.log('S2 pairs after match', studentTwoRemain);
                if (studentTwoRemain.length < fullArr.length / 2) {
                  tripleCheck = storeTriples(
                    studentTwoRemain,
                    deadlyPattern,
                    everybody[i].id
                  );
                  console.log('deadly after S2', deadlyPattern);
                }

                everybody.splice(i, 1);
                everybody.splice(0, 1);
                groupsCount++;
                break;
              } else if (i === everybody.length - 1) {
                console.log('new bad shuffle logic');

                pairedArr.length = 0;
                deadlyPattern.length = 0;

                iterator++;
                groupsCount = 1;
                everybody = everybodyBackup.slice();
                shuffle(everybody);
                break;
              }
            }

            if (everybody.length === 0 && tripleCheck === true && checkLength > 1) {
              console.log('Time for triple check!!', deadlyPattern);

              const getOccurrence = (array, value) => {
                return array.filter((v) => v === value).length;
              };

              const tripleCheck = (test) => {
                for (let i = 0; i < test.length; i++) {
                  console.log('checkLength', checkLength);
                  if (getOccurrence(test, test[i]) === checkLength) {
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
            // console.log(`to be hidden: `, toBeHidden);
            if (toBeHidden.length > 0) {
              await Assignment.update(
                { ishidden: true },
                {
                  where: {
                    groupId: {
                      [Op.in]: toBeHidden,
                    },
                  },
                }
              );
            }

            for (let i = 0; i < pairedArr.length; i++) {
              let newGroup = await Group.create({ group_name: pairedArr[i][0] });
              if (pairedArr[i].length === 7) {
                await Assignment.bulkCreate([
                  { groupId: newGroup.id, studentId: pairedArr[i][1] },
                  { groupId: newGroup.id, studentId: pairedArr[i][2] },
                  { groupId: newGroup.id, studentId: pairedArr[i][3] },
                ]);
              } else {
                await Assignment.bulkCreate([
                  { groupId: newGroup.id, studentId: pairedArr[i][1] },
                  { groupId: newGroup.id, studentId: pairedArr[i][2] },
                ]);
              }
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
        // { firstName: 'Kelly', lastName: 'Kapowski' },
        // { firstName: 'Leslie', lastName: 'Lamour' },
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
