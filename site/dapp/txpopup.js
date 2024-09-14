// Array to store processed transaction hashes to avoid duplicates
let processedTxHashes = new Set();

// Function to handle new transaction receipts
async function handleNewReceipt(receipt) {
    const txHash = receipt.transactionHash;

    // Check if we've already processed this transaction
    if (processedTxHashes.has(txHash)) {
        return; // Skip if this transaction was already processed
    }

    // Mark this transaction as processed
    processedTxHashes.add(txHash);

    const events = receipt.logs.map(log => {
        return {
            event: log.event,
            amount: log.data / 100000, // Adjusting for smallest unit (e.g., wei to ether)
        };
    });

    // Create a notification for each event in the receipt
    events.forEach(event => {
        createNotificationPopup(event);
    });

    // Save notifications in localStorage to persist until user clears them
    saveNotificationsToLocalStorage();
}

// Function to create a notification popup
function createNotificationPopup(event) {
    const notificationContainer = document.getElementById('notificationsContainer');

    const notification = document.createElement('div');
    notification.className = 'newTxPopup';
    notification.innerHTML = `
        <p>${event.event}: ${event.amount}</p>
        <button class="closePopup">X</button>
    `;

    notificationContainer.appendChild(notification);

    // Event listener for the close button
    notification.querySelector('.closePopup').addEventListener('click', () => {
        removeAllNotifications();
    });
}

// Function to save notifications in localStorage
function saveNotificationsToLocalStorage() {
    const notifications = document.getElementById('notificationsContainer').innerHTML;
    localStorage.setItem('notifications', notifications);
}

// Function to load notifications from localStorage
function loadNotificationsFromLocalStorage() {
    const notifications = localStorage.getItem('notifications');
    if (notifications) {
        document.getElementById('notificationsContainer').innerHTML = notifications;

        // Reattach event listeners to the close buttons
        document.querySelectorAll('.closePopup').forEach(button => {
            button.addEventListener('click', () => {
                removeAllNotifications();
            });
        });
    }
}

// Function to remove all notifications
function removeAllNotifications() {
    document.getElementById('notificationsContainer').innerHTML = '';
    localStorage.removeItem('notifications');
    processedTxHashes.clear(); // Clear the processed transactions
}

// Function to poll for new transaction receipts
async function pollForNewReceipts() {
    // Replace with your Web3 logic to get recent transactions
    const latestBlock = await web3.eth.getBlock('latest', true);

    // Iterate over all transactions in the latest block
    for (const tx of latestBlock.transactions) {
        const receipt = await web3.eth.getTransactionReceipt(tx.hash);
        if (receipt) {
            handleNewReceipt(receipt);
        }
    }
}

// Start polling every 2 seconds
setInterval(pollForNewReceipts, 2000);

// Load notifications from localStorage when the page loads
window.addEventListener('load', () => {
    loadNotificationsFromLocalStorage();
});

