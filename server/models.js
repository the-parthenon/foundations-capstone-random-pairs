const { Sequelize, DataTypes, Model, Deferrable } = require('sequelize');

const sequelize = require('./controller');

//Define Student model in sequelize
const Student = sequelize.define('Student', {
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
});

//Define Pair model in sequelize
const Pair = sequelize.define('pair_history', {
  studentOne: {
    type: DataTypes.INTEGER,

    references: {
      model: Student,
      key: 'id',
      // deferrable: Deferrable.INITIALLY_DEFERRED,
    },
  },
  studentTwo: {
    type: DataTypes.INTEGER,

    references: {
      model: Student,
      key: 'id',
      // deferrable: Deferrable.INITIALLY_DEFERRED,
    },
  },
});

module.exports = { Student, Pair };
