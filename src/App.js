import React, { useState, useEffect } from "react";
import { GiBoltSpellCast } from "react-icons/gi";
import abi from "./constant/abi.json";
import { ethers } from "ethers";
import "./App.css";

const App = () => {
  const contract_address = "0xf3Ef095981606e6F4263e541fe4bd4157d9f1224";
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [joined, setJoined] = useState(false);

  const getNumberOfWhitelisted = async () => {
    try {
      const contract = new ethers.Contract(contract_address, abi, provider);
      const _numberOfWhitelisted = await contract.numAddressesWhitelisted();
      console.log(_numberOfWhitelisted);
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  const addAddressToWhitelist = async() => {
    try{
       const provider = new ethers.providers.Web3Provider(window.ethereum);
       const signer = await provider.getSigner();
       const contract = new ethers.Contract(contract_address, abi, signer);
       const tx = await contract.addAddressToWhitelist();
       await tx.wait();
       await getNumberOfWhitelisted();
    } catch(err) {
      console.error(err);
    }
  }

  const checkIfInWhitelist = async () => {
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contract_address, abi, signer);
      const address = await signer.getAddress();
      const tx = await contract.whitelistedAddresses(address);
      setJoined(tx);
      
    } catch(err){
      console.error(err);
    }
  }

  const initConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const tprovider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(tprovider);
      setAccount(accounts[0]);
      setWalletConnected(true);
    } else {
      console.log("Please install metamask");
    }
  };

  useEffect(() => {
    if (!walletConnected){
      initConnection();
    }
    getNumberOfWhitelisted();
  }, [walletConnected , numberOfWhitelisted]);
  return (
    <div className="page">
      <div className="header">
        <p className="logo">DAPP</p>
        <p>
          11/15
          <span>
            <GiBoltSpellCast className="span-style" />
          </span>
        </p>
        {account === "" ? (
          <button className="connect-button" onClick={() => initConnection()}>
            Connect Wallet
          </button>
        ) : (
          <p>...{account.substring(account.length - 7)}</p>
        )}{" "}
      </div>
      <div>
        <p>{numberOfWhitelisted}</p>
        <button className="connect-button" onClick={() => addAddressToWhitelist()}>
            addToWhitelist
          </button>
          <button onClick={() => checkIfInWhitelist()}>Check</button>
      <button onClick={() =>getNumberOfWhitelisted() }>whitelisted</button>
      </div>    
    </div>
  );
};

export default App;
