let fetchedEventsContract1 = [];
let fetchedEventsContract2 = [];

async function loadContractAbi(abiPath) {
    try {
        const response = await fetch(abiPath);
        const abiJson = await response.json();
        return abiJson;
    } catch (error) {
        console.error('Error loading contract ABI:', error);
        throw error;
    }
}

async function fetchTransactions(contractAddress, tableId, abiPath, eventNames, start = 0, count = 10) {
    try {
        const contractAbi = await loadContractAbi(abiPath);
        const contract = new web3.eth.Contract(contractAbi, contractAddress);

        let allEvents = [];
        let fetchedEventsArray;

        if (tableId === 'transactionTableBody1') {
            fetchedEventsArray = fetchedEventsContract1;
        } else {
            fetchedEventsArray = fetchedEventsContract2;
        }

        for (const eventName of eventNames) {
            console.log(`Fetching events for ${eventName}...`);
            const events = await contract.getPastEvents(eventName, { fromBlock: 0, toBlock: 'latest' });
            console.log(`Fetched ${events.length} events for ${eventName}`);
            allEvents = allEvents.concat(events);
        }

        allEvents.sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

        // Append only new events to the fetchedEventsArray
        allEvents.forEach(event => {
            if (!fetchedEventsArray.some(e => e.transactionHash === event.transactionHash)) {
                fetchedEventsArray.push(event);
            }
        });

        // Slice the events to return only the required portion
        const eventsToDisplay = fetchedEventsArray.slice(start, start + count);

        const tableBody = document.getElementById(tableId);

        for (const event of eventsToDisplay) {
            console.log(`Processing event: ${event.event} at block ${event.blockNumber}`);
            const row = tableBody.insertRow();
            const timestampCell = row.insertCell(0);
            const addressCell = row.insertCell(1);
            const methodCell = row.insertCell(2);
            const amountCell = row.insertCell(3);

            const truncatedAddress = event.returnValues.addr.slice(2, 7);
            const etherscanUrl = `https://etherscan.io/address/${event.returnValues.addr}`;

            addressCell.innerHTML = `<a href="${etherscanUrl}" target="_blank">${truncatedAddress}...</a>`;
            methodCell.textContent = event.event;

            const amountInWei = BigInt(event.returnValues.amt);
            const decimals = 8;
            const amountInToken = Number(amountInWei) / 10 ** decimals;
            amountCell.textContent = `${amountInToken.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} BSOV`;

            const block = await web3.eth.getBlock(event.blockNumber);
            const timestamp = new Date(Number(block.timestamp) * 1000);
            const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' };
            const formattedTimestamp = timestamp.toLocaleString('en-GB', options);
            timestampCell.textContent = formattedTimestamp;
            timestampCell.style.fontSize = '8pt';
        }

        // Return true if there are more events to load
        return eventsToDisplay.length === count;
    } catch (error) {
        console.error('Error fetching transactions for contract', contractAddress, ':', error);
    }
}

async function loadMoreTransactions(contractAddress, tableId, abiPath, eventNames) {
    const start = document.querySelectorAll(`#${tableId} tr`).length; // Start after the already loaded transactions
    const hasMoreTransactions = await fetchTransactions(contractAddress, tableId, abiPath, eventNames, start, 50);

    if (!hasMoreTransactions) {
        const loadMoreButton = document.getElementById(`loadMoreBtn_${tableId}`);
        loadMoreButton.style.display = 'none'; // Hide the button

        const noMoreText = document.createElement('p');
        noMoreText.className = 'no-more-transactions';
        noMoreText.textContent = 'All transactions have been loaded';
        loadMoreButton.parentNode.appendChild(noMoreText);
    }
}


async function initiateWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // Check if any accounts are connected without requesting account access (read-only mode)
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });

            if (accounts.length === 0) {
                // No accounts connected, proceed in read-only mode
                console.log('MetaMask is in read-only mode (no accounts connected).');
            } else {
                console.log('MetaMask is connected with account:', accounts[0]);
            }

            // Fetch transactions in read-only mode (no account signing required)
            await fetchTransactions(contract1Address, 'transactionTableBody1', '/dapp/contract1.abi', ['TokensUnfrozen', 'TokensFrozen'], 0, 10);
            await fetchTransactions(contract2Address, 'transactionTableBody2', '/dapp/contract2.abi', ['TokenTimelock', 'TokenWithdrawalRegularAccount'], 0, 10);
        } catch (error) {
            console.error('Error accessing MetaMask in read-only mode:', error);
        }
    } else {
        console.error('MetaMask not detected. Falling back to Infura.');
        window.web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

        try {
            // Fetch transactions via Infura in read-only mode
            await fetchTransactions(contract1Address, 'transactionTableBody1', '/dapp/contract1.abi', ['TokensUnfrozen', 'TokensFrozen'], 0, 10);
            await fetchTransactions(contract2Address, 'transactionTableBody2', '/dapp/contract2.abi', ['TokenTimelock', 'TokenWithdrawalRegularAccount'], 0, 10);
        } catch (error) {
            console.error('Error fetching transactions via Infura:', error);
        }
    }
}


/*
async function initiateWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Account access granted');
            await fetchTransactions(contract1Address, 'transactionTableBody1', '/dapp/contract1.abi', ['TokensUnfrozen', 'TokensFrozen'], 0, 10);
            await fetchTransactions(contract2Address, 'transactionTableBody2', '/dapp/contract2.abi', ['TokenTimelock', 'TokenWithdrawalRegularAccount'], 0, 10);
        } catch (error) {
            console.error('User denied account access:', error);
        }
    } else {
        console.error('MetaMask not detected. Falling back to Infura.');
        window.web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
        try {
            await fetchTransactions(contract1Address, 'transactionTableBody1', '/dapp/contract1.abi', ['TokensUnfrozen', 'TokensFrozen'], 0, 10);
            await fetchTransactions(contract2Address, 'transactionTableBody2', '/dapp/contract2.abi', ['TokenTimelock', 'TokenWithdrawalRegularAccount'], 0, 10);
        } catch (error) {
            console.error('Error fetching transactions via Infura:', error);
        }
    }
}
*/


initiateWeb3();

