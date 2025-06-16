CREATE DATABASE IF NOT EXISTS `92lottery`;
USE `92lottery`;

CREATE TABLE IF NOT EXISTS `wingo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `period` varchar(255) NOT NULL,
  `game` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `5d` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `period` varchar(255) NOT NULL,
  `result` varchar(255) NOT NULL,
  `game` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `k3` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `period` varchar(255) NOT NULL,
  `result` varchar(255) NOT NULL,
  `game` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `minutes_1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `invite` varchar(255) NOT NULL,
  `stage` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `money` decimal(20,2) NOT NULL,
  `price` decimal(20,2) NOT NULL,
  `amount` int(11) NOT NULL,
  `fee` decimal(20,2) NOT NULL,
  `game` varchar(255) NOT NULL,
  `join_bet` varchar(255) NOT NULL,
  `bet` varchar(255) NOT NULL,
  `result` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `proxy` int(11) NOT NULL DEFAULT 0,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level` int(11) NOT NULL,
  `f1` float NOT NULL,
  `f2` float NOT NULL,
  `f3` float NOT NULL,
  `f4` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `bank_recharge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_bank` varchar(255) NOT NULL,
  `name_user` varchar(255) NOT NULL,
  `stk` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wingo1` varchar(255) NOT NULL,
  `wingo3` varchar(255) NOT NULL,
  `wingo5` varchar(255) NOT NULL,
  `wingo10` varchar(255) NOT NULL,
  `k5d` varchar(255) NOT NULL,
  `k5d3` varchar(255) NOT NULL,
  `k5d5` varchar(255) NOT NULL,
  `k5d10` varchar(255) NOT NULL,
  `win_rate` varchar(255) NOT NULL,
  `telegram` varchar(255) NOT NULL,
  `cskh` varchar(255) NOT NULL,
  `app` varchar(255) NOT NULL,
  `recharge_bonus` decimal(20,2) NOT NULL DEFAULT 0.00,
  `recharge_bonus_2` decimal(20,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin settings
INSERT IGNORE INTO `admin` (`id`, `wingo1`, `wingo3`, `wingo5`, `wingo10`, `k5d`, `k5d3`, `k5d5`, `k5d10`, `win_rate`, `telegram`, `cskh`, `app`, `recharge_bonus`, `recharge_bonus_2`) 
VALUES (1, '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '0.95', 'https://t.me/your_telegram', 'https://t.me/your_cskh', 'https://your-app-url.com', 0.00, 0.00);

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `invite` varchar(255) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `money` decimal(20,2) NOT NULL DEFAULT 0.00,
  `roses_f1` decimal(20,2) NOT NULL DEFAULT 0.00,
  `roses_f2` decimal(20,2) NOT NULL DEFAULT 0.00,
  `roses_f3` decimal(20,2) NOT NULL DEFAULT 0.00,
  `roses_f4` decimal(20,2) NOT NULL DEFAULT 0.00,
  `roses_f` decimal(20,2) NOT NULL DEFAULT 0.00,
  `roses_today` decimal(20,2) NOT NULL DEFAULT 0.00,
  `token` varchar(255) DEFAULT NULL,
  `veri` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `recharge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(255) NOT NULL,
  `amount` decimal(20,2) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `utr` varchar(255) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initialize game data
INSERT IGNORE INTO `wingo` (`period`, `game`, `amount`, `status`, `time`) VALUES
('1', 'wingo', 0, 0, UNIX_TIMESTAMP() * 1000),
('1', 'wingo3', 0, 0, UNIX_TIMESTAMP() * 1000),
('1', 'wingo5', 0, 0, UNIX_TIMESTAMP() * 1000),
('1', 'wingo10', 0, 0, UNIX_TIMESTAMP() * 1000);

INSERT IGNORE INTO `5d` (`period`, `result`, `game`, `status`, `time`) VALUES
('1', '0', 1, 0, UNIX_TIMESTAMP() * 1000),
('1', '0', 3, 0, UNIX_TIMESTAMP() * 1000),
('1', '0', 5, 0, UNIX_TIMESTAMP() * 1000),
('1', '0', 10, 0, UNIX_TIMESTAMP() * 1000);

INSERT IGNORE INTO `k3` (`period`, `result`, `game`, `status`, `time`) VALUES
('1', '0', 1, 0, UNIX_TIMESTAMP() * 1000),
('1', '0', 3, 0, UNIX_TIMESTAMP() * 1000),
('1', '0', 5, 0, UNIX_TIMESTAMP() * 1000),
('1', '0', 10, 0, UNIX_TIMESTAMP() * 1000);