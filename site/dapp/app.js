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
    console.log('MetaMask is installed!');
    web3 = new Web3(window.ethereum);
} else {
    console.log('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    alert('MetaMask is not installed. Please consider installing it to view this page correctly: https://metamask.io/download.html');
document.getElementById('contract-explanation').style.display = 'none';
	document.getElementById('fieldContainer').style.display = 'none';
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
    const connectYourWalletText = document.getElementById('connectYourWalletText');
	const fieldContainer = document.getElementById('fieldContainer');
	const container = document.getElementById('container');
    const withdraw1 = document.getElementById('withdraw1');
   

     if (withdraw1) withdraw1.style.display = 'none';
    if (contractSelect) contractSelect.style.display = 'none';
    if (contract1InfoHeader) contract1InfoHeader.style.display = 'none';
    if (contract2InfoHeader) contract2InfoHeader.style.display = 'none';
    if (contract1DynamicInfo) contract1DynamicInfo.style.display = 'none';
  //  if (contract2DynamicInfo) contract2DynamicInfo.style.display = 'none';
    if (contractInfoContainer) contractInfoContainer.style.display = 'none';
	if (container) container.style.display = 'none'; 
	if (fieldContainer) fieldContainer.style.display = 'none';
	if (connectYourWalletText) connectYourWalletText.style.display = 'block';

     resetContractUI(); // Make sure this function also hides relevant elements correctly
     contract1Details.style.display = 'none';
     contract2Details.style.display = 'none';
     contract1Explanation.style.display = 'none';
     contract2Explanation.style.display = 'none';
     fieldContainer.style.display = 'none';
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
                console.log('No connected account found or mismatch with stored account');
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
 //   const contract2DynamicInfo = document.getElementById('contract2DynamicInfo');
        updateWithdrawableAmounts();
    const contractInfoContainer = document.getElementById('contractInfoContainer');
    const withdraw1 = document.getElementById('withdraw1');
    const withdraw2 = document.getElementById('withdraw2');
    const timelock1 = document.getElementById('timelock1');
    const timelock2 = document.getElementById('timelock2');
    const sendlocked = document.getElementById('sendlocked');
    document.getElementById('contract-explanation').style.display = 'block';
                document.getElementById('container').style.display = 'block';

if (contractSelect)  {
document.querySelector('.contract-selection').style.display = 'block';
contractSelect.style.display = 'block';

   connectYourWalletText.style.display = 'none';
document.getElementById(`fieldContainer`).style.display = 'none';

    contractSelect.addEventListener('change', function(event) {
        const selectedContract = event.target.value;

        // Hide all contract details, headers, and dynamic info first
	    
        document.getElementById('contract1Details').style.display = 'none';
        document.getElementById('contract2Details').style.display = 'none';
        document.getElementById('contract1Explanation').style.display = 'none';
	document.getElementById('contract2Explanation').style.display = 'none';
	contract1InfoHeader.style.display = 'none';
        contract2InfoHeader.style.display = 'none';
        contract1DynamicInfo.style.display = 'none';
        document.getElementById('contract2InfoSection').style.display = 'none';
    //    contract2DynamicInfo.style.display = 'none';
        contractInfoContainer.style.display = 'none';
	contractSelect.style.display = 'block';
	document.getElementById(`fieldContainer`).style.display = 'block';
//	document.getElementById(`radio-container-account`).style.display = 'none';
//	document.getElementById(`account-checkbox`).style.display = 'none';
  //      document.getElementById(`account-checkbox-label`).style.display = 'none';
document.getElementById('contract-explanation').style.display = 'block';	
      //  document.getElementById('contract-selection').style.display = 'block';
        if (selectedContract === 'select') {
           document.getElementById(`fieldContainer`).style.display = 'none';
		document.getElementById('contract-explanation').style.display = 'block';
		document.getElementById('container').style.display = 'block';
            return; // Do not proceed further if "Select Contract" is chosen
        }

        // Show the selected contract's details, corresponding header, and dynamic info
        document.getElementById(`${selectedContract}Details`).style.display = 'block';
	document.getElementById(`${selectedContract}Explanation`).style.display = 'block';
	 document.getElementById(`fieldContainer`).style.display = 'block';
        contractInfoContainer.style.display = 'block';
        if (selectedContract === 'contract1') {
            contract1InfoHeader.style.display = 'block';
            contract1DynamicInfo.style.display = 'block';
            withdraw1.style.display = 'block';
	    timelock1.style.display = 'block';
		document.getElementById('contract-explanation').style.display = 'none';
	document.getElementById(`fieldContainer`).style.display = 'block';
		document.getElementById(`acceptIncomingButton`).style.display = 'none';
            fetchContract1Info(account);
        } else if (selectedContract === 'contract2') {
            contract2InfoHeader.style.display = 'block';
		document.getElementById('contract2InfoSection').style.display = 'block';
        //    contract2DynamicInfo.style.display = 'block';
		document.getElementById('contract-explanation').style.display = 'none';
	    withdraw2.style.display = 'block';
	    timelock2.style.display = 'block';
	    sendlocked.style.display = 'block';
	document.getElementById(`fieldContainer`).style.display = 'block';
		document.getElementById(`acceptIncomingButton`).style.display = 'block';
            fetchContract2Info(account);
        }
    });

    // Initialize display based on the currently selected contract
    if (contractSelect.value !== 'select') {
        document.getElementById(`${contractSelect.value}Details`).style.display = 'block';
        contractInfoContainer.style.display = 'block';
	document.getElementById(`fieldContainer`).style.display = 'none';
	    document.getElementById('contract-explanation').style.display = 'block';
        if (contractSelect.value === 'contract1') {
	document.getElementById(`fieldContainer`).style.display = 'block';
            contract1InfoHeader.style.display = 'block';
		document.getElementById('contract-explanation').style.display = 'none';
            contract1DynamicInfo.style.display = 'block';
		document.getElementById(`acceptIncomingButton`).style.display = 'none';
            fetchContract1Info(account);
        } else if (contractSelect.value === 'contract2') {
	document.getElementById(`fieldContainer`).style.display = 'block';
            contract2InfoHeader.style.display = 'block';
		document.getElementById('contract-explanation').style.display = 'none';
        //    contract2DynamicInfo.style.display = 'block';
		document.getElementById(`acceptIncomingButton`).style.display = 'block';
            fetchContract2Info(account);
        }

    }

 }

}


function radioButtonUIResponse() {

// Show the corresponding input field when a radio button is clicked for Contract 1
resetContractUI(); // Call this to reset the UI elements
document.querySelectorAll('input[name="contract1Action"]').forEach(radio => {
    radio.addEventListener('change', () => {
        // Hide both amount input and buttons first
        resetContractUI(); // Call this to reset the UI elements
        // Show the corresponding input field and button
        document.getElementById('amount1').style.display = 'block'; // Show the amount field for both actions
        if (radio.value === 'timelock') {
            document.getElementById('timelock1Button').style.display = 'block';
	    document.getElementById('timelockedtokens1').style.display = 'block';
	    document.getElementById('withdrawaltime1').style.display = 'block';
        } else if (radio.value === 'withdraw') {
            document.getElementById('withdraw1Button').style.display = 'block';
	    document.getElementById('timelockedtokens1').style.display = 'none';
            document.getElementById('withdrawaltime1').style.display = 'none';
        }
    });
});

let intervalId; // Variable to store the interval ID

// Function to start the interval
function startInterval() {
    intervalId = setInterval(() => {
        updateTimelockRewardCalculation();
    }, 1000);
}

// Function to stop the interval
function stopInterval() {
    clearInterval(intervalId);
}

// Show the corresponding input field and/or textarea when a radio button is clicked for Contract 2
document.querySelectorAll('input[name="contract2Action"]').forEach(radio => {
    radio.addEventListener('change', () => {
        // Hide all amount inputs, textarea, and buttons first
        resetContractUI(); // Call this to reset the UI elements

        // Show the corresponding input field and/or textarea and button
        if (radio.value === 'timelock') {
            document.getElementById('amount2').style.display = 'block';
// Set an interval to call the update function every 1 seconds (1000 milliseconds)
startInterval();
	

            document.getElementById('timelock2Button').style.display = 'block';
	                document.getElementById('timelockedtokens2').style.display = 'block';
		document.getElementById('advanceTierMessage').style.display = 'block';

            document.getElementById('withdrawaltime2').style.display = 'block';
document.getElementById('timelockRewardCalculation').style.display = 'block';
        } else if (radio.value === 'withdraw') {
		document.getElementById('withdrawableNowRegularAccount').style.display = 'block';
		document.getElementById('withdrawableNowIncomingAccount').style.display = 'block';
		updateWithdrawableAmounts();
            document.getElementById('amount2').style.display = 'block';
	                document.getElementById('timelockedtokens2').style.display = 'none';
		document.getElementById('advanceTierMessage').style.display = 'none';

            document.getElementById('withdrawaltime2').style.display = 'none';
document.getElementById('timelockRewardCalculation').style.display = 'none';
            document.getElementById('withdraw2Button').style.display = 'block';
		document.getElementById('withdrawAll2Button').style.display = 'block';
document.getElementById(`radio-container-account`).style.display = 'flex';
		        //document.getElementById(`account-checkbox`).style.display = 'block';
        //document.getElementById(`account-checkbox-label`).style.display = 'block';
        } else if (radio.value === 'sendlocked') {
		stopInterval();
            document.getElementById('ethAddresses').style.display = 'block';
            document.getElementById('sendLockedAmounts').style.display = 'block';
            document.getElementById('sendLocked2Button').style.display = 'block';
        }
    });
});
}
radioButtonUIResponse();


// Event listener for the Contract 1 Timelock button
const timelock1Button = document.getElementById('timelock1Button');
if (timelock1Button) {
timelock1Button.addEventListener('click', function() {
    const amount = Number(document.getElementById('amount1').value) * 100000000;
    timelockTokens(contract1Address, amount);
});
}

// Event listener for the Contract 1 Withdraw button

const withdraw1Button = document.getElementById('withdraw1Button');
if (withdraw1Button) {
withdraw1Button.addEventListener('click', function() {
    const amountInput = Number(document.getElementById('amount1').value);
    const amount = Math.floor(amountInput * 100000000); // Ensures it is an integer
    withdrawTokensContract1(amount);
});
}


// Event listener for the Contract 2 Timelock button
const timelock2Button = document.getElementById('timelock2Button');
if (timelock2Button) {
timelock2Button.addEventListener('click', function() {
    const amount = Number(document.getElementById('amount2').value) * 100000000;
    timelockTokens(contract2Address, amount);
});
}

// Event listener for the Contract 2 Withdraw button
const withdraw2Button = document.getElementById('withdraw2Button')
if (withdraw2Button) {
withdraw2Button.addEventListener('click', function() {
    const amountInput = Number(document.getElementById('amount2').value);
    const amount = Math.floor(amountInput * 100000000); // Ensures it is an integer
    withdrawTokensContract2(amount);
});
}

// Event listener for the Contract 2 Send Locked Tokens button
const sendLocked2Button = document.getElementById('sendLocked2Button')
if (sendLocked2Button) {
sendLocked2Button.addEventListener('click', function() {
    const addresses = document.getElementById('ethAddresses').value.trim().split('\n');
    const amountsText = document.getElementById('sendLockedAmounts').value.trim().split('\n');
    const amounts = amountsText.map(amount => Number(amount) * 100000000);
    if (addresses.length !== amounts.length) {
        console.error('The number of addresses and amounts does not match.');
	document.getElementById('errorMessage').innerText = `The number of addresses and amounts does not match.`;
	    document.getElementById('clearError').style.display = 'block';
return;
    }
    markTimelockedTokensForSend(addresses, amounts);
});
}


/*
async function updateWithdrawableAmounts() {
    try {
        const account = await web3.eth.getAccounts()[0]; // Assuming you get the account from web3

        const withdrawableNowRegularAccount = await window.contract2.methods.getUnlockedForWithdrawalRegularAccount(account).call();
        const withdrawableNowIncomingAccount = await window.contract2.methods.getUnlockedForWithdrawalIncomingAccount(account).call();

        document.getElementById('withdrawableNowRegularAccount').innerText = `Max withdrawable now: ${withdrawableNowRegularAccount} BSOV`;
        document.getElementById('withdrawableNowIncomingAccount').innerText = `Max withdrawable now: ${withdrawableNowIncomingAccount} BSOV`;
    } catch (error) {
        console.error('Error fetching withdrawable amounts:', error);
    }
}
*/


/*
async function updateWithdrawableAmounts() {
    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0]; // Ensure an account is available

        if (!account) {
            throw new Error('No account found');
        }

        console.log('Fetching withdrawable amounts for account:', account);

        // Ensure contract2 is initialized
        if (!window.contract2) {
            throw new Error('Contract 2 is not initialized');
        }

        // Fetch withdrawable amounts
        const withdrawableNowRegularAccount = await window.contract2.methods.getUnlockedForWithdrawalRegularAccount(account).call();
        const withdrawableNowIncomingAccount = await window.contract2.methods.getUnlockedForWithdrawalIncomingAccount(account).call();

        // Convert BigInt amounts to BSOV with 8 decimal places
        const withdrawableNowRegularAccountFormatted = formatBSOVAmount(withdrawableNowRegularAccount);
        const withdrawableNowIncomingAccountFormatted = formatBSOVAmount(withdrawableNowIncomingAccount);

        console.log('Withdrawable amounts fetched successfully:', {
            withdrawableNowRegularAccountFormatted,
            withdrawableNowIncomingAccountFormatted
        });

        document.getElementById('withdrawableNowRegularAccount').innerText = `Max withdrawable now: ${withdrawableNowRegularAccountFormatted} BSOV`;
        document.getElementById('withdrawableNowIncomingAccount').innerText = `Max withdrawable now: ${withdrawableNowIncomingAccountFormatted} BSOV`;
    } catch (error) {
        console.error('Error fetching withdrawable amounts:', error.message);
        document.getElementById('errorMessage').innerText = `Error fetching withdrawable amounts: ${error.message}`;
    }
}

function formatBSOVAmount(amount) {
    const bsovAmount = Number(BigInt(amount) / BigInt(100000000)); // Convert to BSOV by dividing by 10^8
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(bsovAmount);
}
*/


async function updateWithdrawableAmounts() {
    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0]; // Ensure an account is available

        if (!account) {
            throw new Error('No account found');
        }

        console.log('Fetching withdrawable amounts and times for account:', account);

        // Ensure contract2 is initialized
        if (!window.contract2) {
            throw new Error('Contract 2 is not initialized');
        }

        // Fetch withdrawable amounts
        const withdrawableNowRegularAccount = await window.contract2.methods.getUnlockedForWithdrawalRegularAccount(account).call();
        const withdrawableNowIncomingAccount = await window.contract2.methods.getUnlockedForWithdrawalIncomingAccount(account).call();

        // Fetch next withdrawal timestamps
        const nextWithdrawalRegularAccount = await window.contract2.methods.getNextWithdrawalRegularAccount(account).call();
        const nextWithdrawalIncomingAccount = await window.contract2.methods.getNextWithdrawalIncomingAccount(account).call();

        // Convert BigInt amounts to BSOV with 8 decimal places
        const withdrawableNowRegularAccountFormatted = formatBSOVAmount(BigInt(withdrawableNowRegularAccount));
        const withdrawableNowIncomingAccountFormatted = formatBSOVAmount(BigInt(withdrawableNowIncomingAccount));

        // Calculate time left until next withdrawal
        const timeLeftRegularAccount = calculateTimeLeft(BigInt(nextWithdrawalRegularAccount));
        const timeLeftIncomingAccount = calculateTimeLeft(BigInt(nextWithdrawalIncomingAccount));

        console.log('Withdrawable amounts and times fetched successfully:', {
            withdrawableNowRegularAccountFormatted,
            withdrawableNowIncomingAccountFormatted,
            timeLeftRegularAccount,
            timeLeftIncomingAccount
        });

        document.getElementById('withdrawableNowRegularAccount').innerText = `Max withdrawable now: ${withdrawableNowRegularAccountFormatted} BSOV`;
        document.getElementById('timeLeftRegularAccount').innerHTML = `Time left until next withdrawal:<br>${timeLeftRegularAccount}`;
        document.getElementById('withdrawableNowIncomingAccount').innerText = `Max withdrawable now: ${withdrawableNowIncomingAccountFormatted} BSOV`;
        document.getElementById('timeLeftIncomingAccount').innerHTML = `Time left until next withdrawal:<br>${timeLeftIncomingAccount}`;
    } catch (error) {
        console.error('Error fetching withdrawable amounts:', error.message);
        document.getElementById('errorMessage').innerText = `Error fetching withdrawable amounts: ${error.message}`;
    }
}

function formatBSOVAmount(amount) {
    const bsovAmount = Number(amount) / 100000000; // Convert to BSOV by dividing by 10^8
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(bsovAmount);
}

function calculateTimeLeft(nextWithdrawalTimestamp) {
    const now = BigInt(Math.floor(Date.now() / 1000)); // Current time in seconds as BigInt

    if (nextWithdrawalTimestamp <= now) {
        return "0 days, 0 hours, 0 min, 0 sec";
    }

    const timeLeft = nextWithdrawalTimestamp - now;

    const days = Number(timeLeft / (24n * 3600n));
    const hours = Number((timeLeft % (24n * 3600n)) / 3600n);
    const minutes = Number((timeLeft % 3600n) / 60n);
    const seconds = Number(timeLeft % 60n);

    return `${days} days, ${hours} hours, ${minutes} min, ${seconds} sec`;
}




// WORKING CODE
async function updateTimelockRewardCalculation() {
    // Check if contract2 and the element exist
    if (!window.contract2 || !document.getElementById('amount2')) {
        console.error('Required elements are not initialized.');
        return;
    }

try {
	const currentTier = await window.contract2.methods.currentGlobalTier().call();
const totalTimelockedBigInt = await window.contract2.methods.totalCumulativeTimelocked().call();
const totalTimelocked = Number(totalTimelockedBigInt);
const totalTimelockedFormatted = totalTimelocked / 100000000;


        // Get the amount and calculate timelocked tokens
        const amount = document.getElementById('amount2').value;
        const timelockedTokens = amount * 0.99;
	let currentTierNum = Number(currentTier);


        


if ((totalTimelockedFormatted + timelockedTokens) >= currentTierNum * 150000) {
	currentTierNum++;
	document.getElementById('advanceTierMessage').innerHTML =
            `You're advancing to Tier ${currentTierNum.toFixed(0)} with halved rewards!`;

} else {
	        document.getElementById('advanceTierMessage').innerHTML =
            `Tier ${currentTierNum.toFixed(0)} `;
}





        // Calculate ROI based on tier
        const roi = calculateAndDisplayROI(currentTier);

        // Calculate Timelock Reward Tokens
        const timelockRewardTokens = timelockedTokens * roi;

        // Update the HTML element
        document.getElementById('timelockRewardCalculation').innerHTML = 
            `You'll be eligible for ${timelockRewardTokens.toFixed(0)} BSOV in Timelock Rewards!`;
    } catch (error) {
        console.error('Error in updating Timelock Reward Calculation:', error);
             }
            }
       
    
function calculateAndDisplayROI(tier) {
    // Define ROI ratios for each tier
    const tierRatios = {
        1: 1,
        2: 0.5,
        3: 0.25,
        4: 0.125,
        5: 0.0625,
        6: 0.03125,
        7: 0.015625,
        8: 0.0078125,
        9: 0.00390625,
        10: 0.00390625
    };

    // Return the ROI for the given tier, or 0 if the tier is not recognized
    return tierRatios[tier];
}



async function executeTransactionIfFeeIsAcceptable(contractMethod, args, fromAddress) {
    const HIGH_FEE_THRESHOLD = web3.utils.toWei("0.1", "ether"); // Example threshold: 0.1 ETH
    const estimatedGas = await contractMethod.estimateGas(...args, { from: fromAddress });
    const gasPrice = await web3.eth.getGasPrice();

    const estimatedFee = BigInt(estimatedGas) * BigInt(gasPrice);
    const highFeeThreshold = BigInt(HIGH_FEE_THRESHOLD);
    console.log('Estimated Fee: ' + estimatedFee);
    console.log("Highest Fee Threshold: " + highFeeThreshold);
    if (estimatedFee > highFeeThreshold) {
        throw new Error("HighFees");
    }

    console.log("Initiating Transaction...");
    return contractMethod.send(...args, { from: fromAddress });
}


const claimRewardsReserveButton = document.getElementById('claimRewardsReserveButton');
if (claimRewardsReserveButton) {
    claimRewardsReserveButton.addEventListener('click', function() {
        claimRewardsReserveTokens();
    });
}

// Function to claim Rewards Reserve tokens
async function claimRewardsReserveTokens() {
    if (!window.contract2) {
        console.error('rewardsReserve is not initialized for claiming tokens');
        return;
    }
    const transaction = window.contract2.methods.claimTimelockRewards();

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Transaction receipt: ", receipt);
    } catch (error) {
        console.error("Error in transaction: ", error);
        document.getElementById('errorMessage').innerText = `${error.message}`;
	    document.getElementById('clearError').style.display = 'block';
}
}


const acceptIncomingButton = document.getElementById('acceptIncomingButton');
if (acceptIncomingButton) {
    acceptIncomingButton.addEventListener('click', function() {
        acceptIncomingTokens();
    });
}


// Function to accept received tokens
async function acceptIncomingTokens() {
    if (!window.contract2) {
        console.error('Contract 2 is not initialized for claiming tokens');
        return;
    }
    const transaction = window.contract2.methods.acceptUntakenIncomingTokens();

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Transaction receipt: ", receipt);
    } catch (error) {
        console.error("Error in transaction: ", error);
        document.getElementById('errorMessage').innerText = `${error.message}`;
	    document.getElementById('clearError').style.display = 'block';
 }
}


// Function to withdraw tokens from Contract 1
async function withdrawTokensContract1(amount) {
    document.getElementById('errorMessage').innerText = '';
    if (!window.contract1) {
        console.error('Contract 1 is not initialized for withdrawal');
        return;
    }

    const transaction = window.contract1.methods.withdraw(amount);

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Transaction receipt: ", receipt);
    } catch (error) {
        if (error.message.includes("HighFees")) {
            document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected. Something is wrong with the parameters you have specified, or you are trying to withdraw before the Lock Time has expired, or you are trying to withdraw/timelock too many tokens.';
		document.getElementById('clearError').style.display = 'block';
 } else {
            console.error("Error in transaction: ", error);
            document.getElementById('errorMessage').innerText = `${error.message}`;
	 document.getElementById('clearError').style.display = 'block';
}
    }
}

/*
// Function to withdraw tokens from Contract 2
async function withdrawTokensContract2(amount) {
    document.getElementById('errorMessage').innerText = '';
    if (!window.contract2) {
        console.error('Contract 2 is not initialized for withdrawal');
        return;
    }
//    const fromIncomingAccount = document.getElementById('account-checkbox').checked;
const selectedAccountType = document.querySelector('input[name="account-type"]:checked').value;

    const transaction = window.contract2.methods.withdrawFromRegularAccount(amount);
    //const transaction = window.contract2.methods.withdraw(amount);

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Transaction receipt: ", receipt);
    } catch (error) {
        if (error.message.includes("HighFees")) {
            document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected. Something is wrong with the parameters you have specified, or you are trying to withdraw before the Lock Time has expired, or you are trying to withdraw/timelock too many tokens.';
		document.getElementById('clearError').style.display = 'block';
} else {
            console.error("Error in transaction: ", error);
            document.getElementById('errorMessage').innerText = `${error.message}`;
	document.getElementById('clearError').style.display = 'block';
}
    }
}
*/

// Function to withdraw tokens from Contract 2
async function withdrawTokensContract2(amount) {
    document.getElementById('errorMessage').innerText = '';
    if (!window.contract2) {
        console.error('Contract 2 is not initialized for withdrawal');
        return;
    }

    // Determine which account type is selected
    const selectedAccountType = document.querySelector('input[name="account-type"]:checked').value;

    let transaction;
    if (selectedAccountType === 'incoming') {
        transaction = window.contract2.methods.withdrawFromIncomingAccount(amount);
    } else {
        transaction = window.contract2.methods.withdrawFromRegularAccount(amount);
    }

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Transaction receipt: ", receipt);
    } catch (error) {
        if (error.message.includes("HighFees")) {
            document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected. Something is wrong with the parameters you have specified, or you are trying to withdraw before the Lock Time has expired, or you are trying to withdraw/timelock too many tokens.';
            document.getElementById('clearError').style.display = 'block';
        } else {
            console.error("Error in transaction: ", error);
            document.getElementById('errorMessage').innerText = `${error.message}`;
            document.getElementById('clearError').style.display = 'block';
        }
    }
}

// Event listener for the Contract 2 Withdraw All button
const withdrawAll2Button = document.getElementById('withdrawAll2Button');
if (withdrawAll2Button) {
    withdrawAll2Button.addEventListener('click', function() {
        withdrawAllTokensContract2();
    });
}

// Function to withdraw all tokens from Contract 2
async function withdrawAllTokensContract2() {
    document.getElementById('errorMessage').innerText = '';
    if (!window.contract2) {
        console.error('Contract 2 is not initialized for withdrawal');
        return;
    }

    let transaction = window.contract2.methods.withdrawAll();

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Transaction receipt: ", receipt);
    } catch (error) {
        if (error.message.includes("HighFees")) {
            document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected. Something is wrong with the parameters you have specified, or you are trying to withdraw before the Lock Time has expired, or you are trying to withdraw/timelock too many tokens.';
            document.getElementById('clearError').style.display = 'block';
        } else {
            console.error("Error in transaction: ", error);
            document.getElementById('errorMessage').innerText = `${error.message}`;
            document.getElementById('clearError').style.display = 'block';
        }
    }
}

/*
// Function for sending locked tokens
async function markTimelockedTokensForSend(addresses, amounts) {
    if (!window.contract2) {
        console.error('Contract 2 is not initialized for sending locked tokens');
        return;
    }

    // Validate Addresses and Amounts
    const isValidAddresses = addresses.every(address => web3.utils.isAddress(address));
    const isValidAmounts = amounts.every(amount => !isNaN(amount) && amount > 0);

    if (!isValidAddresses || !isValidAmounts) {
        document.getElementById('errorMessage').innerText = 'Please enter valid Ethereum addresses and amounts.';
	    document.getElementById('clearError').style.display = 'block';
 return;
    }

    const transaction = window.contract2.methods.sendLockedTokensToMany(addresses, amounts);

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Send Locked token transaction receipt: ", receipt);
    } catch (error) {
        console.error("Error in send locked Token transaction: ", error);
        document.getElementById('errorMessage').innerText = `${error.message}`;
	    document.getElementById('clearError').style.display = 'block';
}
}
*/


// Function for sending locked tokens
async function markTimelockedTokensForSend(addresses, amounts) {
    if (!window.contract2) {
        console.error('Contract 2 is not initialized for sending locked tokens');
        return;
    }

    // Validate Addresses and Amounts
    const isValidAddresses = addresses.every(address => web3.utils.isAddress(address));
    const isValidAmounts = amounts.every(amount => !isNaN(amount) && amount > 0);

    if (!isValidAddresses || !isValidAmounts) {
        document.getElementById('errorMessage').innerText = 'Please enter valid Ethereum addresses and amounts.';
        document.getElementById('clearError').style.display = 'block';
        return;
    }

    let transaction;
    if (addresses.length === 1 && amounts.length === 1) {
        // Call sendLockedTokensToSingle if there's only one address and one amount
        transaction = window.contract2.methods.sendLockedTokensToSingle(addresses[0], amounts[0]);
    } else {
        // Call sendLockedTokensToMany if there are multiple addresses and amounts
        transaction = window.contract2.methods.sendLockedTokensToMany(addresses, amounts);
    }

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Send Locked token transaction receipt: ", receipt);
    } catch (error) {
        console.error("Error in send locked Token transaction: ", error);
        document.getElementById('errorMessage').innerText = `${error.message}`;
        document.getElementById('clearError').style.display = 'block';
    }
}



function resetContractUI() {

// console.log('resetContractUI Function started');
    // Hide all buttons and input fields
    document.getElementById('amount1').style.display = 'none';
    document.getElementById('amount2').style.display = 'none';
    document.getElementById('ethAddresses').style.display = 'none';
    document.getElementById('sendLockedAmounts').style.display = 'none';
    document.getElementById('timelock1Button').style.display = 'none';
    document.getElementById('withdraw1Button').style.display = 'none';
    document.getElementById('timelock2Button').style.display = 'none';
    document.getElementById('withdraw2Button').style.display = 'none';
	document.getElementById('withdrawAll2Button').style.display = 'none';
    document.getElementById('sendLocked2Button').style.display = 'none';
//document.getElementById('contract-explanation').style.display = 'none';
	document.getElementById('errorMessage').innerText = '';
	document.getElementById(`clearError`).style.display = 'none';
 document.getElementById(`radio-container-account`).style.display = 'none';
//	document.getElementById(`account-checkbox`).style.display = 'none';
 //       document.getElementById(`account-checkbox-label`).style.display = 'none';
            document.getElementById('timelockedtokens1').style.display = 'none';
            document.getElementById('withdrawaltime1').style.display = 'none';
            document.getElementById('timelockedtokens2').style.display = 'none';
	document.getElementById('advanceTierMessage').style.display = 'none';
            document.getElementById('withdrawaltime2').style.display = 'none';
document.getElementById('timelockRewardCalculation').style.display = 'none';

// When a new contract is selected
const contractSelect = document.getElementById('contractSelect');
if (contractSelect) {
contractSelect.addEventListener('change', function(event) {
 //   resetContractUI(); // Call this to reset the UI elements
    
});
}


// const HIGH_FEE_THRESHOLD = web3.utils.toWei("0.1", "ether"); // Example threshold: 0.1 ETH

async function handleWithdraw() {
    const selectedContract = document.getElementById('contractSelect').value;
    let contractInstance;
    let amountInputId;

    // Determine which contract is selected and set the corresponding contract instance and input ID
    if (selectedContract === 'contract1') {
        contractInstance = window.contract1;
        amountInputId = 'amount1';
    } else if (selectedContract === 'contract2') {
        contractInstance = window.contract2;
        amountInputId = 'amount2';
    } else {
        alert('Please select a contract.');
        return;
    }

    // Ensure the contract instance is available
    if (!contractInstance) {
        console.error('Selected contract is not initialized.');
        alert('Selected contract is not initialized.');
        return;
    }

     }
   }


