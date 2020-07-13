require('dotenv')
const express = require("express")
const server = express() //executando a função apssada para a variavel express

//pegar o banco de dados
const db = require("./database/db")


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

  const query = `
    INSERT INTO places (
      image,
      name,
      address,
      address2,
      state,
      city,
      items
    ) VALUES (
      ?,?,?,?,?,?,?);
      `

  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items
  ]

  function afterInsertData(err) {
    if(err) {
      return console.log(err)
    }

    console.log("Cadastrado com Sucesso")
    console.log(this)

    return res.render("create-point.html", { saved: true})
  }
  
  db.run(query, values, afterInsertData)
})


server.get("/search", (req, res) => {
  const search = req.query.search

  if(search == "") {
    //pesquisa vazia
    
  return res.render("search-results.html", {total: 0})  
  }




  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
    if(err) {
       console.log(err)
      return res.send("Erro no cadastro!")
    }



    const total = rows.length


   //mostrar página html com os dados do banco de dados 
  return res.render("search-results.html", {places: rows, total})  
  })
})

//ligar o servidor
server.listen(process.env.PORT || 3000)