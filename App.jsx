import { useState } from 'react';
import { ethers } from 'ethers';
import TokenWalletABI from './TokenWalletABI.json';
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE';
function App() {
  const [account, setAccount] = useState(null);
  const [tokenAddress, setTokenAddress] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(null);
  const connectWallet = async () => {
    if (!window.ethereum) return alert('Install MetaMask!');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
  };
  const getTokenBalance = async () => {
    if (!tokenAddress) return alert('Enter token address');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, TokenWalletABI, provider);
    const bal = await contract.getBalance(tokenAddress);
    setBalance(ethers.formatUnits(bal, 18));
  };
  const sendToken = async () => {
    if (!tokenAddress || !recipient || !amount) return alert('Fill all fields');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, TokenWalletABI, signer);
    const tx = await contract.sendToken(tokenAddress, recipient, ethers.parseUnits(amount, 18));
    await tx.wait();
    alert('Token sent!');
  };
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Token Wallet DApp</h1>
      {!account ? <button onClick={connectWallet}>Connect Wallet</button> : <p>Connected: {account}</p>}
      <div style={{ marginTop: '1rem' }}>
        <input placeholder='Token Address' value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} />
        <button onClick={getTokenBalance}>Check Balance</button>
        {balance !== null && <p>Balance: {balance}</p>}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <input placeholder='Recipient Address' value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        <input placeholder='Amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button onClick={sendToken}>Send Token</button>
      </div>
    </div>
  );
}
export default App;