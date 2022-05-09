const getPairButton = document.getElementById('rando-button');
const pairList = document.getElementById('pair-list');
const studentList = document.getElementById('student-list');
const addButton = document.getElementById('add-button');
const addStudent = document.getElementById('add-student');
const stuHist = document.getElementById('get-student-history');
const stuHistDisplay = document.getElementById('display-student-history');

const getPairings = () => {
  console.log(`Going to get pairings!`);
  axios.get(`http://localhost:6060/pairings`).then((res) => {
    console.log(res.data);
    while (pairList.firstChild) {
      pairList.removeChild(pairList.firstChild);
    }

    res.data.forEach((elem) => {
      let pairDiv = document.createElement('div');
      pairList.append(pairDiv);
      let divTitle = `<h5>${elem[0]}</h5>`;
      pairDiv.innerHTML += `${divTitle}`;
      let count = 1;
      for (let i = Math.ceil(elem.length / 2); i < elem.length; i++) {
        let pText = `<p>${count}. ${elem[i]}</p>`;

        pairDiv.innerHTML += `${pText}`;
        count++;
      }
    });
  });
};

const getStudents = () => {
  console.log(`Going to get the students!`);
  axios.get(`http://localhost:6060/studentlist`).then((res) => {
    console.log(res.data);
    let select = document.getElementById('select-student');

    res.data.forEach((elem) => {
      let student = '';
      student += elem.firstName + ' ' + elem.lastName;
      let choice = document.createElement('option');
      // choice.textContent = student;
      choice.value = student;
      // choice.classList.add('dropdown-item');
      select.appendChild(choice);
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

const getStudentHistory = (evt) => {
  evt.preventDefault();
  console.log('Fetching History!');
  let studentName = document.getElementById('historyList');
  // console.log(studentName);
  console.log(`${studentName.value}`);
  let body = {
    requestedName: studentName.value,
  };
  axios.post(`http://localhost:6060/studenthist`, body).then((res) => {
    console.log(res.data);
    while (stuHistDisplay.firstChild) {
      stuHistDisplay.removeChild(stuHistDisplay.firstChild);
    }
    let sectionTitle = `<h5>${studentName.value} Has Previously Paired With</h5>`;
    stuHistDisplay.innerHTML += `${sectionTitle}`;
    res.data.forEach((elem) => {
      let histDiv = document.createElement('div');
      stuHistDisplay.append(histDiv);

      let pText = `<p>${elem.firstName} ${elem.lastName}</p>`;

      histDiv.innerHTML += `${pText}`;
    });
    studentName.value = '';
  });
};

getStudents();
getPairButton.addEventListener('click', getPairings);
addStudent.addEventListener('submit', addNewStudent);
stuHist.addEventListener('submit', getStudentHistory);
