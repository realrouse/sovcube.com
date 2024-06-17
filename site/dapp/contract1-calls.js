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

        return { timelockedTokens, timeLeftInSeconds }; // Return as an object
    } catch (error) {
        console.error('Error fetching timelocked tokens from Contract 1: ', error);
        return null; // Return null or handle this error appropriately
    }
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
    getContract1TimelockedTokens(account).then(({ timelockedTokens, timeLeftInSeconds }) => {
      //  console.log("Contract 1 Timelocked Tokens:", timelockedTokens);
     //   console.log("Contract 1 Lock Time-Seconds:", timeLeftInSeconds);
	const formattedTokens = (Number(timelockedTokens) / 100000000).toFixed(2);
	const formattedTimeLeft = formatTimeLeft2(Number(timeLeftInSeconds));
        updateContract1Details(formattedTokens, '29 January 2020', 1000, formattedTimeLeft, timeLeftInSeconds);
    }).catch(error => {
        console.error("Error in fetching Contract 1 Timelocked Tokens:", error);
    });
}



function updateContract1Details(tokensLocked, unlockTime, withdrawRate, formattedTimeLeft, timeLeftInSeconds) {
    const infoElement = document.getElementById('contract1DynamicInfo');
if (timeLeftInSeconds > 0) {
	infoElement.innerHTML = `
	<p style="text-align:center;"><b>Withdrawal Rate:</b> ${withdrawRate} tokens/week</p>
    <div class="contract-info-container">
        <div class="contract-info-style">
<div id="regularAccount1">
            <h3>Regular Account</h3>
            <p><b>Your Timelocked Tokens:</b><br><span id="yourTokensTextRegular">${tokensLocked} BSOV</span></p>
            <p><b>Global Lock Time:<br><span id="regularUnlockTime">${formattedTimeLeft}</span></p>
        </div>
    </div>
</div>
    <!--<p style="font-size:7pt; text-align:center;">Balances update every 5 seconds</p>-->
`;
}

if (timeLeftInSeconds === 0) {
        infoElement.innerHTML = `
        <p style="text-align:center;"><b>Slow-Release Withdrawal Rate:</b> ${withdrawRate} tokens/week</p>
    <div class="contract-info-container">
        <div class="contract-info-style">
<div id="regularAccount1">
            <h3>Regular Account</h3>
            <p><b>Your Timelocked Tokens:</b><br><span id="yourTokensTextRegular">${tokensLocked} BSOV</span></p>
            <p><b>Global Lock Time:<br><span id="regularUnlockTime" style="color:green;">Unlocked!</span></p>
        </div>
    </div>
</div>
    <!--<p style="font-size:7pt; text-align:center;">Balances update every 5 seconds</p>-->
`;
}


}

