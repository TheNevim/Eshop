import React from 'react';


function Produkty(props) {


  return (
      <div className="container">
         <h3>Produkt:{props.produkt}      Mnozstvo:{props.mnozstvo} ks</h3>
      </div>
    
  );
}

export default Produkty;