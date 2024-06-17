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

