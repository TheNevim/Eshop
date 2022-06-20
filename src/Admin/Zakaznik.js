import React from 'react';
import Produkty from './Produkty'

function Zakaznik(props) {
    function zaplat(){
        var url = 'http://localhost:8081/zaplat'
              fetch(url,{
                  method: 'POST',
                  headers: {'Content-Type': 'application/json;charset=utf-8'},
                  body: JSON.stringify({objednavka:props.id})
              })
              .then(data => {return data.json()})
              .then(res=> {
                if(res.ok=='ok'){
                  alert('Zaplatene')
                  window.location.href='/Admin'
                  return
                }
                if(res.ok=='chyba'){
                  alert('Problem v batabaze')
                  return
                } 
              });
    }

    function produkty(){
        var produkty =  props.produkty.map((produkt,index)=>{
                return <Produkty 
                key={index}
                produkt={produkt.produkt}
                mnozstvo={produkt.mnozstvo}/>    
        })
        return produkty
    }

    if(props.stav=='nezaplatena'){
        return (
            <div className="container">
                  <p>Meno: {props.meno}</p>
                  <p>Mesto: {props.mesto}</p>
                  <p>Ulica: {props.ulica}</p>
                  <p>Pscp: {props.psc}</p>
                  <p>Cislo: {props.cislo}</p>
                  {produkty()}
                  <p>Stav: {props.stav}</p>
                  <button onClick={()=>{zaplat()}}>ZAPLAT</button>
                  <br></br>
                  <br></br>
            </div>)
    }else{
        return (
            <div className="container">
                  <p>Meno: {props.meno}</p>
                  <p>Mesto: {props.mesto}</p>
                  <p>Ulica: {props.ulica}</p>
                  <p>Pscp: {props.psc}</p>
                  <p>Cislo: {props.cislo}</p>
                  {produkty()}
                  <p>Stav: {props.stav}</p>
                  <br></br>
            </div>)
    }
}

export default Zakaznik;