const mongoose = require('mongoose');

const db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
  console.log('Conectado ao MongoDB.')
  // Vamos adicionar nossos Esquemas, Modelos e consultas aqui

});



module.exports = mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
    
  });