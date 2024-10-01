<?php
?>
<link rel="stylesheet" href="/menu-styles.css">
 <div id="menu" class="menu-header">
        <a href="/index.php" class="menu-item-img"><img src="/images/sovcube-logo.png" alt="Logo"></a>
        <a href="/docs/index.php" class="menu-item">Docs & Help</a>
        <a href="/stats/index.php" class="menu-item">Stats</a>
        <a href="/about/index.php" class="menu-item">About</a>
	<a href="/treasury/index.php" class="menu-item treasury-menu">Treasury</a>
	<a href="/rewards/index.php" class="menu-item rewards-menu">Rewards</a>

    </div>
<div class="account-header">

        <a href="/dapp/index.php" class="menu-item menu-launch-button">dApp</a>
	<a href="/account/index.php" class="menu-item">My Account</a>
</div>


    <!-- Hamburger icon -->
    <div class="menu-toggle" id="menu-toggle">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
    </div>

    <!-- Mobile menu -->
    <nav class="mobile-menu" id="mobile-menu">
        <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
        </ul>
    </nav>

    <script>
        // Toggle the menu and account-header visibility
        document.getElementById("menu-toggle").addEventListener("click", function() {
            document.getElementById("menu").classList.toggle("active");
            document.querySelector(".account-header").classList.toggle("active");
            this.classList.toggle("active");
        });
    </script>
