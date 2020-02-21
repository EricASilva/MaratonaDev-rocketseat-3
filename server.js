const express = require('express');
const server = express();
const nunjucks = require('nunjucks');

server.use(express.static('public')); 

//habiltiar body dos forms
server.use(express.urlencoded({ extended: true }))


//conexão com banco
const Pool = require('pg').Pool
const db = new Pool({
  user: 'postgres',
  password: '0000',
  host: 'localhost',
  port: '5432',
  database: 'doe'
})

//configurando template engine
nunjucks.configure('./', {
  express: server,
  noCache: true,
});


server.get('/', (req, res) => {

  db.query('SELECT * FROM donors', function(err, result){
    if (err) return res.send("erro de banco de dados");
    
    const donors = result.rows
    return res.render("index.html", { donors });

  })
});

server.post('/', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

  if (name == "" || email == "" || blood == "" ){
    return res.send("Todos os campos são obrigatórios.")
  }

  const query =`
      INSERT INTO donors ("name", "email", "blood")
      VALUES ($1, $2, $3)`  

  const values = [name, email, blood]

  db.query(query, values, function(err) {
    if (err) return res.send( "erro no banco de dados") //fluxo de erro
 
    return res.redirect('/') //fluxo ideal
  })
})


server.listen(3232, () => {
  console.log('Start Server');
});