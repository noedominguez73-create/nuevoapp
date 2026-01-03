CREATE DATABASE IF NOT EXISTS appnode_local CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE appnode_local;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    subscription_status VARCHAR(20) DEFAULT 'inactive',
    monthly_token_limit INT DEFAULT 10,
    current_month_tokens INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE USER IF NOT EXISTS 'appnode_dev'@'localhost' IDENTIFIED BY 'appnode123';
GRANT ALL PRIVILEGES ON appnode_local.* TO 'appnode_dev'@'localhost';
FLUSH PRIVILEGES;
