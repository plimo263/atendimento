-- adm_usuario: CRIACAO E INSERCAO
CREATE TABLE adm_usuario (id_usuario INT NOT NULL PRIMARY KEY AUTO_INCREMENT, nome varchar(100) UNIQUE NOT NULL, senha varchar(40) NOT NULL, email varchar(255) DEFAULT NULL);
INSERT INTO adm_usuario VALUES (0,'admin',SHA('$ODamemodb'),'');
-- adm_menu: CRIACAO E INSERCAO
CREATE TABLE adm_menu (id_menu INT NOT NULL PRIMARY KEY AUTO_INCREMENT,nome VARCHAR(255) NOT NULL, familia VARCHAR(255) NOT NULL, link VARCHAR(255) UNIQUE NOT NULL);
INSERT INTO adm_menu VALUES (1,'Administrador','Usuarios',"<li><a href='/adicionar_usuario'>Adicionar Usuario</a></li>"),(2,'Administrador','Usuarios',"<li><a href='/remover_usuario'>Remover Usuario</a></li>"),(3,'Administrador','Usuarios',"<li><a href='/adicionar_menu_usuario'>Adicionar Menu Usuario</a></li>"),(4,'Administrador','Usuarios',"<li><a href='/remove_menu_usuario'>Remove Menu Usuario</a></li>"),(5,'Administrador','Usuarios',"<li><a href='/adiciona_loja_usuario'>Adiciona Loja para Usuario</a></li>"),(6,'Administrador','Usuarios',"<li><a href='/remove_loja_usuario'>Remover Loja do Usuario</a></li>"),(7, 'Administrador', 'Usuarios', "<li><a href='/resetar_senha_usuario'>Resetar senha do Usuario</a></li>"),(8, 'Administrador', 'Usuarios', "<li><a href='/backup_banco'>BACKUP DO BANCO</a></li>"),(9, 'Administrador','Usuarios',"<li><a href='/restore_banco'>RESTORE DO BANCO</a></li>"),(10, 'INFORMATIVO DE NAO VENDA','Atendimento', "<li><a href=/informativo_nao_venda>Orçamentos</a></li>"),(11, 'ATENDIMENTO','Atendimento', "<li><a href=/atendimento>Atendimento</a></li>"),(12, 'GESTAO DE ATENDIMENTO','Atendimento', "<li><a href=/gestao_atendimento>Gestão Atendimentos</a></li>"),(13, 'CADASTRO DIVULGADORES', 'Atendimento', "<li><a href=/cadastro_divulgadores>Cadastro Divulgadores</a></li>"),(14, 'CADASTRO VENDEDORES', 'Atendimento', "<li><a href=/cadastro_vendedor>Cadastro Vendedores</a></li>"),(15, 'Administrador', 'Usuarios', "<li><a href='/cadastro_filial'>Adicionar Filiais</a></li>");
-- adm_filial: CRIACAO E INSERCAO
CREATE TABLE adm_filial (id_filial INT NOT NULL PRIMARY KEY AUTO_INCREMENT, filial CHAR(2) NOT NULL);
INSERT INTO adm_filial VALUES (1,'01'),(2,'02');
-- adm_usuario_menu: CRIACAO E INSERCAO
CREATE TABLE adm_usuario_menu (id_usuario INT NOT NULL, CONSTRAINT fk2_adm_usuario_id_usuario FOREIGN KEY(id_usuario) REFERENCES adm_usuario(id_usuario), id_menu INT NOT NULL, CONSTRAINT fk2_adm_menu_id_menue FOREIGN KEY(id_menu) REFERENCES adm_menu(id_menu));
 -- Incluindo os menus para o usuario administrador
 INSERT INTO adm_usuario_menu VALUES(1,1),(1,2),(1,3),(1,4), (1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15);
-- adm_filial_usuario: CRIACAO E INSERCAO
CREATE TABLE adm_usuario_filial (id_usuario INT NOT NULL, id_filial INT NOT NULL,CONSTRAINT fk_adm_usuario_filial_id_usuario FOREIGN KEY(id_usuario) REFERENCES adm_usuario(id_usuario),CONSTRAINT fk_adm_usuario_filial_id_filial FOREIGN KEY(id_filial) REFERENCES adm_filial(id_filial));
-- adm_usuario_filial
INSERT INTO adm_usuario_filial VALUES(1,1), (1,2);
CREATE TABLE `vendedor` (`id_vendedor` int(11) NOT NULL AUTO_INCREMENT,`nome` varchar(150) NOT NULL,`codigo_protheus` char(6) NOT NULL,`imagem` varchar(200) DEFAULT NULL,`filial` char(2) NOT NULL,PRIMARY KEY (`id_vendedor`));
CREATE TABLE `atendimento` (`id_atendimento` int(11) NOT NULL AUTO_INCREMENT,`id_vendedor` int(11) NOT NULL, `inicio_atendimento` char(5) NOT NULL, `hora_atendimento` char(5) NOT NULL, `data_atendimento` date DEFAULT NULL, `sexo` char(1) NOT NULL, `atendimento` varchar(100) NOT NULL, `segundo_atendimento` varchar(100) DEFAULT NULL, `terceiro_atendimento` varchar(100) DEFAULT NULL, `cliente` varchar(150) DEFAULT NULL, `telefone` varchar(15) DEFAULT NULL, `produto` varchar(255) DEFAULT NULL, `valor` varchar(15) DEFAULT NULL, `retorno` char(1) DEFAULT 'N', `id_divulgador` int(11) DEFAULT '0', PRIMARY KEY (`id_atendimento`), KEY `fk_id_vendedor_atendimento_fk_idx` (`id_vendedor`), CONSTRAINT `fk_id_vendedor_atendimento_fk` FOREIGN KEY (`id_vendedor`) REFERENCES `vendedor` (`id_vendedor`));
-- IMPORTANTE PARA QUE EM CASOS DE VENDEDORES EXCLUIDOS NAO SEJA PERDIDO OS DADOS JÁ INCLUSOS
INSERT INTO vendedor VALUES(1, 'PADRAO', '000001', '','99');
-- ESQUEMA PARA TABELA DE DIVULGADORES COM VINCULAÇAO NO MODELO MASTER FRANQUIA
CREATE TABLE `divulgador` (`id_divulgador` int(11) NOT NULL AUTO_INCREMENT,`nome` varchar(200) NOT NULL, `D_E_L_E_T_` char(1) DEFAULT NULL, PRIMARY KEY (`id_divulgador`));
CREATE TABLE adm_filial_divulgador(id_filial INT NOT NULL, id_divulgador INT NOT NULL,CONSTRAINT fk_id_filial_divulgador FOREIGN KEY(id_filial) REFERENCES adm_filial(id_filial), CONSTRAINT fk_id_divulgador_divulgador FOREIGN KEY(id_divulgador) REFERENCES divulgador(id_divulgador));
