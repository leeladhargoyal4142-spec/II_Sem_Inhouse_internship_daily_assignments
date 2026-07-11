<?php

include("dashboardheader.php");

session_start();

echo "Welcome, " .$_SESSION['user_name']. "! You are logged in as " .$_SESSION['user_email']. ".";
?>

<br>
<a href="updatePassword.php"> Update Password </a>

<?php
include("footer.php");
?>
