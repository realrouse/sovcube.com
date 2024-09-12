fetch-contract.js

function fetchContractInfo(contractName, account) {
    if (contractName === 'contract1') {
        getTimelockedTokens(account).then(timelockedTokens => {
            const formattedTokens = Number(timelockedTokens) / 100000000;
            updateContract1Details(formattedTokens, '2023-01-01', 100);
        });
    }
}

