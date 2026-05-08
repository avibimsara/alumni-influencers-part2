-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: alumni_platform
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `api_key_permissions`
--

DROP TABLE IF EXISTS `api_key_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_key_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `api_key_id` int NOT NULL,
  `permission` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_key_id` (`api_key_id`),
  CONSTRAINT `api_key_permissions_ibfk_1` FOREIGN KEY (`api_key_id`) REFERENCES `api_keys` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_key_permissions`
--

LOCK TABLES `api_key_permissions` WRITE;
/*!40000 ALTER TABLE `api_key_permissions` DISABLE KEYS */;
INSERT INTO `api_key_permissions` VALUES (1,1,'read:alumni'),(2,1,'read:analytics'),(3,2,'read:alumni'),(4,2,'read:analytics'),(5,3,'read:alumni_of_day'),(6,4,'read:alumni'),(7,5,'read:alumni'),(8,5,'read:analytics'),(9,5,'read:alumni_of_day');
/*!40000 ALTER TABLE `api_key_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_keys`
--

DROP TABLE IF EXISTS `api_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_keys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key_hash` varchar(255) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_used` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_hash` (`key_hash`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_keys`
--

LOCK TABLES `api_keys` WRITE;
/*!40000 ALTER TABLE `api_keys` DISABLE KEYS */;
INSERT INTO `api_keys` VALUES (1,'680d571b63b9db7d10165043e70f5202a578957ef3c96d035c5f70c00adf22f4','analytics_dashboard',0,NULL,'2026-05-07 21:48:24'),(2,'0d3bc9d1efa8512cc8bb15e265fe679e87b19ca8d6275803a957e6149f050adf','analytics_dashboard',1,'2026-05-07 23:57:00','2026-05-07 23:26:34'),(3,'1a3a727feecfa977bf1809b14059452d9b794cb7b7af8cbb862a9b8a21a97c98','mobile_ar_app',1,NULL,'2026-05-07 23:26:35'),(4,'282b651fbab360448d5b042589fb0b17acd033e34d6c4c3e4f56affdb3884d2c','test_client',1,NULL,'2026-05-07 23:36:34'),(5,'b40bd06e801edf31843bd03826b73ac6b92699d5d331f1762cbad0a1b543a8c3','TestClient_1',0,NULL,'2026-05-08 00:16:25');
/*!40000 ALTER TABLE `api_keys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_usage_logs`
--

DROP TABLE IF EXISTS `api_usage_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_usage_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `api_key_id` int NOT NULL,
  `endpoint` varchar(255) NOT NULL,
  `method` varchar(10) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `api_key_id` (`api_key_id`),
  CONSTRAINT `api_usage_logs_ibfk_1` FOREIGN KEY (`api_key_id`) REFERENCES `api_keys` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_usage_logs`
--

LOCK TABLES `api_usage_logs` WRITE;
/*!40000 ALTER TABLE `api_usage_logs` DISABLE KEYS */;
INSERT INTO `api_usage_logs` VALUES (1,2,'/api/external/alumni','GET','::1','2026-05-07 23:38:30'),(2,2,'/api/external/alumni','GET','::1','2026-05-07 23:39:44'),(3,2,'/api/external/alumni','GET','::1','2026-05-07 23:41:28'),(4,2,'/api/external/alumni','GET','::1','2026-05-07 23:47:18'),(5,2,'/api/external/analytics','GET','::1','2026-05-07 23:53:55'),(6,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:19'),(7,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:20'),(8,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:20'),(9,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:21'),(10,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:22'),(11,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:23'),(12,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:29'),(13,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:29'),(14,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:30'),(15,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:30'),(16,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:30'),(17,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:31'),(18,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:31'),(19,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:31'),(20,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:31'),(21,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:31'),(22,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:32'),(23,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:32'),(24,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:32'),(25,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:32'),(26,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:32'),(27,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:32'),(28,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:33'),(29,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:33'),(30,2,'/api/external/analytics','GET','::1','2026-05-07 23:55:33'),(31,2,'/api/external/analytics','GET','::1','2026-05-07 23:57:00');
/*!40000 ALTER TABLE `api_usage_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bid_winners`
--

DROP TABLE IF EXISTS `bid_winners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bid_winners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alumni_id` int NOT NULL,
  `winning_bid_id` int NOT NULL,
  `month` varchar(7) NOT NULL,
  `selected_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_winner_month` (`alumni_id`,`month`),
  KEY `winning_bid_id` (`winning_bid_id`),
  CONSTRAINT `bid_winners_ibfk_1` FOREIGN KEY (`winning_bid_id`) REFERENCES `bids` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bid_winners`
--

LOCK TABLES `bid_winners` WRITE;
/*!40000 ALTER TABLE `bid_winners` DISABLE KEYS */;
/*!40000 ALTER TABLE `bid_winners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bids`
--

DROP TABLE IF EXISTS `bids`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bids` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `alumni_id` int NOT NULL,
  `bid_amount` decimal(10,2) NOT NULL,
  `month` varchar(7) NOT NULL,
  `status` enum('pending','won','lost') DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_month` (`user_id`,`month`),
  CONSTRAINT `bids_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bids`
--

LOCK TABLES `bids` WRITE;
/*!40000 ALTER TABLE `bids` DISABLE KEYS */;
/*!40000 ALTER TABLE `bids` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(60) NOT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `verification_token` varchar(255) DEFAULT NULL,
  `verification_expiry` datetime DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expiry` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test@iit.ac.lk','$2b$12$fITgeZiKiORDzENnO0MV3eDihqRshMJ2.xpkxws2JaHWvD3uYMeDW',1,NULL,NULL,NULL,NULL,'2026-05-07 02:05:05'),(2,'test2@iit.ac.lk','$2b$12$i6lh7Mcx6VGBn6/HrPL7wuo7wxJ/fPHr/XV4VaNH2ZziDBxLIT586',1,NULL,NULL,NULL,NULL,'2026-05-07 16:23:40'),(3,'test3@iit.ac.lk','$2b$12$giiVM2JOQJXeXi57xqP9TO5o4i/GyDjj9nCDFGL4pzE1cxv71L.mO',1,NULL,NULL,NULL,NULL,'2026-05-07 17:23:09'),(4,'test67@iit.ac.lk','$2b$12$ih5ha3tsnEznL6mAUcAJBO9QTOnMzBK.Ue6GC4S.Afe3uLU0Oqm5u',1,NULL,NULL,NULL,NULL,'2026-05-07 17:26:02');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-08 21:05:05
