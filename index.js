const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries_test')
const port = 3000


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (request, response) => {
  response.json({ info: 'API base de données' })
})

app.get('/Coordonnees', db.getCoord)

//app.get('/Coordonnees/Mouv', db.getUpdateMouv)


app.get('/Coordonnees/Mouv', db.getCoordMouv)

app.get('/Coordonnees/UpdateClick', db.getUpdateClick)
//app.post('/users', db.createUser)
//app.put('/users/:id', db.updateUser)
//app.delete('/users/:id', db.deleteUser)

console.log(db.getUsers)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})