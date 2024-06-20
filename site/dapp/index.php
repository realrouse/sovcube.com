<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SovCube - dApp</title>



<!-- Bootstrap JS and its dependencies -->
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>




    <link rel="stylesheet" href="/dapp/styles.css">
<link rel="icon" href="/images/favicon-logo.png" type="image/x-icon">
    <!-- Include web3.js or other necessary scripts -->

<script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>

<?php  include $_SERVER['DOCUMENT_ROOT'] . '/tag.php';  
?>

</head>
<body>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/menu.php'; ?>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/connect.php'; ?>
<h1 class="dapp-heading">SovCube Timelocking dApp</h1>
<p id="connectYourWalletText"><span class="connectWalletTextClass">Connect your wallet to continue.<br></span>Use a browser like <a href="https://brave.com" target="_blank">Brave Browser</a> or Google Chrome and download the <a href="https://metamask.io/download/" target="_blank">Metamask wallet extension</a> to be able to connect.<br><br><span style="color:red;">Strongly Recommended to read up at <a href="/docs" target="_blank">Docs & Help</a> before you timelock any tokens.</span></p>
    <div id="container">
        <div class="contract-selection" style="display: none;">
            <select id="contractSelect" class="contractSelect">
		<option value="select">Select Contract &#x21B4</option>
                <option value="contract1" style="color:gray;" >Contract 1 (old)</option>
                <option value="contract2">Contract 2 &#127873; (new!)</option>
            </select>
        </div>

<p id="contract-explanation">Only compatible with Ethereum (ETH) mainnet.
<br><br>To begin using the SovCube dApp you have to select a contract to interact with. The contracts have different parameters, and you should read the documentation before you timelock your tokens.
<br><br><span style="color:#F8B128">To get Timelock Rewards, you will need to timelock <a href="https://bsovtoken.com" target="_blank">BSOV Tokens</a> using <strong>Contract 2</strong>
<br></span>
</p>


<div id="fieldContainer">

<p id="contract1Explanation">
  Contract 1: Timelock & Withdraw <a href="https://bsovtoken.com" target="_blank">BSOV Tokens</a>. 
  <br><a href="/docs/index.php/#contract-1" target="_blank">Contract Info</a>
<br> This contract is an old contract that was deployed in year 2019,
<br>and is mainly used for the old timelockers to withdraw their timelocked tokens.
<!--<br><p style="color:orange; text-align:center;">Looking for Timelock Rewards? Then wait for <b>Contract 2</b> to go live!</p>-->
</p>
<p id="contract2Explanation">
  <a href="https://bsovtoken.com" target="_blank">BSOV Token</a> Info - <a href="/docs/index.php/#contract-2" target="_blank">Contract 2</a> Info.
</p>

<script>
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip(); 
});
</script>


        <!-- Contract 1 Details -->
<div id="contract1Details" class="contract-details" style="display: none;">
    <div class="radio-buttons">
        <input type="radio" id="timelock1" name="contract1Action" value="timelock">
        <label for="timelock1" data-toggle="tooltip" title="Lock your tokens to your 'Regular Account' for a pre-set period of time. Tokens cannot be accessed until the Lock Time has expired.">Timelock</label>
        <input type="radio" id="withdraw1" name="contract1Action" value="withdraw">
        <label for="withdraw1" data-toggle="tooltip" title="Retrieve your timelocked tokens after the Lock Time has expired, adhering to the weekly Withdrawal Rate limits.">Withdraw</label>
    </div>
    <input type="number" id="amount1" placeholder="Amount of BSOV">
    <p id="timelockedtokens1">0 BSOV will be timelocked. 0 BSOV will be burnt.</p>
    <p id="withdrawaltime1">Lock Time: 0 years, then 0 years at a withdrawal rate of 1000 tokens/week.</p>

<script>
    // Function to update the text
      async  function updateText() {
            var amount = document.getElementById('amount1').value;
	    var timelocked = amount * 0.99; // 1% burn
	    var burnt = amount * 0.01;
            var weeks = timelocked / 1000;
	    var years = weeks / 52;
	document.getElementById('timelockedtokens1').textContent = timelocked + " BSOV will be timelocked. " + burnt + " BSOV will be burnt.";
try {
	    const lockTimeLeftInSeconds = await contract1.methods.getTimeLeft().call();
const secondsInYear = BigInt(365 * 24 * 60 * 60); // Approximate seconds in a year
// const lockYears = lockTimeLeftInSeconds / secondsInYear;
const lockYears = Number(lockTimeLeftInSeconds) / Number(secondsInYear); // Convert to number


          //  document.getElementById('withdrawaltime1').textContent = "Time to Withdraw: " + weeks.toFixed(0) + " weeks (" + years.toFixed(2) + " years)";
	document.getElementById('withdrawaltime1').textContent = "Lock Time: " + lockYears.toFixed(2) + " years, then " + years.toFixed(2) + " years at a withdrawal rate of 1000 tokens/week.";       
      
        } catch (error) {
           // console.error('Error:', error);
       if (error.message.includes("future is here") || error.message.includes("Tokens are unlocked")) {
                document.getElementById('withdrawaltime1').textContent = "Lock Time: " + years.toFixed(2) + " years at a withdrawal rate of 100 tokens/week.";
              //  document.getElementById('withdrawaltime2').style.color = 'green';
            } else {
                document.getElementById('withdrawaltime1').textContent = "Error fetching data";
            }
	}    
    }


        // Event listener for changes in the input field
        document.getElementById('amount1').addEventListener('input', updateText);

</script>

<!-- Contract 1 - Timelock and Withdraw Buttons -->
<button class="button" id="timelock1Button">Timelock Now</button>
<button class="button" id="withdraw1Button">Withdraw Now</button>


</div>


        <!-- Contract 2 Details -->
        <div id="contract2Details" class="contract-details" style="display: none;">
            
            <div class="radio-buttons">
                <input type="radio" id="timelock2" name="contract2Action" value="timelock">
                <label for="timelock2" style="outline-color:orange; box-shadow: 0 0 10px 1px orange;" data-toggle="tooltip" title="Lock your tokens for a pre-set period of time and receive Timelock Rewards. Tokens cannot be accessed until the Lock Time has expired.">Timelock</label>
                <input type="radio" id="withdraw2" name="contract2Action" value="withdraw">
                <label for="withdraw2" data-toggle="tooltip" title="Retrieve your timelocked tokens after the Lock Time has expired, adhering to the weekly Withdrawal Rate limits.">Withdraw</label>
                <input type="radio" id="sendlocked" name="contract2Action" value="sendlocked">
                <label for="sendlocked" data-toggle="tooltip" title="Transfer your timelocked tokens to someone else's 'Incoming Account'. When these tokens are claimed using the 'Accept Incoming Tokens' button, their Lock Time resets to 1000 days.">Send Locked Tokens</label>
            </div>
            <input type="number" id="amount2" placeholder="Amount of BSOV">

    <p id="timelockedtokens2">0 BSOV will be timelocked. 0 BSOV will be burnt.</p>
    <p id="withdrawaltime2">Lock Time: 0 years, then 0 years at a withdrawal rate of 100 tokens/week.</p>
    <span id="timelockRewardCalculation">You will be eligible for 0 Timelock Reward tokens.</span>
<p id="advanceTierMessage">Tier</p>
<!--<script>
    // Function to update the text
      async function updateText() {
            var amount = document.getElementById('amount2').value;
	    var timelocked = amount * 0.99; // 1% burn
	    var burnt = amount * 0.01;
            var weeks = timelocked / 100;
            var years = weeks / 52;

	    const lockTimeLeftInSeconds = await contract2.methods.getGlobalTimeLeftRegularAccount().call();
const secondsInYear = BigInt(365 * 24 * 60 * 60); // Approximate seconds in a year
// const lockYears = lockTimeLeftInSeconds / secondsInYear;
const lockYears = Number(lockTimeLeftInSeconds) / Number(secondsInYear); // Convert to number


	    document.getElementById('timelockedtokens2').textContent = timelocked + " BSOV will be timelocked. " + burnt + " BSOV will be burnt.";
 	    document.getElementById('withdrawaltime2').textContent = "Lock Time: " + lockYears.toFixed(2) + " years, then " + years.toFixed(2) + " years at a withdrawal rate of 100 tokens/week."; 

        }

        // Event listener for changes in the input field
        document.getElementById('amount2').addEventListener('input', updateText);

</script>-->
<!--
<script>
    // Function to update the text
    async function updateText() {
        var amount = document.getElementById('amount2').value;
        var timelocked = amount * 0.99; // 1% burn
        var burnt = amount * 0.01;
        var weeks = timelocked / 100;
        var years = weeks / 52;

                document.getElementById('timelockedtokens2').textContent = timelocked + " BSOV will be timelocked. " + burnt + " BSOV will be burnt.";
        try {
            const lockTimeLeftInSeconds = await contract2.methods.getGlobalTimeLeftRegularAccount().call();
            const secondsInYear = BigInt(365 * 24 * 60 * 60); // Approximate seconds in a year
            const lockYears = Number(lockTimeLeftInSeconds) / Number(secondsInYear); // Convert to number

            if (lockTimeLeftInSeconds > 0) {
                document.getElementById('withdrawaltime2').textContent = "Lock Time: " + (lockYears > 0 ? lockYears.toFixed(2) + " years, then " : "") + years.toFixed(2) + " years at a withdrawal rate of 100 tokens/week.";
            } else {
                document.getElementById('withdrawaltime2').textContent = "Lock Time: " + years.toFixed(2) + " years at a withdrawal rate of 100 tokens/week.";
               // document.getElementById('withdrawaltime2').style.color = 'green';
            }
        } catch (error) {
            // console.error('Error:', error);

            if (error.message.includes("future is here") || error.message.includes("Tokens are unlocked")) {
                document.getElementById('withdrawaltime2').textContent = "Lock Time: " + years.toFixed(2) + " years at a withdrawal rate of 100 tokens/week.";
              //  document.getElementById('withdrawaltime2').style.color = 'green';
            } else {
                document.getElementById('withdrawaltime2').textContent = "Error fetching data";
            }
        }
    }

    // Event listener for changes in the input field
    document.getElementById('amount2').addEventListener('input', updateText);
</script>
-->

<script>
    // Function to calculate the total withdrawal time considering halving periods
    function calculateWithdrawalTime(amount, initialLockTimeLeftInDays, currentHalvingEra) {
        const withdrawalHalvingPeriod = 1500; // days
        const initialWithdrawalRate = 100; // tokens per week
        const halvingLimit = 5; // Maximum number of halvings
        const daysPerWeek = 7; // 7 days in a week

        let remainingTokens = amount;
        let currentRate = initialWithdrawalRate / (2 ** (currentHalvingEra - 1)); // Set initial rate based on current halving era
        let daysPassed = 0; // Start with the remaining lock time

        for (let halvingEra = currentHalvingEra; halvingEra <= halvingLimit; halvingEra++) {
            const weeksInCurrentEra = withdrawalHalvingPeriod / daysPerWeek;
            let tokensWithdrawnInCurrentEra = weeksInCurrentEra * currentRate;

            if (tokensWithdrawnInCurrentEra >= remainingTokens) {
                daysPassed += (remainingTokens / currentRate) * daysPerWeek;
                remainingTokens = 0;
                break;
            } else {
                remainingTokens -= tokensWithdrawnInCurrentEra;
                daysPassed += withdrawalHalvingPeriod;
                currentRate /= 2; // Halve the rate for the next era
            }
        }

        if (remainingTokens > 0) {
            // Handle any remaining tokens after the maximum number of halvings
            const remainingWeeks = remainingTokens / currentRate;
            daysPassed += remainingWeeks * daysPerWeek;
        }

        return daysPassed;
    }

    // Function to update the text
    async function updateText() {
        var amount = parseFloat(document.getElementById('amount2').value);
        if (isNaN(amount) || amount <= 0) {
            document.getElementById('timelockedtokens2').textContent = "Invalid amount.";
            document.getElementById('withdrawaltime2').textContent = "";
            return;
        }

        var timelocked = amount * 0.99; // 1% burn
        var burnt = amount * 0.01;

        document.getElementById('timelockedtokens2').textContent = timelocked + " BSOV will be timelocked. " + burnt + " BSOV will be burnt.";

        try {
            const lockTimeLeftInSeconds = await contract2.methods.getGlobalTimeLeftRegularAccount().call();
            const timestampOfNextHalving = await contract2.methods.getTimestampOfNextWithdrawalHalving().call();
            const halvingEra = await contract2.methods.withdrawalHalvingEra().call();

            const initialLockTimeLeftInDays = Number(lockTimeLeftInSeconds) / (24 * 60 * 60); // Convert seconds to days, explicitly converting BigInt to Number
            const daysPassed = calculateWithdrawalTime(timelocked, initialLockTimeLeftInDays, Number(halvingEra));
	    const years = daysPassed / 365;
	    const initialLockTimeLeftInYears = (initialLockTimeLeftInDays / 365);

            let halvingDate = new Date(Number(timestampOfNextHalving) * 1000);
            let halvingMessage = `Next withdrawal halving is on ${halvingDate.toDateString()} (Era: ${halvingEra}).`;

            const currentRate = 100 / (2 ** (Number(halvingEra) - 1)); // Calculate the current withdrawal rate based on the halving era
            const withdrawalRateMessage = `Current withdrawal rate is ${currentRate.toFixed(6)} tokens/week.`;

            if (lockTimeLeftInSeconds > 0) {
                document.getElementById('withdrawaltime2').textContent = `Initial Lock for ${initialLockTimeLeftInYears.toFixed(2)} years. Withdrawals continue for approximately ${years.toFixed(2)} years, considering Withdrawal Halving Eras.`;
            } else {
                document.getElementById('withdrawaltime2').textContent = `Initial Lock for ${initialLockTimeLeftInYears.toFixed(2)} years. Withdrawals continue for approximately ${years.toFixed(2)} years, considering Withdrawal Halving Eras.`;
            }
        } catch (error) {
            if (error.message.includes("Tokens are unlocked")) {
                const halvingEra = await contract2.methods.withdrawalHalvingEra().call();
                const daysPassed = calculateWithdrawalTime(timelocked, 0, Number(halvingEra)); // No initial lock time left, explicitly converting BigInt to Number
                const years = daysPassed / 365;
                document.getElementById('withdrawaltime2').textContent = "Lock Time: " + years.toFixed(2) + " years considering halving periods.";
            } else {
                document.getElementById('withdrawaltime2').textContent = "Error fetching data";
            }
        }
    }

    // Event listener for changes in the input field
    document.getElementById('amount2').addEventListener('input', updateText);
</script>


<!--
<div class="checkbox-container">		
<input type="checkbox" id="account-checkbox">
<label for="account-checkbox" id="account-checkbox-label" data-toggle="tooltip" title="Checking this checkbox will attempt to withdraw timelocked tokens from the 'Incoming Account', if you do not check the checkbox it will attempt to withdraw from the 'Regular Account'">Withdraw from <b>Incoming Account?</b></label>
</div> -->
<!--
<div id="radio-container" class="radio-container">
    <input type="radio" id="regular-account" name="account-type" value="regular" checked>
    <label for="regular-account" data-toggle="tooltip" title="" data-original-title="Selecting this option will attempt to withdraw timelocked tokens from the 'Regular Account'">Regular Account</label><br>

    <input type="radio" id="incoming-account" name="account-type" value="incoming">
    <label for="incoming-account" data-toggle="tooltip" title="" data-original-title="Selecting this option will attempt to withdraw timelocked tokens from the 'Incoming Account'">Incoming Account</label>
</div>-->

<!--<div id="radio-container-account" class="radio-container-account">
    <div class="radio-buttons-account">
        <input type="radio" id="regular-account" name="account-type" value="regular" checked>
        <label for="regular-account" data-toggle="tooltip" title="" data-original-title="Selecting this option will attempt to withdraw timelocked tokens from the 'Regular Account'">Regular Account</label>
    </div>
    <div class="radio-buttons-account">
        <input type="radio" id="incoming-account" name="account-type" value="incoming">
        <label for="incoming-account" data-toggle="tooltip" title="" data-original-title="Selecting this option will attempt to withdraw timelocked tokens from the 'Incoming Account'">Incoming Account</label>
    </div>
</div>
-->
<!--
<div id="radio-container-account" class="radio-container-account">
    <div class="radio-buttons-account">
        <input type="radio" id="regular-account" name="account-type" value="regular" checked>
        <label for="regular-account" data-toggle="tooltip" title="" data-original-title="Selecting this option will attempt to withdraw timelocked tokens from the 'Regular Account'">Regular Account</label>
    </div>
    <div class="radio-buttons-account">
        <input type="radio" id="incoming-account" name="account-type" value="incoming">
        <label for="incoming-account" data-toggle="tooltip" title="" data-original-title="Selecting this option will attempt to withdraw timelocked tokens from the 'Incoming Account'">Incoming Account</label>
    </div>
</div>
-->
<!--
<div id="radio-container-account" class="radio-container-account">
    <div class="radio-buttons-account">
        <input type="radio" id="regular-account" name="account-type" value="regular" checked>
        <label for="regular-account" data-toggle="tooltip" title="" data-original-title="Selecting this option will attempt to withdraw timelocked tokens from the 'Regular Account'">Regular Account</label>
    </div>
    <div class="radio-buttons-account">
        <input type="radio" id="incoming-account" name="account-type" value="incoming">
        <label for="incoming-account" data-toggle="tooltip" title="" data-original-title="Selecting this option will attempt to withdraw timelocked tokens from the 'Incoming Account'">Incoming Account</label>
    </div>
    <div id="withdrawableNowRegularAccount" class="withdrawable-now">Max withdrawable now: Loading</div>
    <div id="withdrawableNowIncomingAccount" class="withdrawable-now">Max withdrawable now: Loading</div>
</div>
-->

<!--
<div id="radio-container-account" class="radio-container-account">
    <div class="radio-buttons-account">
        <input type="radio" id="regular-account" name="account-type" value="regular" checked>
        <label for="regular-account" data-toggle="tooltip" title="" data-original-title="Selecting this option will attempt to withdraw timelocked tokens from the regular account">Regular Account</label>
    </div>
    <div class="radio-buttons-account">
        <input type="radio" id="incoming-account" name="account-type" value="incoming">
        <label for="incoming-account" data-toggle="tooltip" title="" data-original-title="Selecting this option will attempt to withdraw timelocked tokens from the incoming account">Incoming Account</label>
    </div>
    <div id="withdrawableNowRegularAccount" class="withdrawable-now">Max withdrawable now: Loading</div>
    <div id="withdrawableNowIncomingAccount" class="withdrawable-now">Max withdrawable now: Loading</div>

    <div id="timeLeftRegularAccount" class="withdrawable-now">Time left until next withdrawal: Loading</div>
    <div id="timeLeftIncomingAccount" class="withdrawable-now">Time left until next withdrawal: Loading</div>
</div>
-->

<div id="radio-container-account" class="radio-container-account">
    <div class="radio-buttons-account column-content">
        <input type="radio" id="regular-account" name="account-type" value="regular" checked>
        <label for="regular-account" data-toggle="tooltip" title="" data-original-title="Selecting this option will attempt to withdraw timelocked tokens from the regular account">Regular Account</label>
        <div id="withdrawableNowRegularAccount" class="withdrawable-now">Max withdrawable now: Loading</div>
        <div id="timeLeftRegularAccount" class="withdrawable-now">Time left until next withdrawal: Loading</div>
    </div>
    <div class="radio-buttons-account column-content">
        <input type="radio" id="incoming-account" name="account-type" value="incoming">
        <label for="incoming-account" data-toggle="tooltip" title="" data-original-title="Selecting this option will attempt to withdraw timelocked tokens from the incoming account">Incoming Account</label>
        <div id="withdrawableNowIncomingAccount" class="withdrawable-now">Max withdrawable now: Loading</div>
        <div id="timeLeftIncomingAccount" class="withdrawable-now">Time left until next withdrawal: Loading</div>
    </div>
</div>






            <textarea id="ethAddresses" spellcheck="false" placeholder="Enter ETH addresses to send timelocked tokens to (one address per line)"></textarea>
	    <textarea id="sendLockedAmounts" spellcheck="false"  placeholder="Enter BSOV amounts (one amount per line)"></textarea>
          <!-- Contract 2 - Timelock, Withdraw, and Send Locked Tokens Buttons -->
<button class="button" id="timelock2Button">Timelock Now</button>
<button class="button" id="withdraw2Button">Withdraw from Selected Account</button>
<button class="button" id="withdrawAll2Button">Withdraw All</button>
<button class="button" id="sendLocked2Button">Send Locked Tokens Now</button>



        </div>
    </div>
</div>
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

    <div id="contract2InfoSection">
    <h3 class="contract2infoheader" style="display:none;">Contract 2 Balances:</h3>
	      <div id="mainContractInfo">
	      </div>
	<div class="contract-info-container">
	      
		<div class="second-line-container">
	     <div class="contract-info-style" id="regularAccountContainer">
	      <div id="regularAccount">
	      </div>
		</div>

	      <div class="contract-info-style" id="incomingAccountContainer">
               <div id="incomingTokensAccount">   
	      </div>	
	              <button id="acceptIncomingButton" data-toggle="tooltip" title="Accepting Incoming Tokens will reset the lock period of any existing timelocked balance in your 'Incoming Account' to a full 1000 days. This will not affect the lock period of your Regular Account.">Accept Untaken Incoming Tokens</button>
		</div>
	</div>

<!--	      <div class="contract-info-style" id="rewardsAccountContainer">
               <div id="rewardsAccount">
	      </div>	
              <button id="claimRewardsReserveButton" data-toggle="tooltip" title="If you timelock BSOV tokens, you'll be worthy of Timelock Rewards! By clicking this button the Unclaimed Timelock Rewards will be transferred to your 'Incoming Tokens' balance">Claim Timelock Rewards</button> 
		</div>
	</div>
-->
         
     </div>

 <p style="font-size:7pt; text-align:center; letter-spacing:1.5px;">Balances update every 10 seconds</p>

</div>

<div class="terms-container">
    <p class="terms">Everything on this site is provided "as-is" and SovCube.com has no responsibilities. Everything you do and see on this website is 100% your responsibility. Read more at <a target="_blank" href="/docs/index.php/#legal">Legal - Terms</a></p>
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
<script src="/dapp/bsov-calls.js"> </script>
<script src="/dapp/app.js"></script>
<script src="/dapp/contract1-calls.js"> </script>
<script src="/dapp/contract2-calls.js"> </script>


 
   
</body>
</html>

