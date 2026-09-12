-- MySQLShell dump 2.0.1  Distrib Ver 8.0.46 for Win64 on x86_64 - for MySQL 8.0.46 (MySQL Community Server (GPL)), for Win64 (x86_64)
--
-- Host: localhost    Database: synapseos    Table: progress
-- ------------------------------------------------------
-- Server version	8.0.46

--
-- Table structure for table `progress`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `progress` (
  `progress_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `subject_id` int NOT NULL,
  `completion_percentage` int DEFAULT '0',
  `total_study_minutes` int DEFAULT '0',
  `tasks_completed` int DEFAULT '0',
  `notes_created` int DEFAULT '0',
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`progress_id`),
  KEY `user_id` (`user_id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `progress_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
