let web3;

// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    web3 = new Web3(window.ethereum);
} else {
    console.log('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    alert('You need to install MetaMask to read the updated data. Please consider installing it: https://metamask.io/download.html');
}

let contract1;
let contract2;
let bsovTokenContract;

// Function to initialize the bsovTokenContract contract
function initBsovTokenContract(abi, contractAddress) {
    bsovTokenContract = new web3.eth.Contract(abi, contractAddress);
}

// Function to initialize contract1
function initContract1(abi, contractAddress) {
    contract1 = new web3.eth.Contract(abi, contractAddress);
}

// Function to initialize contract2
function initContract2(abi, contractAddress) {
    contract2 = new web3.eth.Contract(abi, contractAddress);
}

// Function to load the contract ABI and return a Promise
function loadABI(file) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', file, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const abi = JSON.parse(xhr.responseText);
                resolve(abi);
            } else if (xhr.readyState === 4) {
                reject(new Error(`Failed to load ABI from ${file}`));
            }
        };
        xhr.send();
    });
}

// Initialize contracts using async/await
async function initializeContracts() {
    try {
        const contract1ABI = await loadABI('/dapp/contract1.abi');
        const contract2ABI = await loadABI('/dapp/contract2.abi');
        const tokenContractABI = await loadABI('/dapp/bsov.abi');

        initContract1(contract1ABI, contract1Address); // Initialize contract1
        initContract2(contract2ABI, contract2Address); // Initialize contract2
        initBsovTokenContract(tokenContractABI, tokenContractAddress); // Initialize bsovTokenContract

        // Now that contracts are initialized, you can update their data
        updateData();
    } catch (error) {
        console.error(error);
    }
}

// Helper function to update contract data on the page
function updateContractData(contract, methodName, containerId, methodArgs) {
    const containerLabels = {
        timeUntilWithdrawalHalving: "Time Remaining until Withdrawal Halving",
        contract1TimeLeft: "Time Remaining of Lock Time",
        contract2TimeLeft: "Time Remaining of Lock Time",
        CurrentTier: "Current Reward Tier",
        TotalClaimed: "Total Rewards Claimed",
        TotalEligibleAmount: "Total Rewards Sent",
        RewardsRemaining: "Rewards Remaining",
        TotalTimelocked: "Total BSOV Timelocked for Rewards",
        tokensMinted: "Total BSOV Tokens Minted",
        burnAmount: "Total BSOV Burned"
    };

    const containerLabel = containerLabels[containerId] || 'Unknown Container';

    const containerElement = document.getElementById(containerId);
    if (!containerElement) {
        console.error(`Element with ID '${containerId}' not found.`);
        return;
    }

    let methodCall;
    if (methodArgs && methodArgs.length > 0) {
        methodCall = contract.methods[methodName](...methodArgs);
    } else {
        methodCall = contract.methods[methodName]();
    }

    methodCall
        .call()
        .then((result) => {
            let formattedResult = Number(result);

            // Handle specific case for getTimestampOfNextWithdrawalHalving
            if (methodName === 'getTimestampOfNextWithdrawalHalving') {
                const now = Math.floor(Date.now() / 1000);
                const timeLeft = formattedResult - now;
                if (timeLeft > 0) {
                    formattedResult = formatTime(timeLeft);
                } else {
                    formattedResult = "0 days, 0 hours, 0 min, 0 sec";
                }
            } else if (methodName === 'tokensMinted' || methodName === 'totalClaimed' || methodName === 'totalRewardsEarned' || methodName === 'totalCumulativeTimelocked' || methodName === 'balanceOf' || methodName === 'getBalanceRegularAccount') {
                formattedResult = (formattedResult / 100000000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " BSOV";
            } else if (methodName === 'getTimeLeft' || methodName === 'getGlobalTimeLeftRegularAccount' || methodName === 'getTimeLeftIncomingAccount') {
                formattedResult = formatTime(formattedResult); // Format time as countdown
            }

            containerElement.innerHTML = `<p><b>${containerLabel}:</b><br>${formattedResult}</p>`;
        })
        .catch((error) => {
            if (error.message.includes('future is here') || error.message.includes('Tokens are unlocked')) {
                // Show 'Unlocked!' text in green color
                containerElement.innerHTML = `<p><b>${containerLabel}:</b><br><span style="color: green;">Unlocked!</span></p>`;
            } else {
                containerElement.innerHTML = `<p><b>${containerLabel}:</b><br>Error</p>`;
            }
        });
}

function formatTime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    seconds %= (3600 * 24);
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    return `${days} days, ${hours} hours, ${minutes} min, ${seconds} sec`;
}

// Function to update contract data
function updateData() {
    // Update data for bsovTokenContract
    updateContractData(bsovTokenContract, 'tokensMinted', 'tokensMinted');
    updateContractData(bsovTokenContract, 'balanceOf', 'burnAmount', ["0x0000000000000000000000000000000000000000"]);
    // Update data for contract1
    updateContractData(contract1, 'getTimeLeft', 'contract1TimeLeft');

    // Update data for contract2
    updateContractData(contract2, 'getGlobalTimeLeftRegularAccount', 'contract2TimeLeft');
    updateContractData(contract2, 'getTimestampOfNextWithdrawalHalving', 'timeUntilWithdrawalHalving');

    // Update data for rewardsReserve
    updateContractData(contract2, 'currentGlobalTier', 'CurrentTier');
    updateContractData(contract2, 'totalRewardsEarned', 'TotalEligibleAmount');
    updateContractData(contract2, 'getBalanceRegularAccount', 'RewardsRemaining', [contract2Address]);
    updateContractData(contract2, 'totalCumulativeTimelocked', 'TotalTimelocked');
}

// Call the initializeContracts function to start the process
initializeContracts();
