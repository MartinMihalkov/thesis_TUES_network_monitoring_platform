<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "192.168.200.2";
$username_db = "root";
$password_db = "root";
$dbname = "platform";

$conn = new mysqli($servername, $username_db, $password_db, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Връзката пропадна: " . $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$user = trim($data['username'] ?? '');
$pass = $data['password'] ?? '';

if (empty($user) || empty($pass)) {
    http_response_code(400);
    echo json_encode(["error" => "Моля, въведете потребителско име и парола."]);
    $conn->close();
    exit();
}

// Извличане на потребителя и неговия хеш от базата данни
$sql = "SELECT username, pass_hash FROM users WHERE username = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();
    
    // ВАЖНО: Дехеширане и проверка на паролата
    if (password_verify($pass, $row['pass_hash'])) {
        http_response_code(200);
        echo json_encode([
            "message" => "Успешен вход!",
            "username" => $row['username']
        ]);
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(["error" => "Грешна парола."]);
    }
} else {
    http_response_code(401);
    echo json_encode(["error" => "Потребителят не съществува."]);
}

$stmt->close();
$conn->close();
