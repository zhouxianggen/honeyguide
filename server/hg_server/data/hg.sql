-- MySQL dump 10.13  Distrib 5.1.47, for unknown-linux-gnu (x86_64)
--
-- Host: 10.99.20.92    Database: hg
-- ------------------------------------------------------
-- Server version	5.1.47-community-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `action_link`
--

DROP TABLE IF EXISTS `action_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `action_link` (
  `id` varchar(128) NOT NULL,
  `comb_id` varchar(64) NOT NULL,
  `linker_id` varchar(64) NOT NULL,
  `date` datetime NOT NULL,
  `address` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `comb_id` (`comb_id`,`linker_id`),
  KEY `comb_id_2` (`comb_id`,`linker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action_link`
--

LOCK TABLES `action_link` WRITE;
/*!40000 ALTER TABLE `action_link` DISABLE KEYS */;
INSERT INTO `action_link` VALUES ('1','1','1','2015-04-09 00:00:00','');
/*!40000 ALTER TABLE `action_link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `action_taste`
--

DROP TABLE IF EXISTS `action_taste`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `action_taste` (
  `id` varchar(128) NOT NULL,
  `bee_id` varchar(64) NOT NULL,
  `comb_id` varchar(64) NOT NULL,
  `linker_id` varchar(64) NOT NULL,
  `waggle_id` varchar(64) NOT NULL,
  `date` datetime NOT NULL,
  `address` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bee_id` (`bee_id`,`comb_id`,`linker_id`,`waggle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action_taste`
--

LOCK TABLES `action_taste` WRITE;
/*!40000 ALTER TABLE `action_taste` DISABLE KEYS */;
INSERT INTO `action_taste` VALUES ('1','1','1','1','1','2015-04-30 00:00:00','');
/*!40000 ALTER TABLE `action_taste` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meta_bee`
--

DROP TABLE IF EXISTS `meta_bee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meta_bee` (
  `id` varchar(64) NOT NULL,
  `name` varchar(255) NOT NULL,
  `avatar` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meta_bee`
--

LOCK TABLES `meta_bee` WRITE;
/*!40000 ALTER TABLE `meta_bee` DISABLE KEYS */;
INSERT INTO `meta_bee` VALUES ('1','zxg','');
/*!40000 ALTER TABLE `meta_bee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meta_comb`
--

DROP TABLE IF EXISTS `meta_comb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meta_comb` (
  `id` varchar(64) NOT NULL,
  `bee_id` varchar(64) NOT NULL,
  `title` text NOT NULL,
  `position` text,
  `enable_share` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meta_comb`
--

LOCK TABLES `meta_comb` WRITE;
/*!40000 ALTER TABLE `meta_comb` DISABLE KEYS */;
INSERT INTO `meta_comb` VALUES ('1','1','VERO MODA 西城广场店','',1);
/*!40000 ALTER TABLE `meta_comb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meta_linker`
--

DROP TABLE IF EXISTS `meta_linker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meta_linker` (
  `id` varchar(255) NOT NULL,
  `developer_id` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='连接器表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meta_linker`
--

LOCK TABLES `meta_linker` WRITE;
/*!40000 ALTER TABLE `meta_linker` DISABLE KEYS */;
INSERT INTO `meta_linker` VALUES ('1','1','http://54.69.50.170/?bee=1&comb=1','去淘宝','从微信快速访问你的淘宝店','taobao.png','0'),('2','2','http://54.69.50.170/?bee=1&comb=1','免费电话','免费电话','call1.jpg','0'),('3','3','http://54.69.50.170/?bee=1&comb=1','风先生','同城速递','express1.png','0');
/*!40000 ALTER TABLE `meta_linker` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meta_waggle`
--

DROP TABLE IF EXISTS `meta_waggle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meta_waggle` (
  `id` varchar(128) NOT NULL,
  `bee_id` varchar(64) NOT NULL,
  `comb_id` varchar(64) NOT NULL,
  `date` datetime NOT NULL,
  `address` text NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bee_id` (`bee_id`,`comb_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meta_waggle`
--

LOCK TABLES `meta_waggle` WRITE;
/*!40000 ALTER TABLE `meta_waggle` DISABLE KEYS */;
INSERT INTO `meta_waggle` VALUES ('1','1','1','0000-00-00 00:00:00','','{\"image\": \"page1.jpg\", \"notes\":[{\"type\":\"text\", \"position_x\": 0.2, \"position_y\": 0.6, \"content\": \"ding in the sun\"}]}'),('2','1','1','0000-00-00 00:00:00','','{\"image\": \"page2.jpg\", \"notes\": []}'),('3','1','1','0000-00-00 00:00:00','','{\"image\": \"page3.jpg\", \"notes\": []}'),('4','1','1','0000-00-00 00:00:00','','{\"image\": \"page4.jpg\", \"notes\": []}'),('5','1','1','0000-00-00 00:00:00','','{\"image\": \"page5.jpg\", \"notes\": []}');
/*!40000 ALTER TABLE `meta_waggle` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-04-17 20:36:16
