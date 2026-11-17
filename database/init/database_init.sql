-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: emission_factors
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.22.04.5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `emission_factors`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `emission_factors` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `emission_factors`;

--
-- Table structure for table `activity_data`
--

DROP TABLE IF EXISTS `activity_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `year` int NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` double NOT NULL,
  `factor_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `factor_key` (`factor_key`),
  CONSTRAINT `activity_data_ibfk_1` FOREIGN KEY (`factor_key`) REFERENCES `emission_factors` (`factor_key`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_data`
--

LOCK TABLES `activity_data` WRITE;
/*!40000 ALTER TABLE `activity_data` DISABLE KEYS */;
INSERT INTO `activity_data` VALUES (1,2026,'offices','enschede','Electricity Enschede',72504.68,'electricity_audax','EUR 18126.17 / 0.25'),(2,2026,'offices','the-hague','Electricity The Hague',12989.16,'electricity_audax','EUR 3247.29 / 0.25'),(3,2026,'offices','bought-laptops','New laptops',10,'laptop_production',NULL),(4,2026,'digital','ai','Claude + ChatGPT',120000,'ai_tokens','10,000 million tokens x 12 months'),(5,2026,'digital','servers','Hetzner',33500,'hetzner_hydro',NULL),(6,2026,'digital','servers','Hypernode',4700,'hypernode_effective',NULL),(7,2026,'digital','servers','SV11 (webguru)',270,'electricity_nl_grid',NULL),(8,2026,'transport','train','Employee commute',136878,'train',NULL),(9,2026,'transport','car','Employee commute',27283,'car_avg',NULL),(10,2026,'transport','Walking/Cycling','Employee commute (cycling 14,058 + walking 4,011 km)',18069,'zero',NULL);
/*!40000 ALTER TABLE `activity_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emission_factors`
--

DROP TABLE IF EXISTS `emission_factors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emission_factors` (
  `factor_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kg_co2_per_unit` double NOT NULL,
  `unit` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_year` int NOT NULL,
  `notes` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`factor_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emission_factors`
--

LOCK TABLES `emission_factors` WRITE;
/*!40000 ALTER TABLE `emission_factors` DISABLE KEYS */;
INSERT INTO `emission_factors` VALUES ('ai_tokens',0.4325,'million tokens','dev.to Claude Code article',2026,'average of input 39 g and output 826 g'),('car_avg',0.19,'km','CO2emissiefactoren.nl',2026,'average car per vehicle km'),('electricity_audax',0.21511,'kWh','Audax stroometiket',2024,NULL),('electricity_nl_grid',0.205,'kWh','Electricity Maps NL',2025,NULL),('ev_charging_nl',0.244,'kWh','CO2emissiefactoren.nl',2026,NULL),('hetzner_hydro',0.024,'kWh','IHA hydropower factsheet',2025,NULL),('hypernode_effective',0.01435,'kWh','Electricity Maps NL x 7% non-green',2025,'93% green, so 0.07 x 205 g'),('laptop_production',192.5,'laptop','Apple MacBook Pro 16 PER',2024,'69% of 279 kg'),('train',0.03,'km','CO2emissiefactoren.nl',2026,'per passenger km'),('zero',0,'km','No direct emissions during use',2026,'walking and cycling');
/*!40000 ALTER TABLE `emission_factors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-17 18:22:31
