import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import React from 'react'
import Produkty from './Produkty/AllProducts'
import Kosik from "./Kosik/Kosik"
import Admin from "./Admin/Admin"
import ThankPage from "./ThankPage/ThankPage"


function Home(){

    return (
        <Router>
            <div style={{display:'inline-block'}}>
            <button onClick={()=>{window.location.href='/Admin'}}>ADMIN</button>
            <button onClick={()=>{window.location.href='/'}}>Produkty</button>
            <button onClick={()=>{window.location.href='/Kosik'}}>Kosik</button>
            </div>
            
            <Switch>
                <Route path="/ThankPage" component={ThankPage}/>
                <Route path="/Kosik" component={Kosik}/>
                <Route path="/" exact component={Produkty}/>
                <Route path="/Admin" component={Admin}/>
            </Switch>
        </Router>
    );
  }
  
  export default Home;