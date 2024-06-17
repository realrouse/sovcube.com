<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SovCube - Timelock Rewards</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="/styles-fonts.css">
<link rel="icon" href="/images/favicon-logo.png" type="image/x-icon">
<script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>
<?php  include $_SERVER['DOCUMENT_ROOT'] . '/tag.php';  
?>

</head>

<body>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/menu.php'; ?>

    <div class="body-container">
        <div class="blurred-background"></div>

        <div class="text-container">
            <h1 class="brand-name">Timelock Rewards</h1>
            <h2>Be Early To Maximize Your Rewards</h2>

            <p>Welcome to SovCube Timelock Rewards! We're inviting the community to participate in a unique event that will last for years, where early users have the chance to double their <a href="https://bsovtoken.com" target="_blank">BSOV token</a> holdings. Here's how you can be a part of it:</p>
<div class="stats-container">
<div id="roiDisplay">
    <h4>Receive <span id="roiPercentage">[Loading...]</span>% ROI of your investment if you timelock tokens in the current tier</h4>
</div>
</div>

            <div class="button-container"> 
                <p>Time-lock your BSOV Tokens to be eligible for Timelock Rewards. Click the button below to access the web3 dApp and start timelocking your BSOV Tokens!</p>
	<button onclick="window.location.href='/dapp/index.php'" class="launch-button">Receive Timelock Rewards</button>
            </div>
</div>


<div class="body-container">
<div class="text-container">     
	    <h3>Understanding the Reward Tiers</h3>
<p>The following numbers provide statistical insights applicable to all SovCube users.</p>
<div class="rewards-progress-container">
    <div class="rewards-progress-bar" id="rewardsProgressBar" data-tooltip="Current Progress: [Not Loaded...] / 1,500,000 BSOV">
        <div class="current-progress" style="width: calc(0 / 1500000 * 100%);"></div>
        <!-- Markers for every 150,000 tokens -->
        <div class="marker" style="left: calc(150000 / 1500000 * 100%);" title="150,000 Tokens"></div>
        <div class="marker" style="left: calc(300000 / 1500000 * 100%);" title="300,000 Tokens"></div>
        <div class="marker" style="left: calc(450000 / 1500000 * 100%);" title="450,000 Tokens"></div>
        <div class="marker" style="left: calc(600000 / 1500000 * 100%);" title="600,000 Tokens"></div>
        <div class="marker" style="left: calc(750000 / 1500000 * 100%);" title="750,000 Tokens"></div>
        <div class="marker" style="left: calc(900000 / 1500000 * 100%);" title="900,000 Tokens"></div>
        <div class="marker" style="left: calc(1050000 / 1500000 * 100%);" title="1,050,000 Tokens"></div>
        <div class="marker" style="left: calc(1200000 / 1500000 * 100%);" title="1,200,000 Tokens"></div>
        <div class="marker" style="left: calc(1350000 / 1500000 * 100%);" title="1,350,000 Tokens"></div>
        <!--<div class="marker" style="left: calc(1500000 / 1500000 * 100%);" title="1,500,000 Tokens"></div>-->
    </div>
</div>
<p>This progress bar above represents the total timelocked tokens from all users. The red markers indicate progress towards the next tier, achieved every time all our users timelock 150,000 BSOV tokens in total.</p>
<div class="stats-container">
<div id="totalTimelockedDisplayElement" class="stats-container">
    <h3>Total Timelocked Tokens Eligible for Rewards:</h3>
    <p id="totalTimelockedAmount">Loading...</p>
</div>

<div id="totalRewardsSentDisplayElement" class="stats-container">
    <h3>Total Rewards Earned by Users:</h3>
    <p id="totalRewardsSentAmount">Loading...</p>
</div>

<div id="rewardsLeftDisplay" class="stats-container">
    <h3>Reward Tokens Remaining:</h3>
    <p id="rewardsLeft">Loading...</p>
</div>


<div id="currentTierDisplay" class="stats-container">
    <h3>Current Tier:</h3>
    <p id="currentTier">Loading...</p>
</div>
</div>
	    
<p>With this Timelock Reward Tier Schedule, we are distributing <strong>300,000 BSOV tokens</strong> in a structured tier system. Each tier represents a phase in the Timelock Rewards System, and for every 150,000 tokens that are time-locked in total by the community, we progress through these tiers.</p>
<p>The reward for each tier halves compared to the previous one, starting from a generous 150,000 BSOV in the first tier. This structure ensures a fair and rewarding experience for all participants, especially those who join early.</p>

            <div class="rewards-container">
                <!-- Individual Tier Descriptions -->
                <!-- Repeat for other rewards -->
                    

<div class="rewards" id="rewards1">
    <h2>Reward Tier 1</h2>
    <p>Total Tier Reward: <strong>150,000 BSOV</strong> (100.00% ROI).<br><span class="per1000bsov">Timelocking 1,000 BSOV receives approximately 1,000 BSOV.</span></p>
</div>
<div class="rewards" id="rewards2">
    <h2>Reward Tier 2</h2>
    <p>Total Tier Reward: <strong>75,000 BSOV</strong> (50.00% ROI).<br><span class="per1000bsov">Timelocking 1,000 BSOV receives approximately 500 BSOV.</span></p>
</div>
<div class="rewards" id="rewards3">
    <h2>Reward Tier 3</h2>
    <p>Total Tier Reward: <strong>37,500 BSOV</strong> (25.00% ROI).<br><span class="per1000bsov">Timelocking 1,000 BSOV receives approximately 250 BSOV.</span></p>
</div>
<div class="rewards" id="rewards4">
    <h2>Reward Tier 4</h2>
    <p>Total Tier Reward: <strong>18,750 BSOV</strong> (12.50% ROI).<br><span class="per1000bsov">Timelocking 1,000 BSOV receives approximately 125 BSOV.</span></p>
</div>
<div class="rewards" id="rewards5">
    <h2>Reward Tier 5</h2>
    <p>Total Tier Reward: <strong>9,375 BSOV</strong> (6.25% ROI).<br><span class="per1000bsov">Timelocking 1,000 BSOV receives approximately 62.5 BSOV.</span></p>
</div>
<div class="rewards" id="rewards6">
    <h2>Reward Tier 6</h2>
    <p>Total Tier Reward: <strong>4,687 BSOV</strong> (3.12% ROI).<br><span class="per1000bsov">Timelocking 1,000 BSOV receives approximately 31.25 BSOV.</span></p>
</div>
<div class="rewards" id="rewards7">
    <h2>Reward Tier 7</h2>
    <p>Total Tier Reward: <strong>2,343 BSOV</strong> (1.56% ROI).<br><span class="per1000bsov">Timelocking 1,000 BSOV receives approximately 15.62 BSOV.</span></p>
</div>
<div class="rewards" id="rewards8">
    <h2>Reward Tier 8</h2>
    <p>Total Tier Reward: <strong>1,171 BSOV</strong> (0.78% ROI).<br><span class="per1000bsov">Timelocking 1,000 BSOV receives approximately 7.81 BSOV.</span></p>
</div>
<div class="rewards" id="rewards9">
    <h2>Reward Tier 9</h2>
    <p>Total Tier Reward: <strong>585 BSOV</strong> (0.39% ROI).<br><span class="per1000bsov">Timelocking 1,000 BSOV receives approximately 3.90 BSOV.</span></p>
</div>
<div class="rewards" id="rewards10">
    <h2>Reward Tier 10</h2>
    <p>Total Tier Reward: <strong>585 BSOV</strong> (0.39% ROI).<br><span class="per1000bsov">Timelocking 1,000 BSOV receives approximately 3.90 BSOV.</span></p>
</div>



            <p>Join the SovCube Timelock Rewards System, lock in your BSOV, and be part of this rewarding journey. The sooner you participate, the higher your potential reward. Let’s time-lock and boost our holdings together!</p>
        </div>
    
</div>
<script src="/dapp/config.js"></script>
<script src="/rewards/rewards-progress.js"></script>
</body>
</html>
