
<?php

?>



<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <title>SovCube</title>
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="styles-fonts.css">
<link rel="icon" href="/images/favicon-logo.png" type="image/x-icon">

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation"></script>
<script type="text/javascript">
        function showMessage() {
            document.getElementById('message').style.display = 'block';
        }
    </script>
<!--<script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>-->

<?php  include $_SERVER['DOCUMENT_ROOT'] . '/tag.php';  
?>


</head>

<body>
<div id="clear-background"></div>
<div id="blurred-background"></div>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/menu.php'; ?>

<?php

include('config.php');

// Include the functions file
include('functions.php');


// Assuming $conn is your database connection variable
$contract2Data = get_stats_contract2_data($conn);

// Check if data was fetched successfully
if ($contract2Data) {
    $globalLockTime = $contract2Data['globalLockExpirationDateRegularAccount'];
    // Convert the global lock time to a more readable format if needed, e.g., days remaining
    $currentTime = time(); // Current timestamp
    $timeRemaining = max(0, $globalLockTime - $currentTime);
    $daysRemaining = floor($timeRemaining / 86400); // Convert seconds to days
} else {
    $daysRemaining = 'N/A'; // If data fetching failed, set to 'N/A'
}



?>

<!--
<center><img class="img-fade"  src="/images/Sovcube-padlock-icon-white.png" height=150px width=auto style="opacity:0.9; position:fixed; z-index:1; margin-left:-5%; margin-top:400px;"></img> </center>
-->
<div class="body-container">

<div class="blurred-background"></div>

<div class="text-background">
<!--<center><p>The BSOV Token Community presents</p></center>-->
<center><h1 class="brand-name">SovCube</h1></center>
<center><img  src="/images/ani-locked-bsov-padlock-small.gif" style="margin:0px 0px 0px 0px; z-index:11;" width="100px" alt="BSOV Token" ></img></center><br>
<center><h2 class="tagline">Timelock Today. Shape Tomorrow.</h2></center>
<p style="text-align:center;" class="tagline-body">Unlock the potential of your BSOV Tokens, a Store-of-Value (SoV) cryptocurrency, by locking them in the SovCube dApp, built on Ethereum. By timelocking your tokens, you can earn rewards and participate in a community-driven decentralized foundation.</p>
<center><h3 class="description-heading">Great decisions take time.<br>Shape the future with thoughtful decisions and your vote in our decentralized foundation.</h3></center>
<button onclick="window.location.href='#more'" class="launch-button-gold">Read More</button>
<div class="arrow-down"></div>
</div>
            
    <div class="text-container">

<center><h2 class="tagline" id="more">Long Commitment, Lasting Impact</h2></center>
<center><h3 class="description-heading">Join SovCube, a decentralized autonomous organization (DAO) where your commitment gives you a vote to spend money from a community-governed Treasury to meaningful causes <span style="text-decoration: underline;"  data-toggle="tooltip" data-html="true" data-original-title="<h3>Types of Causes:</h3> <p>The Treasury can support a variety of initiatives, such as funding small projects, charitable efforts, and further development and outreach of SovCube. Whether it's contributing to community-driven ventures or expanding the reach and impact of SovCube itself, the community has the power to decide where the resources are best allocated.</p><br>
<h3>The Future Awaits:</h3> <p>Who knows what SovCube’s impact could be? Will it help tackle global challenges like hunger, or even lay the groundwork for a new digital nation? The only limit is the community's imagination, and the capital that is invested into SovCube.</p>
" >(?)</span>.<br><br>Any member can qualify to become a decision maker by demonstrating their commitment through locking their <a href="https://bsovtoken.com" target="_blank">BSOV Tokens</a> for an extended period.</h3></center>
<p style="text-align:center;"></p>
<!-- <p style="text-align:center;">Secure your <a href="https://bsovtoken.com" target="_blank">BSOV Tokens</a> with SovCube's web3 dApp<br>and smart-contract collection, which work similarly to a traditional long-term savings account.</p>-->
<br>
<center><h2 class="tagline">Features</h2></center>



<div class="stats-container">
<div style="text-align:left;">
<center><h3>Propose, Vote, Be Rewarded (Under development)</h3></center>
<p>
<strong>Exciting developments ahead:</strong> The decentralized foundation allocates funds to significant causes, determined entirely by the community. Proposal Makers suggest ideas, while Top Timelockers vote and receive Voting Rewards, ensuring SovCube reflects the priorities of its most committed members.
</p>
<details>
<summary>
<h4>Governance, Treasury & Incentives</h4>
</summary>
	    <ul>
<li>
                    <p><strong>Treasury:</strong> A fund financed by generous donations from philanthropists and the BSOV Community. Through SovCube, these contributions are directed towards meaningful projects and initiatives that create a lasting impact.</p>
                </li>

                <li>
                    <p><strong>Skin-in-the-game:</strong> Commitment to SovCube is a requirement, ensuring decisions are sound and resilient to voting attacks, creating a robust governance system.</p>
                </li>
                <li>
                    <p><strong>1 Vote per User:</strong> In the beginning, only the top 100 Timelockers can vote, making it costly to acquire multiple votes and ensuring true decentralization.</p>
                </li>
                <li>
                    <p><strong>Decision Maker Pool Decentralizes over Time:</strong> Every four years, a <b>Doubling</b> event will expand the Decision Maker Pool, doubling the number of Top Timelockers eligible to vote.</strong> The first event will increase participation from the top 100 to the top 200, and over 40 years, this pool will grow to include 102,400 individuals. This gradual expansion will empower more people to actively participate in the decision-making process.
                </li>
                <li>
                    <p><strong>Voting Rewards:</strong> To incentivize participation, every Top Timelocker will receive Voting Rewards in the form of BSOV Tokens during the Yearly Vote, where they vote on a proposal to allocate funds from the treasury. Rewards are only given to those Top Timelockers who actively participate in the voting process.</p>
                </li>
                <li>
                    <p><strong>1 Decision per Year:</strong> Only one proposal will win per year, so every vote counts. This scarcity drives competition among proposals, ensuring that only the most impactful and well-supported ideas rise to the top. It also gives the community ample time to thoroughly evaluate each proposal, making the final decision a meaningful reflection of the community's collective vision and commitment to the future of SovCube.</p>
                </li>


            </ul>

</details>

<div class="tech-cube-container">
    <img class="tech-cube-img" src="/images/tech-cube.webp" alt="Tech Cube Image">
</div>



</div>
<br>
</div>


<div class="stats-container">
<div style="text-align:left;">
<center><h3 style="color:#F8B128;">Timelock Rewards for Early Participants</h3></center>
<p>During SovCube's initial onboarding phase, the SovCube smart-contract offers an exclusive opportunity to maximize your BSOV token holdings. By participating early in the Timelock Rewards System, you can earn substantial rewards (up to 100% ROI) as the community progresses through various tiers.
<br>
<div class="how-it-works">
<details>
   <summary> <center><h4>How Rewards Work</h2></center></summary>
    <ul>
        <li> <p>         <strong>Earn up to 100% ROI:</strong> The sooner you timelock your BSOV Tokens, the higher your potential return on investment (ROI). Early participants can earn up to 100% ROI in the first reward tier.
       </p> </li>
        <li><p>
            <strong>Progress Through Reward Tiers:</strong> As more tokens are timelocked by the community, the reward tiers decrease, starting from 150,000 BSOV in Tier 1, with each subsequent tier offering reduced rewards.
       </p> </li>
        <li><p>
            <strong>Limited-Time Offer:</strong> This opportunity is only available during the initial onboarding phase, so the earlier you participate, the greater your rewards.
     </p>   </li>
    </ul>


</div>

</div>
</details>
<div style="text-align:center;">
<!--<img src="/images/Sovcube-padlock-icon11.png" style="margin:0px 0px 20px 0px; z-index:11;" width="200px" ></img>-->
<img src="/images/sovcube-reward2.png" style="margin:0px 0px 20px 0px; z-index:11;" width="55px" ></img>

</div>
</div>


<div class="stats-container">
<center><h3>Timelock Tokens</h3></center>
<div style="text-align:left;">
<p>Timelock your <a href="https://bsovtoken.com" target="_blank">BSOV Tokens</a> using SovCube's web3 interface, which means locking them in a secure smart contract for a set period. During this time, your tokens cannot be moved or traded, demonstrating your commitment to the token's long-term value. However, your tokens remain yours and will be fully withdrawable once the timelock period ends.</p>
<p>As a reward for your dedication, earn Timelock Rewards during the onboarding phase, or qualify to become a Top Timelocker to gain Voting Power and receive Voting Rewards.</p>

<details>
   <summary> <center><h4>Timelock Periods</h4></center></summary>
    <ul>
        <li>
            <p><strong>Onboarding Period:</strong> For the first 1000 days after SovCube was created, all timelocked tokens for all users were locked for the entire period. It is called "Global Lock Time".</p>
        </li>
        <li>
            <p><strong>Post-Onboarding:</strong> After the 1000-day Global Lock Time, new users face a 70-day lock, while existing users only have a 14-day lock.</p>
	</li>
 <li>
 <p id="daysGlobalLockTime"><strong>Global Lock Time: </strong><span style="color:orange;"><?php echo $daysRemaining; ?> days</span> remain of the Global Lock Time</p>
        </li>

    </ul>

<!--<img src="/images/Sovcube-padlock-icon10.png" style="margin:0px 0px 0px 0px; z-index:11;" width="100px" ></img><br>-->
</div>
</details>
<center><img src="/images/timelock-gold-padlock5.png" style="margin:0px 0px 0px 0px; z-index:11;" width="300px" ></img></center><br>
</div>



<div class="stats-container">
    <div style="text-align:left;">
        <center><h3>Withdrawal Process</h3></center>
        <p>The Gradual Release Withdrawal Mechanism (GRWM) is designed to ensure market stability by controlling the flow of token withdrawals, preventing any sudden large-scale sell-offs.</p>
	<br>




        <div class="how-it-works">
	 
<details>
 <summary>  <center><h4>Gradual Release:</h4></center></summary>
            <ul>
                <li>
                    <p><strong>Weekly Limit:</strong> Withdrawals are capped at 100 BSOV tokens per week per user, allowing for a steady and controlled release of tokens.</p>
                </li>
                <li>
                    <p><strong>Withdrawal Halvings:</strong> Every 4 years, the weekly withdrawal limit is halved. For example, after the first halving, the limit will be reduced to 50 BSOV tokens per week, further slowing the release rate over time.</p>
                </li>
	    </ul>





        </div>
    </div>
</details>

<body style="background-color: #1e1e1e; color: white;">
<div style="width: 100%; height: 500px;">
    <h4 style="text-align: center;">SovCube Withdrawal Timeline and Halvings</h4>
    <canvas id="sovCubeChart"></canvas>
  </div>








</body>



    <div style="text-align:center;">
        <!--<img src="/images/Sovcube-padlock-icon11.png" style="margin:0px 0px 20px 0px; z-index:11;" width="200px" ></img>-->
        <!--<img src="/images/sovcube-reward2.png" style="margin:0px 0px 20px 0px; z-index:11;" width="55px"></img> -->
    </div>
</div>

<div class="stats-container">
<div style="text-align:left;">
<center><h3>Send or Pay using Timelocked Tokens</h3></center>

<p>Your timelocked tokens aren't just locked away—they're flexible. Use them to make payments, send gifts, or offer donations, with an additional 100-day lock period applied to the recipient's address to prevent misuse.</p>
</p>
<center><img src="/images/send-locked-tokens-users8.png" style="margin:0px 0px 20px 0px; z-index:11;" class="locked-tokens-img" ></img></center>
</div>
<br>
</div>




</div>
</div>

<div class="button-container">
    <button onclick="window.location.href='/dapp'" class="launch-button">Launch dApp</button>
    <button onclick="window.location.href='/docs'" class="launch-button">Read Docs & Help</button>
    <p id="message" style="display: none; color: red; margin-top: 10px;">Under construction</p>
</div>

</div>
</div>
<script>
window.onload = function() {
    setTimeout(function() {
        document.querySelector('.body-container').classList.add('bg-loaded');
    }, 500); // Wait for 2000 milliseconds before executing the code inside the function
};




document.querySelectorAll('details').forEach((detail) => {
  detail.addEventListener('toggle', function() {
    if (this.open) {
      this.style.maxHeight = this.scrollHeight + "px";
    } else {
      this.style.maxHeight = "50px"; // Set to the height of the summary
    }
  });
});


</script>


<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

<script src="/withdrawchart.js"></script>


<script>
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip(); 
});
</script>



</body>
</html>

