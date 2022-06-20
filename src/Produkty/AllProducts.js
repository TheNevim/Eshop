import React, {useState, useEffect} from 'react';
import Produkt from './Produkt'
import {Link} from 'react-router-dom'

function AllProducts() {
    const[produkt, setProdukt] = useState([])

    useEffect(()=>{
        fetch('http://localhost:8081/nazvy')
        .then(data => data.json())
        .then(res=>{
            setProdukt(res)
      })   
    },[])

    function renderProdukt(){

        produkt.map((produkt)=>{
            if(!localStorage.getItem(produkt.nazov))
            localStorage.setItem(produkt.nazov,0)
        })
        
        var produkty =  produkt.map((produkt)=>{
            return <Produkt 
            key={produkt.id}
            nazov={produkt.nazov}
            cena={produkt.cena}
            obrazok={produkt.obrazok}
            />
        })
        return produkty
    }


   
  return (
      <div>
          {renderProdukt()}  
          <button onClick={()=>{ window.location.href='/Kosik'}}>DO KOSIKU </button>        
      </div>
  );
}

export default AllProducts;