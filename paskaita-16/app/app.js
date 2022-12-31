const cors = require('cors');
const mysql = require('mysql2');

const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

const mysqlConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'Bartaseviciute1969',
    database: 'shop',
    port: 3306
};

const connection = mysql.createConnection(mysqlConfig);
//ENDPOINTS
app.get('/products', (req, res) => {
    connection.execute('SELECT * FROM Products', (err, result) => {
        console.log(result);
        res.send(result);
    });
});
//Post
app.post('/employees', (req, res) => {
    connection.execute('INSERT INTO Employees (name) VALUES (?)', 
    [req.body.name], (err, result) => {
        // jeigu norime, kad konsolėje parodytų employees, rašome:
      connection.execute('SELECT * FROM employees', (err, result) => {
        console.log(result);
        res.send(result);
      })  
    });
});

//endpoint, kai grąžina visą atnaujintą produktų sąrašą:
app.post('/products', (req, res) => {
    connection.execute('INSERT INTO Products (title, price, stock) VALUES (?, ?, ?)', 
    [req.body.title, req.body.price, req.body.stock], (err, result) => {
      connection.execute('SELECT * FROM products', (err, result) => {
        console.log(result);
        res.send(result);
      })  
    });
});

//galima užrašyti ir taip endpoint, kai grąžina atnaujintų produktų sąrašą,
//destruktūrizuojame [req.body.title, req.body.price, req.body.stock] į const:
app.post('/products', (req, res) => {
    const { title, price, stock } = req.body;
    connection.execute(
        'INSERT INTO Products (title, price, stock) VALUES (?, ?, ?)', 
        [title, price, stock], 
        (err, result) => {
            connection.execute('SELECT * FROM Products', (err, result) => {
                console.log(result);
                res.send(result);
      })  
    });
});

//UPDATE -> atnaujinimo endpoint "Employees" lentelėje
//NAUDOSIME DINAMINĮ id
app.patch('/employees/:id', (req, res) => {
    const { name } = req.body;
    connection.execute(
        'UPDATE Employees SET name=? WHERE id=?', 
        [name, req.params.id], 
        (err, result) => {
      connection.execute('SELECT * FROM Employees', (err, result) => {
        console.log(result);
        res.send(result);
      })  
    });
});

// UPDATE "Products" sąrašą
app.patch('/products/:id', (req, res) => {
    const { title, price, stock } = req.body;
    connection.execute(
        'UPDATE Products SET title=?, price=?, stock=?  WHERE id=?', 
        [title, price, stock, req.params.id], 
        (err, result) => {
      connection.execute('SELECT * FROM Products', (err, result) => {
        console.log(result);
        res.send(result);
      })  
    });
});

//DELETE  endpoint “/products/:id“
app.delete('/products/:id', (req, res) => {
  connection.execute(
      'DELETE FROM Products WHERE id=?', 
      [req.params.id], 
      (err, result) => {
    connection.execute('SELECT * FROM Products', (err, result) => {
      console.log(result);
      res.send(result);
    })  
  });
});
//Užduotis 3
//Sukurkite GET endpoint “/sales“ kuris grąžins pardavimus.
//Vietoje FOREIGN KEY (customerId) turi būti įstatyta būtent to kliento informacija (kolkas pas mus klientas turi tik name)
app.get('/sales', (req, res) => {
  connection.execute(
    `
      SELECT customers.id AS customerId, sales.id AS saleId, name, amount AS saleAmount
      FROM shop.sales
      INNER JOIN customers
      ON customers.id=sales.customerId;
    `,
    (err, result) => {
      console.log(err);
      console.log(result);
      res.send(result);
    }
  );

})

const PORT = 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`));
