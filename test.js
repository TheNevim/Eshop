
const mysql = require('mysql');
var assert = require('assert');


describe('end-to-end', function() {
    const http = require('http');
    var connection;
    before(()=>{

        function conncectDBS(){
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
            }
          })
        }
        conncectDBS()
    })


    it('should return -1 when the value is not present', function() {

    assert.equal([1, 2, 3].indexOf(4), -1);
    });
});
