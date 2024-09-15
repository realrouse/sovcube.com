// app.js


// Function to detect mobile devices and log result in console
function isMobile() {
    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    console.log('Is Mobile Device:', isMobileDevice);
    return isMobileDevice;
}


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
	    window.selectedAccount = selectedAccount;
    } else {
        connectButton.innerText = 'Connect to Wallet';
	    window.selectedAccount = null;
    }
}


function showTxProgressPopup() {
    const popup = document.getElementById('txProgressPopup');
    if (popup) {
        popup.style.display = 'block';
    }
}

function hideTxProgressPopup() {
    const popup = document.getElementById('txProgressPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}



// Function to handle wallet connection
async function connectWallet() {
// console.log('connectWallet Function started');
    if (selectedAccount) {
        // Disconnect the wallet
        selectedAccount = null;
	    window.selectedAccount = null;
        localStorage.removeItem('selectedAccount'); // Remove account from local storage
        updateUIForDisconnectedWallet();
    } else if (window.ethereum) {
        // Connect to the wallet
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            selectedAccount = accounts[0];
		window.selectedAccount = selectedAccount;
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
            walletStatus.innerHTML = `<div class="connected-to">
			<b>Connected to:</b><br>${account}<br><br><img width=13px height=auto src="/images/bsov-small-sharp.png"></img><b> BSOV in wallet:</b><br>${formattedBalanceString} BSOV
		</div>`;
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
		    window.selectedAccount = selectedAccount;
                updateUIForConnectedWallet(selectedAccount);
            } else {
                // No accounts connected or the stored account does not match
                console.log('No connected account found or mismatch with stored account');
                updateUIForDisconnectedWallet();
		    window.selectedAccount = null;
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
	   // document.getElementById('withdrawaltime1').style.display = 'block';
        } else if (radio.value === 'withdraw') {
            document.getElementById('withdraw1Button').style.display = 'block';
	    document.getElementById('timelockedtokens1').style.display = 'none';
           // document.getElementById('withdrawaltime1').style.display = 'none';
        }
    });
});



	let intervals = {}; // Object to store all interval IDs and their times

// Function to start an interval for a specific function
function startInterval(fn, intervalTime = 1000) {
    if (!intervals[fn.name]) {
        intervals[fn.name] = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fn();
            }
        }, intervalTime);
    }
}

// Function to stop the interval for a specific function
function stopInterval(fn) {
    if (intervals[fn.name]) {
        clearInterval(intervals[fn.name]);
        delete intervals[fn.name];
    }
}

// Function to stop all intervals
function stopAllIntervals() {
    for (const key in intervals) {
        clearInterval(intervals[key]);
    }
    intervals = {};
}

// Your event listeners or other code where stopAllIntervals is called
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        stopAllIntervals(); // This should now work without errors
    } else if (document.visibilityState === 'visible') {
        const selectedRadio = document.querySelector('input[name="contract2Action"]:checked');
        if (selectedRadio) {
            if (selectedRadio.value === 'withdraw') {
                startInterval(updateWithdrawableAmounts, 1000);
            } else if (selectedRadio.value === 'timelock') {
                startInterval(updateTimelockRewardCalculation, 2000);
            }
        }
    }
});



// Show the corresponding input field and/or textarea when a radio button is clicked for Contract 2
document.querySelectorAll('input[name="contract2Action"]').forEach(radio => {
    radio.addEventListener('change', () => {
        // Hide all amount inputs, textarea, and buttons first
        resetContractUI(); // Call this to reset the UI elements

        // Stop all intervals before starting a new one
        stopAllIntervals();

        // Show the corresponding input field and/or textarea and button
        if (radio.value === 'timelock') {
            document.getElementById('amount2').style.display = 'block';
            startInterval(updateTimelockRewardCalculation, 2000); // Start interval for timelock reward calculation with a 2-second interval

            document.getElementById('timelock2Button').style.display = 'block';
            document.getElementById('timelockedtokens2').style.display = 'block';
            document.getElementById('advanceTierMessage').style.display = 'block';
            document.getElementById('timelockRewardCalculation').style.display = 'block';
        } else if (radio.value === 'withdraw') {
            document.getElementById('withdrawableNowRegularAccount').style.display = 'block';
            document.getElementById('withdrawableNowIncomingAccount').style.display = 'block';
            startInterval(updateWithdrawableAmounts, 1000); // Start interval for withdrawable amounts update with a 1-second interval

            document.getElementById('amount2').style.display = 'block';
            document.getElementById('timelockedtokens2').style.display = 'none';
            document.getElementById('advanceTierMessage').style.display = 'none';
            document.getElementById('timelockRewardCalculation').style.display = 'none';
            document.getElementById('withdraw2Button').style.display = 'block';
            document.getElementById('withdrawAll2Button').style.display = 'block';
            document.getElementById(`radio-container-account`).style.display = 'flex';
        } else if (radio.value === 'sendlocked') {
            stopAllIntervals(); // Stop any running interval

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
    //timelockTokens(contract1Address, amount);
});
}

// Event listener for the Contract 1 Withdraw button

const withdraw1Button = document.getElementById('withdraw1Button');
if (withdraw1Button) {
withdraw1Button.addEventListener('click', function() {
    const amountInput = Number(document.getElementById('amount1').value);
    const amount = Math.floor(amountInput * 100000000); // Ensures it is an integer
   // withdrawTokensContract1(amount);
});
}


// Event listener for the Contract 2 Timelock button
const timelock2Button = document.getElementById('timelock2Button');
if (timelock2Button) {
timelock2Button.addEventListener('click', function() {
    const amount = Number(document.getElementById('amount2').value) * 100000000;
   // timelockTokens(contract2Address, amount);
});
}

// Event listener for the Contract 2 Withdraw button
const withdraw2Button = document.getElementById('withdraw2Button')
if (withdraw2Button) {
withdraw2Button.addEventListener('click', function() {
    const amountInput = Number(document.getElementById('amount2').value);
    const amount = Math.floor(amountInput * 100000000); // Ensures it is an integer
    // withdrawTokensContract2(amount);
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
        const timelockRewardTokens = await calculateTimelockRewardTokens();

        // Update the HTML element
        document.getElementById('timelockRewardCalculation').innerHTML = 
            `You will receive ${timelockRewardTokens.toFixed(0)} BSOV in Timelock Rewards!`;
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
    const formattedFee = web3.utils.fromWei(estimatedFee.toString(), "ether");

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
        //const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
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
        //const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
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


// Function to withdraw tokens from Contract 2
async function withdrawTokensContract2(amount, transaction) {
    document.getElementById('errorMessage').innerText = '';
    if (!window.contract2) {
        console.error('Contract 2 is not initialized for withdrawal');
        return;
    }

    try {
        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
        console.log("Transaction receipt: ", receipt);
    } catch (error) {
        if (error.message.includes("HighFees")) {
            document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected.';
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
    //    withdrawAllTokensContract2();
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
        //const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
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
        //const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
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
          //  document.getElementById('withdrawaltime1').style.display = 'none';
            document.getElementById('timelockedtokens2').style.display = 'none';
	document.getElementById('advanceTierMessage').style.display = 'none';
       //     document.getElementById('withdrawaltime2').style.display = 'none';
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

/*
async function calculateTimelockRewardTokens() {
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
        }

        // Calculate ROI based on tier
        const roi = calculateAndDisplayROI(currentTier);

        // Calculate and return Timelock Reward Tokens
        const timelockRewardTokens = timelockedTokens * roi;
        return timelockRewardTokens;

    } catch (error) {
        console.error('Error in calculating Timelock Reward Tokens:', error);
    }
}
*/
async function calculateTimelockRewardTokens() {
    // Check if contract2 and the element exist
    if (!window.contract2 || !document.getElementById('amount2')) {
        console.error('Required elements are not initialized.');
        return;
    }

    try {
        const currentTier = await window.contract2.methods.currentGlobalTier().call();
        const totalTimelockedBigInt = await window.contract2.methods.totalCumulativeTimelocked().call();
        const totalTimelocked = Number(totalTimelockedBigInt);
        let totalTimelockedFormatted = totalTimelocked / 100000000;

        // Get the amount and calculate timelocked tokens
        const amount = Number(document.getElementById('amount2').value);
        const timelockedTokens = amount * 0.99;
        let remainingTokens = timelockedTokens;
        let rewardTokens = 0;

        let currentTierNum = Number(currentTier);
        let tierThreshold = currentTierNum * 150000;

        while (remainingTokens > 0) {
            let tokensInCurrentTier = 0;

            if (totalTimelockedFormatted + remainingTokens > tierThreshold) {
                // Calculate how many tokens fit into the current tier
                tokensInCurrentTier = tierThreshold - totalTimelockedFormatted;
            } else {
                // All remaining tokens fit within the current tier
                tokensInCurrentTier = remainingTokens;
            }

            // Calculate rewards for tokens in the current tier
            const roi = calculateAndDisplayROI(currentTierNum);
            rewardTokens += tokensInCurrentTier * roi;

            // Update remaining tokens and move to the next tier if needed
            remainingTokens -= tokensInCurrentTier;
            totalTimelockedFormatted += tokensInCurrentTier;

            // Move to the next tier and update the threshold
            if (remainingTokens > 0) {
                currentTierNum++;
                tierThreshold = currentTierNum * 150000;
            }
        }

        return rewardTokens;

    } catch (error) {
        console.error('Error in calculating Timelock Reward Tokens:', error);
    }
}


function loadBSOVTokenABI(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/dapp/bsov.abi', true); // Update the path to the correct URL
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            bsovTokenABI = JSON.parse(xhr.responseText);
            if (callback) {
                callback();
            }
        }
    };
    xhr.send();
}


loadBSOVTokenABI();


function convertBigIntToString(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'bigint') {
            obj[key] = obj[key].toString();
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            convertBigIntToString(obj[key]); // Recursively handle nested objects
        }
    }
}


function showConfirmationModal(title, bodyContents, action) {
    const confirmationModalElement = document.getElementById('confirmationModal');
const modalOverlayElement = document.querySelector('.modal-overlay');
	const confirmationModal = new bootstrap.Modal(confirmationModalElement, {
        backdrop: 'static',
        keyboard: false
    });

    // References to modal elements
    const modalTitleElement = confirmationModalElement.querySelector('.modal-title');
    const modalBodyElement = confirmationModalElement.querySelector('.modal-body');
    const confirmButton = document.getElementById('confirmAction');

    // Join body contents if it's an array
    let bodyContent = '';
    if (Array.isArray(bodyContents)) {
        bodyContent = bodyContents.join('<br><br>');
    } else {
        bodyContent = bodyContents;
    }

    modalTitleElement.textContent = title;
    modalBodyElement.innerHTML = bodyContent;

    // Remove previous event listeners on the confirm button
    const newConfirmButton = confirmButton.cloneNode(true);
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);

    // Attach the new event listener
    newConfirmButton.addEventListener('click', function () {
        if (action && typeof action === 'function') {
            action();
        }
        confirmationModal.hide();
	    modalOverlayElement.style.display = 'none';
    });

    // Cancel button handler
    document.getElementById('cancelAction').addEventListener('click', function () {
        confirmationModal.hide();
	    modalOverlayElement.style.display = 'none';
    });

    // Show the modal
    modalOverlayElement.style.display = 'block';
    confirmationModal.show();
}




document.addEventListener('DOMContentLoaded', function () {
    // Error Display Function
    function displayError(message) {
        const errorMessageElement = document.getElementById('errorMessage');
        const clearErrorButton = document.getElementById('clearError');
        if (errorMessageElement && clearErrorButton) {
            errorMessageElement.textContent = message;
            clearErrorButton.style.display = 'block';
            clearErrorButton.addEventListener('click', function() {
                errorMessageElement.textContent = '';
                clearErrorButton.style.display = 'none';
            });
        } else {
            console.error('Error elements not found in the DOM.');
        }
    }

    // Transaction Functions
    function timelock1Action() {
        try {
            const amountInput = document.getElementById('amount1').value;
            const amount = Number(amountInput) * 100000000;
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Please enter a valid amount.');
            }
            timelockTokens(contract1Address, amount);
        } catch (error) {
            displayError(error.message);
        }
    }

    function timelock2Action() {
        try {
            const amountInput = document.getElementById('amount2').value;
            const amount = Number(amountInput) * 100000000;
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Please enter a valid amount.');
            }
//            timelockTokens(contract2Address, amount);
        } catch (error) {
            displayError(error.message);
        }
    }

    function withdraw1Action() {
        try {
            const amountInput = document.getElementById('amount1').value;
            const amount = Math.floor(Number(amountInput) * 100000000);
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Please enter a valid amount.');
            }
   //         withdrawTokensContract1(amount);
        } catch (error) {
            displayError(error.message);
        }
    }




function withdraw2Action(amount, transaction) {
    try {
        executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount)
            .then(receipt => {
                console.log("Transaction receipt: ", receipt);
            })
            .catch(error => {
                if (error.message.includes("HighFees")) {
                    document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected. Something is wrong with the parameters you have specified, or you are trying to withdraw before the Lock Time has expired, or you are trying to withdraw/timelock too many tokens.';
                    document.getElementById('clearError').style.display = 'block';
                } else {
                    console.error("Error in transaction: ", error);
                    document.getElementById('errorMessage').innerText = `${error.message}`;
                    document.getElementById('clearError').style.display = 'block';
                }
            });
    } catch (error) {
        displayError(error.message);
    }
}


    function withdrawAll2Action() {
        try {
            //withdrawAllTokensContract2();
        } catch (error) {
            displayError(error.message);
        }
    }

function sendLocked2Action() {
    try {
        const addressesInput = document.getElementById('ethAddresses').value.trim();
        const amountsInput = document.getElementById('sendLockedAmounts').value.trim();

        if (!addressesInput || !amountsInput) {
            throw new Error('Please enter both addresses and amounts.');
        }

        const addresses = addressesInput.split('\n').map(addr => addr.trim()).filter(addr => addr);
        const amounts = amountsInput.split('\n').map(amt => Number(amt.trim()) * 100000000).filter(amt => !isNaN(amt) && amt > 0);

        if (addresses.length !== amounts.length) {
            throw new Error('The number of addresses and amounts do not match.');
        }

        for (let addr of addresses) {
            if (!web3.utils.isAddress(addr)) {
                throw new Error(`Invalid Ethereum address: ${addr}`);
            }
        }

        markTimelockedTokensForSend(addresses, amounts);
    } catch (error) {
        displayError(error.message);
    }
}



// Attach Event Listeners to Buttons
function attachConfirmationListeners() {
    // Timelock Contract 1
    const timelock1Button = document.getElementById('timelock1Button');
    if (timelock1Button) {
        timelock1Button.addEventListener('click', function(event) {
            event.preventDefault();
            const amount = document.getElementById('amount1').value;

            // Example placeholder values - replace with real calculations as needed
            const amountBurnt = amount * 0.01;
            const timelockedAmount = amount * 0.99;
            const estimatedFee = '0.001 ETH';

            const customMessage = `
                <p>Are you sure you want to timelock <strong>${amount}</strong> tokens in Contract 1?</p>
                <table class="modal-table">
                    <tr>
                        <td>Amount Sent from Your Wallet:</td>
                        <td>${amount} BSOV</td>
                    </tr>
                    <tr>
                        <td>Amount Burnt (1%):</td>
                        <td>${amountBurnt} BSOV</td>
                    </tr>
                    <tr>
                        <td>Amount Timelocked:</td>
                        <td>${timelockedAmount} BSOV</td>
                    </tr>
                    <tr>
                        <td>Estimated Transaction Fee:</td>
                        <td>${estimatedFee}</td>
                    </tr>
                </table>
		<p>There is no reason for you to timelock your tokens into Contract 1, unless you just really want to. It's recommended to use Contract 2.</p>
		<p>By clicking 'Confirm' you agree on the <a target="_blank" href="http://sovcube.localhost/docs/index.php#legal">terms</a> and that you truly understand what you are doing.</p>
            `;

            showConfirmationModal('Confirm Timelock', customMessage, timelock1Action);
        });
    }




// Timelock Contract 2
const timelock2Button = document.getElementById('timelock2Button');
if (timelock2Button) {
    timelock2Button.addEventListener('click', async function(event) {
        event.preventDefault();
        try {
            const amount = document.getElementById('amount2').value;
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Please enter a valid amount.');
            }

            const amountInSmallestUnit = Math.floor(Number(amount) * 100000000); // Convert to smallest unit if required

            // Determine if the user is new or old
            const lastWithdrawalBigInt = await window.contract2.methods.getLastWithdrawalRegularAccount(selectedAccount).call();
            const lastWithdrawal = Number(lastWithdrawalBigInt);
            const isNewUser = (lastWithdrawal === 0);
            const userStatus = isNewUser ? 'New' : 'Old';

            // Calculate accumulated timelocked tokens
            const currentBalanceBigInt = await window.contract2.methods.getBalanceRegularAccount(selectedAccount).call();
            const currentBalance = Number(currentBalanceBigInt) / 100000000;
            const accumulatedTimelocked = (parseFloat(currentBalance) + parseFloat(amount*0.99)).toFixed(0);
            console.log("Current Balance: " + currentBalance);
            console.log("Last Withdrawal: " + lastWithdrawal);
            console.log("amount: " + amount);
            console.log("accumulatedTimelocked: " + accumulatedTimelocked);

            // Get already calculated rewards
            const timelockRewardTokens = await calculateTimelockRewardTokens();
            const receiveTimelockRewards = timelockRewardTokens.toFixed(0);



            // Get global lock time
            let lockTimeYears;
            let globalTimeLeft;
	    let globalTimeLeftBigInt;
            try {
                globalTimeLeftBigInt = await window.contract2.methods.getGlobalTimeLeftRegularAccount().call();
		globalTimeLeft = (Number(globalTimeLeftBigInt));    
                lockTimeYears = (Number(globalTimeLeft) / (365 * 24 * 60 * 60)).toFixed(2);
            } catch (error) {
                if (error.message.includes("Tokens are unlocked and ready for withdrawal")) {
                    lockTimeYears = "0";
                } else {
                    throw error; // Re-throw the error if it's not the expected one
                }
            }




// Get the period withdrawal amount and halving information
const periodWithdrawalAmountBigInt = await window.contract2.methods.periodWithdrawalAmount().call();
const periodWithdrawalAmount = Number(periodWithdrawalAmountBigInt) / 100000000;
let timestampOfNextWithdrawalHalving = Number(await window.contract2.methods.getTimestampOfNextWithdrawalHalving().call());
const withdrawalHalvingEraBigInt = await window.contract2.methods.withdrawalHalvingEra().call();
const withdrawalHalvingEra = Number(withdrawalHalvingEraBigInt);

// Adjust the withdrawal calculation based on the current and future halving eras
let totalYearsToWithdrawAll = 0;
let remainingTokens = accumulatedTimelocked;
let currentEra = withdrawalHalvingEra;
let currentPeriodWithdrawalAmount = periodWithdrawalAmount; 
let currentTimestamp = Math.floor(Date.now() / 1000); // Current UNIX timestamp
let halvingsOccured = 0;
const daysInYear = 365;
const secondsInYear = daysInYear * 24 * 60 * 60;

while (remainingTokens > 0) { // Continue until remainingTokens is 0
    let timeUntilNextHalvingInSeconds = timestampOfNextWithdrawalHalving - currentTimestamp;

    // Adjust time until next halving if globalTimeLeft is defined and greater than 0
    if (typeof globalTimeLeft !== 'undefined' && globalTimeLeft > 0) {
        timeUntilNextHalvingInSeconds -= globalTimeLeft;
    }

    // Convert the remaining time until the next halving to years
    let timeUntilNextHalvingInYears = timeUntilNextHalvingInSeconds / secondsInYear;

    // Calculate tokens that can be withdrawn until the next halving
    let tokensBeforeNextHalving = timeUntilNextHalvingInYears * (52.14 * currentPeriodWithdrawalAmount);

    if (currentEra >= 5) {
        // If era is 5 or greater, we need to withdraw tokens continuously at the current rate
        tokensBeforeNextHalving = remainingTokens;  // Consider all remaining tokens for era 5+
    }

    if (remainingTokens <= tokensBeforeNextHalving) {
        // If all remaining tokens can be withdrawn before the next halving or era is greater than 5
        totalYearsToWithdrawAll += remainingTokens / (52.14 * currentPeriodWithdrawalAmount);
        remainingTokens = 0;
    } else {
        // If the next halving will occur before all tokens are withdrawn in this era
        totalYearsToWithdrawAll += timeUntilNextHalvingInYears;
        remainingTokens -= tokensBeforeNextHalving;

        if (currentEra < 5) { // Only increase the era and halve the withdrawal amount if era < 5
            currentEra++; // Move to the next era
            halvingsOccured++;
            currentPeriodWithdrawalAmount /= 2; // Halve the withdrawal amount

            // Update the timestamp for the next halving (adding 1500 days in seconds)
            timestampOfNextWithdrawalHalving += 1500 * 24 * 60 * 60;
        }
    }

    // Update current timestamp after processing one iteration
    currentTimestamp += timeUntilNextHalvingInSeconds;
}



console.log("Total Years to Withdraw All Tokens: " + totalYearsToWithdrawAll.toFixed(2));




            const bsovTokenContract = new web3.eth.Contract(bsovTokenABI, tokenContractAddress);
            const transaction = bsovTokenContract.methods.approveAndCall(contract2Address, amountInSmallestUnit, "0x");

            const estimatedTimeNeeded = `Lock Time: ${lockTimeYears} Years, Gradual Withdrawals: ${totalYearsToWithdrawAll.toFixed(2)} years`;

            // Determine the new lock time reset
            const newLockTimeReset = isNewUser ? '70 days' : '14 days';

            // Estimate the transaction fee
            const estimatedGas = await transaction.estimateGas({ from: selectedAccount });
            const gasPrice = await web3.eth.getGasPrice();
            const estimatedFee = web3.utils.fromWei((BigInt(estimatedGas) * BigInt(gasPrice)).toString(), 'ether') + ' ETH';

            console.log("GlobalTimeLeft: " + globalTimeLeft);
            console.log("Total Years to Withdraw All: " + totalYearsToWithdrawAll);
            console.log("periodWithdrawalAmount: " + periodWithdrawalAmount);

            // Create the custom message with all the details, including the fee
            const customMessage = `
                <p>Are you sure you want to timelock <strong>${amount}</strong> tokens in Contract 2?</p>
                <table class="modal-table">
                    <tr>
                        <td>User (New/Old):</td>
                        <td>${userStatus}</td>
                    </tr>
                    <tr>
                        <td>Amount Sent from Your Wallet:</td>
                        <td>${amount} BSOV</td>
                    </tr>
                    <tr>
                        <td>Amount Burnt (1%):</td>
                        <td>${(amount * 0.01).toFixed(0)} BSOV</td>
                    </tr>
                    <tr>
                        <td>Amount Timelocked:</td>
                        <td>${(amount * 0.99).toFixed(0)} BSOV</td>
                    </tr>
                    <tr>
                        <td>Receive Timelock Rewards:</td>
                        <td>${receiveTimelockRewards} BSOV</td>
                    </tr>
                    <tr>
                        <td>Accumulated Timelocked Tokens:</td>
                        <td>${accumulatedTimelocked} BSOV</td>
                    </tr>
                    <tr>
                        <td>Estimated Time needed to Withdraw All Tokens:</td>
                        <td>${estimatedTimeNeeded}</td>
                    </tr>
                    <tr>
                        <td>New Lock Time Reset after Timelock:</td>
                        <td>${newLockTimeReset}</td>
                    </tr>
                    <tr>
                        <td>Estimated Transaction Fee:</td>
                        <td>${estimatedFee}</td>
                    </tr>
                </table>


<p style="color:yellow; line-height: 1.5;">
  <b>NOTICE:</b><br>
  - You will not be able to withdraw any tokens during the Global Lock Time period of 
  <span style="font-weight: bold; background-color: #444; padding: 2px 4px;">
    ${lockTimeYears} years
  </span>.<br>
  - Once your tokens are unlocked, you will need to withdraw every 
  <span style="font-weight: bold; background-color: #444; padding: 2px 4px;">
    10 weeks
  </span> 
  to adhere to the estimated timeline.<br>
  - Due to 
  <span style="font-weight: bold; background-color: #444; padding: 2px 4px;">
    ${halvingsOccured}
  </span> Withdrawal Halvings, 
  it will take approximately 
  <span style="font-weight: bold; background-color: #444; padding: 2px 4px;">
    ${totalYearsToWithdrawAll.toFixed(2)} years
  </span> 
  to fully withdraw all your tokens.
</p>


                <p>By clicking 'Confirm' you agree on the <a target="_blank" href="http://sovcube.localhost/docs/index.php#legal">terms</a> and that you truly understand what you are doing.</p>
            `;

            // Show the confirmation modal with the correct title and message
            showConfirmationModal(
                'Confirm Timelock Tokens',  // Title for the modal
                customMessage,
                async function() {
			showTxProgressPopup();
                    try {

			    // Store the transaction hash before sending it

                    // Store the transaction hash in localStorage for tracking
                        const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
                        console.log("Transaction receipt: ", receipt);
			    hideTxProgressPopup();
			                        // Handle the receipt to create notifications
                    } catch (error) {
			    hideTxProgressPopup();
                        console.error("Error in transaction: ", error);
                        document.getElementById('errorMessage').innerText = `${error.message}`;
                        document.getElementById('clearError').style.display = 'block';
                    }
                }
            );

        } catch (error) {
            console.error('Error during timelock action:', error);
            displayError(error.message);
        }
    });
}















// Withdraw Contract 1
const withdraw1Button = document.getElementById('withdraw1Button');
if (withdraw1Button) {
    withdraw1Button.addEventListener('click', async function(event) {
        event.preventDefault();

        try {
            const amount = document.getElementById('amount1').value;
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Please enter a valid amount.');
            }

            const amountBurnt = amount * 0.01;
            const amountSentToWallet = amount * 0.99;

            // Define the contract transaction
            const transaction = window.contract1.methods.withdraw(Math.floor(Number(amount) * 100000000));

            // Estimate the transaction fee (but do not execute the transaction yet)
            const estimatedGas = await transaction.estimateGas({ from: selectedAccount });
            const gasPrice = await web3.eth.getGasPrice();
            const estimatedFee = BigInt(estimatedGas) * BigInt(gasPrice);
            const formattedFee = web3.utils.fromWei(estimatedFee.toString(), "ether");

            const customMessage = `
                <p>Are you sure you want to withdraw <strong>${amount}</strong> tokens from Contract 1?</p>
                <table class="modal-table">
                    <tr>
                        <td>Amount Withdrawn:</td>
                        <td>${amount} BSOV</td>
                    </tr>
                    <tr>
                        <td>Amount Burnt (1%):</td>
                        <td>${amountBurnt} BSOV</td>
                    </tr>
                    <tr>
                        <td>Amount Sent to Your Wallet:</td>
                        <td>${amountSentToWallet} BSOV</td>
                    </tr>
                    <tr>
                        <td>Estimated Transaction Fee:</td>
                        <td>${formattedFee} ETH</td>
                    </tr>
                </table>
		            <p style="color:yellow;">NOTICE: Withdrawing any amount once will reset the withdrawal timer back to 7 days.</p>
            <p>By clicking 'Confirm' you agree on the <a target="_blank" href="http://sovcube.localhost/docs/index.php#legal">terms</a> and that you truly understand what you are doing.</p>
            `;

            // Show the confirmation modal, passing the transaction to be executed after confirmation
            showConfirmationModal('Confirm Withdrawal', customMessage, async function() {
			showTxProgressPopup();
                try {
                    // Execute the transaction after the user confirms
                    const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
hideTxProgressPopup();
			console.log("Transaction receipt: ", receipt);
                } catch (error) {
			hideTxProgressPopup();
                    if (error.message.includes("HighFees")) {
                        document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected.';
                        document.getElementById('clearError').style.display = 'block';
                    } else {
                        console.error("Error in transaction: ", error);
                        document.getElementById('errorMessage').innerText = `${error.message}`;
                        document.getElementById('clearError').style.display = 'block';
                    }
                }
            });

        } catch (error) {
            displayError(error.message);
        }
    });
}



// Withdraw Contract 2
const withdraw2Button = document.getElementById('withdraw2Button');
if (withdraw2Button) {
    withdraw2Button.addEventListener('click', async function(event) {
        event.preventDefault();

        try {
            const amount = document.getElementById('amount2').value;
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Please enter a valid amount.');
            }

            const amountBurnt = amount * 0.01;
            const amountSentToWallet = amount * 0.99;

            const selectedAccountType = document.querySelector('input[name="account-type"]:checked').value;
            let transaction;

            // Define the contract transaction based on the selected account type
            if (selectedAccountType === 'incoming') {
                transaction = window.contract2.methods.withdrawFromIncomingAccount(Math.floor(Number(amount) * 100000000));
            } else {
                transaction = window.contract2.methods.withdrawFromRegularAccount(Math.floor(Number(amount) * 100000000));
            }

            // Estimate the transaction fee (but do not execute the transaction yet)
            const estimatedGas = await transaction.estimateGas({ from: selectedAccount });
            const gasPrice = await web3.eth.getGasPrice();
            const estimatedFee = BigInt(estimatedGas) * BigInt(gasPrice);
            const formattedFee = web3.utils.fromWei(estimatedFee.toString(), "ether");

            const customMessage = `
                <p>Are you sure you want to withdraw <strong>${amount}</strong> tokens from Contract 2?</p>
                <table class="modal-table">
                    <tr>
                        <td>Amount Withdrawn:</td>
                        <td>${amount} BSOV</td>
                    </tr>
                    <tr>
                        <td>Amount Burnt (1%):</td>
                        <td>${amountBurnt} BSOV</td>
                    </tr>
                    <tr>
                        <td>Amount Sent to Your Wallet:</td>
                        <td>${amountSentToWallet} BSOV</td>
                    </tr>
                    <tr>
                        <td>Estimated Transaction Fee:</td>
                        <td>${formattedFee} ETH</td>
                    </tr>
                </table>
		            <p style="color:yellow;">NOTICE: Withdrawing any amount once will reset the withdrawal timer back to 7 days and reset the 'Max Withdrawable now' back to 0.</p>
            <p>By clicking 'Confirm' you agree on the <a target="_blank" href="http://sovcube.localhost/docs/index.php#legal">terms</a> and that you truly understand what you are doing.</p>
            `;

            showConfirmationModal('Confirm Withdrawal', customMessage, async function() {
		    showTxProgressPopup();
                try {
                    const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
                    hideTxProgressPopup();
			console.log("Transaction receipt: ", receipt);
                } catch (error) {
			hideTxProgressPopup();
                    if (error.message.includes("HighFees")) {
                        document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected.';
                        document.getElementById('clearError').style.display = 'block';
                    } else {
                        console.error("Error in transaction: ", error);
                        document.getElementById('errorMessage').innerText = `${error.message}`;
                        document.getElementById('clearError').style.display = 'block';
                    }
                }
            });

        } catch (error) {
            console.error("Error in transaction: ", error);
            displayError(error.message);
        }
    });
}




withdrawAll2Button.addEventListener('click', async function(event) {
    event.preventDefault();

    try {
        // Fetch the current withdrawable amounts for both regular and incoming accounts
        const withdrawableNowRegularAccountFormatted = parseFloat(document.getElementById('withdrawableNowRegularAccount').innerText.split(': ')[1].replace(' BSOV', '').replace(/,/g, ''));
        const withdrawableNowIncomingAccountFormatted = parseFloat(document.getElementById('withdrawableNowIncomingAccount').innerText.split(': ')[1].replace(' BSOV', '').replace(/,/g, ''));

        // Calculate the total amount withdrawn
        const totalWithdrawn = withdrawableNowRegularAccountFormatted + withdrawableNowIncomingAccountFormatted;

        // Calculate the amount burnt (1% of the total)
        const amountBurnt = totalWithdrawn * 0.01;

        // Calculate the amount sent to the wallet (99% of the total)
        const amountSentToWallet = totalWithdrawn * 0.99;

        // Format the numbers for display
        const totalWithdrawnFormatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(totalWithdrawn);
        const amountBurntFormatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(amountBurnt);
        const amountSentToWalletFormatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(amountSentToWallet);

        // The contract method for withdrawing all tokens
        const transaction = window.contract2.methods.withdrawAll();

        // Estimate the transaction fee (but do not execute the transaction yet)
        const estimatedGas = await transaction.estimateGas({ from: selectedAccount });
        const gasPrice = await web3.eth.getGasPrice();
        const estimatedFee = BigInt(estimatedGas) * BigInt(gasPrice);
        const formattedFee = web3.utils.fromWei(estimatedFee.toString(), "ether");

        // Create the custom message with all the details, including the fee
        const customMessage =`  
            <p>Are you sure you want to withdraw all available tokens from Contract 2?</p>
            <table class="modal-table">
                <tr>
                    <td>Amount Withdrawn:</td>
                    <td>${totalWithdrawnFormatted} BSOV</td>
                </tr>
                <tr>
                    <td>Amount Burnt (1%):</td>
                    <td>${amountBurntFormatted} BSOV</td>
                </tr>
                <tr>
                    <td>Amount Sent to Your Wallet:</td>
                    <td>${amountSentToWalletFormatted} BSOV</td>
                </tr>
                <tr>
                    <td>Estimated Transaction Fee:</td>
                    <td>${formattedFee} ETH</td>
                </tr>
            </table>
            <p style="color:yellow;">NOTICE: Withdrawing any amount once will reset the withdrawal timer back to 7 days and reset the 'Max Withdrawable now' back to 0.</p>
            <p>By clicking 'Confirm' you agree on the <a target="_blank" href="http://sovcube.localhost/docs/index.php#legal">terms</a> and that you truly understand what you are doing.</p>
        `;

        // Show the confirmation modal with the correct title and message
        showConfirmationModal(
            'Confirm Withdraw All',  // Title for the modal
            customMessage,
            async function() {
		    showTxProgressPopup();
                try {
                    // Now execute the transaction after the user confirms
                    const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
                    hideTxProgressPopup();
			console.log("Transaction receipt: ", receipt);
                } catch (error) {
			hideTxProgressPopup();
                    console.error("Error in transaction: ", error);
                    document.getElementById('errorMessage').innerText = `${error.message}`;
                    document.getElementById('clearError').style.display = 'block';
                }
            }
        );

    } catch (error) {
        console.error('Error fetching withdrawable amounts:', error.message);
        document.getElementById('errorMessage').innerText = `Error fetching withdrawable amounts: ${error.message}`;
    }
});
}

/*
    // Send Locked Tokens Contract 2
    const sendLocked2Button = document.getElementById('sendLocked2Button');
    if (sendLocked2Button) {
        sendLocked2Button.addEventListener('click', function(event) {
            event.preventDefault();

            // Example placeholder values - replace with real calculations as needed
            const totalLockedTokens = '1000 BSOV';
            const recipients = '5';
            const estimatedFee = '0.001 ETH';

            const customMessage = `
                <p>Are you sure you want to send locked tokens to the specified addresses?</p>
                <table class="modal-table">
                    <tr>
                        <td>Total Amount of Locked Tokens Sent:</td>
                        <td>${totalLockedTokens} BSOV</td>
                    </tr>
                    <tr>
                        <td>Amount of Recipients:</td>
                        <td>${recipients}</td>
                    </tr>
                    <tr>
                        <td>Estimated Transaction Fee:</td>
                        <td>${estimatedFee}</td>
                    </tr>
                </table>
            `;

            showConfirmationModal('Confirm Send Locked Tokens', customMessage, sendLocked2Action);
        });
    }
}

*/


// Send Locked Tokens Contract 2
const sendLocked2Button = document.getElementById('sendLocked2Button');
if (sendLocked2Button) {
    sendLocked2Button.addEventListener('click', async function(event) {
        event.preventDefault();

        try {
            // Retrieve and process the input values for addresses and amounts
            const addresses = document.getElementById('ethAddresses').value.trim().split('\n').map(addr => addr.trim());
            const amountsText = document.getElementById('sendLockedAmounts').value.trim().split('\n').map(amount => amount.trim());

            if (addresses.length !== amountsText.length) {
                throw new Error('The number of addresses and amounts does not match.');
            }

            const amounts = amountsText.map(amount => Math.floor(Number(amount) * 100000000)); // Convert to smallest unit
            const totalLockedTokens = amounts.reduce((sum, amount) => sum + amount, 0) / 100000000; // Sum and convert back to BSOV
            const recipients = addresses.length;

            // Validate Addresses and Amounts
            const isValidAddresses = addresses.every(address => web3.utils.isAddress(address));
            const isValidAmounts = amounts.every(amount => !isNaN(amount) && amount > 0);

            if (!isValidAddresses || !isValidAmounts) {
                throw new Error('Please enter valid Ethereum addresses and amounts.');
            }

            let transaction;
            if (recipients === 1) {
                // Call sendLockedTokensToSingle if there's only one address and amount
                transaction = window.contract2.methods.sendLockedTokensToSingle(addresses[0], amounts[0]);
            } else {
                // Call sendLockedTokensToMany if there are multiple addresses and amounts
                transaction = window.contract2.methods.sendLockedTokensToMany(addresses, amounts);
            }

            // Estimate the transaction fee (but do not execute the transaction yet)
            const estimatedGas = await transaction.estimateGas({ from: selectedAccount });
            const gasPrice = await web3.eth.getGasPrice();
            const estimatedFee = BigInt(estimatedGas) * BigInt(gasPrice);
            const formattedFee = web3.utils.fromWei(estimatedFee.toString(), "ether");

            // Create the custom message with the calculated details
            const customMessage = `
                <p>Are you sure you want to send locked tokens to the specified addresses?</p>
                <table class="modal-table">
                    <tr>
                        <td>Total Amount of Locked Tokens Sent:</td>
                        <td>${totalLockedTokens.toFixed(2)} BSOV</td>
                    </tr>
                    <tr>
                        <td>Number of Recipients:</td>
                        <td>${recipients}</td>
                    </tr>
                    <tr>
                        <td>Estimated Transaction Fee:</td>
                        <td>${formattedFee} ETH</td>
                    </tr>
                </table>
		<p>By clicking 'Confirm' you agree on the <a target="_blank" href="http://sovcube.localhost/docs/index.php#legal">terms</a> and that you truly understand what you are doing.</p>
            `;

            // Show the confirmation modal with the correct title and message
            showConfirmationModal('Confirm Send Locked Tokens', customMessage, async function() {
		    showTxProgressPopup();
                try {
                    const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
                    hideTxProgressPopup();
			console.log("Transaction receipt: ", receipt);
                } catch (error) {
			hideTxProgressPopup();
                    if (error.message.includes("HighFees")) {
                        document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected.';
                        document.getElementById('clearError').style.display = 'block';
                    } else {
                        console.error("Error in transaction: ", error);
                        document.getElementById('errorMessage').innerText = `${error.message}`;
                        document.getElementById('clearError').style.display = 'block';
                    }
                }
            });

        } catch (error) {
            console.error("Error in transaction: ", error);
            displayError(error.message);
        }
    });

}





/*
const acceptIncomingButton = document.getElementById('acceptIncomingButton');
if (acceptIncomingButton) {
    acceptIncomingButton.addEventListener('click', async function(event) {
        event.preventDefault();

        try {
            // Get the balance of untaken incoming account
            const untakenIncomingAmountBigInt = await window.contract2.methods.getBalanceUntakenIncomingAccount(selectedAccount).call();
            const untakenIncomingAmount = Number(untakenIncomingAmountBigInt) / 100000000; // Convert from smallest unit to BSOV

            // Check if the amount is greater than 0
            if (untakenIncomingAmount <= 0) {
                throw new Error("You have not received any locked tokens or timelock rewards that go into your Untaken Incoming Account, or you have already claimed it.");
            }

            // Define the contract transaction
            const transaction = window.contract2.methods.acceptUntakenIncomingTokens();

            // Estimate the transaction fee (but do not execute the transaction yet)
            const estimatedGas = await transaction.estimateGas({ from: selectedAccount });
            const gasPrice = await web3.eth.getGasPrice();
            const estimatedFee = BigInt(estimatedGas) * BigInt(gasPrice);
            const formattedFee = web3.utils.fromWei(estimatedFee.toString(), "ether");

            // Create the custom message with the calculated details
            const customMessage = `
                <p>Are you sure you want to accept <strong>${untakenIncomingAmount.toFixed(2)}</strong> BSOV tokens from your Untaken Incoming Account?</p>
                <table class="modal-table">
                    <tr>
                        <td>Amount to be Accepted:</td>
                        <td>${untakenIncomingAmount.toFixed(2)} BSOV</td>
                    </tr>
                    <tr>
                        <td>Estimated Transaction Fee:</td>
                        <td>${formattedFee} ETH</td>
                    </tr>
                </table>
		<p style="color:red;">WARNING: This will reset the Lock Time of your Incoming Account back to 100 days.</p>
            `;

            // Show the confirmation modal with the correct title and message
            showConfirmationModal('Confirm Accept Untaken Incoming Tokens', customMessage, async function() {
                try {
                    // Now execute the transaction after the user confirms
                    const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
                    console.log("Transaction receipt: ", receipt);
                } catch (error) {
                    if (error.message.includes("HighFees")) {
                        document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected.';
                        document.getElementById('clearError').style.display = 'block';
                    } else {
                        console.error("Error in transaction: ", error);
                        document.getElementById('errorMessage').innerText = `${error.message}`;
                        document.getElementById('clearError').style.display = 'block';
                    }
                }
            });

        } catch (error) {
            console.error("Error in accepting incoming tokens: ", error);
            document.getElementById('errorMessage').innerText = error.message;
            document.getElementById('clearError').style.display = 'block';
        }
    });
}
*/


const acceptIncomingButton = document.getElementById('acceptIncomingButton');
if (acceptIncomingButton) {
    acceptIncomingButton.addEventListener('click', async function(event) {
        event.preventDefault();

        try {
            // Get the balance of untaken incoming account
            const untakenIncomingAmountBigInt = await window.contract2.methods.getBalanceUntakenIncomingAccount(selectedAccount).call();
            const untakenIncomingAmount = Number(untakenIncomingAmountBigInt) / 100000000; // Convert from smallest unit to BSOV

            // Check if the amount is greater than 0
            if (untakenIncomingAmount <= 0) {
                throw new Error("You have not received any locked tokens or timelock rewards that go into your Untaken Incoming Account, or you have already claimed it.");
            }

            // Get incoming account balance and time left
            const incomingAccountBalanceBigInt = await window.contract2.methods.getBalanceIncomingAccount(selectedAccount).call();
            const incomingAccountBalance = Number(incomingAccountBalanceBigInt) / 100000000; // Convert to BSOV
            const timeLeftIncomingAccountSeconds = await window.contract2.methods.getTimeLeftIncomingAccount(selectedAccount).call();
            const incomingAccountDaysLeft = (Number(timeLeftIncomingAccountSeconds) / (24 * 60 * 60)).toFixed(0); // Convert to days

            // Construct lockTimeWarning based on the incoming account balance
            let lockTimeWarning;
            if (incomingAccountBalance > 0) {
                lockTimeWarning = `<p style="color:orange;"><b>WARNING:</b> Accepting Untaken Incoming Tokens will reset the Lock Time of your Incoming Account back to 100 days.<br>You have <b>${incomingAccountDaysLeft}</b> days left of your Lock Time.<br>This Lock Time reset will only affect your Incoming Account, not your Regular Account.</p>`;
            } else {
                lockTimeWarning = `<p style="color:yellow;"><b>NOTICE:</b> After accepting Untaken Incoming Tokens, a 100-day timer will start,<br> meaning that you will have to wait <b>100 days</b> until you can start withdrawing your tokens.<br>This Lock Time reset will only affect your Incoming Account, not your Regular Account.</p>`;
            }

            // Define the contract transaction
            const transaction = window.contract2.methods.acceptUntakenIncomingTokens();

            // Estimate the transaction fee (but do not execute the transaction yet)
            const estimatedGas = await transaction.estimateGas({ from: selectedAccount });
            const gasPrice = await web3.eth.getGasPrice();
            const estimatedFee = BigInt(estimatedGas) * BigInt(gasPrice);
            const formattedFee = web3.utils.fromWei(estimatedFee.toString(), "ether");

            // Create the custom message with the calculated details
            const customMessage = `
                <p>Are you sure you want to accept <strong>${untakenIncomingAmount.toFixed(2)}</strong> BSOV tokens from your Untaken Incoming Account?</p>
                <table class="modal-table">
                    <tr>
                        <td>Amount to be Accepted:</td>
                        <td>${untakenIncomingAmount.toFixed(2)} BSOV</td>
                    </tr>
                    <tr>
                        <td>Estimated Transaction Fee:</td>
                        <td>${formattedFee} ETH</td>
                    </tr>
                </table>
                ${lockTimeWarning}
		<p>By clicking 'Confirm' you agree on the <a target="_blank" href="http://sovcube.localhost/docs/index.php#legal">terms</a> and that you truly understand what you are doing.</p>
            `;

            // Show the confirmation modal with the correct title and message
            showConfirmationModal('Confirm Accept Incoming Tokens', customMessage, async function() {
		    showTxProgressPopup();
                try {
                    // Now execute the transaction after the user confirms
                    const receipt = await executeTransactionIfFeeIsAcceptable(transaction, [], selectedAccount);
                    hideTxProgressPopup();
			console.log("Transaction receipt: ", receipt);
                } catch (error) {
			hideTxProgressPopup();
                    if (error.message.includes("HighFees")) {
                        document.getElementById('errorMessage').innerText = 'Absurdly high ETH fees detected.';
                        document.getElementById('clearError').style.display = 'block';
                    } else {
                        console.error("Error in transaction: ", error);
                        document.getElementById('errorMessage').innerText = `${error.message}`;
                        document.getElementById('clearError').style.display = 'block';
                    }
                }
            });

        } catch (error) {
            console.error("Error in accepting incoming tokens: ", error);
            document.getElementById('errorMessage').innerText = error.message;
            document.getElementById('clearError').style.display = 'block';
        }
    });
}












// Initialize the application by attaching listeners
attachConfirmationListeners();


});


