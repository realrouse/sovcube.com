// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    web3 = new Web3(window.ethereum);
} else {
    console.log('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
        alert ('You need to install Metamask to read the updated data. Please consider installing it: https://metamask.io/download.html');
}


//let rewardsReserve; // Define rewardsReserve in a broader scope

// Function to initialize the rewardsReserve contract
/*
function initRewardsReserveContract(abi, contractAddress) {
    rewardsReserve = new web3.eth.Contract(abi, contractAddress);
}
*/

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

