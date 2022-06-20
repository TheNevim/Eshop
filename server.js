const mysql = require('mysql');
const express = require('express');
const app = express();
const path = require('path')

allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if ('OPTIONS' === req.method) {
      res.sendStatus(200);
  } else {
      next();
  }
};
app.use(allowCrossDomain);
app.use(express.static('public'))
app.use(express.json());

var produkty= [ {nazov: 'Jahoda', obrazok: 'https://cdn.pixabay.com/photo/2014/02/23/11/09/strawberry-272810_1280.jpg', cena: 5},
                //Autor: Hans Licencia: CC0 Zdroj: https://pixabay.com/sk/photos/strawberry-ovocie-vynikaj%C3%BAce-272810/
                {nazov: 'Jablko', obrazok: 'https://cdn.pixabay.com/photo/2017/09/10/18/11/apple-2736410_1280.png', cena: 6}, 
                //Autor: Capri23auto Licencia: CC0 Zdroj: https://pixabay.com/sk/photos/apple-%C4%8Derven%C3%A9-jablko-ovocie-2736410/
                {nazov: 'Pomaranc', obrazok: 'https://cdn.pixabay.com/photo/2014/08/26/15/25/oranges-428072_960_720.jpg', cena: 7}
                //Autor: jarmoluk Licencia: CC0 Zdroj: https://pixabay.com/sk/photos/pomaran%C4%8De-ovocie-vitam%C3%ADn-428072/
]

var connection = mysql.createConnection({
  host     : 'eshop',
  user     : 'root',
  password : 'root',
});

const conncectDBS = function(callback){
    console.log('connecting to Database ...')
    connection = mysql.createConnection({
      host     : 'eshop',
      user     : 'root',
      password : 'root',
      
    });
    connection.connect(err =>{
      if(err){
        console.error(err)
        console.log('DBS unavailable, retrying in 10 second')
        connection.end(err=>{
            console.error('DBS unavailable, retrying in 10 second')
        })
        setTimeout(()=>{
          conncectDBS(callback)
        },10000);
      }else{
        
        callback()
      }
    })
}

conncectDBS(()=>{
  app.listen(8081, ()=>{
    createDatabase()
    console.log('connected to BDS')
    console.log("listening"); 
  })
})

function createDatabase(){
  connection.query("CREATE DATABASE IF NOT EXISTS eshop;")
  connection.end()
  
  setTimeout(()=>{
    connection = mysql.createConnection({
      host     : 'eshop',
      user     : 'root',
      password : 'root',
      database : 'eshop'
    });
    connection.connect()
    connection.query("CREATE TABLE IF NOT EXISTS Objednavka (id int unsigned NOT NULL AUTO_INCREMENT,id_zakaznik int unsigned NOT NULL,stav varchar(255) NOT NULL,PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=utf8;")
    connection.query("CREATE TABLE IF NOT EXISTS Produkty (id int unsigned NOT NULL AUTO_INCREMENT,nazov varchar(255) NOT NULL,obrazok varchar(255) NOT NULL,cena int unsigned NOT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;")
    connection.query("CREATE TABLE IF NOT EXISTS Zakaznik (id int unsigned NOT NULL AUTO_INCREMENT,meno varchar(255) NOT NULL,ulica varchar(255) NOT NULL,cislo varchar(255) NOT NULL,mesto varchar(255) NOT NULL,psc varchar(255) NOT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;")
    connection.query("CREATE TABLE IF NOT EXISTS ProduktyObjednavka (id_objednavka int unsigned NOT NULL ,produkt int unsigned NOT NULL, mnozstvo int unsigned NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8;")
    connection.query("CREATE TABLE IF NOT EXISTS Counter (id_counter int unsigned NOT NULL ,counter int unsigned NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8;")

    connection.query("SELECT COUNT(*) AS Pcount FROM Produkty", function (err, result, fields) {
        if (err) throw err;
        if( result[0].Pcount<3)
          var str = 'INSERT INTO Produkty (nazov, obrazok,cena) VALUES  ';
          var strNazvy = produkty.map(nazov =>{
            return '(\''+nazov.nazov + '\''+','+ '\''+nazov.obrazok + '\''+','+nazov.cena + ')';
          })
          str += strNazvy.join(',');
          str += ';';
          connection.query(str);
          connection.query('INSERT INTO Counter (id_counter, counter) VALUES'+ '(' + 1 + ',' + 0 +')');
      });
  },1000)
}


app.get('/nazvy',(req, res)=> {
  connection.query('SELECT * FROM Produkty ', function (error, results, fields) {
    if (error) throw error;

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(results));
  });
})

app.get('/adminobjednavky',(req, res)=> {
  connection.query('SELECT Objednavka.id,Objednavka.id_zakaznik,Objednavka.stav,Zakaznik.meno,Zakaznik.ulica,Zakaznik.cislo,Zakaznik.psc,Zakaznik.mesto,ProduktyObjednavka.mnozstvo,Produkty.nazov FROM Objednavka inner JOIN Zakaznik on Objednavka.id_zakaznik=Zakaznik.id inner join ProduktyObjednavka on Objednavka.id=ProduktyObjednavka.id_objednavka inner join Produkty on Produkty.id=ProduktyObjednavka.produkt ORDER BY Objednavka.id', function (error, results, fields) {
    if (error) throw error;

    if(results[0]===undefined){
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ok: 'prazdne'}));
      return;
    }
    var objednavky= [];
    var idObjednavaky = results[0].id;
    var objednavka= ({id:results[0].id,meno:results[0].meno,ulica:results[0].ulica,mesto:results[0].mesto,cislo:results[0].cislo,psc:results[0].psc,stav:results[0].stav, produkty:[]})
    results.forEach(element => {
      
      if(element.id==idObjednavaky){

        objednavka.produkty.push({produkt:element.nazov,mnozstvo:element.mnozstvo})
      }else{
        objednavky.push(objednavka);
        idObjednavaky=element.id;
        objednavka= ({id:element.id,meno:element.meno,ulica:element.ulica,mesto:element.mesto,cislo:element.cislo,psc:element.psc,stav:element.stav, produkty:[{produkt:element.nazov,mnozstvo:element.mnozstvo}]})
      }
    });
    objednavky.push(objednavka)

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(objednavky));
})
})

function insertZakaznik(zakaznik,kosik,res){
  connection.query('INSERT INTO Zakaznik (meno,ulica,cislo,mesto,psc) VALUES ' + '(\'' +zakaznik.meno +'\',' + '\'' + zakaznik.ulica + '\',' + '\''+zakaznik.cislo + '\','+ '\''+zakaznik.mesto+'\','+ '\'' +zakaznik.psc +'\')', function (error, results, fields) {
    if (error) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ok:'chyba'}));
      return
    }
    insertObjednavka(results.insertId,kosik,res) 
  });  
}

function insertObjednavka(id, kosik,res){
  var stav = "nezaplatena"
  connection.query('INSERT INTO Objednavka (id_zakaznik,stav) VALUES ' + '(\'' +id +'\',' +'\''+stav +'\')', function (error, results, fields) {
    if (error) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ok:'chyba'}));
      return
    }
    insertKosik(kosik,results.insertId,res)
  }); 
}

function insertKosik(kosik,idObjednavka,res){
   var str = 'INSERT INTO ProduktyObjednavka (id_objednavka, produkt,mnozstvo) VALUES';
          var strNazvy = kosik.map(nazov =>{
            return '(\''+idObjednavka + '\''+','+ '\''+nazov.produkt + '\''+','+nazov.mnozstvo + ')';
          })
          str += strNazvy.join(',');
          str += ';';
          connection.query(str);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ok:'ok'}));
}

app.post('/insert',(req, res)=> {
  insertZakaznik(req.body.zakaznik,req.body.kosik,res)
})


app.post('/exist',(req, res)=> {
  connection.query("SELECT * FROM Zakaznik WHERE meno = "+'\'' + req.body.zakaznik.meno+'\'', function (err, result, fields) {
    if (err){
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ok:'chyba'}));
      return
    } 
    if( result[0]===undefined){
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ok:'ok'}));
    }else{
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ok:'exist'}));
    }
  });
})

app.get('/counter',(req, res)=> {
  connection.query("SELECT counter  FROM Counter", function (err, result, fields) {
    if (err) throw err;
    var counter = result[0].counter
    counter++;
    connection.query('UPDATE Counter SET counter='+counter+' WHERE id_counter=1')
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ok:'ok'}));
  });
})

app.get('/pocitadlo',(req, res)=> {
  connection.query("SELECT counter  FROM Counter", function (err, result, fields) {
    if (err) throw err;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({counter:result[0].counter}));
  });
})

app.post('/zaplat',(req, res)=> {
    var id = req.body.objednavka;
    connection.query('UPDATE Objednavka SET stav='+'\'' +'zaplatena' + '\''+'WHERE id='+id)
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ok:'ok'}));
})

app.get('*', function(req,res){
  res.sendFile('index.html',{root: path.join(__dirname,'public')})
})
