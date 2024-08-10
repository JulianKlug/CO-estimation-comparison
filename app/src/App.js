import './App.css';
import Footer from "./components/Footer.js";
import DiagnosticDisagreementSimulator from "./components/DiagnosticDisagreementSimulator";
import {useEffect} from "react";
import {isMobile} from "./utils";

function App() {
  return (
    <div className="App">
        <DiagnosticDisagreementSimulator />
        <Footer/>
    </div>
  );
}

export default App;
