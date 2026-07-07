<?php

include('db_connect.php');


$name = mysqli_real_escape_string($conn, $_POST['fullname']);
$email = mysqli_real_escape_string($conn, $_POST['email']);
$phone = mysqli_real_escape_string($conn, $_POST['phonenumber']);
$dob = mysqli_real_escape_string($conn, $_POST['dtDob']);


$errors = [];
$success = "";
 
 
  // Name: required only
  if ($name === '') {
    $errors['fullname'] = 'Name is required.';
    echo "Name is required.";
  }

  // Email: required only
  if ($email === '') {
    $errors['email'] = 'Email is required.';
    echo "Email is required.";
  }

  if (empty($errors)) {
    $success = 'Form submitted successfully.';

     $sql = "INSERT INTO `user` (`ID`, `name`, `email`, `phonenumber`, `time`, `dob`) VALUES (NULL, '$name', '$email', '$phone', current_timestamp(), '$dob')";

      if (mysqli_query($conn, $sql)) {
        echo "New record created successfully";
         } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
  }
    
    
  }
 

  $folderPath = "uploads/";
  if(!is_dir($folderPath)) {
    mkdir($folderPath, 0777, true);
  }

  if (isset($_FILES['myfile'])) {
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

    $extension = strtolower(pathinfo($_FILES['myfile']['name'], PATHINFO_EXTENSION));
    $maxSize = 20 * 1024 * 1024; // 2MB

     if(!in_array($extension, $allowedTypes)) {
    echo "Error: Only JPG, PNG, GIF, and PDF files are allowed.";
  } elseif ($_FILES['myfile']['size'] > $maxSize) {
    echo "Error: File size exceeds the 2MB limit.";
  } else {
    $newFileName = uniqid() . '.' . $extension;
    $destination = $folderPath . $newFileName;

    if (move_uploaded_file($_FILES['myfile']['tmp_name'], $destination)) {
      echo "File uploaded successfully: " . $newFileName;
    } else {
      echo "Error uploading file.";
    }
  }
  }



?>
