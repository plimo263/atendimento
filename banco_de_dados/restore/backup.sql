-- MySQL dump 10.13  Distrib 5.7.21, for Linux (x86_64)
--
-- Host: localhost    Database: atendimento
-- ------------------------------------------------------
-- Server version	5.7.21-0ubuntu0.16.04.1

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
-- Table structure for table `adm_filial`
--

DROP TABLE IF EXISTS `adm_filial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `adm_filial` (
  `id_filial` int(11) NOT NULL AUTO_INCREMENT,
  `filial` char(2) NOT NULL,
  PRIMARY KEY (`id_filial`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adm_filial`
--

LOCK TABLES `adm_filial` WRITE;
/*!40000 ALTER TABLE `adm_filial` DISABLE KEYS */;
INSERT INTO `adm_filial` VALUES (1,'01'),(2,'02'),(3,'03'),(4,'04'),(5,'05');
/*!40000 ALTER TABLE `adm_filial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `adm_filial_divulgador`
--

DROP TABLE IF EXISTS `adm_filial_divulgador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `adm_filial_divulgador` (
  `id_filial` int(11) NOT NULL,
  `id_divulgador` int(11) NOT NULL,
  KEY `fk_id_filial_divulgador` (`id_filial`),
  KEY `fk_id_divulgador_divulgador` (`id_divulgador`),
  CONSTRAINT `fk_id_divulgador_divulgador` FOREIGN KEY (`id_divulgador`) REFERENCES `divulgador` (`id_divulgador`),
  CONSTRAINT `fk_id_filial_divulgador` FOREIGN KEY (`id_filial`) REFERENCES `adm_filial` (`id_filial`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adm_filial_divulgador`
--

LOCK TABLES `adm_filial_divulgador` WRITE;
/*!40000 ALTER TABLE `adm_filial_divulgador` DISABLE KEYS */;
INSERT INTO `adm_filial_divulgador` VALUES (1,2),(1,1);
/*!40000 ALTER TABLE `adm_filial_divulgador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `adm_menu`
--

DROP TABLE IF EXISTS `adm_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `adm_menu` (
  `id_menu` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `familia` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  PRIMARY KEY (`id_menu`),
  UNIQUE KEY `link` (`link`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adm_menu`
--

LOCK TABLES `adm_menu` WRITE;
/*!40000 ALTER TABLE `adm_menu` DISABLE KEYS */;
INSERT INTO `adm_menu` VALUES (1,'Administrador','Usuarios','<li><a href=\'/adicionar_usuario\'>Adicionar Usuario</a></li>'),(2,'Administrador','Usuarios','<li><a href=\'/remover_usuario\'>Remover Usuario</a></li>'),(3,'Administrador','Usuarios','<li><a href=\'/adicionar_menu_usuario\'>Adicionar Menu Usuario</a></li>'),(4,'Administrador','Usuarios','<li><a href=\'/remove_menu_usuario\'>Remove Menu Usuario</a></li>'),(5,'Administrador','Usuarios','<li><a href=\'/adiciona_loja_usuario\'>Adiciona Loja para Usuario</a></li>'),(6,'Administrador','Usuarios','<li><a href=\'/remove_loja_usuario\'>Remover Loja do Usuario</a></li>'),(7,'Administrador','Usuarios','<li><a href=\'/resetar_senha_usuario\'>Resetar senha do Usuario</a></li>'),(8,'Administrador','Usuarios','<li><a href=\'/backup_banco\'>BACKUP DO BANCO</a></li>'),(9,'Administrador','Usuarios','<li><a href=\'/restore_banco\'>RESTORE DO BANCO</a></li>'),(10,'INFORMATIVO DE NAO VENDA','Atendimento','<li><a href=/informativo_nao_venda>Orçamentos</a></li>'),(11,'ATENDIMENTO','Atendimento','<li><a href=/atendimento>Atendimento</a></li>'),(12,'GESTAO DE ATENDIMENTO','Atendimento','<li><a href=/gestao_atendimento>Gestão Atendimentos</a></li>'),(13,'CADASTRO DIVULGADORES','Atendimento','<li><a href=/cadastro_divulgadores>Cadastro Divulgadores</a></li>'),(14,'CADASTRO VENDEDORES','Atendimento','<li><a href=/cadastro_vendedor>Cadastro Vendedores</a></li>'),(15,'Administrador','Usuarios','<li><a href=\'/cadastro_filial\'>Adicionar Filiais</a></li>');
/*!40000 ALTER TABLE `adm_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `adm_usuario`
--

DROP TABLE IF EXISTS `adm_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `adm_usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `senha` varchar(40) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adm_usuario`
--

LOCK TABLES `adm_usuario` WRITE;
/*!40000 ALTER TABLE `adm_usuario` DISABLE KEYS */;
INSERT INTO `adm_usuario` VALUES (1,'admin','bfb8debde06b4ade53ffcaf43dcc4744433adce5',''),(3,'loja01','40bd001563085fc35165329ea1ff5c5ecbdbbeef',NULL);
/*!40000 ALTER TABLE `adm_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `adm_usuario_filial`
--

DROP TABLE IF EXISTS `adm_usuario_filial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `adm_usuario_filial` (
  `id_usuario` int(11) NOT NULL,
  `id_filial` int(11) NOT NULL,
  KEY `fk_adm_usuario_filial_id_usuario` (`id_usuario`),
  KEY `fk_adm_usuario_filial_id_filial` (`id_filial`),
  CONSTRAINT `fk_adm_usuario_filial_id_filial` FOREIGN KEY (`id_filial`) REFERENCES `adm_filial` (`id_filial`),
  CONSTRAINT `fk_adm_usuario_filial_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `adm_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adm_usuario_filial`
--

LOCK TABLES `adm_usuario_filial` WRITE;
/*!40000 ALTER TABLE `adm_usuario_filial` DISABLE KEYS */;
INSERT INTO `adm_usuario_filial` VALUES (1,1),(1,2),(3,1),(1,3),(1,4),(1,5);
/*!40000 ALTER TABLE `adm_usuario_filial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `adm_usuario_menu`
--

DROP TABLE IF EXISTS `adm_usuario_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `adm_usuario_menu` (
  `id_usuario` int(11) NOT NULL,
  `id_menu` int(11) NOT NULL,
  KEY `fk2_adm_usuario_id_usuario` (`id_usuario`),
  KEY `fk2_adm_menu_id_menue` (`id_menu`),
  CONSTRAINT `fk2_adm_menu_id_menue` FOREIGN KEY (`id_menu`) REFERENCES `adm_menu` (`id_menu`),
  CONSTRAINT `fk2_adm_usuario_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `adm_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adm_usuario_menu`
--

LOCK TABLES `adm_usuario_menu` WRITE;
/*!40000 ALTER TABLE `adm_usuario_menu` DISABLE KEYS */;
INSERT INTO `adm_usuario_menu` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(3,10),(3,11);
/*!40000 ALTER TABLE `adm_usuario_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `atendimento`
--

DROP TABLE IF EXISTS `atendimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `atendimento` (
  `id_atendimento` int(11) NOT NULL AUTO_INCREMENT,
  `id_vendedor` int(11) NOT NULL,
  `inicio_atendimento` char(5) NOT NULL,
  `hora_atendimento` char(5) NOT NULL,
  `data_atendimento` date DEFAULT NULL,
  `sexo` char(1) NOT NULL,
  `atendimento` varchar(100) NOT NULL,
  `segundo_atendimento` varchar(100) DEFAULT NULL,
  `terceiro_atendimento` varchar(100) DEFAULT NULL,
  `cliente` varchar(150) DEFAULT NULL,
  `telefone` varchar(15) DEFAULT NULL,
  `produto` varchar(255) DEFAULT NULL,
  `valor` varchar(15) DEFAULT NULL,
  `retorno` char(1) DEFAULT 'N',
  `id_divulgador` int(11) DEFAULT '0',
  PRIMARY KEY (`id_atendimento`),
  KEY `fk_id_vendedor_atendimento_fk_idx` (`id_vendedor`),
  CONSTRAINT `fk_id_vendedor_atendimento_fk` FOREIGN KEY (`id_vendedor`) REFERENCES `vendedor` (`id_vendedor`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atendimento`
--

LOCK TABLES `atendimento` WRITE;
/*!40000 ALTER TABLE `atendimento` DISABLE KEYS */;
INSERT INTO `atendimento` VALUES (1,2,'11:08','11:08','2018-02-23','F','venda','com_rx','normal','','','','0','N',1),(2,3,'11:08','11:08','2018-02-23','F','ajuste_conserto_montagem_pagamento','com_rx','normal','','','','0','N',2);
/*!40000 ALTER TABLE `atendimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `divulgador`
--

DROP TABLE IF EXISTS `divulgador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `divulgador` (
  `id_divulgador` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(200) NOT NULL,
  `D_E_L_E_T_` char(1) DEFAULT NULL,
  PRIMARY KEY (`id_divulgador`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `divulgador`
--

LOCK TABLES `divulgador` WRITE;
/*!40000 ALTER TABLE `divulgador` DISABLE KEYS */;
INSERT INTO `divulgador` VALUES (1,'RADIO',NULL),(2,'TELEVISÃO',NULL);
/*!40000 ALTER TABLE `divulgador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendedor`
--

DROP TABLE IF EXISTS `vendedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendedor` (
  `id_vendedor` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `codigo_protheus` char(6) NOT NULL,
  `imagem` varchar(200) DEFAULT NULL,
  `filial` char(2) NOT NULL,
  PRIMARY KEY (`id_vendedor`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendedor`
--

LOCK TABLES `vendedor` WRITE;
/*!40000 ALTER TABLE `vendedor` DISABLE KEYS */;
INSERT INTO `vendedor` VALUES (1,'PADRAO','000001','','99'),(2,'MARCOS FELIPE','000002','/imagens/sem_foto.png','01'),(3,'FELIPE JARDIM','000003','/imagens/sem_foto.png','01');
/*!40000 ALTER TABLE `vendedor` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-02-23 11:32:16
-- ARQUIVO DE BACKUP;
