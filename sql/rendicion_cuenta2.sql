-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: rendicion_cuenta
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `administrador`
--

DROP TABLE IF EXISTS `administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `administrador` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dni` varchar(8) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `categoria` enum('admin','super_admin') NOT NULL,
  `estado` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- 
-- Dumping data for table `administrador`
--

LOCK TABLES `administrador` WRITE;
/*!40000 ALTER TABLE `administrador` DISABLE KEYS */;
INSERT INTO `administrador` VALUES (1,'40346175','MARTHA LUZ TUÑOQUE JULCAS','$2y$10$n7ZurrZsQR/Ha6liA4SoGun3jEggeie2hxBA09wXeVP8mOplHWT8e','super_admin',1);
/*!40000 ALTER TABLE `administrador` ENABLE KEYS */;
UNLOCK TABLES;

-- 
-- Table structure for table `baner_rendicion`
--

DROP TABLE IF EXISTS `baner_rendicion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `baner_rendicion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_rendicion` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_br_rendicion` (`id_rendicion`),
  CONSTRAINT `fk_br_rendicion` FOREIGN KEY (`id_rendicion`) REFERENCES `rendicion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- 
-- Dumping data for table `baner_rendicion`
--

LOCK TABLES `baner_rendicion` WRITE;
/*!40000 ALTER TABLE `baner_rendicion` DISABLE KEYS */;
/*!40000 ALTER TABLE `baner_rendicion` ENABLE KEYS */;
UNLOCK TABLES;

-- 
-- Table structure for table `eje`
--

DROP TABLE IF EXISTS `eje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `eje` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tematica` varchar(120) NOT NULL,
  `estado` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- 
-- Dumping data for table `eje`
--

LOCK TABLES `eje` WRITE;
/*!40000 ALTER TABLE `eje` DISABLE KEYS */;
/*!40000 ALTER TABLE `eje` ENABLE KEYS */;
UNLOCK TABLES;

-- 
-- Table structure for table `eje_seleccionado`
--

DROP TABLE IF EXISTS `eje_seleccionado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `eje_seleccionado` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_rendicion` int DEFAULT NULL,
  `id_eje` int DEFAULT NULL,
  `cantidad_pregunta` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_es_rendicion` (`id_rendicion`),
  KEY `fk_es_eje` (`id_eje`),
  CONSTRAINT `fk_es_eje` FOREIGN KEY (`id_eje`) REFERENCES `eje` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_es_rendicion` FOREIGN KEY (`id_rendicion`) REFERENCES `rendicion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- 
-- Dumping data for table `eje_seleccionado`
--

LOCK TABLES `eje_seleccionado` WRITE;
/*!40000 ALTER TABLE `eje_seleccionado` DISABLE KEYS */;
/*!40000 ALTER TABLE `eje_seleccionado` ENABLE KEYS */;
UNLOCK TABLES;

-- 
-- Table structure for table `historial_admin`
--

DROP TABLE IF EXISTS `historial_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `historial_admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_admin` int NOT NULL,
  `accion` enum('habilitar','deshabilitar','crear','editar_password') NOT NULL,
  `motivo` text,
  `realizado_por` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ha_admin` (`id_admin`),
  KEY `fk_ha_realizado` (`realizado_por`),
  CONSTRAINT `fk_ha_admin` FOREIGN KEY (`id_admin`) REFERENCES `administrador` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ha_realizado` FOREIGN KEY (`realizado_por`) REFERENCES `administrador` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- 
-- Dumping data for table `historial_admin`
--

LOCK TABLES `historial_admin` WRITE;
/*!40000 ALTER TABLE `historial_admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial_admin` ENABLE KEYS */;
UNLOCK TABLES;

-- 
-- Table structure for table `pregunta`
--

DROP TABLE IF EXISTS `pregunta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `pregunta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contenido` text NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_eje` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_p_usuario` (`id_usuario`),
  KEY `fk_p_eje` (`id_eje`),
  CONSTRAINT `fk_p_eje` FOREIGN KEY (`id_eje`) REFERENCES `eje` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_p_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- 
-- Dumping data for table `pregunta`
--

LOCK TABLES `pregunta` WRITE;
/*!40000 ALTER TABLE `pregunta` DISABLE KEYS */;
/*!40000 ALTER TABLE `pregunta` ENABLE KEYS */;
UNLOCK TABLES;

-- 
-- Table structure for table `pregunta_seleccionada`
--

DROP TABLE IF EXISTS `pregunta_seleccionada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `pregunta_seleccionada` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_eje_seleccionado` int DEFAULT NULL,
  `id_pregunta` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ps_es` (`id_eje_seleccionado`),
  KEY `fk_ps_pregunta` (`id_pregunta`),
  CONSTRAINT `fk_ps_es` FOREIGN KEY (`id_eje_seleccionado`) REFERENCES `eje_seleccionado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ps_pregunta` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- 
-- Dumping data for table `pregunta_seleccionada`
--

LOCK TABLES `pregunta_seleccionada` WRITE;
/*!40000 ALTER TABLE `pregunta_seleccionada` DISABLE KEYS */;
/*!40000 ALTER TABLE `pregunta_seleccionada` ENABLE KEYS */;
UNLOCK TABLES;

-- 
-- Table structure for table `rendicion`
--

DROP TABLE IF EXISTS `rendicion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `rendicion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `banner` varchar(255) COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- 
-- Dumping data for table `rendicion`
--

LOCK TABLES `rendicion` WRITE;
/*!40000 ALTER TABLE `rendicion` DISABLE KEYS */;
/*!40000 ALTER TABLE `rendicion` ENABLE KEYS */;
UNLOCK TABLES;

-- 
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `sexo` enum('M','F') NOT NULL,
  `tipo_participacion` enum('asistente','orador') NOT NULL,
  `titulo` enum('PERSONAL','ORGANIZACION') DEFAULT NULL,
  `ruc_empresa` varchar(11) DEFAULT NULL,
  `nombre_empresa` varchar(100) DEFAULT NULL,
  `dni` varchar(8) DEFAULT NULL,
  `id_rendicion` int DEFAULT NULL,
  `asistencia` enum('si','no') NOT NULL DEFAULT 'no',
  PRIMARY KEY (`id`),
  KEY `fk_usuario_r` (`id_rendicion`),
  CONSTRAINT `fk_usuario_r` FOREIGN KEY (`id_rendicion`) REFERENCES `rendicion` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- 
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-14 12:34:48