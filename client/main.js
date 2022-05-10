const getPairButton = document.getElementById('rando-button');
const pairList = document.getElementById('pair-list');
const studentList = document.getElementById('student-list');
const addButton = document.getElementById('add-button');
const addStudent = document.getElementById('add-student');
const stuHist = document.getElementById('get-student-history');
const stuHistDisplay = document.getElementById('display-student-history');
const stuHistButton = document.getElementById('st-hist-button');
const pairSpinner = document.getElementById('pair-loading');
const histSpinner = document.getElementById('hist-loading');

const getPairings = () => {
  console.log(`Going to get pairings!`);
  getPairButton.setAttribute('disabled', '');
  pairSpinner.classList.remove('invisible');
  while (pairList.firstChild) {
    pairList.removeChild(pairList.firstChild);
  }
  axios.get(`http://localhost:6060/pairings`).then((res) => {
    console.log(res.data);

    res.data.forEach((elem) => {
      let pairDiv = document.createElement('div');
      pairList.append(pairDiv);
      pairDiv.classList.add('col-3');
      let divTitle = `<h5>${elem[0]}</h5>`;
      pairDiv.innerHTML += `${divTitle}`;
      let count = 1;
      for (let i = Math.ceil(elem.length / 2); i < elem.length; i++) {
        let pText = `<p>${count}. ${elem[i]}</p>`;

        pairDiv.innerHTML += `${pText}`;
        count++;
      }
    });
    getPairButton.removeAttribute('disabled');
    pairSpinner.classList.add('invisible');
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
  addButton.setAttribute('disabled', '');
  document.getElementById('add-alert').classList.remove('collapse');
  console.log(`Let's add a student!`);
  let studentName = document.getElementById('student-name');
  console.log(`${studentName.value}`);
  let body = {
    newName: studentName.value,
  };
  axios.post(`http://localhost:6060/studentadd`, body).then(() => {
    studentName.value = '';
    document.getElementById('add-alert').classList.add('collapse');
    document.getElementById('add-success').classList.remove('collapse');
    setTimeout(() => {
      document.getElementById('add-success').classList.add('collapse');
    }, 3000);

    console.log('Student added!');
  });
};

const getStudentHistory = (evt) => {
  evt.preventDefault();
  stuHistButton.setAttribute('disabled', '');
  while (stuHistDisplay.firstChild) {
    stuHistDisplay.removeChild(stuHistDisplay.firstChild);
  }
  histSpinner.classList.remove('invisible');

  // console.log('Fetching History!');
  let studentName = document.getElementById('historyList');
  // console.log(studentName);
  // console.log(`${studentName.value}`);
  let body = {
    requestedName: studentName.value,
  };
  axios.post(`http://localhost:6060/studenthist`, body).then((res) => {
    // console.log(res.data);

    let sectionTitle = `<h5>${studentName.value} Has Previously Paired With</h5>`;
    stuHistDisplay.innerHTML += `${sectionTitle}`;
    res.data.forEach((elem) => {
      let histDiv = document.createElement('div');
      stuHistDisplay.append(histDiv);

      let pText = `<p>${elem.firstName} ${elem.lastName}</p>`;

      histDiv.innerHTML += `${pText}`;
    });
    stuHistButton.removeAttribute('disabled');
    histSpinner.classList.add('invisible');
    studentName.value = '';
  });
};

getStudents();
getPairButton.addEventListener('click', getPairings);
addStudent.addEventListener('submit', addNewStudent);
stuHist.addEventListener('submit', getStudentHistory);
