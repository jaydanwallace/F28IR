CREATE DATABASE IF NOT EXISTS bankdb;
USE bankdb;

CREATE TABLE IF NOT EXISTS accounts (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  name    VARCHAR(100) NOT NULL,
  balance DECIMAL(10,2) NOT NULL
);

INSERT INTO accounts (name, balance) VALUES ('Checking', 2500.00), ('Savings', 8000.00);