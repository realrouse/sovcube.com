// connect.js

let isConnected = false;

function updateButton() {
    const connectButton = document.getElementById('connectWallet');
    connectButton.innerText = isConnected ? 'Disconnect Wallet' : 'Connect to Wallet';
}

window.addEventListener('load', function() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');

        // Check if any account is connected
        ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
            if (accounts.length > 0) {
                isConnected = true; // An account is connected
            } else {
                isConnected = false; // No account connected
            }
            updateButton();
        });
    } else {
        console.log('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    }

    const connectButton = document.getElementById('connectWallet');
    const walletStatus = document.getElementById('walletStatus');

    connectButton.addEventListener('click', function() {
        if (!isConnected && window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(result => {
                isConnected = true;
                walletStatus.innerText = `Connected to ${result[0]}`;
                walletStatus.style.color = 'green';
            })
            .catch(error => {
                console.error(error);
                walletStatus.innerText = 'Connection to MetaMask failed';
                walletStatus.style.color = 'red';
            });
        } else {
            // Handle disconnection
            isConnected = false;
            walletStatus.innerText = 'Disconnected';
            walletStatus.style.color = 'red';
        }
        updateButton();
    });

    // Listen for account changes
    ethereum.on('accountsChanged', function (accounts) {
        isConnected = accounts.length > 0;
        updateButton();
        walletStatus.innerText = isConnected ? `Connected to ${accounts[0]}` : 'Disconnected';
        walletStatus.style.color = isConnected ? 'green' : 'red';
    });
});

