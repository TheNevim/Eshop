import React from 'react';


function ThankPage() {

    function plusCounter(){
        fetch('http://localhost:8081/counter')
        .then(data => data.json())
        .then(res=>{
      })
      window.location.href='https://www.fiit.stuba.sk/'
    }


    //Autor: martin1134 Licencia: CC0 Zdroj: https://pixabay.com/sk/photos/hrad-japonsko-universal-studio-3826771/
  return (
      <div className="container">
         <h2>Dakujeme</h2>
        <img src='https://cdn.pixabay.com/photo/2018/11/20/08/03/castle-3826771_960_720.jpg' onClick={()=>{plusCounter()}}/>
      </div>
  );
}

export default ThankPage;