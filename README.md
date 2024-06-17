# SovCube.com Website, Timelocking dApp & Smart-contracts

## SovCube description
SovCube functions like a long-term savings account. You lock your tokens and receive rewards that are also locked. You can send or pay others with your timelocked tokens, and their tokens will also be locked. You will need to wait approximately 1,000 days to withdraw your tokens, with a maximum withdrawal limit of 100 tokens per week, letting you accumulate it to max 1,000 tokens per 10 weeks. An upcoming GovernanceTreasury contract will incentivize the top time-lockers with Voting Rewards, granting them the power to vote on spending from a decentralized treasury to finance the development of the BSOV ecosystem.


## SovCube functions
Timelock BSOV Tokens to your RegularAccount and receive Timelock Rewards to your IncomingAccount - Or even send or pay using your locked tokens to the UntakenIncomingAccount of other people.


## Integration Instructions - Order of actions when deploying the contracts for testing:
#### 1. Deploy contracts
- Use for example "Remix - Ethereum IDE"
- Deploy BSOVtoken-test-contract.sol (you'll receive 10 million BSOV on deployment)
- Deploy TimelockAndRewards.sol and set the BSOV Token contract address.
#### 2. Seed contract to activate reward functionalities
- Transfer enough BSOV Tokens directly to TimelockAndRewards contract. (In this case, enter 30609121600000, exacting 306,091 BSOV Tokens)
- Call the "ownerSeedContract" method.
#### 3. Timelock tokens into RegularAccount and automatically receive rewards into IncomingAccount
- In the BSOVtoken contract, call the "ApproveAndCall" method. Fill in the desired amount to timelock. Enter the address of TimelockAndRewards contract in "spender" field, and "0x" in the "data" field. Now your tokens will be sent to your RegularAccount, and rewards are automatically sent to the UntakenIncomingAccount.
#### 4. Claim rewards from UntakenIncomingAccount and withdraw rewards
- Call the "acceptUntakenIncomingTokens" method. All your rewards will be sent to your IncomingAccount, and a timer of 1000 days will start.
- Wait 1000 days from the time you called "acceptUntakenIncomingTokens".
- Call the "withdrawFromIncomingAccount" method to withdraw max 100 BSOV per 1 week, or accumulate them to a maximum of 1000 BSOV per 10 weeks to save transaction fees.
#### 5. Withdraw timelocked tokens from RegularAccount
- Wait ~1000 days from contract deployment date.
- Call the "withdrawFromRegularAccount" method to withdraw max 100 BSOV per 1 week, or accumulate them to a maximum of 1000 BSOV per 10 weeks to save transaction fees.
#### 6. Send locked tokens from RegularAccount
DESCRIPTION: You can send locked tokens to anyone, and the tokens will be sent to the receiver's UntakenIncomingAccount.
- First make sure you have already timelocked tokens into your RegularAccount
- Call the sendLockedTokensToMany or sendLockedTokensToSingle methods.
- The receiver needs to call "acceptUntakenIncomingTokens" to accept the sent tokens, and the 1000-day timer will reset back to 1000 days - It's up to the receiver if they want to reset their timer.




## To test the dApp web interface
- First deploy the contracts as instructed above
- Clone this Git repository to your hard drive
- Install apache2 and php and setup apache to direct to localhost, and the folder of sovcube.com/site
- Edit /dapp/app.js and edit the addresses of:

- `contract1Address = '0x...'; // Insert address of Original Timelock Contract`
- `contract2Address = '0x...'; // Insert address of TimelockContract`
- `tokenContractAddress = '0x...'; // Insert address of BSOV token contract`

(Optional: To test the stats page: First setup the sovcube-apps repository (https://github.com/realrouse/sovcube-apps) and follow the instructions there)
- Copy /site/config.php-sample and rename it to config.php, and fill in MySQL data.
- Edit /site/functions.php and add the address of TimelockAndRewards contract here: `$timelockRewardReserveContractAddress = "0xFC88e4103A5e3647cF3661e2ef41C985b73585DB";
`
- Done! Now you are able to test the website, the dApp, and the contracts.

## Backend (sovcube-apps repository)
- First clone the Github repository of "sovcube-apps" at https://github.com/realrouse/sovcube-apps
- Follow the instructions of that repository



## Known issues and to-do:

- UI COSMETIC - Implement responsive design fitting for phones and tablets.
