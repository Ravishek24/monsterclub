-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 16, 2025 at 02:30 PM
-- Server version: 10.11.10-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u395318240_test1`
--

-- --------------------------------------------------------

--
-- Table structure for table `5d`
--

CREATE TABLE `5d` (
  `id` int(11) NOT NULL,
  `period` bigint(20) DEFAULT 0,
  `result` varchar(5) NOT NULL DEFAULT '0',
  `game` int(11) NOT NULL DEFAULT 1,
  `status` int(11) DEFAULT 0,
  `time` varchar(50) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `5d`
--

INSERT INTO `5d` (`id`, `period`, `result`, `game`, `status`, `time`) VALUES
(1, 20250616225, '44512', 1, 1, '1719507360933');

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `wingo1` text NOT NULL,
  `wingo3` text NOT NULL,
  `wingo5` text NOT NULL,
  `wingo10` text NOT NULL,
  `k5d` text NOT NULL,
  `k5d3` text NOT NULL,
  `k5d5` text,
  `k5d10` text NOT NULL,
  `k3d` text NOT NULL,
  `k3d3` text NOT NULL,
  `k3d5` text NOT NULL,
  `k3d10` text NOT NULL,
  `win_rate` int(11) NOT NULL DEFAULT 0,
  `telegram` varchar(100) NOT NULL DEFAULT '0',
  `cskh` varchar(100) NOT NULL DEFAULT '0',
  `app` text,
  `recharge_bonus` int(11) DEFAULT NULL,
  `recharge_bonus_2` int(11) DEFAULT NULL,
  `signup_bonus` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `balance_transfer`
--

CREATE TABLE `balance_transfer` (
  `id` int(11) NOT NULL,
  `sender_phone` bigint(255) NOT NULL,
  `receiver_phone` bigint(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bank_recharge`
--

CREATE TABLE `bank_recharge` (
  `id` int(11) NOT NULL,
  `name_bank` varchar(50) NOT NULL DEFAULT '0',
  `name_user` varchar(100) NOT NULL DEFAULT '0',
  `stk` varchar(100) NOT NULL DEFAULT '0',
  `qr_code_image` varchar(255) NOT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'bank',
  `time` varchar(30) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `bank_recharge`
--

INSERT INTO `bank_recharge` (`id`, `name_bank`, `name_user`, `stk`, `qr_code_image`, `type`, `time`) VALUES
(36, 'So', 'Re', 'jayrajeshwar1008@ybl', 'SD.JPG', 'momo', '0');

-- --------------------------------------------------------

--
-- Table structure for table `crashbetrecord`
--

CREATE TABLE `crashbetrecord` (
  `id` int(11) NOT NULL,
  `username` varchar(211) NOT NULL,
  `amount` int(11) NOT NULL,
  `status` varchar(211) NOT NULL DEFAULT 'pending',
  `winpoint` float NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dragonpay`
--

CREATE TABLE `dragonpay` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `payOrderId` varchar(255) NOT NULL,
  `mchOrderNo` varchar(255) NOT NULL,
  `amount` varchar(255) NOT NULL,
  `currency` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `financial_details`
--

CREATE TABLE `financial_details` (
  `id` int(11) NOT NULL,
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `phone_used` varchar(50) NOT NULL DEFAULT '0',
  `money` int(11) NOT NULL DEFAULT 0,
  `type` varchar(50) NOT NULL DEFAULT '0',
  `time` varchar(50) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `k3`
--

CREATE TABLE `k3` (
  `id` int(11) NOT NULL,
  `period` bigint(20) NOT NULL DEFAULT 0,
  `result` int(11) NOT NULL,
  `game` int(11) NOT NULL DEFAULT 1,
  `status` int(11) NOT NULL DEFAULT 0,
  `time` varchar(100) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `k3`
--

INSERT INTO `k3` (`id`, `period`, `result`, `game`, `status`, `time`) VALUES
(1, 20250616225, 123, 3, 1, '0');

-- --------------------------------------------------------

--
-- Table structure for table `level`
--

CREATE TABLE `level` (
  `id` int(11) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `f1` varchar(50) NOT NULL,
  `f2` varchar(50) NOT NULL,
  `f3` varchar(50) NOT NULL,
  `f4` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `level`
--

INSERT INTO `level` (`id`, `level`, `f1`, `f2`, `f3`, `f4`) VALUES
(0, 0, '0.8', '0.8', '0.8', '0'),
(1, 1, '0.8', '0.8', '0.8', '0.8'),
(2, 2, '0.3', '0.3', '0.3', '0.3'),
(3, 3, '0.2', '0.2', '0.2', '0.2'),
(4, 4, '0.1', '0.2', '0.2', '0.2'),
(5, 5, '0.25', '0.25', '0.25', '0.25'),
(6, 6, '0.25', '0.25', '0.25', '0.25'),
(7, 7, '0.25', '0.25', '0.25', '0.25'),
(8, 8, '0.25', '0.25', '0.25', '0.25'),
(9, 9, '0.25', '0.25', '0.25', '0.25'),
(10, 10, '0.5', '0.5', '0.5', '0.5'),
(11, 11, '0.5', '0.5', '0.5', '0.5'),
(12, 12, '0.5', '0.05', '0.5', '0.5'),
(13, 13, '0.5', '0.5', '0.5', '0.5'),
(14, 14, '0.5', '0.5', '0.5', '0.5');

-- --------------------------------------------------------

--
-- Table structure for table `login_notification`
--

CREATE TABLE `login_notification` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `notification_text` text NOT NULL,
  `status` int(3) NOT NULL DEFAULT 0,
  `today` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `minutes_1`
--

CREATE TABLE `minutes_1` (
  `id` int(11) NOT NULL,
  `id_product` varchar(100) NOT NULL DEFAULT '0',
  `phone` varchar(20) NOT NULL DEFAULT '0',
  `code` varchar(30) NOT NULL DEFAULT '0',
  `invite` varchar(30) NOT NULL DEFAULT '0',
  `stage` varchar(255) NOT NULL DEFAULT '0',
  `result` int(11) NOT NULL DEFAULT 0,
  `more` int(11) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 0,
  `money` decimal(15,2) NOT NULL DEFAULT 0.00,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `get` decimal(15,2) NOT NULL DEFAULT 0.00,
  `game` varchar(50) NOT NULL DEFAULT '0',
  `bet` varchar(10) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT 0,
  `today` varchar(50) NOT NULL DEFAULT '0',
  `time` varchar(30) NOT NULL DEFAULT '0',
  `proxy` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `point_list`
--

CREATE TABLE `point_list` (
  `id` int(11) NOT NULL,
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `telegram` varchar(100) NOT NULL DEFAULT '0',
  `money` int(11) NOT NULL DEFAULT 0,
  `money_us` int(11) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 0,
  `total1` int(11) NOT NULL DEFAULT 20,
  `total2` int(11) NOT NULL DEFAULT 50,
  `total3` int(11) NOT NULL DEFAULT 150,
  `total4` int(11) NOT NULL DEFAULT 350,
  `total5` int(11) NOT NULL DEFAULT 850,
  `total6` int(11) NOT NULL DEFAULT 5000,
  `total7` int(11) NOT NULL DEFAULT 18050,
  `total8` int(11) NOT NULL DEFAULT 20000
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `point_list`
--

INSERT INTO `point_list` (`id`, `phone`, `telegram`, `money`, `money_us`, `level`, `total1`, `total2`, `total3`, `total4`, `total5`, `total6`, `total7`, `total8`) VALUES
(1, '6262686221', '0', 0, 0, 0, 20, 50, 150, 350, 850, 5000, 18050, 20000),
(783, '6388735644', '0', 0, 0, 0, 20, 50, 150, 350, 850, 5000, 18050, 20000),
(784, '7398999219', '0', 0, 0, 0, 20, 50, 150, 350, 850, 5000, 18050, 20000),
(785, '9936936177', '0', 0, 0, 0, 20, 50, 150, 350, 850, 5000, 18050, 20000),
(786, '9285226331', '0', 0, 0, 0, 20, 50, 150, 350, 850, 5000, 18050, 20000),
(787, '9285226336', '0', 0, 0, 0, 20, 50, 150, 350, 850, 5000, 18050, 20000),
(788, '7753040178', '0', 0, 0, 0, 20, 50, 150, 350, 850, 5000, 18050, 20000);

-- --------------------------------------------------------

--
-- Table structure for table `recharge`
--

CREATE TABLE `recharge` (
  `id` int(11) NOT NULL,
  `id_order` varchar(100) NOT NULL DEFAULT '0',
  `transaction_id` varchar(100) DEFAULT '0',
  `utr` bigint(255) DEFAULT NULL,
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `money` int(11) NOT NULL DEFAULT 0,
  `type` varchar(10) NOT NULL DEFAULT 'bank',
  `status` int(11) NOT NULL DEFAULT 0,
  `today` varchar(50) NOT NULL DEFAULT '0',
  `url` varchar(255) DEFAULT NULL,
  `time` varchar(30) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `recharge`
--

INSERT INTO `recharge` (`id`, `id_order`, `transaction_id`, `utr`, `phone`, `money`, `type`, `status`, `today`, `url`, `time`) VALUES
(886, '202521364953803517517', 'NULL', 49865433579, '1234567890', 300, 'upi_manual', 2, '2025-03-03 12:43:52 PM', 'NULL', '1740987652956');

-- --------------------------------------------------------

--
-- Table structure for table `redenvelopes`
--

CREATE TABLE `redenvelopes` (
  `id` int(11) NOT NULL,
  `id_redenvelope` varchar(100) NOT NULL DEFAULT '0',
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `money` int(11) NOT NULL DEFAULT 0,
  `used` int(11) NOT NULL DEFAULT 0,
  `amount` int(11) NOT NULL DEFAULT 0,
  `status` int(11) NOT NULL DEFAULT 0,
  `time` varchar(50) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `redenvelopes`
--

INSERT INTO `redenvelopes` (`id`, `id_redenvelope`, `phone`, `money`, `used`, `amount`, `status`, `time`) VALUES
(1, 'NRA0FKI3QPE327HF', '1234567890', 2100, 0, 1, 1, '1735451575216'),
(98, 'ET1GVTNOGX1NGZNU', '1234567890', 100000000, 1, 1, 0, '1743002532532'),
(99, 'GYOVTUTYD0RUCW6X', '1234567890', 100000000, 0, 1, 1, '1743002536524'),
(100, 'ULK8QJPYHU4D1EAS', '1234567890', 1000000, 1, 1, 0, '1743008024203'),
(101, '9WMNCFZZKDDZGHFW', '1234567890', 1000000, 0, 1, 1, '1743008026227'),
(102, 'XMTTPND1TE59XCSM', '1234567890', 25000, 0, 1, 1, '1743239750077'),
(103, '1SC5VLYJTQI00RYH', '1234567890', 4500000, 0, 1, 1, '1743330087456'),
(104, 'ROUY811AXPFBW81D', '1234567890', 1000, 0, 1, 1, '1744298527987'),
(105, '3XS48QQCLOO13HP4', '1234567890', 100, 0, 1, 1, '1744883216190'),
(106, 'NMER6NAYLKQWCGGP', '1234567890', 20000, 0, 1, 1, '1746766625381'),
(107, 'WHYZZFWSP3SKXUAV', '1234567890', 500, 0, 1, 1, '1746858164098');

-- --------------------------------------------------------

--
-- Table structure for table `redenvelopes_used`
--

CREATE TABLE `redenvelopes_used` (
  `id` int(11) NOT NULL,
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `phone_used` varchar(50) NOT NULL DEFAULT '0',
  `id_redenvelops` varchar(50) NOT NULL DEFAULT '0',
  `money` int(11) NOT NULL DEFAULT 0,
  `time` varchar(50) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `redenvelopes_used`
--

INSERT INTO `redenvelopes_used` (`id`, `phone`, `phone_used`, `id_redenvelops`, `money`, `time`) VALUES
(1, '1234567890', '7841925620', 'NRA0FKI3QPE327HF', 2100, '1735451694132'),
(72, '1234567890', '6388735644', '9WMNCFZZKDDZGHFW', 1000000, '1743008036360'),
(73, '1234567890', '1234567890', 'XMTTPND1TE59XCSM', 25000, '1743239773023'),
(74, '1234567890', '1234567890', '1SC5VLYJTQI00RYH', 4500000, '1743330117392'),
(75, '1234567890', '1234567890', 'ROUY811AXPFBW81D', 1000, '1744298566103'),
(76, '1234567890', '1234567890', '3XS48QQCLOO13HP4', 100, '1744883225881'),
(77, '1234567890', '1234567890', 'NMER6NAYLKQWCGGP', 20000, '1746766634246'),
(78, '1234567890', '7753040178', 'WHYZZFWSP3SKXUAV', 500, '1746858247319');

-- --------------------------------------------------------

--
-- Table structure for table `result_5d`
--

CREATE TABLE `result_5d` (
  `id` int(11) NOT NULL,
  `id_product` varchar(100) NOT NULL DEFAULT '0',
  `phone` varchar(20) DEFAULT '0',
  `code` varchar(30) NOT NULL DEFAULT '0',
  `invite` varchar(30) NOT NULL DEFAULT '0',
  `stage` bigint(20) DEFAULT 0,
  `result` varchar(5) NOT NULL DEFAULT '0',
  `level` int(11) NOT NULL DEFAULT 0,
  `money` int(11) NOT NULL DEFAULT 0,
  `price` int(11) NOT NULL DEFAULT 0,
  `amount` int(11) NOT NULL DEFAULT 0,
  `fee` int(11) NOT NULL DEFAULT 0,
  `get` int(11) NOT NULL DEFAULT 0,
  `game` int(11) NOT NULL,
  `join_bet` varchar(10) NOT NULL DEFAULT '0',
  `bet` varchar(20) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT 0,
  `time` varchar(50) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `result_k3`
--

CREATE TABLE `result_k3` (
  `id` int(11) NOT NULL,
  `id_product` varchar(100) NOT NULL DEFAULT '0',
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `code` varchar(50) NOT NULL DEFAULT '0',
  `invite` varchar(50) NOT NULL DEFAULT '0',
  `stage` varchar(50) NOT NULL DEFAULT '0',
  `result` varchar(5) NOT NULL DEFAULT '0',
  `level` int(11) NOT NULL DEFAULT 0,
  `money` int(11) NOT NULL DEFAULT 0,
  `price` int(11) NOT NULL DEFAULT 0,
  `amount` int(11) NOT NULL DEFAULT 0,
  `fee` int(11) NOT NULL DEFAULT 0,
  `get` int(11) NOT NULL DEFAULT 0,
  `game` varchar(5) NOT NULL DEFAULT '0',
  `join_bet` varchar(100) NOT NULL DEFAULT '0',
  `typeGame` varchar(100) NOT NULL DEFAULT '0',
  `bet` varchar(100) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT 0,
  `time` varchar(50) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roses`
--

CREATE TABLE `roses` (
  `id` int(11) NOT NULL,
  `phone` varchar(50) DEFAULT '0',
  `code` varchar(50) NOT NULL DEFAULT '0',
  `invite` varchar(50) NOT NULL DEFAULT '0',
  `f1` decimal(10,2) NOT NULL DEFAULT 0.00,
  `f2` int(11) NOT NULL DEFAULT 0,
  `f3` int(11) NOT NULL DEFAULT 0,
  `f4` int(11) NOT NULL DEFAULT 0,
  `time` varchar(50) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `roses`
--

INSERT INTO `roses` (`id`, `phone`, `code`, `invite`, `f1`, `f2`, `f3`, `f4`, `time`) VALUES
(1260, '1234567890', 'uVxnY75353', 'SUTFD37284', 2.40, 0, 0, 0, '1741181369092'),
(1287, '1234567890', 'uVxnY75353', 'SUTFD37284', 800.00, 800, 800, 0, '1742544205115'),
(1288, '1234567890', 'uVxnY75353', 'SUTFD37284', 800.00, 800, 800, 0, '1742544261586'),
(1289, '1234567890', 'uVxnY75353', 'SUTFD37284', 800.00, 800, 800, 0, '1742544320809'),
(1290, '1234567890', 'uVxnY75353', 'SUTFD37284', 800.00, 800, 800, 0, '1742544326506'),
(1291, '6388735644', 'gnXzZ33957', 'uVxnY75353', 8.00, 8, 8, 0, '1743321112306');

-- --------------------------------------------------------

--
-- Table structure for table `salary`
--

CREATE TABLE `salary` (
  `id` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `amount` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `time` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `salary`
--

INSERT INTO `salary` (`id`, `phone`, `amount`, `type`, `time`) VALUES
(1, '1234567890', 100, 'daily', '07/02/2024, 08:15:49 PM'),
(5, '1234567890', 10000, 'daily', '03/21/2025, 08:22:35 AM'),
(6, '1234567890', 1000000, 'daily', '03/21/2025, 08:38:41 AM'),
(7, '1234567890', 500, 'daily', '03/28/2025, 05:32:23 PM');

-- --------------------------------------------------------

--
-- Table structure for table `sunpay`
--

CREATE TABLE `sunpay` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `amount` varchar(255) NOT NULL,
  `trans` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `turn_over`
--

CREATE TABLE `turn_over` (
  `id` int(11) NOT NULL,
  `phone` varchar(250) NOT NULL,
  `code` varchar(250) NOT NULL,
  `invite` varchar(250) NOT NULL,
  `daily_turn_over` decimal(20,2) NOT NULL DEFAULT 0.00,
  `total_turn_over` decimal(20,2) NOT NULL DEFAULT 0.00,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `turn_over`
--

INSERT INTO `turn_over` (`id`, `phone`, `code`, `invite`, `daily_turn_over`, `total_turn_over`, `date_time`) VALUES
(1, '6262686221', 'VhUJO48944', 'uVxnY75353', 0.00, 0.00, '2024-12-26 06:43:50'),
(1988, '6388735644', 'gnXzZ33957', 'uVxnY75353', 0.00, 0.00, '2025-03-26 15:20:22'),
(1989, '7398999219', 'ldTzf19216', 'gnXzZ33957', 0.00, 0.00, '2025-03-27 10:22:04'),
(1990, '9936936177', 'hDYcj58877', 'gnXzZ33957', 0.00, 0.00, '2025-03-29 05:40:23'),
(1991, '9285226331', 'UCHMY62774', 'uVxnY75353', 0.00, 0.00, '2025-04-05 11:47:54'),
(1992, '9285226336', 'rczTj61034', 'uVxnY75353', 0.00, 0.00, '2025-04-05 11:48:39'),
(1993, '7753040178', 'ZTDhE25562', 'uVxnY75353', 0.00, 0.00, '2025-05-10 06:21:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `id_user` varchar(50) NOT NULL DEFAULT '0',
  `phone` varchar(20) NOT NULL DEFAULT '0',
  `token` varchar(100) NOT NULL DEFAULT '0',
  `name_user` varchar(50) NOT NULL DEFAULT '0',
  `img_user` varchar(100) NOT NULL,
  `password` varchar(50) NOT NULL DEFAULT '0',
  `plain_password` varchar(250) DEFAULT NULL,
  `money` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_money` decimal(10,2) NOT NULL DEFAULT 0.00,
  `roses_f1` decimal(10,2) NOT NULL DEFAULT 0.00,
  `roses_f` decimal(10,2) NOT NULL DEFAULT 0.00,
  `roses_today` decimal(10,2) NOT NULL DEFAULT 0.00,
  `level` int(11) NOT NULL DEFAULT 0,
  `rank` int(11) NOT NULL DEFAULT 0,
  `code` varchar(30) NOT NULL DEFAULT '0',
  `invite` varchar(30) NOT NULL DEFAULT '0',
  `ctv` varchar(50) NOT NULL DEFAULT '0',
  `veri` int(11) NOT NULL DEFAULT 0,
  `otp` varchar(10) NOT NULL DEFAULT '0',
  `ip_address` varchar(50) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT 0,
  `today` datetime NOT NULL DEFAULT current_timestamp(),
  `time` varchar(50) NOT NULL DEFAULT '0',
  `time_otp` varchar(50) NOT NULL DEFAULT '0',
  `user_level` int(11) DEFAULT 0,
  `proxy` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `id_user`, `phone`, `token`, `name_user`, `img_user`, `password`, `plain_password`, `money`, `total_money`, `roses_f1`, `roses_f`, `roses_today`, `level`, `rank`, `code`, `invite`, `ctv`, `veri`, `otp`, `ip_address`, `status`, `today`, `time`, `time_otp`, `user_level`, `proxy`) VALUES
(282, '2000000', '1234567890', '5298e1a9dc9f6eb69ead8e1bd66cadc8', 'Djfuchxgzydyx', '17-bedde42f.png', 'e807f1fcf82d132f9bb018ca6738a19f', '1234567890', 25.65, 159030.00, 42526.41, 42632.47, 0.00, 1, 1, 'uVxnY75353', 'SUTFD37284', '000000', 1, '309099', '::1', 1, '2024-02-25 18:41:52', '1708886512413', '0', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_bank`
--

CREATE TABLE `user_bank` (
  `id` int(11) NOT NULL,
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `name_bank` varchar(100) NOT NULL DEFAULT '0',
  `name_user` varchar(100) DEFAULT '0',
  `stk` varchar(100) NOT NULL DEFAULT '0',
  `tp` varchar(100) NOT NULL DEFAULT '0',
  `email` varchar(100) NOT NULL DEFAULT '0',
  `sdt` varchar(20) DEFAULT '0',
  `tinh` varchar(100) NOT NULL DEFAULT '0',
  `chi_nhanh` varchar(100) NOT NULL DEFAULT '0',
  `time` varchar(30) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `user_bank`
--

INSERT INTO `user_bank` (`id`, `phone`, `name_bank`, `name_user`, `stk`, `tp`, `email`, `sdt`, `tinh`, `chi_nhanh`, `time`) VALUES
(199, '1234567890', 'Bank of Baroda', 'ut', '64654', '0', '0', 'ghgh', '7545', '0', '1741597602478'),
(203, '6388735644', 'Baroda U.P Bank', 'RISHIKANT PANDEY', '84340100002097', '0', '0', 'BARBOBUPGBX', '6388735644', '0', '1744465928247');

-- --------------------------------------------------------

--
-- Table structure for table `wingo`
--

CREATE TABLE `wingo` (
  `id` int(11) NOT NULL,
  `period` varchar(100) NOT NULL,
  `amount` int(11) NOT NULL DEFAULT 0,
  `game` varchar(10) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT 0,
  `time` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `wingo`
--

INSERT INTO `wingo` (`id`, `period`, `amount`, `game`, `status`, `time`) VALUES
(1, '202506162205', 0, 'wingo', 1, '');

-- --------------------------------------------------------

--
-- Table structure for table `withdraw`
--

CREATE TABLE `withdraw` (
  `id` int(11) NOT NULL,
  `id_order` varchar(100) NOT NULL DEFAULT '0',
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `money` int(11) NOT NULL DEFAULT 0,
  `stk` varchar(100) NOT NULL DEFAULT '0',
  `name_bank` varchar(100) NOT NULL DEFAULT '0',
  `name_user` varchar(100) NOT NULL DEFAULT '0',
  `ifsc` varchar(255) NOT NULL,
  `sdt` varchar(255) NOT NULL DEFAULT '0',
  `tp` varchar(211) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT 0,
  `today` varchar(50) NOT NULL DEFAULT '0',
  `time` varchar(30) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `withdraw`
--

INSERT INTO `withdraw` (`id`, `id_order`, `phone`, `money`, `stk`, `name_bank`, `name_user`, `ifsc`, `sdt`, `tp`, `status`, `today`, `time`) VALUES
(1, '2024513021851077415367', '1234567890', 200, '654646', 'Bank of India', 'PRE', 'bkig', '0', '0', 1, '2024-06-30 4:00:27 PM', '1719756027845'),
(544, '2025212171504224459276', '1234567890', 12838, '64654', 'Bank of Baroda', 'ut', 'ghgh', '0', '0', 2, '2025-03-21 8:46:00 AM', '1742543160332'),
(545, '2025212115243549040442', '1234567890', 12838, '64654', 'Bank of Baroda', 'ut', 'ghgh', '0', '0', 2, '2025-03-21 8:46:01 AM', '1742543161154'),
(546, '2025212154813273455811', '1234567890', 4900000, '64654', 'Bank of Baroda', 'ut', 'ghgh', '0', '0', 1, '2025-03-21 4:55:07 PM', '1742572507802'),
(547, '2025212819372359595504', '6388735644', 15000, '84340100002097', 'Baroda U.P Bank', 'RISHIKANT PANDAY', 'BARB0BUPGBX', '0', '0', 2, '2025-03-28 3:40:15 PM', '1743172815744'),
(548, '2025212831796977094171', '6388735644', 15000, '84340100002097', 'Baroda U.P Bank', 'RISHIKANT PANDAY', 'BARB0BUPGBX', '0', '0', 2, '2025-03-28 3:40:24 PM', '1743172824602'),
(549, '2025212860436786556127', '1234567890', 470, '64654', 'Bank of Baroda', 'ut', 'ghgh', '0', '0', 1, '2025-03-28 5:43:41 PM', '1743180221640'),
(550, '2025212949857548619223', '6388735644', 2000, '84340100002097', 'Baroda U.P Bank', 'RISHIKANT PANDAY', 'BARB0BUPGBX', '0', '0', 1, '2025-03-29 7:15:14 AM', '1743228914382'),
(551, '2025212913367190070312', '6388735644', 2000, '84340100002097', 'Baroda U.P Bank', 'RISHIKANT PANDAY', 'BARB0BUPGBX', '0', '0', 1, '2025-03-29 7:15:14 AM', '1743228914702'),
(552, '2025212911459845447927', '6388735644', 2000, '84340100002097', 'Baroda U.P Bank', 'RISHIKANT PANDAY', 'BARB0BUPGBX', '0', '0', 2, '2025-03-29 7:15:14 AM', '1743228914840'),
(553, '2025212986203680639719', '6388735644', 2000, '84340100002097', 'Baroda U.P Bank', 'RISHIKANT PANDAY', 'BARB0BUPGBX', '0', '0', 2, '2025-03-29 7:15:15 AM', '1743228915435'),
(554, '2025212965151627362845', '6388735644', 2000, '84340100002097', 'Baroda U.P Bank', 'RISHIKANT PANDAY', 'BARB0BUPGBX', '0', '0', 1, '2025-03-29 7:15:15 AM', '1743228915784'),
(555, '2025212974273377110097', '6388735644', 2000, '84340100002097', 'Baroda U.P Bank', 'RISHIKANT PANDAY', 'BARB0BUPGBX', '0', '0', 2, '2025-03-29 7:15:16 AM', '1743228916083'),
(556, '2025212959510516962457', '6388735644', 2000, '84340100002097', 'Baroda U.P Bank', 'RISHIKANT PANDAY', 'BARB0BUPGBX', '0', '0', 1, '2025-03-29 7:15:17 AM', '1743228917697'),
(557, '2025212924692103765217', '6388735644', 200, '84340100002097', 'Baroda U.P Bank', 'RISHIKANT PANDAY', 'BARB0BUPGBX', '0', '0', 2, '2025-03-29 9:41:18 AM', '1743237678943'),
(558, '2025212916737978186653', '1234567890', 335953, '64654', 'Bank of Baroda', 'ut', 'ghgh', '0', '0', 1, '2025-03-29 10:13:28 AM', '1743239608231'),
(559, '2025213085322776098302', '1234567890', 25000, '64654', 'Bank of Baroda', 'ut', 'ghgh', '0', '0', 2, '2025-03-30 7:57:44 AM', '1743314264378'),
(560, '202531179277425998870', '6388735644', 2000, '056110091167', 'India post payment Bank', 'ANKIT KHARWAR', 'IPOS0000001', '0', '0', 0, '2025-04-01 12:15:16 PM', '1743502516305'),
(561, '202531176073250477127', '1234567890', 10000, '64654', 'Bank of Baroda', 'ut', 'ghgh', '0', '0', 0, '2025-04-01 3:34:09 PM', '1743514449718'),
(562, '202531320966150477378', '6388735644', 2000, '056110091167', 'India post payment Bank', 'ANKIT KHARWAR', 'IPOS0000001', '0', '0', 0, '2025-04-03 8:21:08 AM', '1743661268954'),
(563, '202531562421745026973', '6388735644', 225, '056110091167', 'India post payment Bank', 'ANKIT KHARWAR', 'IPOS0000001', '0', '0', 0, '2025-04-05 10:17:44 AM', '1743841064236'),
(564, '2025311231009338862999', '6388735644', 1000, '84340100002097', 'Baroda U.P Bank', 'RISHIKANT PANDEY', 'BARBOBUPGBX', '0', '0', 0, '2025-04-12 3:52:57 PM', '1744465977333'),
(565, '2025411146084369818907', '1234567890', 400, '64654', 'Bank of Baroda', 'ut', 'ghgh', '0', '0', 0, '2025-05-11 5:24:25 PM', '1746964465409'),
(566, '2025412114041053402915', '6388735644', 3000, '84340100002097', 'Baroda U.P Bank', 'RISHIKANT PANDEY', 'BARBOBUPGBX', '0', '0', 0, '2025-05-21 3:06:18 PM', '1747820178025');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `5d`
--
ALTER TABLE `5d`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `balance_transfer`
--
ALTER TABLE `balance_transfer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bank_recharge`
--
ALTER TABLE `bank_recharge`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `crashbetrecord`
--
ALTER TABLE `crashbetrecord`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dragonpay`
--
ALTER TABLE `dragonpay`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mchOrderNo` (`mchOrderNo`),
  ADD UNIQUE KEY `payOrderId` (`payOrderId`);

--
-- Indexes for table `financial_details`
--
ALTER TABLE `financial_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `k3`
--
ALTER TABLE `k3`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `level`
--
ALTER TABLE `level`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `login_notification`
--
ALTER TABLE `login_notification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `minutes_1`
--
ALTER TABLE `minutes_1`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `point_list`
--
ALTER TABLE `point_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recharge`
--
ALTER TABLE `recharge`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `redenvelopes`
--
ALTER TABLE `redenvelopes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `redenvelopes_used`
--
ALTER TABLE `redenvelopes_used`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `result_5d`
--
ALTER TABLE `result_5d`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `result_k3`
--
ALTER TABLE `result_k3`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roses`
--
ALTER TABLE `roses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salary`
--
ALTER TABLE `salary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sunpay`
--
ALTER TABLE `sunpay`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `trans` (`trans`);

--
-- Indexes for table `turn_over`
--
ALTER TABLE `turn_over`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_bank`
--
ALTER TABLE `user_bank`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wingo`
--
ALTER TABLE `wingo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `withdraw`
--
ALTER TABLE `withdraw`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `5d`
--
ALTER TABLE `5d`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `balance_transfer`
--
ALTER TABLE `balance_transfer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bank_recharge`
--
ALTER TABLE `bank_recharge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `crashbetrecord`
--
ALTER TABLE `crashbetrecord`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dragonpay`
--
ALTER TABLE `dragonpay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12190;

--
-- AUTO_INCREMENT for table `financial_details`
--
ALTER TABLE `financial_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `k3`
--
ALTER TABLE `k3`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `level`
--
ALTER TABLE `level`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `login_notification`
--
ALTER TABLE `login_notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `minutes_1`
--
ALTER TABLE `minutes_1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `point_list`
--
ALTER TABLE `point_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=789;

--
-- AUTO_INCREMENT for table `recharge`
--
ALTER TABLE `recharge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=942;

--
-- AUTO_INCREMENT for table `redenvelopes`
--
ALTER TABLE `redenvelopes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `redenvelopes_used`
--
ALTER TABLE `redenvelopes_used`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `result_5d`
--
ALTER TABLE `result_5d`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `result_k3`
--
ALTER TABLE `result_k3`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roses`
--
ALTER TABLE `roses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1292;

--
-- AUTO_INCREMENT for table `salary`
--
ALTER TABLE `salary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sunpay`
--
ALTER TABLE `sunpay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `turn_over`
--
ALTER TABLE `turn_over`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1994;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6620;

--
-- AUTO_INCREMENT for table `user_bank`
--
ALTER TABLE `user_bank`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

--
-- AUTO_INCREMENT for table `wingo`
--
ALTER TABLE `wingo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `withdraw`
--
ALTER TABLE `withdraw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=567;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
