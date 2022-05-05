const { Sequelize, DataTypes, Model, Deferrable } = require('sequelize');

const sequelize = require('./controller');

class Student extends Model {
  getFullName() {
    return [this.firstName, this.lastName].join(' ');
  }
}

Student.init(
  {
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'student',
  }
);
//Define Student model in sequelize
// const Student = sequelize.define('student', {
//   firstName: {
//     type: DataTypes.STRING,
//   },
//   lastName: {
//     type: DataTypes.STRING,
//   },

//   getFullName() {
//     return [this.firstName, this.lastName].join(' ');
//   },
// });

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

module.exports = { Student, Group, Assignment };
