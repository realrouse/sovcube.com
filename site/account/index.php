<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SovCube - My Account</title>



<!-- Bootstrap JS and its dependencies -->
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>




    <link rel="stylesheet" href="/account/styles.css">
<link rel="icon" href="/images/favicon-logo.png" type="image/x-icon">
    <!-- Include web3.js or other necessary scripts -->

<script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>
<?php  include $_SERVER['DOCUMENT_ROOT'] . '/tag.php';  
?>


</head>
<body>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/menu.php'; ?>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/connect.php'; ?>
<h1 class="dapp-heading">My Account</h1>
<p id="connectYourWalletText"><span class="connectWalletTextClass">Connect your wallet to continue.<br></span>Use a browser like <a href="https://brave.com" target="_blank">Brave Browser</a> or Google Chrome and download the <a href="https://metamask.io/download/" target="_blank">Metamask wallet extension</a> to be able to connect.<br><br><span style="color:red;">Strongly Recommended to read up at <a href="/docs" target="_blank">Docs & Help</a> before you timelock any tokens.</span></p>
    <div id="container">
       <p>Info and stats about your accounts.</p>
</div>




<script>
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip(); 
});
</script>



<div id="errorMessage" style="color: red;"></div><span id="clearError" style="cursor: pointer; padding: 0 5px; display:none;">X</span>


<script>
document.getElementById('clearError').addEventListener('click', function() {
    document.getElementById('errorMessage').innerText = '';
    document.getElementById('clearError').style.display = 'none';
});

</script>

<div id="contractInfoContainer">
    <div id="contract1InfoSection">
        <h3 class="contract1infoheader" style="display:none;">Contract 1 Balances:</h3>
        <span id="contract1DynamicInfo"></span>
    </div>

    <!-- HTML template for Contract 1 Info -->
    <script id="contract1Template" type="text/template">
        <p style="text-align:center;"><b>Withdrawal Rate:</b> ${withdrawRate} tokens/week</p>
        <div class="contract-info-container">
            <div class="contract-info-style">
                <div id="regularAccount1">
                    <h3>Regular Account</h3>
                    <p><b>Your Timelocked Tokens:</b><br><span id="yourTokensTextRegular">${tokensLocked} BSOV</span></p>
                    <p style="margin-top:10px;"><b>Lock Time:</b><br><span id="regularUnlockTime">${timeLeftOutput}</span></p>
		    <p style="margin-top:10px;"><b>Time to next withdrawal:</b><br><span id="nextWithdrawal1Regular">${nextWithdrawal1RegularOutput}</span></p>
		    </div>
		    </div>
        </div>
        <!--<p style="font-size:7pt; text-align:center;">Balances update every 5 seconds</p>-->
    </script>


<div class="contract-container">
<div class="contract-section">
                    <h4>Your Latest Transactions</h4>
    <table class="latestTxTable" border="1">
        <thead>
            <tr>
                <th>Timestamp</th>
                <th>Method</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody id="transactionTableBody1"></tbody>
    </table>
</div>
</div>



</div>





<div class="styled-divider"></div>


<div id="contractInfo2Container">
    <div id="contract2InfoSection">
	<h3 class="contract2infoheader" style="display:none;">Contract 2 Balances:</h3>
<div id="mainContractInfo">
	      </div>
        <span id="contract2DynamicInfo"></span>
    </div>

    <!-- HTML template for Contract 2 Info -->
    <script id="contract2Template" type="text/template">
        <p style="text-align:center;"><b>Withdrawal Rate:</b> ${withdrawRate} tokens/week</p>
	<div class="contract-info-container">
	<div class="second-line-container">
            <div class="contract-info-style" id="regularAccountContainer">
                <div id="regularAccount">
                    <h3>Regular Account</h3>
                    <p><b>Your Timelocked Tokens:</b><br><span id="yourTokensTextRegular">${tokensLocked} BSOV</span></p>
                    <p style="margin-top:10px;"><b>Lock Time:</b><br><span id="regularUnlockTime">${timeLeftOutput}</span></p>
		    <p style="margin-top:10px;"><b>Time to next withdrawal:</b><br><span id="nextWithdrawal2Regular">${nextWithdrawal2RegularOutput}</span></p>
		    </div>
</div>
		                  <div class="contract-info-style" id="incomingAccountContainer">
				  <div id="incomingTokensAccount">
				          <h3>Incoming Account</h3>
        <p><b>Your Timelocked Tokens:</b><br><span id="yourTokensText">${incomingAccountBalance} BSOV</span></p>
	<p style="margin-top:10px;"><b>Lock Time:</b><br><span id="incomingUnlockTime">${incomingAccountLockTimeOutput}</span></p>
	<p style="margin-top:10px;"><b>Time to next withdrawal:</b><br><span id="nextWithdrawal2Incoming">${nextWithdrawal2IncomingOutput}</span></p>
        <p style="margin-top:10px;"><b>Untaken Incoming Tokens:</b><br><span id="unclaimedTokens">${untakenIncomingTokens} BSOV</span></p>
	</div>
                </div>

		</div>

		             <!-- <div class="contract-info-style" id="rewardsAccountContainer">
			      <div id="rewardsAccount">
			      	<h3 style="color:orange; border-bottom:1px solid orange;">Your Rewards</h3>
	<p><b>Unclaimed Timelock Rewards:</b><br><span id="yourTokensText" style="color:yellow;">${formattedEligibleTokens} BSOV</span></p>
              </div>
                </div>
-->

            </div>
        </div>
        <!--<p style="font-size:7pt; text-align:center;">Balances update every 5 seconds</p>-->
    </script>


<div class="contract-container">
<div class="contract-section">
                           <h4>Your Latest Transactions</h4>
                <table class="latestTxTable" border="1">
        <thead>
            <tr>
                <th>Timestamp</th>
                <th>Method</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody id="transactionTableBody2"></tbody>
    </table>
</div>


<div class="contract-section">
               <h4>Your Latest Transactions</h4>
                <table class="latestTxTable" border="1">
        <thead>
            <tr>
                <th>Timestamp</th>
                <th>Method</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody id="transactionTableBody2Incoming"></tbody>
    </table>
</div>
</div>

</div>
 <p style="font-size:7pt; text-align:center; letter-spacing:1.5px;">Balances update every 10 seconds</p>


<div class="terms-container">
    <p class="terms">Everything on this site is provided "as-is" and SovCube.com has no responsibilities. Everything you do and see on this website is 100% your responsibility. This is because SovCube is purely a voluntary community initiative.</p>
 <a href="#" id="toggleTerms" class="toggle-terms">Disclaimer</a>
</div>
<script>
document.getElementById('toggleTerms').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default anchor behavior
    var terms = document.querySelector('.terms');

    if (terms.style.display === "none" || terms.style.display === "") {
        terms.style.display = "block";
        setTimeout(function() {
            terms.style.opacity = 1;
        }, 10); // Timeout ensures the opacity transition occurs
    } else {
        terms.style.opacity = 0;
        setTimeout(function() {
            terms.style.display = "none";
        }, 100); // Matches the duration of the fade effect
    }
});

</script>

<script src="/dapp/config.js"></script>
<script src="/account/bsov-calls.js"> </script>
<script src="/account/account.js"></script>
<script src="/account/contract1-calls.js"> </script>
<script src="/account/contract2-calls.js"> </script>
<script src="/account/txes.js"> </script>

 
   
</body>
</html>

