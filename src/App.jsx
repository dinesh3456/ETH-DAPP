import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
    
  const contractAddress = "0xA5f11810aa6F46e08565eA290789C5c8bbC97F77";
  const contractABI = abi.abi;
  const getEthereumObject = () => window.ethereum;

  const getAllWaves = async() =>{
    try{
      const { ethereum } = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Providers(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();
        let wavesCleaned =[];
        waves.forEach(wave =>{
            wavesCleaned.push({
              address:wave.visitor,
              message: wave.message,
              timestamp: new Date(wave.timestamp *1000)
            });
        });
         
        setAllWaves(wavesCleaned);
        } else {
          console.log("Ethereum object doesn't exist!")
        }
      } catch (error) {
        console.log(error);
        }
      }
    

  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const  ethereum  = getEthereumObject();

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const  ethereum  = getEthereumObject();

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(print?{data}:null,{ gasLimit: 300000 });
      
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        

        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const [data,setData] = useState(null)
  const [print,setPrint] = useState(false);

  function getData(val){
    setData(val.target.value)
    setPrint(false);
  }

  return (
    
    <div className="mainContainer">     
      <div className="dataContainer">
        
           
          
          
        <div className="header">
        <h1>👋</h1>
        <h2> Hey folks!</h2> 
        </div>

        <div className="bio">
        This is Dinesh! I am learning web3 and currently working on projects with the help of buildSpace. Connect your Ethereum wallet and wave at me!
        </div>

        
      <br />
        {!currentAccount && (
          <button className="waveButton" style={{ marginLeft: '4%'}} onClick={connectWallet}>
            <h3>Connect Wallet</h3>
          </button>
        )}
      
      {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
         
          <input type="text"  style={{height: "40px",textAlign: 'center',  width: "400px" ,marginLeft: "20%" }} placeholder="Enter the message" onChange={getData} />
          
            <div className = "message"  style={{ width: "125px", height: "40px", padding:"0px", marginLeft: '43%', backgroundColor: 'black'}} >    
              
          <button color="black" style={{backgroundColor: 'black'}} onClick={()=>setPrint(true)}><h4>MESSAGE ME</h4></button>
            </div>
        <button className="waveButton" style={{ marginLeft: '4%'}} onClick={wave}>
          <h3>Wave at Me</h3>
        </button>
     
    </div>
        </div>
      
  );
  }
export default App;
