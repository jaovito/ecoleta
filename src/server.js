require('dotenv').config()
const express = require("express")
const server = express() //executando a função apssada para a variavel express



const mongoose = require('mongoose');

const db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
  console.log('Conectado ao MongoDB.')
  // Vamos adicionar nossos Esquemas, Modelos e consultas aqui

});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
  
});



const ecology = new mongoose.Schema({
  image: String,
  name: String,
  address: String,
  address2: String,
  state: String,
  city: String,
  items: String
});

const Eco = mongoose.model('Eco', ecology);





//configurar pasta publica
server.use(express.static("public")) // aqui ele passa para o server a pasta public sem precisar buscar por ela nos arquivos html

//habilitar o uso do req.body
server.use(express.urlencoded({ extended: true }))


//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
  express: server,
  noCache: true
})


//configurar caminhos da aplicação
//página inicial
//req: requisição
//res: resposta

server.get("/", (req, res) => {
 return res.render("index.html")  

  //dirname seria nome do diretorio onde está
  
  //o send enviaria uma msg, render uma arquivo
})

server.get("/create-point", (req, res) => {
  //req.query: query strings da nossa url
  console.log(req.query)


 return res.render("create-point.html")  
})

server.post("/savepoint", (req, res) => {
  //req.body: o corpo do nosso formulário
  //inserir dados no banco de dados

  function afterInsertData(err) {
    if(err) {
      return console.log(err)
    }

    console.log("Cadastrado com Sucesso")
    console.log(this)

    return res.render("create-point.html", { saved: true})
  }
  
  const query = new Eco({
    image: req.body.image,
    name: req.body.name,
    address: req.body.address,
    address2: req.body.address2,
    state: req.body.state,
    city: req.body.city,
    items: req.body.items
  })

  query.save(function(err, query) {
    if(err) return console.error(err)
    console.dir(query)
    afterInsertData()
  })

  
  
})


server.get("/search", (req, res) => {
  const search = req.query.search

  if(search == "") {
    //pesquisa vazia
    
  return res.render("search-results.html", {total: 0})  
  }




  Eco.find({city: search}, function(err, rows) {
    if(err) {
       console.log(err)
      return res.send("Erro no cadastro!")
    }
    console.dir(rows)


  const total = rows.length


   //mostrar página html com os dados do banco de dados 
  return res.render("search-results.html", {places: rows, total})  
  })
})

//ligar o servidor
server.listen(process.env.PORT || 3001) // porta heroku