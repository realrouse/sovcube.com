// contract1-calls.js

let contract1; // Define contract1 in a broader scope

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

// Load ABI and Initialize contract1
if (web3) {
    loadABI('/dapp/contract1.abi', function(abi) {
        window.contract1 = new web3.eth.Contract(abi, contract1Address);
	contract1 = new web3.eth.Contract(abi, contract1Address);
    });
}


async function getContract1TimelockedTokens(account) {
    if (!contract1) {
        console.error('Contract1 is not initialized when fetching timelocked tokens');
        return;
    }
    try {
        const timelockedTokens = await contract1.methods.getBalance(account).call();

        let timeLeftInSeconds;
        try {
            timeLeftInSeconds = await contract1.methods.getTimeLeft().call();
        } catch (error) {
        //    console.error("Time Left Error in Contract 1:", error.message);
            timeLeftInSeconds = 0; // Set to 0 or a suitable default value indicating that tokens are unlocked
        }

	            let nextWithdrawal1RegularInSeconds;
        try {
            nextWithdrawal1RegularInSeconds = await contract1.methods.getLastWithdrawal(account).call();
        } catch (error) {
            console.error("getLastWithdrawal Error in Contract 1:", error.message);
            nextWithdrawal1Regular = 0; // Set to 0 or a suitable default value indicating that tokens are unlocked
        }


        return { timelockedTokens, timeLeftInSeconds, nextWithdrawal1RegularInSeconds }; // Return as an object
    } catch (error) {
        console.error('Error fetching timelocked tokens from Contract 1: ', error);
        return null; // Return null or handle this error appropriately
    }


}

function calculateNextWithdrawalTime(lastWithdrawalTimestamp) {
    // Get the current timestamp in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Calculate the time elapsed since the last withdrawal
    const elapsedTime = currentTimestamp - lastWithdrawalTimestamp;

    // Calculate the remaining time until the next 7-day interval
    const remainingTime = (7 * 24 * 60 * 60) - (elapsedTime % (7 * 24 * 60 * 60));

    return remainingTime;
}

function formatTimeLeft2(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * 24 * 60 * 60;
    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    return `${days} days, ${hours} hours, ${minutes} min, ${seconds} sec`;
}



function fetchContract1Info(account) {
    // console.log("Fetching Contract 1 info for account:", account);
    getContract1TimelockedTokens(account).then(({ timelockedTokens, timeLeftInSeconds, nextWithdrawal1RegularInSeconds }) => {
      //  console.log("Contract 1 Timelocked Tokens:", timelockedTokens);
      //  console.log("Contract 1 Unlock Time-Seconds:", timeLeftInSeconds);
	const formattedTokens = (Number(timelockedTokens) / 100000000).toFixed(2);
	const formattedTimeLeft = formatTimeLeft2(Number(timeLeftInSeconds));
	const nextWithdrawal1RegularCalculated = calculateNextWithdrawalTime(Number(nextWithdrawal1RegularInSeconds));    
	const formattedNextWithdrawal1Regular = formatTimeLeft2(Number(nextWithdrawal1RegularCalculated));    
        updateContract1Details(formattedTokens, '29 January 2020', 1000, formattedTimeLeft, timeLeftInSeconds, formattedNextWithdrawal1Regular, nextWithdrawal1RegularInSeconds);
    }).catch(error => {
        console.error("Error in fetching Contract 1 Timelocked Tokens:", error);
    });
}



function updateContract1Details(tokensLocked, unlockTime, withdrawRate, formattedTimeLeft, timeLeftInSeconds, formattedNextWithdrawal1Regular, nextWithdrawal1RegularInSeconds) {
    const infoElement = document.getElementById('contract1DynamicInfo');
    const template = document.getElementById('contract1Template').innerHTML;

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

    let nextWithdrawal1RegularOutput = '';	
   if (nextWithdrawal1RegularInSeconds == 0) {
	   // console.log('nextWithdrawal1RegularInSeconds is 0');
	nextWithdrawal1RegularOutput = `<span id="nextWithdrawal1Regular" style="color:green;">Ready to Withdraw!</span>`;
    }
	else if (nextWithdrawal1RegularInSeconds > 0) {
	   // console.log('nextWithdrawal1RegularInSeconds is over 0');
        nextWithdrawal1RegularOutput = `<span id="nextWithdrawal1Regular">${formattedNextWithdrawal1Regular}</span>`;
    }

    

    // Replace variables in the template with actual values
    const updatedHtml = template.replace(/\${withdrawRate}/g, withdrawRate)
                               .replace(/\${tokensLocked}/g, tokensLocked)
                               .replace(/\${formattedTimeLeft}/g, formattedTimeLeft)
                               .replace('${timeLeftOutput}', timeLeftOutput)
				.replace('${nextWithdrawal1RegularOutput}', nextWithdrawal1RegularOutput);

    // Update the HTML content of the target element
    infoElement.innerHTML = updatedHtml;
}

