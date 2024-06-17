
const contract1Address = '0x5Fcd063977104cabfbaa2eF8b0EfD8E5ddBB6613'; // Replace with actual Contract 1 address
const contract2Address = '0x92369bA557f84f50079b2a676EdbA10615973498'; // Replace with actual Contract 2 address
const tokenContractAddress = '0x31eE7662f4575a6380Fec7C1c6B15b1F54Cfa9Ce';
const giveawayReserveContractAddress = '0xFC88e4103A5e3647cF3661e2ef41C985b73585DB';
console.log("config.js is starting...");

/*
let web3;
let selectedAccount;


// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    web3 = new Web3(window.ethereum);
} else {
    console.log('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
}
*/
// Sending an AJAX request to your PHP script
/*fetch('/stats/index.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `giveawayReserveContractAddress=${giveawayReserveContractAddress}`
})
.then(response => response.text())
.then(data => {
    // Handle the response data
    console.log(data);
})
.catch(error => {
    console.error('Error:', error);
});
console.log("config.js is loaded...");
*/

fetch('/stats/index.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `giveawayReserveContractAddress=${giveawayReserveContractAddress}`
})
.then(response => response.text())
.then(data => {
    console.log("Response received");
})
.catch(error => {
    console.error('Error:', error);
});
