require('dotenv').config();
const Sequelize = require('sequelize');

const { CONNECTION_STRING } = process.env;

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = {
  seed: (req, res) => {
    sequelize
      .query(
        `
                DROP TABLE IF EXISTS pairs;
                DROP TABLE IF EXISTS students;
                DROP TABLE IF EXISTS squads;

                CREATE TABLE squads(
                    squad_id SERIAL PRIMARY KEY,
                    squad_name VARCHAR(40)
                  );
                
                CREATE TABLE students(
                    student_id SERIAL PRIMARY KEY,
                    first_name VARCHAR(40),
                    last_name VARCHAR(40),
                    squad_id INT REFERENCES squads(squad_id)
                  );
                  
                CREATE TABLE pairs(
                    pair_id SERIAL PRIMARY KEY,
                    student_one INT REFERENCES students(student_id),
                    student_two INT REFERENCES students(student_id)
                  );
                  
                  INSERT INTO squads(squad_name)
                  VALUES('A Squad'),
                  ('B Squad');  
                  
                  INSERT INTO students(first_name, last_name, squad_id)
                  VALUES ('Amy', 'Adams', 1),
                  ('Billy', 'Boyd', 1),
                  ('Chester', 'Cheetah', 1),
                  ('Davey', 'Dillups', 1),
                  ('Edmund', 'Everly', 1),
                  ('Frankie', 'Fivetimes', 1),
                  ('Gilbert', 'Grape', 2),
                  ('Harry', 'Hambone', 2),
                  ('India', 'Illmatic', 2),
                  ('Julie', 'July', 2),
                  ('Kelly', 'Kapowski', 2),
                  ('Leslie', 'Lamour', 2);

            `
      )
      .then(() => {
        console.log('DB seeded!');
        res.sendStatus(200);
      });
    //   .catch((err) => console.log('error seeding DB'), err);
  },
};
