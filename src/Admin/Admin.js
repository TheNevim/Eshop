
import React, {useState, useEffect} from 'react';
import Zakaznik from './Zakaznik'

function Admin() {
    const[objednavka, setObjednavka] = useState([])
    const[counter, setCounter] = useState(0)

    useEffect(()=>{
        fetch('http://localhost:8081/adminobjednavky')
        .then(data => data.json())
        .then(res=>{
            if(res.ok=='prazdne'){
                return;
            }
            setObjednavka(res)
      })   
    },[])

    useEffect(()=>{
        fetch('http://localhost:8081/pocitadlo')
        .then(data => data.json())
        .then(res=>{
            setCounter(res.counter)
      })   
    },[])
  
    function renderProdukt(){

        if(objednavka.length==0){
            return(<h1>ZIADNE OBJEDNAVKY</h1>)
        }
        
        var objednavky =  objednavka.map((produkt,index)=>{
            return <Zakaznik 
            key={index}
            id={produkt.id}
            meno={produkt.meno}
            ulica={produkt.ulica}
            mesto={produkt.mesto}
            cislo={produkt.cislo}
            psc={produkt.psc}
            stav={produkt.stav}
            produkty={produkt.produkty}  
            />
        })
        return objednavky
    }

  return (
    <div>
        <h2>Kliknuti na reklamu {counter}</h2>
        {renderProdukt()}  
          
      </div>
  );
}
export default Admin;