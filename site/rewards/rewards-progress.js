// rewards-progress.js

let contract2;

// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    web3 = new Web3(window.ethereum);
} else {
    console.log('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
	alert ('You need to install Metamask to read the updated data. Please consider installing it: https://metamask.io/download.html');
}


if (web3) {
    loadABI('/dapp/contract2.abi', function(abi) {
        window.contract2 = new web3.eth.Contract(abi, contract2Address);
        contract2 = new web3.eth.Contract(abi, contract2Address);
    });
}

// Function to initialize the rewardsReserve contract
function initRewardsReserveContract(abi, contractAddress) {
    rewardsReserve = new web3.eth.Contract(abi, contractAddress);
}

// Function to load the contract ABI
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


// Function to update the progress bar
function updateProgressBar(totalTimelocked, totalEligibleAmount) {
    const progressBarElement = document.getElementById('rewardsProgressBar');
    const currentProgressElement = progressBarElement.querySelector('.current-progress');

    // Convert the values to Numbers for arithmetic operations
    const totalTimelockedNum = Number(totalTimelocked);
    const totalEligibleAmountNum = Number(totalEligibleAmount);
    const formattedTotalEligibleAmountNum = totalEligibleAmountNum / 100000000; 
    const formattedTotalTimelockedNum = totalTimelockedNum / 100000000;
    const formattedTimelockLimit = 1500000

    // Calculate the width of the progress bar based on the total timelocked and eligible amount
    const progressPercent = (formattedTotalTimelockedNum / 1500000) * 100;
    currentProgressElement.style.width = progressPercent + '%';
    
    // Update the tooltip with the current progress
    progressBarElement.setAttribute('data-tooltip', `This many tokens have been timelocked already: ${formattedTotalTimelockedNum.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} BSOV of a maximum of ${formattedTimelockLimit.toLocaleString()} BSOV.`);

 // Update the Total Timelocked Tokens display
    const totalTimelockedDisplayElement = document.getElementById('totalTimelockedAmount');
    totalTimelockedDisplayElement.textContent = (Number(totalTimelocked) / 1e8).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ` BSOV`; // Assuming 8 decimal places for your token

    // Update the Total Rewards Sent display
    const totalRewardsSentDisplayElement = document.getElementById('totalRewardsSentAmount');
    totalRewardsSentDisplayElement.textContent = (Number(totalEligibleAmount) / 1e8).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ` BSOV`; // Assuming 8 decimal places for your token
  
	// Update the Rewards Left display
    const rewardsLeftElement = document.getElementById('rewardsLeft');
// Assuming 8 decimal places for your token
const rewardsLeft = 300000 - (Number(totalEligibleAmount) / 1e8);
rewardsLeftElement.textContent = rewardsLeft.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ` BSOV`;

}

async function updateCurrentTierDisplay() {
    if (!contract2) {
        console.error('Rewards Reserve contract is not initialized');
        return;
    }

    try {
        const currentTier = await contract2.methods.currentGlobalTier().call();
        // Ensure currentTier is interpreted as a number
        const currentTierNumber = Number(currentTier);


        // Update the Current Tier display
        const currentTierDisplayElement = document.getElementById('currentTier');
        currentTierDisplayElement.textContent = currentTier;

	            // Calculate and display ROI based on the current tier
        calculateAndDisplayROI(currentTierNumber);

    } catch (error) {
        console.error("Error fetching the current tier from the Rewards Reserve contract:", error);
        const currentTierDisplayElement = document.getElementById('currentTier');
        currentTierDisplayElement.textContent = "Error";
    }
}

function calculateAndDisplayROI(tier) {
    let roi;
    switch (tier) {
        case 1:
            roi = 1; // 100%
            break;
        case 2:
            roi = 0.5; // 50%
            break;
        case 3:
            roi = 0.25; // 25%
            break;
        case 4:
            roi = 0.125; // 12.5%
            break;
        case 5:
            roi = 0.0625; // 6.25%
            break;
        case 6:
            roi = 0.03125; // 3.125%
            break;
        case 7:
            roi = 0.015625; // 1.5625%
            break;
        case 8:
            roi = 0.0078125; // 0.78125%
            break;
        case 9:
            roi = 0.00390625; // 0.390625%
            break;
        case 10:
            roi = 0.00390625; // 0.390625%
            break;
        default:
            roi = 0; // Default case if the tier is not recognized
    }

    // Convert ROI to percentage format
    const roiPercentage = (roi * 100).toFixed(2); // To fix it to two decimal places

    // Update the ROI display in the HTML
    const roiDisplayElement = document.getElementById('roiPercentage');
    roiDisplayElement.textContent = roiPercentage;
}

// Function to fetch and update the progress bar information
async function fetchAndUpdateProgressBar() {
    if (!contract2) {
        console.error('Rewards Reserve contract is not initialized');
        return;
    }

    try {
        const totalTimelocked = await contract2.methods.totalCumulativeTimelocked().call();
        const totalEligibleAmount = await contract2.methods.totalRewardsEarned().call();
        
        updateProgressBar(totalTimelocked, totalEligibleAmount);
    } catch (error) {
        console.error("Error fetching data from the Rewards Reserve contract:", error);
    }
}



// Set an interval to regularly update the progress bar
setInterval(fetchAndUpdateProgressBar, 5000); // Update every 5 seconds
setInterval(updateCurrentTierDisplay, 5000); // Update every 5 seconds

