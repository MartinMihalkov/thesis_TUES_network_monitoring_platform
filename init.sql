USE platform;
CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50), pass_hash VARCHAR(60));
INSERT INTO users (username, pass_hash) 
VALUES 
    ('Martin', 'smarti'),
    ('Ivan', 'ivan123'),
    ('Maria', 'secretpass');
