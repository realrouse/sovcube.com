
async function initiateWeb3() {
    if (window.ethereum) {
      // window.web3 = new Web3(window.ethereum);
        try {
           //  await window.ethereum.request({ method: 'eth_requestAccounts' });
	await checkWalletConnection();
		

		console.log('Connected to: '+ selectedAccount);
		if (selectedAccount) {
			console.log('2Connected to: '+ selectedAccount);
            fetchTransactions(contract2Address, 'transactionTableBody2Incoming', '/dapp/contract2.abi');
            fetchTransactions(contract1Address, 'transactionTableBody1', '/dapp/contract1.abi');
	    fetchTransactions(contract2Address, 'transactionTableBody2', '/dapp/contract2.abi');
		}


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


// ... (your existing code)

async function fetchTransactions(contractAddress, tableId, abiPath) {
    const contractAbi = await loadContractAbi(abiPath);
    const contract = new web3.eth.Contract(contractAbi, contractAddress);


    const tokensUnfrozenEvents = await contract.getPastEvents('TokensUnfrozen', { fromBlock: 0, toBlock: 'latest' });
    const tokensFrozenEvents = await contract.getPastEvents('TokensFrozen', { fromBlock: 0, toBlock: 'latest' });
    let allEvents = [...tokensUnfrozenEvents, ...tokensFrozenEvents].sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));


let tokensClaimedEvents; // Declare tokensClaimedEvents outside the if block
let sendTimelockedMarkedEvents;




if (tableId === 'transactionTableBody2Incoming') {
tokensClaimedEvents = await contract.getPastEvents('TokensClaimed', { fromBlock: 0, toBlock: 'latest' });
sendTimelockedMarkedEvents = await contract.getPastEvents('sendTimelockedMarked', { fromBlock: 0, toBlock: 'latest' });
console.log('TokensClaimed Events for incoming transactions:', tokensClaimedEvents);
            console.log('sendTimelockedMarked Events for incoming transactions:', sendTimelockedMarkedEvents);

 allEvents = [...allEvents, ...tokensClaimedEvents, ...sendTimelockedMarkedEvents];
}        




// Filter events based on tableId and selectedAccount
if (tableId === 'transactionTableBody2Incoming') {
    console.log('Found Incoming Account Id');

    allEvents = allEvents.filter(event =>
    ((event.event === 'TokensClaimed' && event.returnValues.to && event.returnValues.to.toLowerCase() === selectedAccount.toLowerCase()) ||
         (event.event === 'sendTimelockedMarked' && event.returnValues.from && event.returnValues.from.toLowerCase() === selectedAccount.toLowerCase()))

    );
    // Log each filtered event
    allEvents.forEach(filteredEvent => {
        console.log('Filtered Events ' + filteredEvent);
	        console.log('Filtered Event Type:', filteredEvent.event);
    console.log('Filtered Event Return Values:', filteredEvent.returnValues);
    });
}
   



const tableBody = document.getElementById(tableId);
tableBody.innerHTML = '';
    // console.log('Before loop - tableBody:', tableBody);

    for (const event of allEvents) {

	    const sender = event.returnValues.addr || event.returnValues._sender;

	    if (sender.toLowerCase() === selectedAccount.toLowerCase()) {

	const row = tableBody.insertRow();
        const timestampCell = row.insertCell(0);
        const methodCell = row.insertCell(1);
        const amountCell = row.insertCell(2);

		    const eventType = event.event;

		            // Determine the amount field based on the event type
        let amountField;
        if (eventType === 'TokensClaimed' || eventType === 'sendTimelockedMarked') {
            amountField = 'amount';
        } else if (eventType === 'TokensFrozen' || eventType === 'TokensUnfrozen') {
            amountField = 'amt';
        }

        // console.log('Event:', event);

//       methodCell.textContent = event.event === 'TokensUnfrozen' ? 'Withdraw' : 'Timelock';
        if (event.event === 'TokensUnfrozen') {
            methodCell.textContent = 'Withdraw';
	} else if (event.event === 'TokensFrozen') {
	    methodCell.textContent = 'Timelock';
        } else if (event.event === 'TokensClaimed') {
            methodCell.textContent = 'Accept Incoming Tokens';
        } else if (event.event === 'sendTimelockedMarked') {
            methodCell.textContent = 'Sent Locked Tokens';
        } else {
            // If the event type is unknown, you can set a default value or handle it accordingly
            methodCell.textContent = 'Unknown';
        }


        const amountInWei = BigInt(event.returnValues[amountField]);
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

    // console.log('After loop - tableBody:', tableBody);
    // console.log('Finished processing events');




    // console.log('Final tableBody:', tableBody.innerHTML);
}

initiateWeb3();


