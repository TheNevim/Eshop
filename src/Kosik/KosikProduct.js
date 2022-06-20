import React from 'react';

function KosikProduct(props) {

  return (
    <div className="container" >
        <div >
        <h3>{props.nazov} : {props.mnozstvo} ks</h3>
        </div> 
    </div>
  );
}

export default KosikProduct;