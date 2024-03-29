async function initiateWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            fetchTransactions(contract1Address, 'transactionTableBody1', '/dapp/contract1.abi');
            fetchTransactions(contract2Address, 'transactionTableBody2', '/dapp/contract2.abi');
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

async function fetchTransactions(contractAddress, tableId, abiPath) {
    const contractAbi = await loadContractAbi(abiPath);
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    const tokensUnfrozenEvents = await contract.getPastEvents('TokensUnfrozen', { fromBlock: 0, toBlock: 'latest' });
    const tokensFrozenEvents = await contract.getPastEvents('TokensFrozen', { fromBlock: 0, toBlock: 'latest' });
    const allEvents = [...tokensUnfrozenEvents, ...tokensFrozenEvents].sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

    const tableBody = document.getElementById(tableId);

    for (const event of allEvents) {
        const row = tableBody.insertRow();
        const timestampCell = row.insertCell(0);
        const addressCell = row.insertCell(1);
        const methodCell = row.insertCell(2);
        const amountCell = row.insertCell(3);

        const truncatedAddress = event.returnValues.addr.slice(2, 7);
        const etherscanUrl = `https://goerli.etherscan.io/address/${event.returnValues.addr}`;

        addressCell.innerHTML = `<a href="${etherscanUrl}" target="_blank">${truncatedAddress}...</a>`;
        methodCell.textContent = event.event === 'TokensUnfrozen' ? 'Withdraw' : 'Timelock';

        const amountInWei = BigInt(event.returnValues.amt);
        const decimals = 8;
        const amountInToken = Number(amountInWei) / 10**decimals;

      //  amountCell.textContent = amountInToken.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' BSOV';
	amountCell.textContent = `${amountInToken.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} BSOV`;

        const block = await web3.eth.getBlock(event.blockNumber);
        // const timestamp = new Date(block.timestamp * 1000);
        const timestamp = new Date(Number(block.timestamp) * 1000);
	const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' };
	const formattedTimestamp = timestamp.toLocaleString('en-GB', options);
	// const formattedTimestamp = timestamp.toLocaleString();

        timestampCell.textContent = formattedTimestamp;
	timestampCell.style.fontSize = '8pt';
    }
}

initiateWeb3();
