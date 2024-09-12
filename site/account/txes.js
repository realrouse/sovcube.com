async function initiateWeb3() {
    if (window.ethereum) {
        try {
            await checkWalletConnection();
            if (selectedAccount) {
                fetchTransactions(contract1Address, 'transactionTableBody1', '/dapp/contract1.abi');
                fetchTransactions(contract2Address, 'transactionTableBody2', '/dapp/contract2.abi', 'regular');
                fetchTransactions(contract2Address, 'transactionTableBody2Incoming', '/dapp/contract2.abi', 'incoming');
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

async function fetchTransactions(contractAddress, tableId, abiPath, accountType = 'regular') {
    const contractAbi = await loadContractAbi(abiPath);
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    let allEvents = [];

    if (tableId === 'transactionTableBody1') {
        try {
            const tokensFrozenEvents = await contract.getPastEvents('TokensFrozen', { fromBlock: 0, toBlock: 'latest' });
            allEvents = allEvents.concat(tokensFrozenEvents);
            console.log('TokensFrozen events:', tokensFrozenEvents);
        } catch (error) {
            console.error('Error fetching TokensFrozen events:', error);
        }
        try {
            const tokensUnfrozenEvents = await contract.getPastEvents('TokensUnfrozen', { fromBlock: 0, toBlock: 'latest' });
            allEvents = allEvents.concat(tokensUnfrozenEvents);
            console.log('TokensUnfrozen events:', tokensUnfrozenEvents);
        } catch (error) {
            console.error('Error fetching TokensUnfrozen events:', error);
        }
    } else if (accountType === 'incoming') {
        try {
            const sentToSingleEvents = await contract.getPastEvents('SentLockedTokensToSingle', { fromBlock: 0, toBlock: 'latest' });
            sentToSingleEvents.forEach(event => {
                if (event.returnValues.to.toLowerCase() === selectedAccount.toLowerCase()) {
                    allEvents.push(event);
                }
            });
            console.log('SentLockedTokensToSingle events (Incoming):', sentToSingleEvents);
        } catch (error) {
            console.error('Error fetching SentLockedTokensToSingle events:', error);
        }
        try {
            const sentToManyEvents = await contract.getPastEvents('SentLockedTokensToMany', { fromBlock: 0, toBlock: 'latest' });
            sentToManyEvents.forEach(event => {
                if (event.returnValues.receivers.map(addr => addr.toLowerCase()).includes(selectedAccount.toLowerCase())) {
                    allEvents.push(event);
                }
            });
            console.log('SentLockedTokensToMany events (Incoming):', sentToManyEvents);
        } catch (error) {
            console.error('Error fetching SentLockedTokensToMany events:', error);
        }
        try {
            const earnedRewardEvents = await contract.getPastEvents('EarnedReward', { fromBlock: 0, toBlock: 'latest' });
            earnedRewardEvents.forEach(event => {
                if (event.returnValues.to.toLowerCase() === selectedAccount.toLowerCase()) {
                    allEvents.push(event);
                }
            });
            console.log('EarnedReward events:', earnedRewardEvents);
        } catch (error) {
            console.error('Error fetching EarnedReward events:', error);
        }
        try {
            const acceptedUntakenTokensEvents = await contract.getPastEvents('AcceptedUntakenIncomingTokens', { fromBlock: 0, toBlock: 'latest' });
            acceptedUntakenTokensEvents.forEach(event => {
                if (event.returnValues.to.toLowerCase() === selectedAccount.toLowerCase()) {
                    allEvents.push(event);
                }
            });
            console.log('AcceptedUntakenIncomingTokens events:', acceptedUntakenTokensEvents);
        } catch (error) {
            console.error('Error fetching AcceptedUntakenIncomingTokens events:', error);
        }
        try {
            const tokenWithdrawalIncomingEvents = await contract.getPastEvents('TokenWithdrawalIncomingAccount', { fromBlock: 0, toBlock: 'latest' });
            tokenWithdrawalIncomingEvents.forEach(event => {
                if (event.returnValues.addr.toLowerCase() === selectedAccount.toLowerCase()) {
                    allEvents.push(event);
                }
            });
            console.log('TokenWithdrawalIncomingAccount events:', tokenWithdrawalIncomingEvents);
        } catch (error) {
            console.error('Error fetching TokenWithdrawalIncomingAccount events:', error);
        }
    } else {
        try {
            const tokenTimelockEvents = await contract.getPastEvents('TokenTimelock', { fromBlock: 0, toBlock: 'latest' });
            tokenTimelockEvents.forEach(event => {
                if (event.returnValues.addr.toLowerCase() === selectedAccount.toLowerCase()) {
                    allEvents.push(event);
                }
            });
            console.log('TokenTimelock events:', tokenTimelockEvents);
        } catch (error) {
            console.error('Error fetching TokenTimelock events:', error);
        }
        try {
            const tokenWithdrawalRegularEvents = await contract.getPastEvents('TokenWithdrawalRegularAccount', { fromBlock: 0, toBlock: 'latest' });
            tokenWithdrawalRegularEvents.forEach(event => {
                if (event.returnValues.addr.toLowerCase() === selectedAccount.toLowerCase()) {
                    allEvents.push(event);
                }
            });
            console.log('TokenWithdrawalRegularAccount events:', tokenWithdrawalRegularEvents);
        } catch (error) {
            console.error('Error fetching TokenWithdrawalRegularAccount events:', error);
        }
        try {
            const sentToSingleEvents = await contract.getPastEvents('SentLockedTokensToSingle', { fromBlock: 0, toBlock: 'latest' });
            sentToSingleEvents.forEach(event => {
                if (event.returnValues.from.toLowerCase() === selectedAccount.toLowerCase()) {
                    allEvents.push(event);
                }
            });
            console.log('SentLockedTokensToSingle events (Regular):', sentToSingleEvents);
        } catch (error) {
            console.error('Error fetching SentLockedTokensToSingle events:', error);
        }
        try {
            const sentToManyEvents = await contract.getPastEvents('SentLockedTokensToMany', { fromBlock: 0, toBlock: 'latest' });
            sentToManyEvents.forEach(event => {
                if (event.returnValues.from.toLowerCase() === selectedAccount.toLowerCase()) {
                    allEvents.push(event);
                }
            });
            console.log('SentLockedTokensToMany events (Regular):', sentToManyEvents);
        } catch (error) {
            console.error('Error fetching SentLockedTokensToMany events:', error);
        }
    }

    allEvents.sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = '';

    for (const event of allEvents) {
        const sender = event.returnValues.addr || event.returnValues._sender || event.returnValues.from || event.returnValues.to;
        let senderFrom = event.returnValues.to || event.returnValues.from;

        if (sender && selectedAccount && sender.toLowerCase() === selectedAccount.toLowerCase() ||
            (['SentLockedTokensToSingle', 'SentLockedTokensToMany'].includes(event.event) && senderFrom && senderFrom.toLowerCase() === selectedAccount.toLowerCase()) ||
            (event.event === 'EarnedReward' && event.returnValues.to.toLowerCase() === selectedAccount.toLowerCase())) {

            const row = tableBody.insertRow();
            const timestampCell = row.insertCell(0);
            const methodCell = row.insertCell(1);
            const amountCell = row.insertCell(2);

            const eventType = event.event;

            if (eventType === 'TokensUnfrozen' || eventType === 'TokenWithdrawalRegularAccount' || eventType === 'TokenWithdrawalIncomingAccount') {
                methodCell.textContent = 'Withdraw';
            } else if (eventType === 'TokensFrozen' || eventType === 'TokenTimelock') {
                methodCell.textContent = 'Timelock';
            } else if (eventType === 'EarnedReward') {
                methodCell.textContent = 'Earned Reward';
                console.log('Processing EarnedReward event:', event);
            } else if (eventType === 'AcceptedUntakenIncomingTokens') {
                methodCell.textContent = 'Accepted Incoming Tokens';
            } else if (eventType === 'SentLockedTokensToSingle' || eventType === 'SentLockedTokensToMany') {
                const isSender = event.returnValues.from.toLowerCase() === selectedAccount.toLowerCase();
                const isRecipient = event.returnValues.to?.toLowerCase() === selectedAccount.toLowerCase() || event.returnValues.receivers?.map(addr => addr.toLowerCase()).includes(selectedAccount.toLowerCase());
                if (isRecipient && isSender) {
                    methodCell.textContent = 'Sent to Self';
                } else if (isRecipient) {
                    methodCell.textContent = 'Incoming Tokens';
                } else if (isSender) {
                    methodCell.textContent = 'Sent Locked Tokens';
                } else {
                    methodCell.textContent = 'Unknown';
                }
            } else {
                methodCell.textContent = 'ERROR';
            }

            const amountInWei = BigInt(event.returnValues.amount || event.returnValues.amt);
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
    }
}

initiateWeb3();
