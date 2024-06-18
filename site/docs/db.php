<?php
// Query for timelock_contract_1
$query1 = "SELECT netAmount FROM timelock_contract_1 WHERE address = 'TOTAL'";

// Query for timelock_contract_2
$query2 = "SELECT netAmount FROM timelock_contract_2 WHERE address = 'TOTAL'";

// Execute the queries
$result1 = $conn->query($query1);
$result2 = $conn->query($query2);

// Check for query execution errors
if (!$result1 || !$result2) {
    die("Query failed: " . $conn->error);
}

// Fetch data from the results
$row1 = $result1->fetch_assoc();
$row2 = $result2->fetch_assoc();

// Close the database connection
$conn->close();
?>
