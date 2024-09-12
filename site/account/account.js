// app.js

document.addEventListener('DOMContentLoaded', function() {
    const connectButton = document.getElementById('connectWallet');
    const walletStatus = document.getElementById('walletStatus');

    if (connectButton) {
        connectButton.addEventListener('click', connectWallet);
    }
});


let web3;
let selectedAccount;


// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    // console.log('MetaMask is installed!');
    web3 = new Web3(window.ethereum);
} else {
    // console.log('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    alert('MetaMask is not installed. Please consider installing it to view this page correctly: https://metamask.io/download.html');
}


function toggleConnectButtonText() {
// console.log('Function toggleConnectButtonText started');
    const connectButton = document.getElementById('connectWallet');
    if (selectedAccount) {
        connectButton.innerText = 'Disconnect Wallet';
    } else {
        connectButton.innerText = 'Connect to Wallet';
    }
}

// Function to handle wallet connection
async function connectWallet() {
// console.log('connectWallet Function started');
    if (selectedAccount) {
        // Disconnect the wallet
        selectedAccount = null;
        localStorage.removeItem('selectedAccount'); // Remove account from local storage
        updateUIForDisconnectedWallet();
    } else if (window.ethereum) {
        // Connect to the wallet
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            selectedAccount = accounts[0];
            localStorage.setItem('selectedAccount', selectedAccount); // Store account in local storage
            updateUIForConnectedWallet(selectedAccount);
		initiateWeb3();
	  // updateUIForConnectedWallet(selectedAccount);
        } catch (error) {
            console.error('User denied account access', error);
        }
    } else {
        alert('MetaMask is not installed. Please consider installing it to use the SovCube dApp: https://metamask.io/download.html');
    }
}


function updateUIForDisconnectedWallet() {
// console.log('updateUIForDisconnectedWallet Function started');
    const walletStatus = document.getElementById('walletStatus');
    walletStatus.innerText = 'Disconnected';
    walletStatus.style.color = 'red';
    toggleConnectButtonText();
    
    // Hide or reset dApp-specific UI elements
    const contractSelect = document.getElementById('contractSelect');
    const contract1InfoHeader = document.querySelector('.contract1infoheader');
    const contract2InfoHeader = document.querySelector('.contract2infoheader');
    const contract1DynamicInfo = document.getElementById('contract1DynamicInfo');
  //  const contract2DynamicInfo = document.getElementById('contract2DynamicInfo');
    const contractInfoContainer = document.getElementById('contractInfoContainer');
    const contractInfo2Container = document.getElementById('contractInfo2Container');
	const connectYourWalletText = document.getElementById('connectYourWalletText');
	const container = document.getElementById('container');
    const withdraw1 = document.getElementById('withdraw1');
   

     if (withdraw1) withdraw1.style.display = 'none';
    if (contractSelect) contractSelect.style.display = 'none';
    if (contract1InfoHeader) contract1InfoHeader.style.display = 'none';
    if (contract2InfoHeader) contract2InfoHeader.style.display = 'none';
    if (contract1DynamicInfo) contract1DynamicInfo.style.display = 'none';
  //  if (contract2DynamicInfo) contract2DynamicInfo.style.display = 'none';
    if (contractInfoContainer) contractInfoContainer.style.display = 'none';
	if (contractInfo2Container) contractInfo2Container.style.display = 'none';
	if (container) container.style.display = 'none'; 
	if (connectYourWalletText) connectYourWalletText.style.display = 'block';

     resetContractUI(); // Make sure this function also hides relevant elements correctly
	container.style.display = 'none';
     connectYourWalletText.style.display = 'block';
}


// Function to update UI after connecting the wallet
function updateUIForConnectedWallet(account) {
   // console.log('updateUIForConnectedWallet Function started');
    const walletStatus = document.getElementById('walletStatus');
    const bsovTokenContract = new web3.eth.Contract(bsovTokenABI, tokenContractAddress);
    
    bsovTokenContract.methods.balanceOf(account).call()
        .then(balance => {
const balanceNumber = Number(BigInt(balance) / BigInt(100000000)); // Convert balance to a JavaScript number
            const formattedBalance = balanceNumber.toFixed(2); // Format with 2 decimal places
const formattedBalanceString = new Intl.NumberFormat('en-US').format(formattedBalance); // Format with commas
            walletStatus.innerText = `Connected to: ${account}\nBSOV in wallet: ${formattedBalanceString} BSOV`;
            walletStatus.style.color = '#2CB723';
            toggleConnectButtonText();
            updateUIOnConnection(selectedAccount);
        })
        .catch(error => {
            console.error('Error fetching BSOV balance:', error);
            walletStatus.innerText = `Connected to: ${account}\nError fetching BSOV balance`;
            walletStatus.style.color = 'red';
            toggleConnectButtonText();
            updateUIOnConnection(selectedAccount);
        });
}




async function checkWalletConnection() {
// console.log('checkWalletConnection Function started');
    if (window.ethereum) {
        try {
            // Request currently connected accounts
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });

            // Check local storage for the account state
            const storedAccount = localStorage.getItem('selectedAccount');

            if (accounts.length > 0 && storedAccount === accounts[0]) {
                // An account is connected and matches the stored account
                selectedAccount = accounts[0];
                updateUIForConnectedWallet(selectedAccount);
            } else {
                // No accounts connected or the stored account does not match
                // console.log('No connected account found or mismatch with stored account');
                updateUIForDisconnectedWallet();
            }
        } catch (error) {
            console.error('Error checking for connected accounts:', error);
        }
    }
}


// Call this function when the page loads
window.addEventListener('load', checkWalletConnection);




// Function to update the UI after wallet connection
function updateUIOnConnection(account) {
// console.log('updateUIOnConnection Function started');
   // console.log(`Connected to account: ${account}`);
    const contractSelect = document.getElementById('contractSelect');
    const contract1InfoHeader = document.querySelector('.contract1infoheader');
    const contract2InfoHeader = document.querySelector('.contract2infoheader');
    const contract1DynamicInfo = document.getElementById('contract1DynamicInfo');
    const contract2DynamicInfo = document.getElementById('contract2DynamicInfo');
    const contractInfoContainer = document.getElementById('contractInfoContainer');
    const withdraw1 = document.getElementById('withdraw1');
    const withdraw2 = document.getElementById('withdraw2');
    const timelock1 = document.getElementById('timelock1');
    const timelock2 = document.getElementById('timelock2');
    const rewards = document.getElementById('rewards');
                document.getElementById('container').style.display = 'block';


   connectYourWalletText.style.display = 'none';


        // Hide all contract details, headers, and dynamic info first
	    
	contract1InfoHeader.style.display = 'block';
        contract2InfoHeader.style.display = 'block';
        contract1DynamicInfo.style.display = 'none';
        document.getElementById('contract2InfoSection').style.display = 'block';
        contractInfoContainer.style.display = 'none';
	if (contractInfo2Container) contractInfo2Container.style.display = 'none';
contract2InfoHeader.style.display = 'block';
    contract1DynamicInfo.style.display = 'block';
	    contract1InfoHeader.style.display = 'block';
	    contractInfoContainer.style.display = 'block';
	contractInfo2Container.style.display = 'block';
	    // Show the selected contract's details, corresponding header, and dynamic info
	document.getElementById('contract2InfoSection').style.display = 'block';


            fetchContract1Info(account);
            fetchContract2Info(account);
    };
    




let intervalId; // Variable to store the interval ID

// Function to start the interval
function startInterval() {
}

// Function to stop the interval
function stopInterval() {
    clearInterval(intervalId);
}

// Set an interval to call the update function every 1 seconds (1000 milliseconds)
startInterval();
	


/*
let totalTimelockedBigInt;

// Function to fetch total timelocked value
async function fetchTotalTimelocked() {
  try {
    if (!window.rewardsReserve) {
      console.error('rewardsReserve is not initialized for fetching totalTimelocked');
      return;
    }
    totalTimelockedBigInt = await window.rewardsReserve.methods.totalTimelocked().call();
    // Continue with the rest of your code that depends on totalTimelockedBigInt
  } catch (error) {
    console.error("Error fetching totalTimelocked:", error);
  }
}


window.addEventListener('load', () => {
    fetchTotalTimelocked();
});
*/



function resetContractUI() {

// console.log('resetContractUI Function started');
    // Hide all buttons and input fields
	document.getElementById('errorMessage').innerText = '';
	document.getElementById(`clearError`).style.display = 'none';

// When a new contract is selected
const contractSelect = document.getElementById('contractSelect');
if (contractSelect) {
contractSelect.addEventListener('change', function(event) {
 //   resetContractUI(); // Call this to reset the UI elements
    
});
}
}
