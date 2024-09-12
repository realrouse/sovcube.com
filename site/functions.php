<?php




include('config.php');
// $timelockRewardReserveContractAddress = "0xFC88e4103A5e3647cF3661e2ef41C985b73585DB"; // Put Timelock Reward Reserve Contract Address here
$columnName = "netAmount"; // Replace with the column name you want to select
$condition = "address = 'TOTAL'"; // Replace with your condition to select the row with address 'TOTAL'


function formatBigInt($value) {
    return number_format((float) $value, 0, '.', ',');
}




function timelockLeaderboard($tableName) {

$timelockRewardReserveContractAddress = "0x88BeA0051854c7C9c9f664594c5e440227F98039"; // insert Timelock Reward Reserve Contract Address here
 	global $conn, $giveawayReserveContractAddress;
// echo "POST Address inside function: " . $giveawayReserveContractAddress . "<br>";


   // echo json_encode($leaderboard);
    
    // Construct the SQL query to select addresses, totalFrozen, totalUnfrozen, and netAmount
    $sql = "SELECT address, totalFrozen, totalUnfrozen, netAmount FROM $tableName";

    // Execute the query
    $result = $conn->query($sql);

    $leaderboard = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {

  //    echo " - POST Address inside while loop: " . $rewardsReserveContractAddress . "<br>";
 if ($row['address'] === 'TOTAL') {
                // For "TOTAL" address, don't shorten and don't create a link
                $formattedAddress = 'TOTAL';
} elseif ($row['address'] === $timelockRewardReserveContractAddress) {
                $formattedAddress = '<a target="_blank" href="https://etherscan.io/address/' . $row['address'] . '">Timelock Reward Reserve</a>';
            } else {
                // For other addresses, format as a link with shortened representation
                $formattedAddress = '<a target="_blank" href="https://etherscan.io/address/' . $row['address'] . '">' . substr($row['address'], 2, 5) . '...</a>';
            }

/*
// Format the address (show first 5 characters and link to etherscan)
            $formattedAddress = '<a href="https://etherscan.io/address/' . $row['address'] . '">' . substr($row['address'], 2, 5) . '...</a>';
 */
            // Calculate the netAmount and format it
            $netAmount = $row['netAmount'];
	    $totalFrozen = $row['totalFrozen'];
	    $totalUnfrozen = $row['totalUnfrozen'];

         //   $formattedNetAmount = number_format($netAmount, 0, '.', ',');

$formattedNetAmount = formatBigInt($row['netAmount']);
$formattedTotalFrozen = formatBigInt($row['totalFrozen']);
$formattedTotalUnfrozen = formatBigInt($row['totalUnfrozen']);

            $leaderboard[] = [
                'address' => $formattedAddress,
                'totalFrozen' => $formattedTotalFrozen,
                'totalUnfrozen' => $formattedTotalUnfrozen,
                'netAmount' => $formattedNetAmount,
            ];
        }
/*
        // Sort the leaderboard by netAmount in descending order
        usort($leaderboard, function ($a, $b) {
            return $b['netAmount'] - $a['netAmount'];
	});

 */
// Sort the leaderboard by netAmount in descending order
usort($leaderboard, function ($a, $b) {
    $netAmountA = (int) str_replace(',', '', $a['netAmount']);
    $netAmountB = (int) str_replace(',', '', $b['netAmount']);

    return $netAmountB - $netAmountA; // Descending order
});

    }

    return $leaderboard;
}




// Function to get the totalTimelocked value
function getTotalTimelockedValue($tableName) {
    global $conn;

    $columnName = "netAmount";
    $condition = "address = 'TOTAL'";

    // Construct the SQL query
    $sql = "SELECT $columnName FROM $tableName WHERE $condition";

    // Execute the query
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Fetch the result as an associative array
        $row = $result->fetch_assoc();

        // Return the value
        return $row[$columnName];
    } else {
        // No rows found
        return null;
    }
}






// Function to fetch data from stats_token
function get_stats_token_data($conn) {
    $sql = "SELECT * FROM stats_token WHERE id = 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $burnPercent = $row['burnPercent'];
        $name = $row['name'];
        $totalSupply = $row['totalSupply'];
        $decimals = $row['decimals'];
        $_totalSupply = $row['_totalSupply'];
        $maxSupplyForEra = $row['maxSupplyForEra'];
        $tokensMinted = $row['tokensMinted'];
        $balanceOfBurntTokens = $row['balanceOfBurntTokens'];
        $owner = $row['owner'];
        $symbol = $row['symbol'];
        $newOwner = $row['newOwner'];

        return compact('burnPercent', 'name', 'totalSupply', 'decimals', '_totalSupply', 'maxSupplyForEra', 'tokensMinted', 'balanceOfBurntTokens', 'owner', 'symbol', 'newOwner');
    } else {
        return null;
    }
}

// Function to fetch data from stats_contract1
function get_stats_contract1_data($conn) {
    $sql = "SELECT * FROM stats_contract1 WHERE id = 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $getTimeLeft = $row['getTimeLeft'];

        return compact('getTimeLeft');
    } else {
        return null;
    }
}

// Function to fetch data from stats_contract2
function get_stats_contract2_data($conn) {
    $sql = "SELECT * FROM stats_contract2 WHERE id = 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $currentGlobalTier = $row['currentGlobalTier'];
        $deploymentTimestamp = $row['deploymentTimestamp'];
        $getGlobalTimeLeftRegularAccount = $row['getGlobalTimeLeftRegularAccount'];
        $getTimestampOfNextWithdrawalHalving = $row['getTimestampOfNextWithdrawalHalving'];
        $globalLockExpirationDateRegularAccount = $row['globalLockExpirationDateRegularAccount'];
        $isContractSeeded = $row['isContractSeeded'];
        $lastWithdrawalHalving = $row['lastWithdrawalHalving'];
        $owner = $row['owner'];
        $periodWithdrawalAmount = $row['periodWithdrawalAmount'];
        $totalCumulativeTimelocked = $row['totalCumulativeTimelocked'];
        $totalCurrentlyTimelocked = $row['totalCurrentlyTimelocked'];
        $totalRewardsEarned = $row['totalRewardsEarned'];
        $totalRewardsSeeded = $row['totalRewardsSeeded'];
        $withdrawalHalvingEra = $row['withdrawalHalvingEra'];

        return compact('currentGlobalTier', 'deploymentTimestamp', 'getGlobalTimeLeftRegularAccount', 'getTimestampOfNextWithdrawalHalving', 'globalLockExpirationDateRegularAccount', 'isContractSeeded', 'lastWithdrawalHalving', 'owner', 'periodWithdrawalAmount', 'totalCumulativeTimelocked', 'totalCurrentlyTimelocked', 'totalRewardsEarned', 'totalRewardsSeeded', 'withdrawalHalvingEra');
    } else {
        return null;
    }
}





?>
