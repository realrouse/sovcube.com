const { Web3 } = require('web3'); // Import Web3 from web3 package

// Assuming server.js is using Express or a similar framework
const express = require('express');
const app = express();
const config = require('./config');
const web3 = new Web3(config.infuraUrl); // Initialize Web3 with Infura URL

// Your server code here...

// Example of using Web3 4.x for fetching account balance (adjust as needed)

app.get('/balance/:address', async (req, res) => {
  try {
    const address = req.params.address;
    console.log(`Fetching balance for address: ${address}`);
    const balance = await web3.eth.getBalance(address);
    console.log(`Balance for ${address}: ${balance}`);
    res.send({ balance });
  } catch (error) {
    console.error(`Error fetching balance: ${error.message}`);
    res.status(500).send({ error: error.message });
  }
});


// Continue with your server configuration...

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

