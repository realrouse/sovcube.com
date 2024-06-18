
<?php

?>



<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SovCube</title>
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="styles-fonts.css">
<link rel="icon" href="/images/favicon-logo.png" type="image/x-icon">

<script type="text/javascript">
        function showMessage() {
            document.getElementById('message').style.display = 'block';
        }
    </script>
<!--<script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>-->

<?php  include $_SERVER['DOCUMENT_ROOT'] . '/tag.php';  
?>


</head>

<?php include $_SERVER['DOCUMENT_ROOT'] . '/menu.php'; ?>
<body>


<center><img class="img-fade"  src="/images/Sovcube-BSOV-no-text.png" height=300px width=auto style="opacity:0.9; position:fixed; z-index:-1; margin-left:-17%; margin-top:400px;"></img> </center>

<div class="body-container">

<div class="blurred-background"></div>
    <div class="text-container">

<center><h1 class="brand-name">SovCube</h1></center>
<center><h2>Grow Long-Term Value with an<br>Anti-Inflationary Savings Account</h2></center>
<p style="text-align:center;">Secure your <a href="https://bsovtoken.com" target="_blank">BSOV Tokens</a> with SovCube's web3 dApp and smart-contract collection, which function similarly to a traditional long-term savings account, aiming to preserve and grow your assets over time by mitigating the effects of inflation.</p>

<!-- <p style="text-align:center;">Secure your <a href="https://bsovtoken.com" target="_blank">BSOV Tokens</a> with SovCube's web3 dApp<br>and smart-contract collection, which work similarly to a traditional long-term savings account.</p>-->
<br>
<div class="stats-container">
<center><h3>Timelock Tokens</h3></center>
<div style="text-align:center;">
<p>Lock in your BSOV Tokens using SovCube's web3 interface, showcasing your commitment to BSOV Token's long-term value.</p>
<img src="/images/Sovcube-padlock-icon10.png" style="margin:0px 0px 0px 0px; z-index:11;" width="200px" ></img>
</div>
</div>

<div class="stats-container">
<center><h3 style="color:#F8B128;">Timelock Rewards</h3></center>
<p>Earn rewards by timelocking, and potentially double your investment when you're an early participant of SovCube's Timelock Rewards</p>
<br>
<div style="text-align:center;">
<img src="/images/Sovcube-padlock-icon11.png" style="margin:0px 0px 20px 0px; z-index:11;" width="200px" ></img>
</div>
</div>
<div class="stats-container">
<center><h3>Send or Pay using Timelocked Tokens</h3></center>

<p>Once you've timelocked your tokens, you can still utilize them!
 You can offer individuals a payment that remains locked for 1000 days. 
In essence, you can provide them with a Long-Term Savings Account by sending, gifting, or paying anyone with timelocked BSOV Tokens.</p>
</p>
<br>
</div>


</div>
</div>

<div class="button-container">
	<button onclick="window.location.href='/dapp/index.php'" class="launch-button">Launch dApp</button>
<p id="message" style="display: none; color: red; margin-top: 10px;">Under construction</p>
</div>


</div>
</div>
<script>
window.onload = function() {
    setTimeout(function() {
        document.querySelector('.body-container').classList.add('bg-loaded');
    }, 1000); // Wait for 2000 milliseconds before executing the code inside the function
};

</script>

</body>
</html>

