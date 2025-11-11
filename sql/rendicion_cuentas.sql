-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: rendicion_cuentas
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
-- Table structure for table `administradores`
--

DROP TABLE IF EXISTS `administradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administradores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dni_admin` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `nombres_admin` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `categoria_admin` enum('admin','super_admin') COLLATE utf8mb4_general_ci NOT NULL,
  `estado` enum('habilitado','deshabilitado') COLLATE utf8mb4_general_ci DEFAULT 'habilitado',
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administradores`
--

LOCK TABLES `administradores` WRITE;
/*!40000 ALTER TABLE `administradores` DISABLE KEYS */;
INSERT INTO `administradores` VALUES (1,'40346175','MARTHA LUZ TUÑOQUE JULCAS','$2y$10$n7ZurrZsQR/Ha6liA4SoGun3jEggeie2hxBA09wXeVP8mOplHWT8e','super_admin','habilitado','2025-11-11 17:35:54','2025-11-11 17:35:54');
/*!40000 ALTER TABLE `administradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eje`
--

DROP TABLE IF EXISTS `eje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eje` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tematica` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `estado` enum('habilitado','deshabilitado') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'habilitado',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eje`
--

LOCK TABLES `eje` WRITE;
/*!40000 ALTER TABLE `eje` DISABLE KEYS */;
/*!40000 ALTER TABLE `eje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejes_seleccionados`
--

DROP TABLE IF EXISTS `ejes_seleccionados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejes_seleccionados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_rendicion` int DEFAULT NULL,
  `id_eje` int DEFAULT NULL,
  `cantidad_preguntas` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_rendicion` (`id_rendicion`),
  KEY `fk_eje` (`id_eje`),
  CONSTRAINT `fk_ejes_eje` FOREIGN KEY (`id_eje`) REFERENCES `eje` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ejes_rendicion` FOREIGN KEY (`id_rendicion`) REFERENCES `rendicion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejes_seleccionados`
--

LOCK TABLES `ejes_seleccionados` WRITE;
/*!40000 ALTER TABLE `ejes_seleccionados` DISABLE KEYS */;
/*!40000 ALTER TABLE `ejes_seleccionados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_admin`
--

DROP TABLE IF EXISTS `historial_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_admin` int NOT NULL,
  `accion` enum('habilitar','deshabilitar','crear','editar_password') COLLATE utf8mb4_general_ci NOT NULL,
  `motivo` text COLLATE utf8mb4_general_ci,
  `realizado_por` int NOT NULL,
  `fecha_accion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_admin` (`id_admin`),
  KEY `fk_realizado_por` (`realizado_por`),
  CONSTRAINT `historial_admin_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `administradores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `historial_admin_ibfk_2` FOREIGN KEY (`realizado_por`) REFERENCES `administradores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pregunta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contenido` text COLLATE utf8mb4_general_ci NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_eje` int DEFAULT NULL,
  `fecha_registro` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pregunta_usuario` (`id_usuario`),
  KEY `fk_pregunta_eje` (`id_eje`),
  CONSTRAINT `pregunta_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pregunta_ibfk_2` FOREIGN KEY (`id_eje`) REFERENCES `eje` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pregunta`
--

LOCK TABLES `pregunta` WRITE;
/*!40000 ALTER TABLE `pregunta` DISABLE KEYS */;
/*!40000 ALTER TABLE `pregunta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preguntas_seleccionadas`
--

DROP TABLE IF EXISTS `preguntas_seleccionadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preguntas_seleccionadas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_eje_seleccionado` int DEFAULT NULL,
  `id_pregunta` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_eje_seleccionado` (`id_eje_seleccionado`),
  KEY `fk_pregunta` (`id_pregunta`),
  CONSTRAINT `preguntas_seleccionadas_ibfk_1` FOREIGN KEY (`id_eje_seleccionado`) REFERENCES `ejes_seleccionados` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preguntas_seleccionadas_ibfk_2` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preguntas_seleccionadas`
--

LOCK TABLES `preguntas_seleccionadas` WRITE;
/*!40000 ALTER TABLE `preguntas_seleccionadas` DISABLE KEYS */;
/*!40000 ALTER TABLE `preguntas_seleccionadas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rendicion`
--

DROP TABLE IF EXISTS `rendicion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rendicion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora_rendicion` time NOT NULL,
  `banner_rendicion` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(60) COLLATE utf8mb4_general_ci NOT NULL,
  `sexo` enum('M','F') COLLATE utf8mb4_general_ci NOT NULL,
  `tipo_participacion` enum('asistente','orador') COLLATE utf8mb4_general_ci NOT NULL,
  `titulo` enum('PERSONAL','ORGANIZACION') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ruc_empresa` varchar(11) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre_empresa` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dni` varchar(8) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_rendicion` int DEFAULT NULL,
  `asistencia` enum('si','no') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'no',
  PRIMARY KEY (`id`),
  KEY `fk_rendicion_usuario` (`id_rendicion`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rendicion`) REFERENCES `rendicion` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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

-- Dump completed on 2025-11-11 12:38:33
