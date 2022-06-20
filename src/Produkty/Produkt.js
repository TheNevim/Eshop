import React from 'react';

function Produkt(props) {

  function neco(){
    var pocet = prompt('Zmen počet '+ props.nazov + ' aktualna hodnota: ' + localStorage.getItem(props.nazov))
    if(pocet=="" || pocet==null){
      localStorage.setItem(props.nazov,0)
    }else{
      localStorage.setItem(props.nazov,pocet)
    }
  }

  return (
    <div className="container">
        <h3>{props.nazov}</h3>
        <img src={props.obrazok} width="150" ></img>
        <h3 >Cena : {props.cena} €</h3>
        <button onClick={()=>{neco()}}>Pridaj do kosiku</button>
        <br></br>
        <br></br>
        
    </div>
  );
}

export default Produkt;