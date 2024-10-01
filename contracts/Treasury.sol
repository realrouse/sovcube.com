//
// User Requirements:
// - Only Top Timelockers can vote (starting at a theoretical amount of 100)
// - 1 vote per user
//
// Top Timelocker Criteria:
// - Once a year, right after the Yearly Vote; the Top Timelockers for the next Yearly Vote are decided.
// - To become a Top Timelocker the user must have at least 1% of the totalCurrentlyTimelockedRegularAccount timelocked in his Regular Account.
//
// Timeline of Proposals and Yearly Vote:
// - Proposal makers can submit proposals at any time. It will cost periodWithdrawalAmount (starting at 100 BSOV Tokens) to post a proposal. 
// - Top Timelockers can vote at any time, and change their vote at any time. 
// - Once a year there is a Yearly Vote where a winning proposal is chosen, and all existing votes will be nullified to start the next Yearly Vote.
// - After a winning proposal is chosen, 25% of the all the BSOV in the Treasury will be distributed as Voting Rewards equally between all the participating voters.
// - After a winning proposal is chosen, the proposal winner will receive their requested budget, distributed to the addresses specified in the Budget Recipients field.
// - If no proposal wins due to failing the Quorum Requirement, no one will receive Voting Rewards.
// - Voting Rewards and Requested Budgets will be sent as locked tokens to the "Incoming Account" of the recipients.
// 
// Requirement to win a proposal:
// - Quorum of 60%, meaning that at least 60% of all the Top Timelockers will need to have voted, otherwise, no proposal can win.
// - The proposal with the most votes will be a winning proposal.
//
// Proposal content:
// - Title
// - Body
// - Requested Budget (in BSOV)
// - Budget Recipients: Address(es) + Address description + Allocation % of budget
// 
// Voter Doubling
// - Every 4 years, the amount of Top Timelockers will double (first time from 100 to 200), meaning that the percentToBeTopTimelocker will halve, (first time from 1% to 0.5%)   



// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

    import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/utils/ReentrancyGuard.sol";

interface TimelockContract2Interface {
    function totalCurrentlyTimelocked() external view returns (uint256);
    function getBalanceRegularAccount(address _addr) external view returns (uint256);
}

// Defines the interface of the BSOV Token contract
    abstract contract ERC20Interface {
        function transfer(address to, uint tokens) public virtual returns(bool success);
        function transferFrom(address from, address to, uint tokens) public virtual returns(bool success);
        function approve(address spender, uint tokens) public virtual returns(bool success);
        function approveAndCall(address spender, uint tokens, bytes memory data) public virtual returns(bool success);
        event Transfer(address indexed from, address indexed to, uint tokens);
        event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    }

contract GovernanceTreasury is ReentrancyGuard {

    ERC20Interface tokenContract;
    TimelockContract2Interface timelockContract;

// Define the percentage. 100 = 1% and 10 = 0.1% and 1 = 0.01%
    uint constant percentToBeTopTimelocker = 100; // Represent 1% as 100 basis points

constructor(address _tokenContractAddress, address _timelockContractAddress) {
tokenContract = ERC20Interface(_tokenContractAddress);
timelockContract = TimelockContract2Interface(_timelockContractAddress);
}


    function fetchTotalTimelocked() public view returns (uint256) {
            return timelockContract.totalCurrentlyTimelocked();
        }

    function amITopTimelocker() public view returns (bool) {
            uint256 balance = timelockContract.getBalanceRegularAccount(msg.sender);
            uint256 totalTimelocked = fetchTotalTimelocked();
            require(totalTimelocked > 0, "Total timelocked must be greater than 0");

            if (balance >= ((totalTimelocked * percentToBeTopTimelocker) / 100)) {
                return true;
            } else {
                return false;
            }
        }

    // Test transfer of the token
    function testTransferToken(address to, uint256 amount) public nonReentrant returns (bool) {
            
            bool success = tokenContract.transfer(to, amount);
            return success;
        }


}

