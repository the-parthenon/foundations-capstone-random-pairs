const getPairButton = document.getElementById('rando-button');
const pairList = document.getElementById('pair-list');
// const studentArr = [];
function getPairings() {
  console.log(`Going to get pairings!`);
  axios.get('http://localhost:6060/pairings').then((res) => {
    console.log(res.data);
    res.data.forEach((elem) => {
      let pairing = `<h1>${elem}</h1>`;

      pairList.innerHTML += pairing;
    });
  });
  //   res.data.forEach((elem) => {
  //     //   console.log(elem);
  //     let student_id = elem['student_id'];
  //     studentArr.push(student_id);
  //   });
  //   console.log(studentArr);
  // });
  //   .catch((err) => console.log(err));
}

getPairings();
