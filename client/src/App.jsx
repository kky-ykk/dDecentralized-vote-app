import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "./constant/constant";
import Login from "./Components/Login";
import Finished from "./Components/Finished";
import Connected from "./Components/Connected";
import "./App.css";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [CanVote, setCanVote] = useState(true);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (typeof window.ethereum === "undefined") {
      setIsMetaMaskInstalled(false);
      alert("⚠️ MetaMask is not installed. Please install it from https://metamask.io/");
      setLoading(false);
      return;
    }

    setIsMetaMaskInstalled(true);
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {             //MetaMask API call that asks MetaMask for a list of currently connected Ethereum accounts.
      console.log("accounts:",accounts);
      if (accounts.length > 0) {
        setAccount(accounts[0]);  // Save the first account
        setIsConnected(true);     // Mark the user as connected
        fetchData();              // Call a function to get blockchain data
      }
      setLoading(false);
    });

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
  }, []);

  const fetchData = async () => {
    await getCandidates();
    await getRemainingTime();
    await getCurrentStatus();
  };

  async function vote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    const tx = await contractInstance.vote(number);
    await tx.wait();
    canVote();
  }

  async function canVote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    const voteStatus = await contractInstance.voters(await signer.getAddress());
    setCanVote(voteStatus);
  }

  // async function getCandidates() {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   await provider.send("eth_requestAccounts", []);
  //   const signer = provider.getSigner();
  //   const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
  //   const candidatesList = await contractInstance.getAllVotesOfCandiates();
  //   setCandidates(
  //     candidatesList.map((candidate, index) => ({
  //       index,
  //       name: candidate.name,
  //       voteCount: candidate.voteCount.toNumber(),
  //     }))
  //   );
  // }

  async function getCandidates() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);                    // Asks MetaMask to connect the user's wallet to the app
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

    // Fetch candidates list from smart contract
    const candidatesList = await contractInstance.getAllVotesOfCandiates();

    // Format and sort candidates by vote count (descending order)
    const sortedCandidates = candidatesList
        .map((candidate, index) => ({
            index,
            name: candidate.name,
            voteCount: candidate.voteCount.toNumber(),
        }))
        .sort((a, b) => b.voteCount - a.voteCount); // Sorting logic

    setCandidates(sortedCandidates);
}


  async function getCurrentStatus() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    setVotingStatus(await contractInstance.getVotingStatus());
  }

  async function getRemainingTime() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    setRemainingTime(parseInt(await contractInstance.getRemainingTime(), 16));
  }

  function handleAccountsChanged(accounts) {
    console.log("in handleAccountsChanged");
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
      canVote();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
    console.log("account:",account);
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setAccount(await signer.getAddress());
        setIsConnected(true);
        canVote();
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("MetaMask is not detected in the browser");
    }
  }

  if (loading) {
    return <div className="loading">🔄 Loading...</div>;
  }

  return (
    <div className="App">
      {!isMetaMaskInstalled ? (
        <div className="alert">
          <p>⚠️ MetaMask is not installed.</p>
          <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
            Click here to install MetaMask
          </a>
        </div>
      ) : votingStatus ? (
        isConnected ? (
          <Connected
            account={account}
            candidates={candidates}
            remainingTime={remainingTime}
            number={number}
            handleNumberChange={(value) => setNumber(value)}
            voteFunction={vote}
            showButton={CanVote}
          />
        ) : (
          <Login connectWallet={connectToMetamask} />
        )
      ) : (
        <Finished />
      )}
    </div>
  );
}

export default App;
