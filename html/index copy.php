<?php
// 1. Проверка дали заявката е направена чрез POST метод
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['create_user'])) {
    
    // Данни за връзка с базата данни
    $servername = "172.21.0.2";
    $username   = "root";
    $userpass   = "root";
    $dbname     = "platform";

    // Активиране на грешките за MySQLi
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    try {
        // 2. Създаване на връзка
        $conn = new mysqli($servername, $username, $userpass, $dbname);
        $conn->set_charset("utf8mb4");

        // --- ЧАСТ 1: ДОБАВЯНЕ НА НОВ ЗАПИС ---
        $fixed_username = "Albena"; 
        $fixed_password = "secure";
        $pass_hash      = password_hash($fixed_password, PASSWORD_BCRYPT);

        $stmt = $conn->prepare("INSERT INTO users (username, pass_hash) VALUES (?, ?)");
        $stmt->bind_param("ss", $fixed_username, $pass_hash);
        
        if ($stmt->execute()) {
            echo "<div style='background-color: #d4edda; color: #155724; padding: 15px; border-radius: 4px; margin-bottom: 20px;'>";
            echo "<strong>Успех!</strong> Успешно беше създаден нов запис: <code>$fixed_username</code>";
            echo "</div>";
        }
        $stmt->close(); // Затваряме подготвената заявка за вмъкване


        // --- ЧАСТ 2: ИЗВЛИЧАНЕ И ПОКАЗВАНЕ НА ВСИЧКИ ТЕКУЩИ ЗАПИСИ ---
        echo "<h2>Текущ списък с потребители в базата:</h2>";
        
        $sql = "SELECT id, username, pass_hash FROM users ORDER BY id DESC"; // Сортирани от най-новия към най-стария
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            echo "<table border='1' cellpadding='8' style='border-collapse: collapse; width: 100%; text-align: left;'>";
            echo "<tr style='background-color: #f2f2f2;'><th>ID</th><th>Потребителско име</th><th>Хеш на паролата</th></tr>";
            
            while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $row["id"] . "</td>";
                echo "<td><strong>" . $row["username"] . "</strong></td>";
                echo "<td><small style='color: #666;'>" . $row["pass_hash"] . "</small></td>";
                echo "</tr>";
            }
            
            echo "</table>";
        } else {
            echo "Няма намерени записи.";
        }

    } catch (mysqli_sql_exception $e) {
        echo "<div style='color: red;'>Database Error: " . $e->getMessage() . "</div>";
    } finally {
        // 3. Затваряне на връзката
        if (isset($conn) && $conn->ping()) {
            $conn->close();
        }
    }
    
    echo "<br><br><a href='index.html' style='display:inline-block; background:#007BFF; color:white; padding:10px 15px; text-decoration:none; border-radius:4px;'>← Назад към бутона</a>";

} else {
    header("Location: index.html");
    exit();
}
?>
