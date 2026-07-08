<?php

include("db_connect.php");

if($_SERVER["REQUEST_METHOD"]=="POST"){

$email = mysqli_real_escape_string($conn,$_POST["email"]);
$password = mysqli_real_escape_string($conn,$_POST["password"]);

$query = "SELECT * FROM user WHERE email='$email' AND password='$password'";

$result = mysqli_query($conn,$query);
if(mysqli_num_rows($result) > 0){

    echo "<h2 style='color:green;'>Login Successful!</h2>";

}
else{

    echo "<h2 style='color:red;'>Invalid Email or Password!</h2>";

}
}

?>
