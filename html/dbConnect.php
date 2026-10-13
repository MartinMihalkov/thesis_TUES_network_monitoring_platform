<?php
$servername = "192.168.200.2";
$username = "root";
$password = "root";
$dbname = "platform";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
//   die("Connection failed: " . $conn->connect_error);
  header('Content-Type: application/json');
  http_response_code(500);
  echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
  exit();

}
// echo "Connected successfully";
header('Content-Type: application/json; charset=utf-8');

header("Access-Control-Allow-Origin: *");
$sql = "SELECT id, username, pass_hash FROM users";
$result = $conn->query($sql);

// 5. Проверка дали има намерени записи
if ($result->num_rows > 0) {
  $data = array();
  
  // Извличане на всеки ред като асоциативен масив
  while($row = $result->fetch_assoc()) {
    $data[] = $row;
  }
  
  // Връщане на данните в JSON формат
  http_response_code(200);
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
} else {
  // Ако няма записи в таблицата
  http_response_code(404);
  echo json_encode(["message" => "No records found."]);
}

// 6. Затваряне на връзката
$conn->close();
?>