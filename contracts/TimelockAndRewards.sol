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
// This contract timelocks BSOV Tokens for 1000 days from the day the contract is deployed.
// Tokens can be timelocked within that period without resetting the timer.
// The timelocked tokens will be sent to the user's "Regular Account"
//
// Once the users have timelocked their tokens, they are able to send locked tokens to anyone,
// they can even batch several addresses and amounts into one "SendLockedTokens" transaction. 
// If you receive timelocked tokens from someone, they will be sent to your "Untaken Incoming Balance".
// If you accept the incoming tokens using the "acceptUntakenIncomingTokens" method, the Lock Time of your Incoming Tokens Account will reset to 1000 days.
//
// After the globalLockExpirationDateRegularAccount is reached, users can withdraw tokens with a rate limit to prevent all holders
// from withdrawing and selling at the same time. The limit is 100 BSoV per week per user once the 1000 days is hit.

/*
The additional function of this smart-contract is to act as a Timelock Rewards reserve/treasury and distributor of timelocked tokens to users to timelock their BSOV Tokens.
It interacts with a timelocking contract (timelockContract).
https://SovCube.com

*/


   import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/utils/ReentrancyGuard.sol";

// Defines the interface of the BSOV Token contract
    abstract contract ERC20Interface {
        function transfer(address to, uint tokens) public virtual returns(bool success);
        function transferFrom(address from, address to, uint tokens) public virtual returns(bool success);
        function approve(address spender, uint tokens) public virtual returns(bool success);
        function approveAndCall(address spender, uint tokens, bytes memory data) public virtual returns(bool success);
        event Transfer(address indexed from, address indexed to, uint tokens);
        event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    }

    contract TimelockAndRewardsContract is ReentrancyGuard {
        
        ERC20Interface tokenContract;

// Customizable constants if you ever wish to deploy this contract with different parameters
        uint constant TOKEN_PRECISION = 100000000; // Number of decimals in BSOV Token (8)
        uint constant setGlobalLockExpirationRegularAccounts = 1000 days; // A global countdown that unlocks timelocked tokens in all user's Regular Accounts when it expires. 
        uint constant maxWithdrawalPeriods = 10; // The user can accumulate withdrawals for a maximum number of periods.
        uint constant timeBetweenWithdrawals = 7 days; // The user has to wait this amount of time to withdraw periodWithdrawalAmount
        uint constant resetTimeLeftIncomingAccount = 1000 days; // Whenever a user takes untaken incoming tokens, the timer will reset to this amount of time.
        uint constant withdrawalHalvingEraDuration = 1000 days; // Amount of days until the periodWithdrawalAmount halves - only happens after the inital lockExpiration.
        uint constant maxWithdrawalHalvingEras = 10; // Max amount of withdrawal halving eras
        uint constant newUserLockTime = 10 weeks; // Set the duration that new timelockers need to wait before withdrawing their tokens. To penalize multiple wallets. 
        uint constant oldUserLockTime = 7 days; // Set the duration that old timelockers need to wait before withdrawing their tokens, if they decide to timelock again. - To prevent immediate withdrawal.
        uint globalLockExpirationDateRegularAccount;
        
// Set in the constructor - The user can withdraw this amount of tokens per withdrawal period.
        uint public periodWithdrawalAmount; 

// Withdrawal halving variables
        uint public lastWithdrawalHalving;
        uint public withdrawalHalvingEra;

// Stats that apply to totals and globals
        uint public currentGlobalTier; // The current global tier. The reward ratio for each tier is defined in getRewardRatioForTier.
        uint public totalCumulativeTimelocked; // Amount of tokens that have ever been timelocked, disregarding withdrawals.
        uint public totalCurrentlyTimelocked; // Amount of tokens that are currently timelocked
        uint public totalRewardsEarned; // Total amount of rewards that have been earned across all users.
        uint public deploymentTimestamp; // Timestamp created the day of contract deployment
        

// Address of the owner/contract deployer - Supposed to become the burn address (0x0000...) after owner revokes ownership.
        address public owner;
        
// Mappings for Regular Accounts        
        mapping(address => uint) balanceRegularAccount;
        mapping(address => uint) lastWithdrawalRegularAccount;

// Mappings for Incoming Accounts
        mapping(address => uint) lockExpirationForUserIncomingAccount;
        mapping(address => uint) balanceIncomingAccount;
        mapping(address => uint) lastWithdrawalIncomingAccount;
        mapping(address => uint) balanceUntakenIncomingAccount;

// Events
        event SentLockedTokensToSingle(address indexed from, address indexed to, uint256 amount);
        event SentLockedTokensToMany(address indexed from, address[] receivers, uint[] amounts);
        event EarnedReward(address indexed from, address indexed to, uint256 amount);
        event AcceptedUntakenIncomingTokens(address indexed to, uint256 amount);
        event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
        event TokenTimelock(address indexed addr, uint256 amt, uint256 time);
        event TokenWithdrawalRegularAccount(address indexed addr, uint256 amt, uint256 time);
        event TokenWithdrawalIncomingAccount(address indexed addr, uint256 amt, uint256 time);
        event NewWithdrawalHalving(uint256 era, uint256 time);

// When deploying this contract, you will need to input the BSOV Token contract address.
        constructor(address _tokenContractAddress) {
            tokenContract = ERC20Interface(_tokenContractAddress); // Input address of BSOV Token contract
            owner = msg.sender; // Set owner
            globalLockExpirationDateRegularAccount = (block.timestamp + setGlobalLockExpirationRegularAccounts); // Initialize initial lock period of all RegularAccounts
            currentGlobalTier = 1; // Set the global tier to 1
            deploymentTimestamp = block.timestamp; // Initialize the deployment timestamp
            
            // Set the first withdrawal amount, which will halve every 1000 days after globalLockExpirationDateRegularAccount has expired
            periodWithdrawalAmount = 100 * TOKEN_PRECISION; // 100 BSOV Tokens
            
            lastWithdrawalHalving = globalLockExpirationDateRegularAccount; // Initialize the last halving timestamp
            withdrawalHalvingEra = 1; // Initialize the halving era
        }

        modifier onlyOwner() {
            require(msg.sender == owner, "Not owner");
            _;
        }

// This function "seeds" the 300,000 tokens that are reserved for the Timelock Rewards.
// First the owner needs to transfer at least 30609121600000 tokens to this contract, then he can call this function.
        function ownerSeedContract() public onlyOwner {
            require(tokenContract.approveAndCall(address(this), 30303030384000, "0x"), "Token approval failed");
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

        // If sender has not withdrawn yet, meaning is a new user, then set a 10 week wait before the user can withdraw.
        if (lastWithdrawalRegularAccount[_sender] == 0) {
            lastWithdrawalRegularAccount[_sender] = block.timestamp + newUserLockTime;
        } else {
            // For old users, ensure there's at least a 1 week lock from now
            if (lastWithdrawalRegularAccount[_sender] < block.timestamp + oldUserLockTime) {
                lastWithdrawalRegularAccount[_sender] = block.timestamp + oldUserLockTime;
            }
        }
            
                // If sender is not this contract, meaning a normal user initiates timelock, then calculate and send Timelock Rewards
                if (_sender != address(this)) {
                    calculateAndSendRewardsAfterTimelock(_sender, _adjustedValue);
                }
        }

// Used in receiveApproval: Calculate and send rewards
        function calculateAndSendRewardsAfterTimelock(address user, uint256 amountTimelocked) internal {
            require(amountTimelocked <= 14500000000000, "Cannot timelock more than 145,000 tokens at once");

            // Read balances and totals once and create temporary variables in memory
            uint256 totalRewards = totalRewardsEarned;
            uint256 currentTier = currentGlobalTier;
            uint256 totalCumulative = totalCumulativeTimelocked;

            // Update balances and totals in memory
            totalCumulative += amountTimelocked;
            
            // Update totals to storage
            totalCumulativeTimelocked = totalCumulative;

                // If total rewards earned has reached 300,000 tokens, no more rewards will be calculated or sent
                if (totalRewards >= 30000000000000) {
                    return;
                }

            uint256 newlyEarnedRewards = 0;
            uint256 nextTierThreshold = currentTier * 15000000000000;
                    
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
                if (totalRewards + newlyEarnedRewards > 30000000000000) {
                newlyEarnedRewards = 30000000000000 - totalRewards;
                }

            // Update totals
            totalRewardsEarned += newlyEarnedRewards;

            // Send earned rewards to user's Incoming Account and deduct from Rewards Reserve
            balanceRegularAccount[address(this)] -= newlyEarnedRewards;
            balanceUntakenIncomingAccount[user] += newlyEarnedRewards;
            
                emit EarnedReward(address(this), user, newlyEarnedRewards);
        }
        

    // Send locked tokens to a single address
    function sendLockedTokensToSingle(address _receiver, uint _amount) public nonReentrant {
        uint senderBalance = balanceRegularAccount[msg.sender];
        require(senderBalance >= _amount, "Insufficient timelocked balance. You have to timelock tokens before sending timelocked tokens.");

        // Update the sender's balance
        balanceRegularAccount[msg.sender] = senderBalance - _amount;

        // Update the receiver's balance
        balanceUntakenIncomingAccount[_receiver] += _amount;

        // Emit an event for the locked token transfer
        emit SentLockedTokensToSingle(msg.sender, _receiver, _amount);
    }

// Send locked tokens to several addresses
        function sendLockedTokensToMany(address[] memory _receivers, uint[] memory _amounts) public nonReentrant {
            require(_receivers.length == _amounts.length, "Mismatched array lengths");

            uint length = _amounts.length;
            uint totalAmount = 0;

            // Use an array to track unique receivers and amounts
            address[] memory uniqueReceivers = new address[](length);
            uint[] memory receiverAmounts = new uint[](length);
            uint uniqueCount = 0;

            for (uint i = 0; i < length; i++) {
                address receiver = _receivers[i];
                uint amount = _amounts[i];
                totalAmount += amount;

                bool found = false;
                for (uint j = 0; j < uniqueCount; j++) {
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

            uint senderBalance = balanceRegularAccount[msg.sender];
            require(senderBalance >= totalAmount, "Insufficient timelocked balance. You have to timelock tokens before sending timelocked tokens.");
            balanceRegularAccount[msg.sender] -= totalAmount;

            // Write the accumulated amounts to storage
            for (uint i = 0; i < uniqueCount; i++) {
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
            lockExpirationForUserIncomingAccount[msg.sender] = block.timestamp + resetTimeLeftIncomingAccount;

            // Update the last withdrawal timestamp for incoming account
            lastWithdrawalIncomingAccount[msg.sender] = block.timestamp;

            delete balanceUntakenIncomingAccount[msg.sender];
            emit AcceptedUntakenIncomingTokens(msg.sender, incomingTokensAmount);
    }


// Withdrawal functions - Enforce a set withdrawal rate
        function withdrawFromRegularAccount(uint _amount) public nonReentrant {
            require(_amount > 0, "Withdraw amount must be greater than zero");
            require(block.timestamp >= globalLockExpirationDateRegularAccount, "Tokens are locked!");

            uint senderBalance = balanceRegularAccount[msg.sender];
            require(senderBalance >= _amount, "Insufficient timelocked balance for withdrawal");

            uint lastWithdrawal = lastWithdrawalRegularAccount[msg.sender];
            uint maxWithdrawable = calculateMaxWithdrawable(lastWithdrawal);
            require(_amount <= maxWithdrawable, "Exceeds max allowable withdrawal amount based on elapsed time");

            balanceRegularAccount[msg.sender] = senderBalance - _amount;
            totalCurrentlyTimelocked -= _amount;
            lastWithdrawalRegularAccount[msg.sender] = block.timestamp;

            require(ERC20Interface(tokenContract).transfer(msg.sender, _amount), "Withdrawal: Transfer failed");
            emit TokenWithdrawalRegularAccount(msg.sender, _amount, block.timestamp);
        }

        function withdrawFromIncomingAccount(uint _amount) public nonReentrant {
            require(_amount > 0, "Withdraw amount must be greater than zero");
            require(block.timestamp >= lockExpirationForUserIncomingAccount[msg.sender], "Tokens are locked!");

            uint senderBalance = balanceIncomingAccount[msg.sender];
            require(senderBalance >= _amount, "Insufficient timelocked balance for withdrawal");

            uint lastWithdrawal = lastWithdrawalIncomingAccount[msg.sender];
            uint maxWithdrawable = calculateMaxWithdrawable(lastWithdrawal);
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
            require(block.timestamp >= globalLockExpirationDateRegularAccount || block.timestamp >= lockExpirationForUserIncomingAccount[msg.sender], "Tokens are locked!");

            // Calculate max withdrawable amounts from both accounts using the calculateMaxWithdrawable function
            uint maxWithdrawableFromRegular = block.timestamp >= globalLockExpirationDateRegularAccount ? calculateMaxWithdrawable(lastWithdrawalRegularAccount[msg.sender]) : 0;
            uint maxWithdrawableFromIncoming = block.timestamp >= lockExpirationForUserIncomingAccount[msg.sender] ? calculateMaxWithdrawable(lastWithdrawalIncomingAccount[msg.sender]) : 0;

            uint regularBalance = balanceRegularAccount[msg.sender];
            uint incomingBalance = balanceIncomingAccount[msg.sender];

            uint amountToWithdrawFromRegular = maxWithdrawableFromRegular > regularBalance ? regularBalance : maxWithdrawableFromRegular;
            uint amountToWithdrawFromIncoming = maxWithdrawableFromIncoming > incomingBalance ? incomingBalance : maxWithdrawableFromIncoming;

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
        function calculateMaxWithdrawable(uint lastWithdrawalTime) internal view returns (uint) {
            if (block.timestamp < lastWithdrawalTime + timeBetweenWithdrawals) {
                return 0; // If it's not yet time for the next withdrawal, return 0
            }
            uint elapsedWithdrawalPeriods = (block.timestamp - lastWithdrawalTime) / timeBetweenWithdrawals;
            if (elapsedWithdrawalPeriods > maxWithdrawalPeriods) {
                elapsedWithdrawalPeriods = maxWithdrawalPeriods;
            }
            return elapsedWithdrawalPeriods * periodWithdrawalAmount; // Calculate the max amount based on the number of withdrawal periods elapsed
        }

// After the Global globalLockExpirationDateRegularAccount is over, then start 1000 day countdown to halve the weekly periodWithdrawalAmount
        function newWithdrawalHalving() public {
            require(block.timestamp >= globalLockExpirationDateRegularAccount, "Global lock expiration has not been reached");
            require(withdrawalHalvingEra <= maxWithdrawalHalvingEras, "Max halving eras reached");
            require(block.timestamp >= lastWithdrawalHalving + withdrawalHalvingEraDuration, "Halving era duration has not elapsed");

            periodWithdrawalAmount /= 2; // Halve the withdrawal amount
            lastWithdrawalHalving = block.timestamp; // Update the last halving timestamp
            withdrawalHalvingEra += 1; // Increment the halving era
            emit NewWithdrawalHalving (withdrawalHalvingEra, block.timestamp);
        }


// Get-functions to retrieve essential data about users and stats.

	// Get the timestamp of the next withdrawal halving
        function getTimestampOfNextWithdrawalHalving() public view returns (uint256) {
            
            if (block.timestamp < globalLockExpirationDateRegularAccount) {
                return 0; // Global lock expiration has not been reached
            }
            
            if (withdrawalHalvingEra > maxWithdrawalHalvingEras) {
                return 0; // All halving eras have been completed
            }
            
            uint256 nextHalvingTimestamp = lastWithdrawalHalving + withdrawalHalvingEraDuration;
            
            if (block.timestamp >= nextHalvingTimestamp) {
                return block.timestamp; // The next halving can be performed immediately
            }
            
            return nextHalvingTimestamp; // Return the timestamp of the next halving
        }

        function getUnlockedForWithdrawalRegularAccount(address user) public view returns (uint) {
            uint balance = balanceRegularAccount[user];
            if (balance == 0) {
                return 0;
            }
            uint maxWithdrawable = calculateMaxWithdrawable(lastWithdrawalRegularAccount[user]);
            return balance < maxWithdrawable ? balance : maxWithdrawable;
        }

        function getUnlockedForWithdrawalIncomingAccount(address user) public view returns (uint) {
            uint balance = balanceIncomingAccount[user];
            if (balance == 0) {
                return 0;
            }
            uint maxWithdrawable = calculateMaxWithdrawable(lastWithdrawalIncomingAccount[user]);
            return balance < maxWithdrawable ? balance : maxWithdrawable;
        }

        function getBalanceRegularAccount(address _addr) public view returns (uint256 _balance) {
            return balanceRegularAccount[_addr];
        }

        function getBalanceUntakenIncomingAccount(address _user) public view returns (uint256) {
            return balanceUntakenIncomingAccount[_user];
        }

        function getBalanceIncomingAccount(address _addr) public view returns (uint256 _balance) {
            return balanceIncomingAccount[_addr];
        }

        function getLastWithdrawalIncomingAccount(address _addr) public view returns (uint256 _lastWithdrawalTime) {
            return lastWithdrawalIncomingAccount[_addr];
        }

        function getLastWithdrawalRegularAccount(address _addr) public view returns (uint256 _lastWithdrawal) {
            return lastWithdrawalRegularAccount[_addr];
        }

        function getNextWithdrawalIncomingAccount(address _addr) public view returns (uint256 _nextWithdrawalTime) {
            uint lastWithdrawal = lastWithdrawalIncomingAccount[_addr];
            if (lastWithdrawal == 0) {
                return 0;
            }
            if (block.timestamp < lastWithdrawal + timeBetweenWithdrawals) {
                return lastWithdrawal + timeBetweenWithdrawals;
            } else {
                uint elapsedWithdrawalPeriods = (block.timestamp - lastWithdrawal) / timeBetweenWithdrawals;
                if (elapsedWithdrawalPeriods >= maxWithdrawalPeriods) {
                    return block.timestamp;
                } else {
                    return lastWithdrawal + ((elapsedWithdrawalPeriods + 1) * timeBetweenWithdrawals);
                }
            }
        }

        function getNextWithdrawalRegularAccount(address _addr) public view returns (uint256 _nextWithdrawalTime) {
            uint lastWithdrawal = lastWithdrawalRegularAccount[_addr];
            if (lastWithdrawal == 0) {
                return 0;
            }
            if (block.timestamp < lastWithdrawal + timeBetweenWithdrawals) {
                return lastWithdrawal + timeBetweenWithdrawals;
            } else {
                uint elapsedWithdrawalPeriods = (block.timestamp - lastWithdrawal) / timeBetweenWithdrawals;
                if (elapsedWithdrawalPeriods >= maxWithdrawalPeriods) {
                    return block.timestamp;
                } else {
                    return lastWithdrawal + ((elapsedWithdrawalPeriods + 1) * timeBetweenWithdrawals);
                }
            }
        }



        function getGlobalTimeLeftRegularAccount() public view returns (uint256 _timeLeft) {
            require(globalLockExpirationDateRegularAccount > block.timestamp, "Tokens are unlocked and ready for withdrawal");
            return globalLockExpirationDateRegularAccount - block.timestamp;
        }

        function getTimeLeftIncomingAccount(address _addr) public view returns (uint256 _timeLeft) {
            if (lockExpirationForUserIncomingAccount[_addr] <= block.timestamp) {
                return 0;
            } else {
                return lockExpirationForUserIncomingAccount[_addr] - block.timestamp;
            }
        }



    }
