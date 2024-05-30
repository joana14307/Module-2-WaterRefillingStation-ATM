import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [showThankYou, setShowThankYou] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  // Function to retrieve the user's wallet
  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  // Function to handle the user's account
  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      const acc = accounts[0];
      console.log("Account connected: ", acc);
      setAccount(acc);
    } else {
      console.log("No account found");
    }
  };

  // Function to connect the user's account
  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // Once wallet is set, we can get a reference to our deployed contract
    getATMContract();
  };

  // Function to retrieve the ATM contract
  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  // Function to retrieve the user's balance
  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  // Function to add funds to the user's account
  const addFunds = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  // Function to purchase funds from the user's account
  const purchase = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
      setShowThankYou(true); // Show the thank you message after successful purchase
    }
  };

  // Function to initialize the user interface
  const initUser = () => {
    // Check if the user has MetaMask installed
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this ATM.</p>;
    }

    // Check if the user is connected. If not, prompt to connect their account
    if (!account) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={connectAccount} style={{ fontSize: '14px', padding: '8px 12px', display: 'inline-block', width: 'auto', maxWidth: '200px', backgroundColor: '#008000', color: 'white', border: 'none', borderRadius: '4px' }}>Please connect your MetaMask wallet</button>
        </div>
      );
    }

    // If balance is undefined, retrieve it
    if (balance === undefined) {
      getBalance();
    }

    // Display user account details and options to add funds or purchase
    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={addFunds}>Add Funds</button>
        <button onClick={purchase}>Purchase </button>
        {showThankYou && (
          <div>
            <p>Thank you for refilling your water, you may now collect your refilled container!</p>
            <button onClick={() => setShowThankYou(false)}>Okay</button>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  // Render the main page content
  return (
    <main className="container">
      <header>
        <h1>Welcome to the WR Station ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: #FFFFFF; 
          height: 100vh; /* Full height */
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-family: Arial, sans-serif;
        }
      `}</style>
    </main>
  );
}
