const cors = require('cors');
const mysql = require('mysql2');//lieka tik mysql2

const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

const mysqlConfig = {
    host: '127.0.0.1',//local host
    user: 'root',
    password: 'Bartaseviciute1969',
    database: 'codeacademy',
    port: 3306
};
//išsikeliame config, panaikiname async ir await
//naudojame call back
const connection = mysql.createConnection(mysqlConfig);

app.get('/students', (req, res) => {
    const result = connection.execute('SELECT * FROM students', (err, students) => {
        console.log(students);
        res.send(students);
    });
});

app.get('/assignments', (req, res) => {
    const result = connection.execute('SELECT * FROM assignments', (err, assignments) => {
        console.log(assignments);
        res.send(assignments);
    });
});

app.get('/assignments/done', (req, res) => {
    const result = connection.execute('SELECT * FROM assignments WHERE done=1', (err, doneAssignments) => {
        console.log(doneAssignments);
        res.send(doneAssignments);
    });
});

app.get('/assignments/notdone', (req, res) => {
    
    const result = connection.execute('SELECT * FROM assignments WHERE done=0', (err, notdoneAssignments) => {
        console.log(notdoneAssignments);
        res.send(notdoneAssignments);
    });
});

const PORT = 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`));
