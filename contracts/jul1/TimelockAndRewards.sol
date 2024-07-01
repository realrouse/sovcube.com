// SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20;

// Welcome to Sovcube's TimeLock & Rewards Contract
// https://SovCube.com
// 
//
// DO NOT SEND TOKENS DIRECTLY TO THIS CONTRACT!!!
// THEY WILL BE LOST FOREVER!!!
// YOU HAVE TO MAKE A CALL TO THE CONTRACT TO BE ABLE TO TIMELOCK & WITHDRAW!!!
//
// *** Accounts ***
// All users have two different main accounts: A Regular Account and an Incoming Account.
// When users timelock BSOV tokens, the tokens are sent to their Regular Account.
// When users receive Timelock Rewards, and when users receive Sent Locked Tokens, the tokens are sent to their Incoming Account.
// Before receiving the tokens to their Incoming Account, they have to Accept Incoming Tokens first which resets/starts their Lock Time.
// The two accounts have individual Lock Time countdowns, but they have the same weekly Withdrawal Rate that starts at 100 tokens.
//
// *** Timelock ***
// The user can timelock BSOV Tokens for a Global Lock Time of 1000 days (2.7 years), a countdown that starts the day the contract is deployed.
// Tokens can be timelocked within that period without resetting the timer.
// The timelocked tokens will be sent to the user's "Regular Account".
// After the Global Lock Time of 1000 days has expired, when timelocking tokens; new users will have a lock time of 70 days, old users 14 days.
// 
// *** Timelock Rewards ***
// The deployer of this contract has seeded the contract with a total of 300,000 BSOV Tokens 
// that will be distributed to early adopters as Timelock Rewards.
//
// To incentivize early adopters, the users of the first 1,500,000 timelocked tokens will receive Timelock Rewards.
// The earliest users will receive the highest amount of rewards. The first users will receive ~100% ROI,
// meaning that if a user timelocks 10,000 BSOV, they will receive another 10,000 BSOV in rewards.
// For every 150,000 total timelocked BSOV, the ROI will halve, due to a Global Tier system that reaches max 10 tiers.
//
// *** Send Locked Tokens ***
// Once the users have timelocked their tokens, they are able to Send Locked Tokens to anyone,
// they can even batch several addresses and amounts into one "SendLockedTokensToMany" transaction. 
// If you receive timelocked tokens from someone, they will be sent to your "Untaken Incoming Balance".
// If you accept the incoming tokens using the "acceptUntakenIncomingTokens" method,
// the Lock Time of your Incoming Tokens Account will reset to 100 days, if the initial Global Lock Time of 1000 days has expired.
//
// *** After the Global Lock Time of 1000 days has expired ***
//
// *** Withdrawals ***
// After the Global Lock Time of 1000 days has expired, users can begin withdrawing tokens
// from their "Regular Account" and "Incoming Account"
// with a rate limit to prevent all holders from withdrawing all tokens and selling at the same time,
// and to enforce skin-in-the-game to all users.
// The withdrawal limit is 100 BSOV per week, per user. A user can wait and accumulate their Max Withdrawal Amount to 1000, which takes 10 weeks,
// which means that to withdraw the maximum amount possible, they will need to withdraw at least every 10 weeks.
//
// *** Withdrawal Halving Eras***
// After the Global Lock Time of 1000 days has expired, a countdown of 1500 days (~4 years) starts for the next Withdrawal Halving.
// When the 1500 days have elapsed, anyone can call the newWithdrawalHalving method,
// which will halve the weekly Withdrawal Rate (e.g. from 100 to 50).
// Withdrawal Era number will reach the final Halving Era number 5, which will make the weekly withdrawal rate become 6.25 tokens.
// It will take ~20 years to reach the final Halving Era.
// 
// *** Miscellaneous ***
// After the Global Lock Time of 1000 days has expired, every new user needs to wait 70 days to start withdrawing their tokens,
// The intention of this 70-day lock is to penalize the creation of multiple wallets.
//
// After the Global Lock Time of 1000 days has expired, every old user needs to wait at least 14 days to start withdrawing their tokens.
//
// In the case the user would like to transfer all their locked token ownership to a cold wallet,
// or in inheritance or custody-transfer scenarios, there is a "migrateAccount" method.
//
// This contract is supposed to be a pre-cursor and an essential component to an upcoming GovernanceTreasury contract
// that will qualify only the TopTimelockers of this contract. It is essential that you timelock your tokens using only a single address.
//
// Note that BSOV has 1% burn on transfer, so 1% of your BSOV will burn when timelocking and 1% will burn when withdrawing.

  // import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/utils/ReentrancyGuard.sol";
  import "./ReentrancyGuard.sol";

// Defines the interface of the BSOV Token contract
    abstract contract ERC20Interface {
        function transfer(address to, uint256 tokens) public virtual returns(bool success);
        function transferFrom(address from, address to, uint256 tokens) public virtual returns(bool success);
        function approve(address spender, uint256 tokens) public virtual returns(bool success);
        function approveAndCall(address spender, uint256 tokens, bytes memory data) public virtual returns(bool success);
        function balanceOf(address account) public virtual returns (uint256);
        event Transfer(address indexed from, address indexed to, uint256 tokens);
        event Approval(address indexed tokenOwner, address indexed spender, uint256 tokens);
        
    }


    contract TimelockAndRewards is ReentrancyGuard {
        
        ERC20Interface tokenContract;

// Customizable constants if you ever wish to deploy this contract with different parameters
        uint256 constant TOKEN_PRECISION = 100000000; // Number of decimals in BSOV Token (8)
        uint256 constant GLOBAL_LOCK_EXPIRATION_TIME = 1000 days; // A global countdown that unlocks timelocked tokens in all user's Regular Accounts when it expires. 
        uint256 constant MAX_WITHDRAWAL_PERIODS = 10; // The user can accumulate withdrawals for a maximum number of periods.
        uint256 constant TIME_BETWEEN_WITHDRAWALS = 7 days; // The user has to wait this amount of time to withdraw periodWithdrawalAmount
        uint256 constant RESET_TIME_LEFT_INCOMING_ACCOUNT = 100 days; // Whenever a user takes untaken incoming tokens, the timer will reset to this amount of time.
        uint256 constant WITHDRAWAL_HALVING_ERA_DURATION = 1500 days; // Amount of days until the periodWithdrawalAmount halves - only happens after the inital lockExpiration.
        uint256 constant MAX_WITHDRAWAL_HALVING_ERAS = 5; // Max amount of withdrawal halving eras
        uint256 constant NEW_USER_LOCK_TIME = 70 days; // Set the duration that new timelockers need to wait before withdrawing their tokens. To penalize multiple wallets, and enforce skin-in-the-game. 
        uint256 constant OLD_USER_LOCK_TIME = 14 days; // Set the duration that old timelockers need to wait before withdrawing their tokens, if they decide to timelock again. - To prevent immediate withdrawal.
        uint256 constant MAX_TIMELOCK_AMOUNT = 145000 * TOKEN_PRECISION; // Max amount of tokens to timelock in a single tx - Must be lower than NEXT_TIER_THRESHOLD 
        uint256 constant TOTAL_REWARDS_SEEDED = 300000 * TOKEN_PRECISION; // Total amount of tokens intended to be seeded for rewards
        uint256 constant NEXT_TIER_THRESHOLD = 150000 * TOKEN_PRECISION; // The amount of tokens to be timelocked to trigger the next Global Tier. Must be higher than MAX_TIMELOCK_AMOUNT

// Set in the constructor
        uint256 public periodWithdrawalAmount; // The user can withdraw this amount of tokens per withdrawal period.
        uint256 globalLockExpirationDateRegularAccount; // Timestamp of the day of contract deployment + GLOBAL_LOCK_EXPIRATION_TIME
        uint256 public deploymentTimestamp; // Timestamp created the day of contract deployment

// Withdrawal halving variables
        uint256 public lastWithdrawalHalving;
        uint256 public withdrawalHalvingEra;

// Stats that apply to totals and globals
        uint256 public currentGlobalTier; // The current global tier. The reward ratio for each tier is defined in getRewardRatioForTier.
        uint256 public totalCumulativeTimelocked; // Amount of tokens that have ever been timelocked, disregarding withdrawals.
        uint256 public totalCurrentlyTimelocked; // Amount of tokens that are currently timelocked
        uint256 public totalRewardsEarned; // Total amount of rewards that have been earned across all users.

// Address of the owner/contract deployer - Supposed to become the burn address (0x0000...) after owner revokes ownership.
        address public owner;
        bool public isContractSeeded;
        
// Mappings for Regular Accounts        
        mapping(address => uint256) balanceRegularAccount;
        mapping(address => uint256) lastWithdrawalRegularAccount;

// Mappings for Incoming Accounts
        mapping(address => uint256) lockExpirationForUserIncomingAccount;
        mapping(address => uint256) balanceIncomingAccount;
        mapping(address => uint256) lastWithdrawalIncomingAccount;
        mapping(address => uint256) balanceUntakenIncomingAccount;

// Events
        event SentLockedTokensToSingle(address indexed from, address indexed to, uint256 amount);
        event SentLockedTokensToMany(address indexed from, address[] receivers, uint256[] amounts);
        event EarnedReward(address indexed from, address indexed to, uint256 amount);
        event AcceptedUntakenIncomingTokens(address indexed to, uint256 amount);
        event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
        event TokenTimelock(address indexed addr, uint256 amt, uint256 time);
        event TokenWithdrawalRegularAccount(address indexed addr, uint256 amt, uint256 time);
        event TokenWithdrawalIncomingAccount(address indexed addr, uint256 amt, uint256 time);
        event NewWithdrawalHalving(uint256 era, uint256 time);
        event AccountMigration(address indexed oldAddress, address indexed newAddress);

// When deploying this contract, you will need to input the BSOV Token contract address.
        constructor(address _tokenContractAddress) {
            tokenContract = ERC20Interface(_tokenContractAddress); // Input address of BSOV Token contract
            owner = msg.sender; // Set owner
            globalLockExpirationDateRegularAccount = (block.timestamp + GLOBAL_LOCK_EXPIRATION_TIME); // Initialize initial lock period of all RegularAccounts
            currentGlobalTier = 1; // Set the global tier to 1
            deploymentTimestamp = block.timestamp; // Initialize the deployment timestamp
            
            // Set the first withdrawal amount, which will halve every 1500 days after globalLockExpirationDateRegularAccount has expired
            periodWithdrawalAmount = 100 * TOKEN_PRECISION; // 100 BSOV Tokens
            
            lastWithdrawalHalving = globalLockExpirationDateRegularAccount; // Initialize the last halving timestamp
            withdrawalHalvingEra = 1; // Initialize the halving era
            isContractSeeded = false;
        }

        modifier onlyOwner() {
            require(msg.sender == owner, "Not owner");
            _;
        }

// This function "seeds" the 300,000 tokens that are reserved for the Timelock Rewards.
// First the owner needs to transfer at least 30609121600000 tokens to this contract, then he can call this function.
        function ownerSeedContract() public onlyOwner {
            require (!isContractSeeded, "Contract is already seeded");
            uint256 balance = tokenContract.balanceOf(address(this));
            require(tokenContract.approveAndCall(address(this), balance, "0x"), "Token approval failed");
            isContractSeeded = true;
        }

// Move ownership of contract to the burn address.
        function revokeOwnership() public onlyOwner {
            emit OwnershipTransferred(owner, address(0));
            owner = address(0);
        }

// Gets the ratio for rewards according to the current tier.
        function getRewardRatioForTier(uint256 tier) internal pure returns (uint256) {
            if (tier == 1) return 1 * 100000000;
            if (tier == 2) return 0.5 * 100000000;
            if (tier == 3) return 0.25 * 100000000;
            if (tier == 4) return 0.125 * 100000000;
            if (tier == 5) return 0.0625 * 100000000;
            if (tier == 6) return 0.03125 * 100000000;
            if (tier == 7) return 0.015625 * 100000000;
            if (tier == 8) return 0.0078125 * 100000000;
            if (tier == 9) return 0.00390625 * 100000000;
            if (tier == 10) return 0.00390625 * 100000000;
            return 0;
        }

/** THE TIMELOCK FUNCTION
*   Name: receiveApproval
*   Handles the approval and timelocking of BSOV tokens.
*   The receiveApproval function is called by the approveAndCall function in the BSOV token contract.
*   If the timelock contract initiates the transaction (as done with the ownerSeedContract function), no rewards will be earned.
*   If a user initiates the transaction, they will earn rewards through the calculateAndSendRewardsAfterTimelock function.
*/
        function receiveApproval(address _sender, uint256 _value, address _tokenContract, bytes memory _extraData) public nonReentrant {
            require(_tokenContract == address(tokenContract), "Can only deposit BSOV into this contract!");
            require(_value > 100, "Value must be greater than 100 Mundos, (0.00000100 BSOV)");

            require(ERC20Interface(tokenContract).transferFrom(_sender, address(this), _value), "Timelocking transaction failed");
            
            // Adjust for 1% burn of BSOV Token
            uint256 _adjustedValue = (_value * 99) / 100;
            
            // Write updated balance to storage
            balanceRegularAccount[_sender] += _adjustedValue;
            totalCurrentlyTimelocked += _adjustedValue;
            
            emit TokenTimelock(_sender, _adjustedValue, block.timestamp);

            // If sender has withdrawn before, meaning is an existing user, then set a 14-day lock from now.
            if (lastWithdrawalRegularAccount[_sender] != 0) {
                // If the global lock is still in effect, set lastWithdrawalRegularAccount to the global lock expiration date
                if (block.timestamp < (globalLockExpirationDateRegularAccount - OLD_USER_LOCK_TIME)) {
                    lastWithdrawalRegularAccount[_sender] = globalLockExpirationDateRegularAccount - TIME_BETWEEN_WITHDRAWALS;
                } else {
                    // Check if the current lock time is less than the new proposed lock time.
                    if (lastWithdrawalRegularAccount[_sender] < block.timestamp - TIME_BETWEEN_WITHDRAWALS + OLD_USER_LOCK_TIME) {
                        lastWithdrawalRegularAccount[_sender] = block.timestamp - TIME_BETWEEN_WITHDRAWALS + OLD_USER_LOCK_TIME;
                    }
                }
            } else {
                // For new users, set a 70-day wait before the user can withdraw.
                if (block.timestamp < (globalLockExpirationDateRegularAccount - NEW_USER_LOCK_TIME)) {
                    lastWithdrawalRegularAccount[_sender] = globalLockExpirationDateRegularAccount - TIME_BETWEEN_WITHDRAWALS;
                } else {
                    lastWithdrawalRegularAccount[_sender] = block.timestamp - TIME_BETWEEN_WITHDRAWALS + NEW_USER_LOCK_TIME;
                }
            }


            
                // If sender is not this contract, meaning a normal user initiates timelock, then calculate and send Timelock Rewards
                if (_sender != address(this)) {
                    calculateAndSendRewardsAfterTimelock(_sender, _adjustedValue);
                }
        }

// Used in receiveApproval: Calculate and send rewards
        function calculateAndSendRewardsAfterTimelock(address user, uint256 amountTimelocked) internal {
            require(amountTimelocked <= MAX_TIMELOCK_AMOUNT, "Cannot timelock more than 145,000 tokens in a single transaction");

            // Read balances and totals once and create temporary variables in memory
            uint256 totalRewards = totalRewardsEarned;
            uint256 currentTier = currentGlobalTier;
            uint256 totalCumulative = totalCumulativeTimelocked;

            // Update balances and totals in memory
            totalCumulative += amountTimelocked;
            
            // Update totals to storage
            totalCumulativeTimelocked = totalCumulative;

                // If total rewards earned has reached 300,000 tokens, no more rewards will be calculated or sent
                if (totalRewards >= TOTAL_REWARDS_SEEDED) {
                    return;
                }

            uint256 newlyEarnedRewards = 0;
            uint256 nextTierThreshold = currentTier * NEXT_TIER_THRESHOLD;
                    
                    // Check if total cumulative timelocked amount is below the threshold for the next tier or if the current tier is the highest (tier 10)
                if (totalCumulative < nextTierThreshold || currentTier == 10) {
                    uint256 rewardRatio = getRewardRatioForTier(currentTier);
                    newlyEarnedRewards = amountTimelocked * rewardRatio / TOKEN_PRECISION;
                } else {
                    
                    // Calculate rewards for the current tier and adjust for any amount that exceeds the current tier threshold
                    uint256 amountInCurrentTier = nextTierThreshold - (totalCumulative - amountTimelocked);
                    uint256 rewardRatioCurrent = getRewardRatioForTier(currentTier);
                    newlyEarnedRewards = amountInCurrentTier * rewardRatioCurrent / TOKEN_PRECISION;
                    
                    // Move to the next tier and calculate rewards for the remaining amount in the next tier
                    currentGlobalTier++;
                    uint256 amountInNextTier = amountTimelocked - amountInCurrentTier;
                    uint256 rewardRatioNext = getRewardRatioForTier(currentGlobalTier);
                    newlyEarnedRewards += amountInNextTier * rewardRatioNext / TOKEN_PRECISION;

                }
                    // Ensure that total rewards earned does not exceed 300,000 tokens
                if (totalRewards + newlyEarnedRewards > TOTAL_REWARDS_SEEDED) {
                newlyEarnedRewards = TOTAL_REWARDS_SEEDED - totalRewards;
                }

            // Update totals
            totalRewardsEarned += newlyEarnedRewards;

            // Send earned rewards to user's Incoming Account and deduct from Rewards Reserve
            balanceRegularAccount[address(this)] -= newlyEarnedRewards;
            balanceUntakenIncomingAccount[user] += newlyEarnedRewards;
            
                emit EarnedReward(address(this), user, newlyEarnedRewards);
        }
        
// Send locked tokens to a single address
        function sendLockedTokensToSingle(address _receiver, uint256 _amount) public nonReentrant {
            uint256 senderBalance = balanceRegularAccount[msg.sender];
            require(senderBalance >= _amount, "Insufficient timelocked balance. You have to timelock tokens before sending timelocked tokens.");

            // Update the sender's balance
            balanceRegularAccount[msg.sender] = senderBalance - _amount;

            // Update the receiver's balance
            balanceUntakenIncomingAccount[_receiver] += _amount;

            // Emit an event for the locked token transfer
            emit SentLockedTokensToSingle(msg.sender, _receiver, _amount);
        }

// Send locked tokens to several addresses
        function sendLockedTokensToMany(address[] memory _receivers, uint256[] memory _amounts) public nonReentrant {
            require(_receivers.length == _amounts.length, "Mismatched array lengths");

            uint256 length = _amounts.length;
            uint256 totalAmount = 0;

            // Use an array to track unique receivers and amounts
            address[] memory uniqueReceivers = new address[](length);
            uint256[] memory receiverAmounts = new uint256[](length);
            uint256 uniqueCount = 0;

            for (uint256 i = 0; i < length; i++) {
                address receiver = _receivers[i];
                uint256 amount = _amounts[i];
                totalAmount += amount;

                bool found = false;
                for (uint256 j = 0; j < uniqueCount; j++) {
                    if (uniqueReceivers[j] == receiver) {
                        receiverAmounts[j] += amount;
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    uniqueReceivers[uniqueCount] = receiver;
                    receiverAmounts[uniqueCount] = amount;
                    uniqueCount++;
                }
            }

            uint256 senderBalance = balanceRegularAccount[msg.sender];
            require(senderBalance >= totalAmount, "Insufficient timelocked balance. You have to timelock tokens before sending timelocked tokens.");
            balanceRegularAccount[msg.sender] -= totalAmount;

            // Write the accumulated amounts to storage
            for (uint256 i = 0; i < uniqueCount; i++) {
                address receiver = uniqueReceivers[i];
                balanceUntakenIncomingAccount[receiver] += receiverAmounts[i];
            }

            // Emit a single event with all receivers and amounts
            emit SentLockedTokensToMany(msg.sender, _receivers, _amounts);
        }

// Accept locked tokens that have been sent from other users, or received as rewards
        function acceptUntakenIncomingTokens() public nonReentrant {
            require(balanceUntakenIncomingAccount[msg.sender] > 0, "You have no Incoming Tokens to accept!");

            uint256 incomingTokensAmount = balanceUntakenIncomingAccount[msg.sender];
            balanceIncomingAccount[msg.sender] += incomingTokensAmount;
            uint256 globalLockMinusIncomingReset = globalLockExpirationDateRegularAccount - RESET_TIME_LEFT_INCOMING_ACCOUNT;

            // Set the lock time of IncomingAccount based on the Global Lock Time, if the Global Lock Time has not expired yet
            if (block.timestamp < globalLockMinusIncomingReset) {
                lockExpirationForUserIncomingAccount[msg.sender] = globalLockExpirationDateRegularAccount;
                lastWithdrawalIncomingAccount[msg.sender] = globalLockExpirationDateRegularAccount - TIME_BETWEEN_WITHDRAWALS;
            } else {
                lockExpirationForUserIncomingAccount[msg.sender] = block.timestamp + RESET_TIME_LEFT_INCOMING_ACCOUNT;
                lastWithdrawalIncomingAccount[msg.sender] = block.timestamp  + RESET_TIME_LEFT_INCOMING_ACCOUNT - TIME_BETWEEN_WITHDRAWALS;
            }

            // Reset the untaken incoming balance
            delete balanceUntakenIncomingAccount[msg.sender];
            
            emit AcceptedUntakenIncomingTokens(msg.sender, incomingTokensAmount);
        }

// Withdrawal functions - Enforce a set withdrawal rate
        function withdrawFromRegularAccount(uint256 _amount) public nonReentrant {
            require(_amount > 0, "Withdraw amount must be greater than zero");
            require(block.timestamp >= globalLockExpirationDateRegularAccount, "Tokens are locked! Global Lock Time has not expired yet!");

            uint256 senderBalance = balanceRegularAccount[msg.sender];
            require(senderBalance >= _amount, "Insufficient timelocked balance for withdrawal");

            uint256 lastWithdrawal = lastWithdrawalRegularAccount[msg.sender];
            uint256 maxWithdrawable = calculateMaxWithdrawable(lastWithdrawal, globalLockExpirationDateRegularAccount);
            require(_amount <= maxWithdrawable, "Exceeds max allowable withdrawal amount based on elapsed time");

            balanceRegularAccount[msg.sender] = senderBalance - _amount;
            totalCurrentlyTimelocked -= _amount;
            lastWithdrawalRegularAccount[msg.sender] = block.timestamp;

            require(ERC20Interface(tokenContract).transfer(msg.sender, _amount), "Withdrawal: Transfer failed");
            emit TokenWithdrawalRegularAccount(msg.sender, _amount, block.timestamp);
        }

        function withdrawFromIncomingAccount(uint256 _amount) public nonReentrant {
            require(_amount > 0, "Withdraw amount must be greater than zero");
            require(block.timestamp >= lockExpirationForUserIncomingAccount[msg.sender], "Tokens are locked! Lock Time has not expired yet!");

            uint256 senderBalance = balanceIncomingAccount[msg.sender];
            require(senderBalance >= _amount, "Insufficient timelocked balance for withdrawal");

            uint256 lastWithdrawal = lastWithdrawalIncomingAccount[msg.sender];
            uint256 maxWithdrawable = calculateMaxWithdrawable(lastWithdrawal, lockExpirationForUserIncomingAccount[msg.sender]);
            require(_amount <= maxWithdrawable, "Exceeds max allowable withdrawal amount based on elapsed time");

            balanceIncomingAccount[msg.sender] = senderBalance - _amount;
            totalCurrentlyTimelocked -= _amount; 
            lastWithdrawalIncomingAccount[msg.sender] = block.timestamp;

            require(ERC20Interface(tokenContract).transfer(msg.sender, _amount), "Withdrawal: Transfer failed");
            emit TokenWithdrawalIncomingAccount(msg.sender, _amount, block.timestamp);
        }

// Withdraw maxWithdrawable from both RegularAccount and IncomingAccount in a single transaction.
        function withdrawAll() public nonReentrant {

            // Ensure that at least one of the accounts are unlocked before proceeding
            require(block.timestamp >= globalLockExpirationDateRegularAccount || block.timestamp >= lockExpirationForUserIncomingAccount[msg.sender], "Tokens are locked! Lock Time has not expired yet!");

            // Calculate max withdrawable amounts from both accounts using the calculateMaxWithdrawable function
            uint256 maxWithdrawableFromRegular = block.timestamp >= globalLockExpirationDateRegularAccount ? calculateMaxWithdrawable(lastWithdrawalRegularAccount[msg.sender], globalLockExpirationDateRegularAccount) : 0;
            uint256 maxWithdrawableFromIncoming = block.timestamp >= lockExpirationForUserIncomingAccount[msg.sender] ? calculateMaxWithdrawable(lastWithdrawalIncomingAccount[msg.sender], lockExpirationForUserIncomingAccount[msg.sender]) : 0;

            uint256 regularBalance = balanceRegularAccount[msg.sender];
            uint256 incomingBalance = balanceIncomingAccount[msg.sender];

            uint256 amountToWithdrawFromRegular = maxWithdrawableFromRegular > regularBalance ? regularBalance : maxWithdrawableFromRegular;
            uint256 amountToWithdrawFromIncoming = maxWithdrawableFromIncoming > incomingBalance ? incomingBalance : maxWithdrawableFromIncoming;

            // Ensure there is something to withdraw
            require(amountToWithdrawFromRegular > 0 || amountToWithdrawFromIncoming > 0, "No withdrawable tokens available");

            // If the accounts have anything to withdraw, then update balances and total currently timelocked tokens and then transfer 
            if (amountToWithdrawFromRegular > 0) {
                balanceRegularAccount[msg.sender] -= amountToWithdrawFromRegular;
                lastWithdrawalRegularAccount[msg.sender] = block.timestamp;
                totalCurrentlyTimelocked -= amountToWithdrawFromRegular;
                require(ERC20Interface(tokenContract).transfer(msg.sender, amountToWithdrawFromRegular), "Withdrawal from regular account: Transfer failed");
                emit TokenWithdrawalRegularAccount(msg.sender, amountToWithdrawFromRegular, block.timestamp);
            }

            if (amountToWithdrawFromIncoming > 0) {
                balanceIncomingAccount[msg.sender] -= amountToWithdrawFromIncoming;
                lastWithdrawalIncomingAccount[msg.sender] = block.timestamp;
                totalCurrentlyTimelocked -= amountToWithdrawFromIncoming;
                require(ERC20Interface(tokenContract).transfer(msg.sender, amountToWithdrawFromIncoming), "Withdrawal from incoming account: Transfer failed");
                emit TokenWithdrawalIncomingAccount(msg.sender, amountToWithdrawFromIncoming, block.timestamp);
            }
        }

// Let the user accumulate a withdrawal amount for a set amount of periods, so that they do not need to waste gas on too many transactions.
        function calculateMaxWithdrawable(uint256 lastWithdrawalTime, uint256 lockExpirationTime) internal view returns (uint256) {
            if (block.timestamp < lockExpirationTime) {
                return 0;
            }
            if (block.timestamp < lastWithdrawalTime + TIME_BETWEEN_WITHDRAWALS) {
                return 0; // If it's not yet time for the next withdrawal, return 0
            }
            uint256 elapsedWithdrawalPeriods = (block.timestamp - lastWithdrawalTime) / TIME_BETWEEN_WITHDRAWALS;
            if (elapsedWithdrawalPeriods > MAX_WITHDRAWAL_PERIODS) {
                elapsedWithdrawalPeriods = MAX_WITHDRAWAL_PERIODS;
            }
            return elapsedWithdrawalPeriods * periodWithdrawalAmount; // Calculate the max amount based on the number of withdrawal periods elapsed
        }

// After the Global globalLockExpirationDateRegularAccount is over, then start 1500 day countdown to halve the weekly periodWithdrawalAmount
        function newWithdrawalHalving() public {
            require(block.timestamp >= globalLockExpirationDateRegularAccount, "Global lock expiration has not been reached");
            require(withdrawalHalvingEra < MAX_WITHDRAWAL_HALVING_ERAS, "Max halving eras reached");
            require(block.timestamp >= lastWithdrawalHalving + WITHDRAWAL_HALVING_ERA_DURATION, "Halving era duration has not elapsed");

            periodWithdrawalAmount /= 2; // Halve the withdrawal amount
            lastWithdrawalHalving = block.timestamp; // Update the last halving timestamp
            withdrawalHalvingEra += 1; // Increment the halving era
            emit NewWithdrawalHalving (withdrawalHalvingEra, block.timestamp);
        }

// If a user needs to change the ownership of their account to another address, they can do so, using this function.
// E.g. this can be used if you wish to move your account to a cold wallet, or a future contract, or another person.
        function migrateAccount(address _receiver) public nonReentrant {
            
            // Require the receiver to be a new account without any history with SovCube
            require(_receiver != address(0), "Invalid address");
            require(balanceRegularAccount[_receiver] == 0, "The receiver account is not fresh");
            require(balanceIncomingAccount[_receiver] == 0, "The receiver account is not fresh");
            require(balanceUntakenIncomingAccount[_receiver] == 0, "The receiver account is not fresh");
            require(lastWithdrawalRegularAccount[_receiver] == 0, "The receiver account is not fresh");
            require(lockExpirationForUserIncomingAccount[_receiver] == 0, "The receiver account is not fresh");
            require(lastWithdrawalIncomingAccount[_receiver] == 0, "The receiver account is not fresh");

            // Transfer balance and lastWithdrawal from Regular Account
            balanceRegularAccount[_receiver] = balanceRegularAccount[msg.sender];
            balanceRegularAccount[msg.sender] = 0;

            lastWithdrawalRegularAccount[_receiver] = lastWithdrawalRegularAccount[msg.sender];
            lastWithdrawalRegularAccount[msg.sender] = 0;

            // Transfer balance, lockExpiration, lastWithdrawal and untakenBalance from Incoming Account
            lockExpirationForUserIncomingAccount[_receiver] = lockExpirationForUserIncomingAccount[msg.sender];
            lockExpirationForUserIncomingAccount[msg.sender] = 0;

            balanceIncomingAccount[_receiver] = balanceIncomingAccount[msg.sender];
            balanceIncomingAccount[msg.sender] = 0;

            lastWithdrawalIncomingAccount[_receiver] = lastWithdrawalIncomingAccount[msg.sender];
            lastWithdrawalIncomingAccount[msg.sender] = 0;

            balanceUntakenIncomingAccount[_receiver] = balanceUntakenIncomingAccount[msg.sender];
            balanceUntakenIncomingAccount[msg.sender] = 0;

            emit AccountMigration(msg.sender, _receiver);
        }

//
//
// Get-functions to retrieve essential data about users and stats.
//
//

// Get the timestamp of the next withdrawal halving
        function getTimestampOfNextWithdrawalHalving() public view returns (uint256) {
            if (block.timestamp < globalLockExpirationDateRegularAccount) {
                // Global lock expiration has not been reached
                // Return the timestamp when the global lock will expire plus the first halving duration
                return globalLockExpirationDateRegularAccount + WITHDRAWAL_HALVING_ERA_DURATION;
            }
            
            require(withdrawalHalvingEra < MAX_WITHDRAWAL_HALVING_ERAS, "All halving eras have been completed");
            
            uint256 nextHalvingTimestamp = lastWithdrawalHalving + WITHDRAWAL_HALVING_ERA_DURATION;
            
            if (block.timestamp >= nextHalvingTimestamp) {
                return block.timestamp; // The next halving can be performed immediately
            }
            
            return nextHalvingTimestamp; // Return the timestamp of the next halving
        }

// Get the amount of tokens unlocked for withdrawal to Regular Account
        function getUnlockedForWithdrawalRegularAccount(address user) public view returns (uint256) {
            uint256 balance = balanceRegularAccount[user];
            if (balance == 0) {
                return 0;
            }
            uint256 maxWithdrawable = calculateMaxWithdrawable(lastWithdrawalRegularAccount[user], globalLockExpirationDateRegularAccount);
            return balance < maxWithdrawable ? balance : maxWithdrawable;
        }

// Get the amount of tokens unlocked for withdrawal to Incoming Account
        function getUnlockedForWithdrawalIncomingAccount(address user) public view returns (uint256) {
            uint256 balance = balanceIncomingAccount[user];
            if (balance == 0) {
                return 0;
            }
            uint256 maxWithdrawable = calculateMaxWithdrawable(lastWithdrawalIncomingAccount[user], lockExpirationForUserIncomingAccount[user]);
            return balance < maxWithdrawable ? balance : maxWithdrawable;
        }

// Get amount of tokens timelocked in Regular Account
        function getBalanceRegularAccount(address _addr) public view returns (uint256 _balance) {
            return balanceRegularAccount[_addr];
        }

// Get amount of pending tokens in the Untaken Incoming Tokens Account
        function getBalanceUntakenIncomingAccount(address _user) public view returns (uint256) {
            return balanceUntakenIncomingAccount[_user];
        }

// Get amount of timelocked tokens in the Incoming Account
        function getBalanceIncomingAccount(address _addr) public view returns (uint256 _balance) {
            return balanceIncomingAccount[_addr];
        }

// Get the timestamp of the last withdrawal of Incoming Account
        function getLastWithdrawalIncomingAccount(address _addr) public view returns (uint256 _lastWithdrawalTime) {
            return lastWithdrawalIncomingAccount[_addr];
        }

// Get the timestamp of the last withdrawal of Regular Account
        function getLastWithdrawalRegularAccount(address _addr) public view returns (uint256 _lastWithdrawal) {
            return lastWithdrawalRegularAccount[_addr];
        }

// Get the timestamp of the next withdrawal, or accumulation of withdrawals to the Incoming Account
        function getNextWithdrawalIncomingAccount(address _addr) public view returns (uint256 _nextWithdrawalTime) {
            uint256 lastWithdrawal = lastWithdrawalIncomingAccount[_addr];
            uint256 lockExpiration = lockExpirationForUserIncomingAccount[_addr];

            // If the lock time is still active, return the lock expiration time
            if (block.timestamp < lockExpiration) {
                return lockExpiration;
            }

            if (lastWithdrawal == 0) {
                return 0;
            }
            if (block.timestamp < lastWithdrawal + TIME_BETWEEN_WITHDRAWALS) {
                return lastWithdrawal + TIME_BETWEEN_WITHDRAWALS;
            } else {
                uint256 elapsedWithdrawalPeriods = (block.timestamp - lastWithdrawal) / TIME_BETWEEN_WITHDRAWALS;
                if (elapsedWithdrawalPeriods >= MAX_WITHDRAWAL_PERIODS) {
                    return block.timestamp;
                } else {
                    return lastWithdrawal + ((elapsedWithdrawalPeriods + 1) * TIME_BETWEEN_WITHDRAWALS);
                }
            }
        }

// Get the timestamp of the next withdrawal, or accumulation of withdrawals to the Regular Account
        function getNextWithdrawalRegularAccount(address _addr) public view returns (uint256 _nextWithdrawalTime) {
            uint256 lastWithdrawal = lastWithdrawalRegularAccount[_addr];
            uint256 lockExpiration = globalLockExpirationDateRegularAccount;

            if (block.timestamp < lockExpiration) {
                // If global lock is still in effect, return both the lock expiration time and next possible withdrawal time.
                uint256 nextWithdrawalTime = lastWithdrawal == 0 ? 0 : lastWithdrawal + TIME_BETWEEN_WITHDRAWALS;
                if (nextWithdrawalTime > lockExpiration) {
                    return nextWithdrawalTime;
                } else {
                    return lockExpiration;
                }
            }

            if (lastWithdrawal == 0) {
                return 0;
            }

            if (block.timestamp < lastWithdrawal + TIME_BETWEEN_WITHDRAWALS) {
                return lastWithdrawal + TIME_BETWEEN_WITHDRAWALS;
            } else {
                uint256 elapsedWithdrawalPeriods = (block.timestamp - lastWithdrawal) / TIME_BETWEEN_WITHDRAWALS;
                if (elapsedWithdrawalPeriods >= MAX_WITHDRAWAL_PERIODS) {
                    return block.timestamp;
                } else {
                    return lastWithdrawal + ((elapsedWithdrawalPeriods + 1) * TIME_BETWEEN_WITHDRAWALS);
                }
            }
        }

// Get the time left until the Global Lock Time of all Regular Accounts expire.
        function getGlobalTimeLeftRegularAccount() public view returns (uint256 _timeLeft) {
            require(globalLockExpirationDateRegularAccount > block.timestamp, "Tokens are unlocked and ready for withdrawal");
            return globalLockExpirationDateRegularAccount - block.timestamp;
        }

// Get the time left until the Lock Time of individual Incoming Accounts expire.
        function getTimeLeftIncomingAccount(address _addr) public view returns (uint256 _timeLeft) {
            if (lockExpirationForUserIncomingAccount[_addr] <= block.timestamp) {
                return 0;
            } else {
                return lockExpirationForUserIncomingAccount[_addr] - block.timestamp;
            }
        }



    }
