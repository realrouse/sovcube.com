async function initiateWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accountAddress = await getAccountAddress(); // Implement getAccountAddress function
            fetchTransactions(contract1Address, 'transactionTableBody1', '/dapp/contract1.abi', accountAddress);
            fetchTransactions(contract2Address, 'transactionTableBody2', '/dapp/contract2.abi', accountAddress);
	    fetchTransactions(contract2Address, 'transactionTableBody2Incoming', '/dapp/contract2.abi', accountAddress);
        } catch (error) {
            console.error('User denied account access');
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
        console.error('Error loading contract ABI:', error);
        throw error;
    }
}


async function getAccountAddress() {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts[0];
}

async function fetchTransactions(contractAddress, tableId, abiPath, accountAddress) {
    const contractAbi = await loadContractAbi(abiPath);
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    const tokensUnfrozenEvents = await contract.getPastEvents('TokensUnfrozen', { filter: { addr: accountAddress }, fromBlock: 0, toBlock: 'latest' });
    const tokensFrozenEvents = await contract.getPastEvents('TokensFrozen', { filter: { addr: accountAddress }, fromBlock: 0, toBlock: 'latest' });
    const allEvents = [...tokensUnfrozenEvents, ...tokensFrozenEvents].sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

    const tableBody = document.getElementById(tableId);
    allEvents.forEach(async event => {
        const row = tableBody.insertRow();
        const timestampCell = row.insertCell(0);
        const methodCell = row.insertCell(1);
        const amountCell = row.insertCell(2);

        methodCell.textContent = event.event === 'TokensUnfrozen' ? 'Withdraw' : 'Timelock';

        const amountInWei = BigInt(event.returnValues.amt);
        const decimals = 8;
        const amountInToken = Number(amountInWei) / 10**decimals;

        amountCell.textContent = amountInToken.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' BSOV';
        const block = await web3.eth.getBlock(event.blockNumber);
        const timestamp = new Date(block.timestamp * 1000);
        const formattedTimestamp = timestamp.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' });
        timestampCell.textContent = formattedTimestamp;
    });
}

initiateWeb3();
