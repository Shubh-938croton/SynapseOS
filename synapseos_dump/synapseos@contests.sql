-- MySQLShell dump 2.0.1  Distrib Ver 8.0.46 for Win64 on x86_64 - for MySQL 8.0.46 (MySQL Community Server (GPL)), for Win64 (x86_64)
--
-- Host: localhost    Database: synapseos    Table: contests
-- ------------------------------------------------------
-- Server version	8.0.46

--
-- Table structure for table `contests`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `contests` (
  `contest_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `platform` enum('LeetCode','Codeforces','CodeChef','HackerRank','AtCoder','Other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `contest_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contest_date` datetime NOT NULL,
  `contest_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `participation_status` enum('Upcoming','Participated','Missed') COLLATE utf8mb4_unicode_ci DEFAULT 'Upcoming',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`contest_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `contests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
