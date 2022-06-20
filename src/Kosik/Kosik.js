import React, {useState, useEffect} from 'react';
import KosikProdukt from './KosikProduct'


function Kosik() {
  
  const[produkt, setProdukt] = useState([])
  const[meno, setMeno] = useState('')
  const[ulica, setUlica] = useState('')
  const[mesto, setMesto] = useState('')
  const[psc, setPsc] = useState('')
  const[cislo, setCislo] = useState('')
  var[spolu, setSpolu] = useState()

    useEffect(()=>{
        fetch('http://localhost:8081/nazvy')
        .then(data => data.json())
        .then(res=>{
            setProdukt(res)
      })   
    },[])
    

    function renderKosik(){
      var sp=0;
      var produkty =  produkt.map((produkt)=>{
        let kolko = localStorage.getItem(produkt.nazov)
        spolu+=kolko*produkt.cena
        return <KosikProdukt 
        key={produkt.id}
        nazov={produkt.nazov}
        mnozstvo = {kolko}
        />
    })
    useEffect(()=>{
      setSpolu(sp)
    },[])
    return produkty
    }

    function objednaj(){
      if(meno=='' || cislo==='' || mesto==='' || ulica==='' || psc==='' ){
        alert('Nevyplnenene vsetky udaje!!!')
        return
      }
      var zakaznik = {meno:meno,ulica:ulica,cislo:cislo,mesto:mesto,psc:psc}

      var kosik=[]

      produkt.forEach(element => {
        if(localStorage.getItem(element.nazov)!=0){
          kosik.push({produkt: element.id, mnozstvo:localStorage.getItem(element.nazov)})
        }
      });

      if(kosik.length==0){
        alert('Ziadne produkty v kosiku')
        return;
      }

      var url = 'http://localhost:8081/exist'
        fetch(url,{
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({zakaznik:zakaznik})
        })
        .then(data => {return data.json()})
        .then(res=> {
            if(res.ok=='exist'){
              alert('Rovnake meno ojbednavky')
              return
            }
            if(res.ok=='chyba'){
              alert('Chyba s objednavkou :(')
              return
            }

            var url = 'http://localhost:8081/insert'
              fetch(url,{
                  method: 'POST',
                  headers: {'Content-Type': 'application/json;charset=utf-8'},
                  body: JSON.stringify({zakaznik:zakaznik,kosik:kosik})
              })
              .then(data => {return data.json()})
              .then(res=> {
                if(res.ok=='ok'){
                  alert('Uspesne objednane')
                  setSpolu(0)
                  produkt.map((produkt)=>{
                    if(localStorage.getItem(produkt.nazov))
                    localStorage.setItem(produkt.nazov,0)
                })
                  setSpolu(0)
                  window.location.href='/ThankPage'
                  return
                }
                if(res.ok=='chyba'){
                  alert('Chyba s objednavkou :(')
                  return
                } 
              });
        });
    }

  return (
    <div>
      <h2>KOSIK</h2>
      {renderKosik()}
      <h3>Spolu {spolu} €</h3>
      <br></br>
      <h2>Udaje</h2>
   

      <div className="container">
        <h2>Meno</h2>
        <input type="text" name="meno" onChange={event => setMeno(event.target.value)} ></input>
        <br></br>
        <h2>Mesto</h2>
        <input type="text" name="mesto" onChange={event => setMesto(event.target.value)}></input>
        <br></br>
        <h2>Ulica</h2>
        <input type="text" name="ulica" onChange={event => setUlica(event.target.value)}></input>
        <br></br>
        <h2>PSC</h2>
        <input type="text" name="psc" onChange={event => setPsc(event.target.value)}></input>
        <br></br>
        <h2>Cislo</h2>
        <input type="text" name="cislo" onChange={event => setCislo(event.target.value)}></input>
        <br></br>
        <button onClick={()=>{objednaj()}}>OBJEDNAJ</button>
        
    </div>

    </div>
);
}

export default Kosik;