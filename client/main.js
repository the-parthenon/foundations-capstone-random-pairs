const getPairButton = document.getElementById('rando_button');
const studentArr = [];
function getPairings() {
  console.log(`Going to get pairings!`);
  axios.get('http://localhost:6060/pairings'); //.then((res) => {
  //   // console.log(res.data);
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
