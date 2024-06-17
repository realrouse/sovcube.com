async function initiateWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Account access granted');
            await fetchTransactions(contract1Address, 'transactionTableBody1', '/dapp/contract1.abi', ['TokensUnfrozen', 'TokensFrozen']);
            await fetchTransactions(contract2Address, 'transactionTableBody2', '/dapp/contract2.abi', ['TokenTimelock', 'TokenWithdrawalRegularAccount']);
        } catch (error) {
            console.error('User denied account access:', error);
        }
    } else {
        console.error('Web3 not detected');
    }
}

async function loadContractAbi(abiPath) {
    try {
        const response = await fetch(abiPath);
        const abiJson = await response.json();
        return abiJson;
    } catch (error) {
        console.error('Error loading contract ABI from', abiPath, ':', error);
        throw error;
    }
}

async function fetchTransactions(contractAddress, tableId, abiPath, eventNames) {
    try {
        const contractAbi = await loadContractAbi(abiPath);
        const contract = new web3.eth.Contract(contractAbi, contractAddress);

        let allEvents = [];
        for (const eventName of eventNames) {
            console.log(`Fetching events for ${eventName}...`);
            const events = await contract.getPastEvents(eventName, { fromBlock: 0, toBlock: 'latest' });
            console.log(`Fetched ${events.length} events for ${eventName}`);
            allEvents = allEvents.concat(events);
        }
        allEvents.sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

        const tableBody = document.getElementById(tableId);

        for (const event of allEvents) {
            console.log(`Processing event: ${event.event} at block ${event.blockNumber}`);
            const row = tableBody.insertRow();
            const timestampCell = row.insertCell(0);
            const addressCell = row.insertCell(1);
            const methodCell = row.insertCell(2);
            const amountCell = row.insertCell(3);

            const truncatedAddress = event.returnValues.addr.slice(2, 7);
            const etherscanUrl = `https://goerli.etherscan.io/address/${event.returnValues.addr}`;

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
    } catch (error) {
        console.error('Error fetching transactions for contract', contractAddress, ':', error);
    }
}

initiateWeb3();
