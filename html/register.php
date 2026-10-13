<?php
// 1. HTTP Хедъри за REST API и CORS
header("Access-Control-Allow-Origin: *"); // Разрешава CORS заявки от Vue/Frontend
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Задължително добавете OPTIONS
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// 1.5 Автоматично обработване на Preflight OPTIONS заявката от браузъра
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Преflight заявката ТРЯБВА да върне статус 200 OK
    exit(); // Спираме скрипта тук, браузърът е удовлетворен
}

// 2. Настройки на връзката
$servername = "192.168.200.2";
$username_db = "root";
$password_db = "root";
$dbname = "platform";

$conn = new mysqli($servername, $username_db, $password_db, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Връзката с базата данни пропадна: " . $conn->connect_error]);
    exit();
}

// 3. Сега проверяваме дали същинският метод е точно POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Методът не е разрешен. Използвайте POST."]);
    $conn->close();
    exit();
}

// 4. Взимане на изпратените данни (поддържа JSON и стандартна форма)
$data = json_decode(file_get_contents("php://input"), true);

// Ако данните не са изпратени като JSON, проверяваме стандартния $_POST
$user = $data['username'] ?? $_POST['username'] ?? null;
$pass = $data['password'] ?? $_POST['password'] ?? null;

// Почистване и валидация
$user = trim($user);

if (empty($user) || empty($pass)) {
    http_response_code(400);
    echo json_encode(["error" => "Моля, въведете потребителско име и парола."]);
    $conn->close();
    exit();
}

// 5. Сигурно хеширане на паролата (използва силния алгоритъм bcrypt)
$hashed_password = password_hash($pass, PASSWORD_BCRYPT);

// 6. Запис в базата данни чрез Подготвена заявка (Prepared Statement)
// КОРИГИРАНО: Сменено от "password" на "pass_hash"
$sql = "INSERT INTO users (username, pass_hash) VALUES (?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt) {
    // Обвързване на параметрите ("ss" означава два стринга)
    $stmt->bind_param("ss", $user, $hashed_password);
    
    // Изпълнение на заявката
    if ($stmt->execute()) {
        http_response_code(201); // 201 Created
        echo json_encode(["message" => "Потребителят е създаден успешно."]);
    } else {
        // Проверка дали грешката е заради дублиращо се потребителско име (UNIQUE constraint)
        if ($conn->errno == 1062) {
            http_response_code(409); // 409 Conflict
            echo json_encode(["error" => "Потребителското име вече е заето."]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Възникна грешка при запис: " . $stmt->error]);
        }
    }
    
    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(["error" => "Грешка при подготовката на SQL заявката: " . $conn->error]);
}

// Затваряне на връзката
$conn->close();