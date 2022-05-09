const sequelize = require('./controller');

const { getPastGroups, getPastPairs } = require('./functions');

module.exports = {
  getRemainingPairs: async (arr, id) => {
    let groupArr = await getPastGroups(id);
    groupArr = groupArr.map((a) => a.groupId);
    console.log('group arr: ', groupArr);
    let pairArr = await getPastPairs(groupArr);
    pairArr = pairArr.map((a) => a.studentId);
    let remainingPairs = arr.filter((x) => !pairArr.includes(x));
    // console.log('remaining pairs ', remainingPairs);

    return {
      group: groupArr,
      remain: remainingPairs,
    };
  },
};
