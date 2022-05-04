const { Sequelize, DataTypes, Model, Deferrable } = require('sequelize');

const sequelize = require('./controller');

//Define Student model in sequelize
const Student = sequelize.define('student', {
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
});

const Group = sequelize.define('group', {
  group_name: {
    type: DataTypes.STRING,
  },
});

// Define Assignment model in sequelize
const Assignment = sequelize.define('assignment', {
  studentId: {
    type: DataTypes.INTEGER,

    references: {
      model: Student,
      key: 'id',
    },
  },

  groupId: {
    type: DataTypes.INTEGER,

    references: {
      model: Group,
      key: 'id',
    },
  },
});

Student.belongsToMany(Group, { through: Assignment });
Group.belongsToMany(Student, { through: Assignment });
Assignment.hasMany(Student);
Student.belongsTo(Assignment);
Assignment.hasMany(Group);
Group.belongsTo(Assignment);
//Define Pair model in sequelize
// const Pair = sequelize.define('pair', {
//   studentOne: {
//     type: DataTypes.INTEGER,

//     references: {
//       model: Student,
//       key: 'id',
//     },
//   },
//   studentTwo: {
//     type: DataTypes.INTEGER,

//     references: {
//       model: Student,
//       key: 'id',
//     },
//   },
// });

module.exports = { Student, Group, Assignment };
