// contract2-calls.js

let contract2; // Define contract2 in a broader scope

function loadABI(file, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', file, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const abi = JSON.parse(xhr.responseText);
            callback(abi);
        }
    };
    xhr.send();
}

// Load ABI and Initialize contract2
if (web3) {
    loadABI('/dapp/contract2.abi', function(abi) {
        window.contract2 = new web3.eth.Contract(abi, contract2Address);
	contract2 = new web3.eth.Contract(abi, contract2Address);
    });
/*    loadABI('/dapp/rewardsReserve.abi', function(abi) {
        rewardsReserve = new web3.eth.Contract(abi, rewardsReserveContractAddress);
    window.rewardsReserve = new web3.eth.Contract(abi, rewardsReserveContractAddress);
    });
*/
}



function formatTimeLeft(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * 24 * 60 * 60;
    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    return `${days} days, ${hours} hours, ${minutes} min, ${seconds} sec`;
}


async function getContract2TimelockedTokens(account) {
    if (!contract2) {
        console.error('Contract2 is not initialized when fetching timelocked tokens');
        return;
    }
    const untakenIncomingTokens = await contract2.methods.getBalanceUntakenIncomingAccount(account).call();
    const timelockedTokens = await contract2.methods.getBalanceRegularAccount(account).call();
    const incomingAccountBalance = await contract2.methods.getBalanceIncomingAccount(account).call();

let timeLeftInSeconds, incomingAccountLockTimeInSeconds;
          try {
            timeLeftInSeconds = await contract2.methods.getGlobalTimeLeftRegularAccount().call();
        } catch (error) {
           // console.error("Time Left Error:", error.message);
	
            timeLeftInSeconds = 0; // Set to 0 or a suitable default value
        }
try {
            incomingAccountLockTimeInSeconds = await contract2.methods.getTimeLeftIncomingAccount(account).call();
} catch (error) {

            incomingAccountLockTimeInSeconds = 0; // Set to 0 or a suitable default value
}

	return { timelockedTokens, incomingAccountBalance, untakenIncomingTokens, timeLeftInSeconds, incomingAccountLockTimeInSeconds };
}


// Function to fetch information related to Rewards Reserve

async function fetchRewardsReserveInfo(account) {
    if (!contract2) {
        console.error('Rewards Reserve contract is not initialized');
	    return;
    }


// DEPRECATED        const eligibleTokens = await contract2.methods.currentUserRewardsAmount(account).call();
  //      return eligibleTokens;
	
}	

function updateProgressBar(totalTimelocked, totalEligibleAmount) {
    const progressBarElement = document.getElementById('rewardsProgressBar');
    const currentProgressElement = progressBarElement.querySelector('.current-progress');

    // Calculate the width of the progress bar based on the total timelocked and eligible amount
    const progressPercent = (totalTimelocked / totalEligibleAmount) * 100;
    currentProgressElement.style.width = progressPercent + '%';

    // Update the tooltip with the current progress
    progressBarElement.setAttribute('data-tooltip', `Current Progress: ${totalTimelocked.toLocaleString()} / ${totalEligibleAmount.toLocaleString()} BSOV`);
}

async function fetchContract2Info(account) {
   // console.log("Fetching Contract 2 info for account:", account);
    try {
        const { timelockedTokens, incomingAccountBalance, untakenIncomingTokens, timeLeftInSeconds, incomingAccountLockTimeInSeconds } = await getContract2TimelockedTokens(account);
   // DEPRECATED     const eligibleTokens = await fetchRewardsReserveInfo(account);

        const formattedTokens = (Number(timelockedTokens) / 100000000).toFixed(2);
        const formattedIncomingAccountBalance = (Number(incomingAccountBalance) / 100000000).toFixed(2);
        const formattedUntakenIncomingTokens = (Number(untakenIncomingTokens) / 100000000).toFixed(2);
        const formattedTimeLeft = formatTimeLeft(Number(timeLeftInSeconds));
        const formattedIncomingAccountLockTime = formatTimeLeft(Number(incomingAccountLockTimeInSeconds));
 //DEPRECATED       const formattedEligibleTokens = (Number(eligibleTokens) / 100000000).toFixed(2);

        updateContract2Details(formattedTokens, formattedIncomingAccountBalance, formattedUntakenIncomingTokens, formattedTimeLeft, formattedIncomingAccountLockTime, '16 September 2026', 100, timeLeftInSeconds, incomingAccountLockTimeInSeconds);
    } catch (error) {
        console.error("Error in fetching Contract 2 info:", error);
    }
}


function updateContract2Details(tokensLocked, tokensIncomingAccount, untakenIncomingTokens, formattedTimeLeft, formattedIncomingAccountLockTime, unlockTime, withdrawRate, timeLeftInSeconds, incomingAccountLockTimeInSeconds) {
	
	const mainContractInfoElement = document.getElementById('mainContractInfo');
    mainContractInfoElement.innerHTML = `
<p id="contractDescription"><b>Withdrawal Rate:</b> ${withdrawRate} tokens/week</p>
        `;

/* DEPRECATED
	const rewardsAccountElement = document.getElementById('rewardsAccount');
    rewardsAccountElement.innerHTML = `
	<h3 style="color:orange; border-bottom:1px solid orange;">Your Rewards</h3>	
	<p><b>Unclaimed Timelock Rewards:</b> <span id="yourTokensText" style="color:yellow;">${formattedEligibleTokens} BSOV</span></p>
	`;
*/

if (timeLeftInSeconds > 0) {
	const regularAccountElement = document.getElementById('regularAccount');
    regularAccountElement.innerHTML = `
        <h3>Regular Account</h3>
        <p><b>Your Timelocked Tokens:</b><br><span id="yourTokensTextRegular">${tokensLocked} BSOV</span></p>
        <p style="margin-top:10px;"><b>Lock Time:</b><br><span id="regularUnlockTime">${formattedTimeLeft}</span></p>
    `;

}
if (timeLeftInSeconds === 0) {
	const regularAccountElement = document.getElementById('regularAccount');
    regularAccountElement.innerHTML = `
        <h3>Regular Account</h3>
        <p><b>Your Timelocked Tokens:</b><br><span id="yourTokensTextRegular">${tokensLocked} BSOV</span></p>
        <p style="margin-top:10px;"><b>Lock Time:</b><span id="regularUnlockTime" style="color:green;">Unlocked!</span></p>
    `;
}


// console.log(incomingAccountLockTimeInSeconds);
if (incomingAccountLockTimeInSeconds > 0) {
    // Update Incoming Account Info
    const incomingTokensAccountElement = document.getElementById('incomingTokensAccount');
    incomingTokensAccountElement.innerHTML = `
        <h3>Incoming Account</h3>
        <p><b>Your Timelocked Tokens:</b> <span id="yourTokensText">${tokensIncomingAccount} BSOV</span></p>
        <p><b>Lock Time:</b> <span id="incomingUnlockTime">${formattedIncomingAccountLockTime}</span></p>
        <p style="margin-top:10px;"><b>Untaken Incoming Tokens:</b> <span id="unclaimedTokens">${untakenIncomingTokens} BSOV</span></p>
    `;

   }

else if (parseFloat(tokensIncomingAccount) == 0)  {

    const incomingTokensAccountElement = document.getElementById('incomingTokensAccount');
    incomingTokensAccountElement.innerHTML = `
        <h3>Incoming Account</h3>
        <p><b>Your Timelocked Tokens:</b> <span id="yourTokensText">${tokensIncomingAccount} BSOV</span></p>
        <p><b>Lock Time:</b> <span id="incomingUnlockTime" style="font-size:8pt;">Accept Incoming Tokens to reset the Lock Time.</span></p>
        <p style="margin-top:10px;"><b>Untaken Incoming Tokens:</b> <span id="unclaimedTokens">${untakenIncomingTokens} BSOV</span></p>
    `;


    }

else if (incomingAccountLockTimeInSeconds == 0) {
    const incomingTokensAccountElement = document.getElementById('incomingTokensAccount');
    incomingTokensAccountElement.innerHTML = `
        <h3>Incoming Account</h3>
        <p><b>Your Timelocked Tokens:</b> <span id="yourTokensText">${tokensIncomingAccount} BSOV</span></p>
        <p style="margin-top:10px;"><b>Lock Time:</b><br><span id="incomingUnlockTime" style="color:green;">Unlocked!</span></p>
	<p style="margin-top:10px;"><b>Untaken Incoming Tokens:</b> <span id="unclaimedTokens">${untakenIncomingTokens} BSOV</span></p>
    `;
}

}

/*
let fetchInterval;

function startFetching() {
    fetchInterval = setInterval(function() {
        if (!document.hidden && selectedAccount) {
            
		fetchContract2Info(selectedAccount);
		fetchContract1Info(selectedAccount);
        }
    }, 10000);
}

function stopFetching() {
    clearInterval(fetchInterval);
}

// Start fetching when the window gains focus
window.onfocus = startFetching;

// Stop fetching when the window loses focus
window.onblur = stopFetching;

// Also start fetching when the page initially loads
startFetching();
*/

/*
let fetchInterval;

function startFetching() {
const contractSelect = document.getElementById('contractSelect');

contractSelect.addEventListener('change', function(event) {
        const selectedContract = event.target.value;

	fetchInterval = setInterval(function() {
        if (!document.hidden && selectedAccount) {
            if (selectedContract === 'contract1') {
                fetchContract1Info(selectedAccount);
            } else if (selectedContract === 'contract2') {
                fetchContract2Info(selectedAccount);
            }
            // You can add additional conditions for other contracts as needed.
        }
    }, 10000);

});
}


function stopFetching() {
    clearInterval(fetchInterval);
}

// Start fetching when the window gains focus
window.onfocus = startFetching;

// Stop fetching when the window loses focus
window.onblur = stopFetching;

// Also start fetching when the page initially loads
startFetching();
*/


let fetchInterval;
function startFetching() {
const contractSelect = document.getElementById('contractSelect');

contractSelect.addEventListener('change', function(event) {
    const selectedContract = event.target.value;

    clearInterval(fetchInterval); // Clear the previous interval

    fetchInterval = setInterval(function() {
        if (!document.hidden && selectedAccount) {
            if (selectedContract === 'contract1') {
                fetchContract1Info(selectedAccount);
            } else if (selectedContract === 'contract2') {
                fetchContract2Info(selectedAccount);
            }
            // You can add additional conditions for other contracts as needed.
        }
    }, 10000);
});
}

function stopFetching() {
    clearInterval(fetchInterval);
}

// Start fetching when the window gains focus
window.onfocus = function() {
    startFetching();
    contractSelect.dispatchEvent(new Event('change')); // Trigger change event on window focus to update based on the selected contract immediately.
};

// Stop fetching when the window loses focus
window.onblur = stopFetching;

// Also start fetching when the page initially loads
startFetching();

