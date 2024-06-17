<?php

?>



<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SovCube - About</title>
<link rel="stylesheet" href="/about/styles.css">
<link rel="stylesheet" href="/styles-fonts.css">
<link rel="icon" href="/images/favicon-logo.png" type="image/x-icon">
<script type="text/javascript">
        function showMessage() {
            document.getElementById('message').style.display = 'block';
        }
    </script>
<script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>

<!--<script src="/dapp/connect.js"> </script>-->
<?php  include $_SERVER['DOCUMENT_ROOT'] . '/tag.php';  
?>


</head>
<body>

<?php include $_SERVER['DOCUMENT_ROOT'] . '/menu.php'; ?>
<!--<?php include $_SERVER['DOCUMENT_ROOT'] . '/connect.php'; ?>-->
<div class="body-container">
<div class="text-container">
    <h1>About SovCube</h1>
    <p>
        SovCube is the name for a collection of smart-contracts that were made by voluntary contributors from the BSOV Token community, 
and was initially started with the deployment of a timelocking contract in August, 2019.
    </p>
	<p>
		The "Sov" part of the name "SovCube", representing "Store-of-Value," 
directly aligns with the core function of the system, which is to preserve the value of the BSOV Token.
 The "Cube" portion of the name suggests structure, stability, and containment, 
which fits well with the idea of securely timelocking tokens.
</p><p>
The SovCube concept was created around year 2020, when a community member wanted to conceptualize a name for the timelock contract that already existed (Contract 1) for BSOV Token.
In February 2024, the SovCube website was redesigned and launched with the creation of Contract 2 and the Rewards Reserve Contract.
	</p>
	<h2>Contact and support</h2>
    <p class="linklist">
        You can go to the <a class="linklist" target="_blank" href="https://t.me/SovCube">SovCube Telegram group</a> and ask for help, or if you have any issues or find any bugs.
    </p>

<h2 style="text-align:center;">Links</h2>
   <ul class="linklist" style="text-align:center;">
        <li><a href="https://github.com/realrouse/sovcube.com" target="_blank">SovCube - Github</a></li>
        <li><a href="https://t.me/SovCube" target="_blank">SovCube - Telegram</a></li>
        <li><a href="https://bsovtoken.com" target="_blank">BSOV Token - Website</a></li>
        <li><a href="https://t.me/BitcoinSoVCommunity" target="_blank">BSOV Token - Telegram</a></li>
        <li><a href="https://bsovtoken.com/trade" target="_blank">Buy BSOV Tokens</a></li>
    </ul>

<h2>How is SovCube funded and developed?</h2>
<p class="linklist">SovCube has been developed by a long-term voluntary community contributor named "Rouse",
 and the Timelock Rewards are entirely self-funded through Rouse's investment in BSOV Token.
You can visit the <a class="linklist" href="https://github.com/realrouse/sovcube.com" target="_blank">SovCube Github</a>
 repository to see the code for the dApp and smart-contracts, and potentially contribute.</p>
    <h2>What is BSOV Token</h2>
<p class="linklist">
The full name of BSOV Token is "BitcoinSoV", where the SoV stands for Store-of-Value.
BSOV Token is a deflationary cryptocurrency and a PoW (Proof of Work) mineable ERC20 Token built on the Ethereum Blockchain.
 It features a supply schedule and halvings reminiscent of Bitcoin.
</p>
<p class="linklist"> 
However, the mining functionality of BSOV Token has ceased, halting any further inflation.
 Consequently, no additional BSOV Tokens will be created under that specific token contract. You can find more info about BSOV Token
 on their website at <a class="linklist" target="_blank" href="https://bsovtoken.com">bsovtoken.com</a>
</p>


</div>

<!--<script src="/dapp/app.js"></script> -->

</div>
</body>
</html>
