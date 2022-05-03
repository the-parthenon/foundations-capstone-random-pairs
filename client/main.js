const getPairButton = document.getElementById('rando-button');
const pairList = document.getElementById('pair-list');
const studentList = document.getElementById('student-list');

const getPairings = () => {
  console.log(`Going to get pairings!`);
  axios.get(`http://localhost:6060/pairings`).then((res) => {
    // console.log(res.data);
    let groupNum = 1;
    res.data.forEach((elem) => {
      let pairDiv = document.createElement('div');
      let divTitle = `<h1>Group ${groupNum}</h1>`;
      pairList.append(pairDiv);
      pairDiv.innerHTML += `${divTitle}: <h3>${elem}</h3>`;
      groupNum++;
    });
  });
};

const getStudents = () => {
  console.log(`Going to get the students!`);
  axios.get(`http://localhost:6060/studentlist`).then((res) => {
    console.log(res.data);
    res.data.forEach((elem) => {
      let student = `<h1>${elem.firstName} ${elem.lastName}</h1>`;

      studentList.innerHTML += student;
    });
  });
};

// getStudents();
getPairButton.addEventListener('click', getPairings);
