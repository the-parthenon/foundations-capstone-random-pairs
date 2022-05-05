const getPairButton = document.getElementById('rando-button');
const pairList = document.getElementById('pair-list');
const studentList = document.getElementById('student-list');
// const pairOneButton = document.getElementById('single-test');
const addButton = document.getElementById('add-button');
const addStudent = document.getElementById('add-student');

const getPairings = () => {
  console.log(`Going to get pairings!`);
  axios.get(`http://localhost:6060/pairings`).then((res) => {
    console.log(res.data);
    let groupNum = 1;
    res.data.forEach((elem) => {
      let pairDiv = document.createElement('div');
      let divTitle = `<h3>Group ${groupNum}</h3>`;
      pairList.append(pairDiv);
      pairDiv.innerHTML += `${divTitle}: <p>1. ${elem[0]} 2. ${elem[1]}</p>`;
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

const addNewStudent = (evt) => {
  evt.preventDefault();
  console.log(`Let's add a student!`);
  let studentName = document.getElementById('student-name');
  console.log(`${studentName.value}`);
  let body = {
    newName: studentName.value,
  };
  axios.post(`http://localhost:6060/studentadd`, body).then(() => {
    console.log('Student added!');
  });
};

// const pairOne = () => {
//   console.log(`Single pair, heard!`);
//   axios.get(`http://localhost:6060/pairone`).then((res) => {
//     console.log(res.data);
//   });
// };

// getStudents();
getPairButton.addEventListener('click', getPairings);
addStudent.addEventListener('submit', addNewStudent);

// pairOneButton.addEventListener('click', pairOne);
