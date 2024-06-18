<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SovCube - Global Stats</title>
<link rel="stylesheet" href="/stats/styles.css">
<link rel="stylesheet" href="/styles-fonts.css">
<link rel="icon" href="/images/favicon-logo.png" type="image/x-icon">
<script type="text/javascript">
        function showMessage() {
            document.getElementById('message').style.display = 'block';
        }
    </script>
<script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>

<?php  include $_SERVER['DOCUMENT_ROOT'] . '/tag.php';  
?>


</head>
<body>
<script src="/dapp/config.js"></script>
<?php



// Include the configuration file
 global $conn, $rewardsReserveContractAddress;
    //   $rewardsReserveContractAddress = '';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Assuming rewardsReserveContractAddress is sent via POST
    $rewardsReserveContractAddress = $_POST['rewardsReserveContractAddress'] ?? '';
} 
// You can now use $rewardsReserveContractAddress in this script


/*if ($_SERVER["REQUEST_METHOD"] == "POST") {
            // Retrieve the address from the POST request
    $rewardsReserveContractAddress = $_POST['rewardsReserveContractAddress'] ?? '';
echo "POST Address immediately after setting: " . $rewardsReserveContractAddress . "<br>";
}*/



include('../config.php');

// Include the functions file
include('../functions.php');



// Define the table names for different HTML elements
$tableName1 = 'timelock_contract_1';
$tableName2 = 'timelock_contract_2';
// Add more table names as needed

$totalTimelocked1 = getTotalTimelockedValue($tableName1);
$totalTimelocked2 = getTotalTimelockedValue($tableName2);
// Fetch the total timelocked values for other table names as needed

// echo "POST Address before calling function: " . $rewardsReserveContractAddress . "<br>";
$leaderboard1 = timelockLeaderboard($tableName1);
$leaderboard2 = timelockLeaderboard($tableName2);


// Function to format the number
function formatNumber($value) {
    return number_format($value, 0, '.', ',');
}

?>


<div class="body-container">
<?php include $_SERVER['DOCUMENT_ROOT'] . '/menu.php'; ?>
<!--<?php include $_SERVER['DOCUMENT_ROOT'] . '/connect.php'; ?>-->
 

 
        <center><h1>SovCube Global Stats</h1></center>
   



    <div class="container">


        <div class="contract-section">
            <h2 id="contract-heading">Contract 1</h2>
<a id="external-link1" href='#' target="_blank"><img src="/images/external-link.png" width="15px" alt="External Link Icon"> Etherscan</a> <a id="moreinfo" href="/docs/index.php/#contract-1" target="_blank">More info</a>
           

 <div class="info-container" id="contract1TimeLeft">
                Time Left: Loading...
            </div>
            <div class="info-container" id="contract1TotalTimelocked">
                <p><b>Current Total Timelocked:</b><br><?php echo formatNumber($totalTimelocked1) . " BSOV"; ?></p>
            </div>
            <div class="info-container" id="contract1UsersInfo">
                <div class="leaderboard-container" id="contract1Leaderboard">
    <h2>Leaderboard</h2>
<h3>Top Timelockers</h3>
    <table>
        <tr>
            <th>Address</th>
            <th>Total Timelocked</th>
            <th>Total Withdrawn</th>
            <th>Net Amount</th>
        </tr>
        <?php foreach ($leaderboard1 as $entry): ?>
            <tr>
                <td><?php echo $entry['address']; ?></td>
                <td><?php echo $entry['totalFrozen']; ?></td>
                <td><?php echo $entry['totalUnfrozen']; ?></td>
                <td><?php echo $entry['netAmount']; ?></td>
            </tr>
        <?php endforeach; ?>
    </table>

    <h4>Latest Transactions</h4>
    <table class="latestTxTable" border="1">
        <thead>
	    <tr>
		<th>Timestamp</th>
                <th>Address</th>
                <th>Method</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody id="transactionTableBody1"></tbody>
    </table>
</div>

            </div>
        </div>

        <div class="contract-section">
            <h2 id="contract-heading">Contract 2</h2>
		<a id="external-link2" href='#' target="_blank"><img src="/images/external-link.png" width="15px" alt="External Link Icon"> Etherscan</a> <a id="moreinfo" href="/docs/index.php/#contract-2" target="_blank">More info</a>
            <div class="info-container" id="timeUntilWithdrawalHalving">
                Time Left: Loading...
            </div>
            <div class="info-container" id="contract2TimeLeft">
                Time Left: Loading...
            </div>
            <div class="info-container" id="contract2TotalTimelocked">
                <p><b>Current Total Timelocked:</b><br><?php echo formatNumber($totalTimelocked2) . " BSOV"; ?></p>
            </div>
            <div class="info-container" id="contract2UsersInfo">
                <div class="leaderboard-container" id="contract2Leaderboard">
    <h2>Leaderboard</h2>
<h3>Top Timelockers</h3>
    <table>
        <tr>
            <th>Address</th>
            <th>Total Timelocked</th>
            <th>Total Withdrawn or Sent</th>
            <th>Net Amount</th>
        </tr>
        <?php foreach ($leaderboard2 as $entry): ?>
            <tr>
                <td><?php echo $entry['address']; ?></td>
                <td><?php echo $entry['totalFrozen']; ?></td>
                <td><?php echo $entry['totalUnfrozen']; ?></td>
                <td><?php echo $entry['netAmount']; ?></td>
            </tr>
        <?php endforeach; ?>
    </table>
   <h4>Latest Transactions</h4>
    <table class="latestTxTable" border="1">
        <thead>
	    <tr>
		<th>Timestamp</th>
                <th>Address</th>
                <th>Method</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody id="transactionTableBody2"></tbody>
    </table>
</div>

</div>

            </div>
        </div>

    </div>
<div class="governance-text-container">
<div class="governance-text">In the future, we are considering the implementation of a governance function specifically for the Top Timelockers featured on the leaderboard. Therefore, maintaining your tokens timelocked in a single address could become an important aspect of leveraging this potential new feature.</div>
   </div>

 <div class="container">

        <div class="contract-section">
	    <h2 id="contract-heading">Timelock Rewards</h2>
<a id="moreinfo" href="/docs/index.php/#rewardreserve" target="_blank">More info</a>
            <div class="info-container" id="CurrentTier">
                Current Tier: Loading...
            </div>
            <div class="info-container" id="TotalEligibleAmount">
                Total Eligible Amount: Loading...
            </div>
	   <div class="info-container" id="RewardsRemaining">
    		Rewards Remaining: Loading...
	   </div>
            <div class="info-container" id="TotalTimelocked">
                Total Timelocked: Loading...
            </div>
	</div>
        <div class="contract-section">
	    <h2 id="contract-heading">BSOV Token</h2>
<a id="external-link4" href='#' target="_blank"><img src="/images/external-link.png" width="15px" alt="External Link Icon"> Etherscan</a> <a id="moreinfo" href="/docs/index.php/#bsov" target="_blank">More info</a>
            <div class="info-container" id="tokensMinted">
                Tokens Minted: Loading...
            </div>
            <div class="info-container" id="burnAmount">
                Tokens Minted: Loading...
            </div>
        </div>


</div>
<br><br><br>
</div>

<!--<script src="/dapp/app.js"></script> -->
<p style="text-align:center;">Balances on this page are updated every minute or two.</p>
</div>

<script>

    // Get the link element by its ID
    const externalLink1 = document.getElementById('external-link1');
    const externalLink2 = document.getElementById('external-link2');
    const externalLink4 = document.getElementById('external-link4');

    // Set the href attribute of the link using the contract1Address
    externalLink1.href = `https://etherscan.io/address/${contract1Address}`;
    externalLink2.href = `https://etherscan.io/address/${contract2Address}`;
    
    externalLink4.href = `https://etherscan.io/address/${tokenContractAddress}`;
</script>


<!-- <script src="/dapp/config.js"></script>-->
<script src="stats.js"></script>
<script src="txes.js"></script>
</body>
</html>
