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
    
}

function calculateNextWithdrawalTime2(lastWithdrawalTimestamp) {
    // Get the current timestamp in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Calculate the time elapsed since the last withdrawal
    const elapsedTime = currentTimestamp - lastWithdrawalTimestamp;

    // Calculate the remaining time until the next 7-day interval
    const remainingTime = (7 * 24 * 60 * 60) - (elapsedTime % (7 * 24 * 60 * 60));

    return remainingTime;
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
const nextWithdrawal2IncomingInSeconds = await contract2.methods.getLastWithdrawalIncomingAccount(account).call();
const nextWithdrawal2RegularInSeconds = await contract2.methods.getLastWithdrawalRegularAccount(account).call();

let timeLeftInSeconds, incomingAccountLockTimeInSeconds;

          try {
            timeLeftInSeconds = await contract2.methods.getTimeLeftRegularAccount().call();
        } catch (error) {
           // console.error("Time Left Error:", error.message);

            timeLeftInSeconds = 0; // Set to 0 or a suitable default value
        }
try {
            incomingAccountLockTimeInSeconds = await contract2.methods.getTimeLeftIncomingAccount(account).call();
} catch (error) {

            incomingAccountLockTimeInSeconds = 0; // Set to 0 or a suitable default value
}



    return { timelockedTokens, incomingAccountBalance, untakenIncomingTokens, timeLeftInSeconds, incomingAccountLockTimeInSeconds, nextWithdrawal2IncomingInSeconds, nextWithdrawal2RegularInSeconds };
}


// Function to fetch information related to Rewards Reserve

async function fetchRewardsReserveInfo(account) {
    if (!contract2) {
        console.error('Rewards Reserve contract is not initialized');
	    return;
    }


//        const eligibleTokens = await contract2.methods.getBalanceUntakenIncomingAccount(account).call();
 //       return eligibleTokens;
	
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
        const { timelockedTokens, incomingAccountBalance, untakenIncomingTokens, timeLeftInSeconds, incomingAccountLockTimeInSeconds, nextWithdrawal2IncomingInSeconds, nextWithdrawal2RegularInSeconds } = await getContract2TimelockedTokens(account);
       // const eligibleTokens = await fetchRewardsReserveInfo(account);

        const formattedTokens = (Number(timelockedTokens) / 100000000).toFixed(2);
        const formattedIncomingAccountBalance = (Number(incomingAccountBalance) / 100000000).toFixed(2);
        const formattedUntakenIncomingTokens = (Number(untakenIncomingTokens) / 100000000).toFixed(2);

const nextWithdrawal2RegularCalculated = calculateNextWithdrawalTime(Number(nextWithdrawal2RegularInSeconds));
const nextWithdrawal2IncomingCalculated = calculateNextWithdrawalTime(Number(nextWithdrawal2IncomingInSeconds));
const formattedNextWithdrawal2Incoming = formatTimeLeft(Number(nextWithdrawal2IncomingCalculated));
const formattedNextWithdrawal2Regular = formatTimeLeft(Number(nextWithdrawal2RegularCalculated));

// console.log('nextWithdrawal2IncomingCalculated: ', nextWithdrawal2IncomingCalculated);
// console.log('formattedNextWithdrawal2Incoming: ', formattedNextWithdrawal2Incoming);

        const formattedTimeLeft = formatTimeLeft(Number(timeLeftInSeconds));
        const formattedIncomingAccountLockTime = formatTimeLeft(Number(incomingAccountLockTimeInSeconds));
        //const formattedEligibleTokens = (Number(eligibleTokens) / 100000000).toFixed(2);

        updateContract2Details(formattedTokens, formattedIncomingAccountBalance, formattedUntakenIncomingTokens, formattedTimeLeft, formattedIncomingAccountLockTime, '16 September 2026', 100, timeLeftInSeconds, incomingAccountLockTimeInSeconds, formattedNextWithdrawal2Regular, nextWithdrawal2RegularInSeconds, nextWithdrawal2IncomingInSeconds, formattedNextWithdrawal2Incoming);
    } catch (error) {
        console.error("Error in fetching Contract 2 info:", error);
    }
}


function updateContract2Details(tokensLocked, incomingAccountBalance, untakenIncomingTokens, formattedTimeLeft, formattedIncomingAccountLockTime, unlockTime, withdrawRate, timeLeftInSeconds, incomingAccountLockTimeInSeconds, formattedNextWithdrawal2Regular, nextWithdrawal2RegularInSeconds, nextWithdrawal2IncomingInSeconds, formattedNextWithdrawal2Incoming) {
    const infoElement = document.getElementById('contract2DynamicInfo');
    const template = document.getElementById('contract2Template').innerHTML;

    // Determine the TimeLeft output based on the condition
    let timeLeftOutput = '';
            if (timeLeftInSeconds == 0) {
                    // console.log('timeLeftInSeconds is 0');
        timeLeftOutput = `<span id="regularUnlockTime" style="color:green;">Unlocked!</span>`;
    }

        else if (timeLeftInSeconds > 0) {
            // console.log ('timeLeftInSeconds is over 0');
        timeLeftOutput = `<span id="regularUnlockTime">${formattedTimeLeft}</span>`;
    }


    let incomingAccountLockTimeOutput = '';

	        if (parseFloat(incomingAccountBalance) == 0) {
        incomingAccountLockTimeOutput = `<span id="incomingUnlockTime" style="font-size:8pt;">Accept Incoming Tokens to reset the Lock Time.</span>`;

        }

	else if (incomingAccountLockTimeInSeconds == 0) {	
                     // console.log('incomingAccountLockTimeInSeconds is 0');
        incomingAccountLockTimeOutput = `<span id="regularUnlockTime" style="color:green;">Unlocked!</span>`;
    }

	

        else if (incomingAccountLockTimeInSeconds > 0) {
             // console.log ('incomingAccountLockTimeInSeconds is over 0');
        incomingAccountLockTimeOutput = `<span id="regularUnlockTime">${formattedIncomingAccountLockTime}</span>`;
    }

    


    let nextWithdrawal2RegularOutput = '';

	if ((nextWithdrawal2RegularInSeconds == 0) && (incomingAccountLockTimeInSeconds > 0)) {
nextWithdrawal2RegularOutput = `<span id="nextWithdrawal2Regular" style="font-size:8pt;">Cannot withdraw before Lock Time has expired.</span>`;

	}
	else if (nextWithdrawal2RegularInSeconds == 0) {
            // console.log('nextWithdrawal2RegularInSeconds is 0');
        nextWithdrawal2RegularOutput = `<span id="nextWithdrawal2Regular" style="color:green;">Ready to Withdraw!</span>`;
    }
        else if (nextWithdrawal2RegularInSeconds > 0) {
           // console.log('nextWithdrawal2RegularInSeconds is over 0');
        nextWithdrawal2RegularOutput = `<span id="nextWithdrawal2Regular">${formattedNextWithdrawal2Regular}</span>`;
    }

    let nextWithdrawal2IncomingOutput = '';

                if (parseFloat(incomingAccountBalance) == 0) {
        nextWithdrawal2IncomingOutput = `<span id="nextWithdrawal2Incoming" style="font-size:8pt;">You do not have timelocked tokens in this account.</span>`;

        }
        else if ((nextWithdrawal2IncomingInSeconds == 0) && (incomingAccountLockTimeInSeconds > 0)) {
           // console.log('nextWithdrawal2IncomingInSeconds for nextWithdrawalIncoming is 0');
        nextWithdrawal2IncomingOutput = `<span id="nextWithdrawal2Incoming" style="font-size:8pt;">Cannot withdraw before Lock Time has expired.</span>`;
    }
	else if (nextWithdrawal2IncomingInSeconds == 0) {
           // console.log('nextWithdrawal2IncomingInSeconds for nextWithdrawalIncoming is 0');
        nextWithdrawal2IncomingOutput = `<span id="nextWithdrawal2Incoming" style="color:green;">Ready to Withdraw!</span>`;
    }
        else if (nextWithdrawal2IncomingInSeconds > 0) {
            // console.log('nextWithdrawal2IncomingInSeconds for nextWithdrawalIncoming is over 0');
        nextWithdrawal2IncomingOutput = `<span id="nextWithdrawal2Incoming">${formattedNextWithdrawal2Incoming}</span>`;
    }


    // Replace variables in the template with actual values
    const updatedHtml = template.replace(/\${withdrawRate}/g, withdrawRate)
                               .replace(/\${tokensLocked}/g, tokensLocked)
				.replace('${incomingAccountBalance}', incomingAccountBalance)
                               .replace(/\${formattedTimeLeft}/g, formattedTimeLeft)
                               .replace('${timeLeftOutput}', timeLeftOutput)
				.replace('${incomingAccountLockTimeOutput}', incomingAccountLockTimeOutput)
                                .replace('${nextWithdrawal2RegularOutput}', nextWithdrawal2RegularOutput)
				.replace('${nextWithdrawal2IncomingOutput}', nextWithdrawal2IncomingOutput)
			//	.replace('${formattedEligibleTokens}', formattedEligibleTokens)
				.replace('${untakenIncomingTokens}', untakenIncomingTokens);
	// Update the HTML content of the target element
    infoElement.innerHTML = updatedHtml;
}





let fetchInterval;
function startFetching() {


    clearInterval(fetchInterval); // Clear the previous interval

    fetchInterval = setInterval(function() {
                fetchContract1Info(selectedAccount);
                fetchContract2Info(selectedAccount);
	       
    }, 10000);
};


function stopFetching() {
    clearInterval(fetchInterval);
}

// Start fetching when the window gains focus
window.onfocus = function() {
    startFetching();
};

// Stop fetching when the window loses focus
window.onblur = stopFetching;

// Also start fetching when the page initially loads
startFetching();

