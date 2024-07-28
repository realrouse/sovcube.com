
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

<!--
<center><img class="img-fade"  src="/images/Sovcube-padlock-icon-white.png" height=150px width=auto style="opacity:0.9; position:fixed; z-index:1; margin-left:-5%; margin-top:400px;"></img> </center>
-->

<div class="body-container">

<div class="blurred-background"></div>

<div class="text-background">
<!--<center><p>The BSOV Token Community presents</p></center>-->
<center><h1 class="brand-name">SovCube</h1></center>
<center><p style="margin-bottom:100px; color:rgb(195, 195, 195, 0.9);"></p></center>
<img src="/images/locked-bsov.png" style="margin:0px 0px 0px 0px; z-index:11;" width="50px" ></img>
<center><h2 class="tagline">Timelock Today. Shape Tomorrow.</h2></center>
<center><h3 class="description-heading">Great decisions take time. Your vote shapes the future in our decentralized foundation.</h3></center>
<button onclick="window.location.href='#more'" class="launch-button-gold">Read More</button>
</div>

    <div class="text-container">

<center><h2 class="tagline" id="more">Long Commitment, Lasting Impact</h2></center>
<center><h3 class="description-heading">SovCube is a decentralized autonomous organization (DAO) that spends donated Treasury funds to various causes. Decision makers must demonstrate their commitment by locking their <a href="https://bsovtoken.com" target="_blank">BSOV Tokens</a> for an extended period.</h3></center>
<p style="text-align:center;"></p>

<!-- <p style="text-align:center;">Secure your <a href="https://bsovtoken.com" target="_blank">BSOV Tokens</a> with SovCube's web3 dApp<br>and smart-contract collection, which work similarly to a traditional long-term savings account.</p>-->
<br>
<center><h2 class="tagline">Features</h2></center>
<div class="stats-container">
<center><h3>Timelock Tokens</h3></center>
<div style="text-align:center;">
<p>Timelock your <a href="https://bsovtoken.com" target="_blank">BSOV Tokens</a> using SovCube's web3 interface to showcase your commitment to the token's long-term value. Become a Top Timelocker to qualify for voting power and earn voting rewards.</p>
<img src="/images/timelock-gold.png" style="margin:0px 0px 0px 0px; z-index:11;" width="200px" ></img><br>
<img src="/images/Sovcube-padlock-icon10.png" style="margin:0px 0px 0px 0px; z-index:11;" width="100px" ></img><br>
</div>
</div>

<div class="stats-container">
<div style="text-align:center;">
<center><h3 style="color:#F8B128;">Timelock Rewards for early users</h3></center>
<p>Earn rewards by timelocking, and potentially<br>double your investment (100% ROI) when you're an early participant of SovCube's Timelock Rewards.</p>
<br>
</div>
<div style="text-align:center;">
<img src="/images/Sovcube-padlock-icon11.png" style="margin:0px 0px 20px 0px; z-index:11;" width="200px" ></img>
</div>
</div>
<div class="stats-container">
<div style="text-align:center;">
<center><h3>Send or Pay using Timelocked Tokens</h3></center>

<p>Once you've timelocked your tokens, you can still use them!<br>
 You can offer individuals a payment that remains locked for 100 days.<br> 
In essence, you can send, gift, or pay anyone with timelocked BSOV Tokens.</p>
</p>
<img src="/images/send-locked-tokens.png" style="margin:0px 0px 20px 0px; z-index:11;" width="200px" ></img>
</div>
<br>
</div>

<div class="stats-container">
<div style="text-align:center;">
<center><h3>Propose, Vote, Be Rewarded (Under development)</h3></center>
<p>The decentralized foundation needs to spend donated funds on important causes.
Only the Top Timelockers can vote and receive Voting Rewards, but anyone can write proposals.
Will you take part in shaping the future?</p>
</p>
</div>
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

