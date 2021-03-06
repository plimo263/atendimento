# -*- coding: utf8 -*- #

"""
Autor               :	Marcos Felipe da Silva Jardim
Versão atual		:	1.2
Data da versão atual:	17-02-2017

------------------------------------------------------------------------------------------------------------------------------
Notas de versão:

Versão 1.0  :	17-02-2017 Inclusão da classe Consulta que trabalha sobre dados retornados de uma consulta
Versão 1.1  :   19-06-2017 Inclusão do metodo gravaVisita() para a classe usuario. Metodo responsavel por salvar na tabela a data de acesso.
versão 1.2  :   19-06-2017 Usuario,senha,banco e servidor do MSSQL é repassado pelas variaveis MS_USUARIO, MS_SERVIDOR, MS_BANCO, MS_SENHA
------------------------------------------------------------------------------------------------------------------------------	

"""
import pymysql
import config
import re, time, os
from bottle import request, response
from datetime import datetime

# Acesso base de dados Mysql
my_usuario = config.MY_USUARIO
my_senha =  config.MY_SENHA
my_banco = config.MY_BANCO
my_servidor = config.MY_SERVIDOR

# Acesso a base de dados MSSQL
ms_usuario = ''
ms_senha = ''
ms_banco = ''
ms_servidor = '' 

## Classe que gera datas em formato formulario e banco mssql
class Data:
    __de = ''
    __ate = ''
    def __init__(self):
        self.__obterData()

    def __obterData(self):
        self.__de = request.get_cookie('de')
        self.__ate = request.get_cookie('ate')
        if self.__de == '' or self.__ate == '' or self.__de is None or self.__ate is None:
            dataAtual = datetime.now()
            self.__de = '%04d-%02d-%02d' % (dataAtual.year, dataAtual.month, dataAtual.day)
            self.__ate = '%04d-%02d-%02d' % (dataAtual.year, dataAtual.month, dataAtual.day)

    def getDataForm(self):
        '''Obtem a data no formato tradicional'''
        return [self.__de, self.__ate]

    def getData(self):
        '''Obtem a data no formato de acesso ao banco de dados '''
        de = self.__de.replace('-','')
        ate = self.__ate.replace('-','')
        return [de, ate]

    def gravaData(self):
        ''' Grava a data atual em um cookie no formato das datas de formulario '''
        response.set_cookie('de', self.__de, expires = (time.time()+(60*60*72)), path = '/')
        response.set_cookie('ate', self.__ate, expires = (time.time()+(60*60*72)), path = '/')
    def setData(self, de, ate):
        ''' Grava as variaveis de data.'''
        padrao = re.compile('^[2][0][1-9][0-9]-([0][1-9]|[1][0-2])-([3][0-1]|[0][1-9]|[1-2][0-9])$')
        if padrao.match(de) and padrao.match(ate):
            self.__de = de
            self.__ate = ate
        else:
            return 'Data informada de forma incorreta'

# Função utilizada para executar um consulta no sgbd informado
def executarConsulta(consulta, usuario, senha, banco, servidor, tipo_sgbd='mysql'):
    # Se conecta ao banco, executa a consulta e retorna sucesso á consulta
    """ Realiza de fato a conexão, usando os parametros passados para a conexão """
    if tipo_sgbd == 'mysql':
        con = pymysql.connect(user = usuario, password = senha, database = banco, host = servidor)
    elif tipo_sgbd == 'mssql':
        con = pymssql.connect(user = usuario, password = senha, database = banco, host = servidor)
    else:
        return 'Erro, tipo de SGBD não reconhecido'
    # Executar a conexão e a consulta
    cur = con.cursor()
    cur.execute(consulta)
    con.commit()
    cur.close()
    con.close()

## Classe usada para trabalhar com consultas do tipo select. Contem muitos metodos uteis como ordenacao de colunas e filtros de campos
class Consulta:
    __campos  = ''
    __registros = ''

    
    def __init__(self, consulta, usuario, senha, banco, servidor, tipo_sgbd='mysql'):
        """Retorna um objeto consulta sendo os parametros consulta, usuario , senha, banco, servidor devem ser repassados no momento de criação do objeto. O único parâmetro opcional é  o tipo de sgbd que vem como padrão mysql
	EX: obj = Consulta('select * from teste', 'root', 'marcos', 'banco_teste', 'localhost', 'mysql')
        """
        
        self.__consulta = consulta
        self.__usuario = usuario
        self.__senha = senha
        self.__banco = banco
        self.__servidor = servidor
        self.__tipo_sgbd = tipo_sgbd
	
        self.__conexao()

    def __str__(self):
        return 'Consulta("%s", "%s", "%s", "%s", "%s", "%s")' % \
               (self.__consulta, self.__usuario, self.__senha, self.__banco, self.__servidor, self.__tipo_sgbd)
    def __repr__(self):
        return eval('Consulta("%s", "%s", "%s", "%s", "%s", "%s")' %
                    (self.__consulta, self.__usuario, self.__senha, self.__banco, self.__servidor, self.__tipo_sgbd))
    def __len__(self):
        return len(self.__campos)

    def getCampos(self):
        """ Retorna todos os campos da tabela """
        return self.__campos

    def getRegistros(self):
        """ Retorna todos os registros da consulta """
        return self.__registros

    def setConsulta(self, consulta):
        """
        self.setConsulta('select * from adm_menu')
        
        Executa uma nova consulta no banco e redefine as variaveis de instancia __registros e __campos.\
        Este metodo foi criado com o intuito de permitir a mudança de dados sem de fato ter de criar outro
        objeto consulta.
        OBS: Somente aceita querys de selecao (select)
        """

        self.__consulta = consulta
        self.__conexao()
        
        
    
    def __conexao(self):
        """ Realiza de fato a conexão, usando os parametros passados para a conexão """
        if self.__tipo_sgbd == 'mysql':
            con = pymysql.connect(user = self.__usuario, password = self.__senha, database = self.__banco, host = self.__servidor)
        elif self.__tipo_sgbd == 'mssql':
            con = pymssql.connect(user = self.__usuario, password = self.__senha, database = self.__banco, host = self.__servidor)
        else:
            return 'Erro, tipo de SGBD não reconhecido'

        # Executar a conexão e a consulta
        cur = con.cursor()
        cur.execute(self.__consulta)
        # Preenchendo os cabecalhos
        self.__campos = [str(campo) for campo, *_ in cur.description]
        # Preenchendo o corpo
        self.__registros = [reg for reg in cur.fetchall()]
        
        # Fechando a conexão com o banco
        con.commit()
        cur.close()

    def selecionaCampo(self, nome):
        """
        self.selecionaCampo('nome') ou self.selecionaCampo(0) => list()
        
        Seleciona um campo baseado no nome que é informado ou no seu numero de coluna. \
        O nome de fato deve ser real ao nome do campo informado pelo retornno de self.getCampos() """
        if nome in self.__campos:
            index = self.__campos.index(nome)
            return [str(item[index]) for item in self.__registros]
        # Se nome for um numero então ele será comparado para verificação de indice de coluna
        elif isinstance(nome, int):
            if nome <= (len(self.__campos)-1):
                index = nome
                return [str(item[index]) for item in self.__registros]
            else:
                return 'O indice de coluna informado não é acessivel na consulta, verifique os campos no atributo _campos ou use um nome de coluna'
        else:
            return 'A coluna informada não foi encontrada, favor verificar o atributo _campos'

    def selecionaCampos(self, lista):
        """self.selecionaCampos(['nome','senha']) => list()
        Seleciona um ou mais campos informados pelo seu nome. Os nomes devem ser enviados \
        dentro de uma lista. Se não sabe quais colunas deseja capturar verifique o metodo getCampos().
        Os campos são retornados como uma tupla aninhada dentro de uma lista externa. """
        if isinstance(lista, list):
            # Cria um objeto conjunto para unificar os campos
            conjunto = list()
            for item in lista:
                if isinstance(item, str) and item in self.__campos:
                    conjunto.append(self.__campos.index(item))
                else:
                    return 'Favor enviar somente nomes de colunas que existam em self.__campos'

                reg = []
                for item in self.__registros:
                    listas = []
                    for campo in conjunto:
                        listas.append(item[campo])
                    reg.append(tuple(listas))
            return reg
        else:
            return 'Por favor informe uma lista para os campos que se deseja retornar'
    
    def ordenaColuna(self, coluna, decrescente=True):
        """Ordena a coluna informada na ordem desejada(ordena os registros) e devolve uma copia para o
        usuario. A coluna deve existir em __campos (verificar com o metodo getCampos()).
        self.ordenaColuna('id_usuarios', False)
        """
        # Se a coluna não existe em self.__campos nem continuo
        if coluna not in self.__campos:
            return 'Campo nao existe'
        
        # Salva os valores originais em variaveis usadas para devolver tudo ao estado original
        campo_original = self.__campos[:]
        registro_original = self.__registros[:]
        # Faz uma copia para uma lista onde vai estar os campos alterados. Na verdade ela é somente temporaria
        campo_alterado = self.__campos[:]
        # Remove o campo a ser ordenado da lista copiada. Isto para trazer ele em um novo array como primeiro campo        
        campos_ordenados = [campo_alterado.pop(self.__campos.index(coluna))]
        desc = [ campos_ordenados.append(item) for item in campo_alterado ]
        # Exclui a variavel temporaria desc e campo_alterado (reducao de consumo de memoria)
        del desc
        del campo_alterado
        ## Recupera os registros desejados com a coluna a ser ordenada em primeiro lugar
        registros_ordenados = self.selecionaCampos(campos_ordenados)
        ## Ordena de fato os registros baseado no valor de decrescente, True ou false
        registros_ordenados = sorted(registros_ordenados, reverse=decrescente)

        ## Insere a ordem dos novos registros em self.__registros e self.__campos armazena a ordem dos campos
        # Isto é importante porque vamos devolver os campos originais ao usuario, ou seja as colunas originais na ordem da coluna
        # informada.
        self.__registros = registros_ordenados
        self.__campos = campos_ordenados
        ## Pede para receber o retorno da ordem das colunas originais com os registros ordenados da forma desejada antes.
        
        registros_ordenados = self.selecionaCampos(campo_original)
        # Volta os valores __campos e __registros para o original
        self.__campos = campo_original
        self.__registros = registro_original
        # Devolve os registros em ordem de coluna original com a coluna desejada ditando a ordem principal
        return registros_ordenados
    def procuraDados(self, dado):
        """ Retorna True se o dado a ser procurado existe em self.getRegistros(), caso contrario retorna False"""
        for reg in self.getRegistros():
            for item in reg:
                if dado == item:
                    return True
        return False


## CLASSE DO USUARIO. ARMAZENA COOKIES, RETORNA-OS, EXIBE SEU NOME, RETORNA ACESSOS ETC...
class Usuario(Consulta, Data):
    __id = 0
    __nome = ''
    __menus = list()
	
    def __init__(self, usuario = '', senha = ''):
        ''' Retorna um objeto usuario recebendo como parametro inicial o ID do usuario '''
        self.__dadosUsuario(usuario, senha)
        Data.__init__(self)    
    def getLojas(self, com_id = False):
        ''' Retorna todas as lojas que o usuario tem acesso. '''
        if com_id == True:
            sql = "select af.id_filial, af.filial from adm_filial af INNER JOIN adm_usuario_filial auf \
            ON af.id_filial = auf.id_filial INNER JOIN adm_usuario au ON au.id_usuario = auf.id_usuario \
            WHERE auf.id_usuario = %d" % self.getID()
        else:
            sql = "select af.filial from adm_filial af INNER JOIN adm_usuario_filial auf \
            ON af.id_filial = auf.id_filial INNER JOIN adm_usuario au ON au.id_usuario = auf.id_usuario \
            WHERE auf.id_usuario = %d" % self.getID()
        con = pymysql.connect(user = my_usuario, password = my_senha, database = my_banco, host = my_servidor)
        cur = con.cursor()
        cur.execute(sql)
        if com_id == True:
            lojas = [ loja for loja in cur.fetchall()]
        else:
            lojas = [  ('%s') % loja for loja in cur.fetchall()]
        cur.close()
        con.close()
        return lojas

    def getGrupos(self, com_id = False):
        '''Retorna todos os grupos que o usuario tem acesso. Os grupos são retornados em uma matriz '''
        if com_id == True:
            sql = "select ag.id_grupo, ag.grupo from adm_grupo  ag INNER JOIN adm_usuario_grupo aug ON ag.id_grupo = aug.id_grupo \
            INNER JOIN adm_usuario au ON au.id_usuario = aug.id_usuario WHERE aug.id_usuario = %d " % self.getID()
        else:
            sql = "select ag.grupo from adm_grupo  ag INNER JOIN adm_usuario_grupo aug ON ag.id_grupo = aug.id_grupo \
            INNER JOIN adm_usuario au ON au.id_usuario = aug.id_usuario WHERE aug.id_usuario = %d " % self.getID()
        con = pymysql.connect(user = my_usuario, password = my_senha, database = my_banco, host = my_servidor)
        cur = con.cursor()
        cur.execute(sql)
        if com_id == True:
            grupos = [ grupo for grupo in cur.fetchall()]
        else:
            grupos = [  ('%s') % grupo for grupo in cur.fetchall()]
        cur.close()
        con.close()
	       
        return grupos

    def getID(self):
        """ Retorna o ID do usuario."""
        return self.__id
    
    def getNome(self):
        """ Retorna o nome do usuario."""
        return self.__nome

    def getMenu(self):
        """ Retorna todos os menus do usuario em forma de lista com lista aninhada. """
        return self.__menus

    def getMenuAdm(self):
        """ Retorna um dicionario com os menus já agrupados da forma que o metodo getMenuAdm da classe Pagina vai entender o fluxo de dados"""
        dados = {}
        for reg in self.getMenu():
            chave, valor = reg
            if chave in dados.keys():
                dados[chave].append(valor)
            else:
                dados[chave] = [valor]
        return dados
        
    def __dadosUsuario(self, usuario, senha):
        """ Verifica se usuario e senha estao em branco, então ver se tem cookies. Se tiver preencher variaveis. """
        sqlMenu = "SELECT am.familia, am.link FROM adm_usuario au INNER JOIN adm_usuario_menu aum \
        ON au.id_usuario = aum.id_usuario INNER JOIN adm_menu am ON aum.id_menu = am.id_menu WHERE aum.id_usuario = %d"
        
        if usuario == '' and senha == '':
            if request.get_cookie('id') is None:
                self.__id = 0
            else:
                self.__id = int(request.get_cookie('id'))
                self.__nome = request.get_cookie('nome')
            sql = 'select * from adm_usuario where id_usuario = %d' % self.__id
            Consulta.__init__(self, sql, my_usuario, my_senha, my_banco, my_servidor, 'mysql')

        else:
            # Consulta para verificar se usuario e senha estão corretos e seus menus
            sql = "SELECT id_usuario, nome FROM adm_usuario WHERE nome = '%s' AND senha = SHA('%s')" % (usuario, senha)
                    
            # Executando e criando um objeto consulta
            Consulta.__init__(self, sql, my_usuario, my_senha, my_banco, my_servidor, 'mysql')
            
            dados = self.getRegistros()
            for reg in dados:
                self.__id, self.__nome = reg
        # Executando e criando um objeto consulta
		
        self.setConsulta(sqlMenu % self.__id)

        self.__menus = self.getRegistros()
            
    def atualizaSenha(self, senhaAntiga, novaSenha):
        """ Recebe a senha antiga e a senha nova do usuario, baseado nisto tenta alterar a senha conectando com e atualizando a nova."""
        # Consulta para verificar a senha antiga
        sqlSenha = "SELECT senha FROM adm_usuario WHERE id_usuario = %d AND senha = SHA('%s') " % (self.__id, senhaAntiga)
        self.setConsulta(sqlSenha)

        dados = self.getRegistros()
        if len(dados) == 1:
            # Senha correta, vamos atualiza-la
            sqlAtualizaSenha = "UPDATE adm_usuario SET senha = SHA('%s') WHERE id_usuario = %d" % (novaSenha, self.__id)
            executarConsulta(sqlAtualizaSenha, my_usuario, my_senha, my_banco, my_servidor)
            return 'Senha Atualizada'
        else:
            return 'Erro com a senha enviada. Senha incorreta'

    def gravaGrupos(self, grupos):
        ''' Grava os grupos em um cookie para ser usado nas proximas consultas.'''
        response.set_cookie('grupo_selecionado', grupos, expires = (time.time()+(60*60*72)), path = '/')

    def gravaTipos(self, tipos):
        ''' Grava os tipos AR e/ou OC escolhidos na validacao dos relatorios por grife e referencia '''
        response.set_cookie('tipo_ar_oc', tipos, expires = (time.time()+(60*60*72)), path = '/')
    def gravaGrupoTemporario(self, grupos):
        ''' Grava os grupos temporarios usados nos relatorios de grife e referencia '''
        response.set_cookie('grupo_temporario', grupos, expires = (time.time()+(60*60*72)), path = '/')
    def gravaLojas(self, lojas):
        ''' Grava as lojas que foram enviadas na consulta'''
        response.set_cookie('loja_selecionada', lojas, expires = (time.time()+(60*60*72)), path = '/')
    def gravaVisita(self, tabela):
        ''' Grava a visita do usuario na tabela da pagina, assim como a data/hora(Implementada via MySQL)'''
        SQL = "INSERT INTO analise_acesso VALUES(0, '%s', '%s', NOW())" % (self.getNome(), tabela)
        executarConsulta(SQL, my_usuario, my_senha, my_banco, my_servidor, 'mysql')

    def verificaMenu(self, menu):
        ''' Verifica o menu do usuario se o mesmo tiver este menu retorna True senao retorna False'''
        for _, m in self.getMenu():

            if m.find(menu) != -1:
                return True
            else:
                continue
        return False

    def gravaTipoGrupoGrife(self, grupo_grife):
        ''' Grava os tipos grupo grife (AHIC, TCHA) '''
        response.set_cookie('tipo_grupo_grife', grupo_grife, expires = (time.time()+(60*60*72)), path = '/')

    def getMeta(self, grupo, mes):
        meta = {'01':['JAN', 'JAN_DIAS'],'02':['FEV', 'FEV_DIAS'],'03':['MAR','MAR_DIAS'], '04':['ABR','ABR_DIAS'],'05':['MAI','MAI_DIAS'],
        '06':['JUN', 'JUN_DIAS'],'07':['JUL','JUL_DIAS'], '08':['AGO','AGO_DIAS'],'09':['SETE','SETE_DIAS'],'10':['OUTU','OUTU_DIAS'],
        '11':['NOV','NOV_DIAS'],'12':['DEZ','DEZ_DIAS']}
        SQL = "SELECT %s, %s FROM adm_meta WHERE grupo_filial = '%s' " % (meta[mes][0],meta[mes][1],grupo)
        c = Consulta(SQL, my_usuario, my_senha, my_banco, my_servidor, 'mysql')
        return c.getRegistros()[0]

    def getDivulgadorGrupo(self, id_grupo, id_filial):
        ''' Retorna o ID e nome do divulgador dependendo do id_grupo e id_filial repassado'''
        SQL = "SELECT d.id_divulgador, d.nome FROM divulgador d INNER JOIN adm_grupo_filial_divulgador agfd ON agfd.id_divulgador = d.id_divulgador \
        INNER JOIN adm_grupo ag ON ag.id_grupo = agfd.id_grupo INNER JOIN adm_filial af ON af.id_filial = agfd.id_filial \
        WHERE agfd.id_grupo = %d AND agfd.id_filial = %d AND d.D_E_L_E_T_ IS NULL" % (int(id_grupo), int(id_filial))
        c = Consulta(SQL, my_usuario, my_senha, my_banco, my_servidor, 'mysql')
        return c.getRegistros()

    def getDivulgadorFilial(self, id_filial):
        ''' Retorna o ID e nome do divulgador recebendo o id_filial repassado '''
        SQL = "SELECT d.id_divulgador, d.nome FROM divulgador d INNER JOIN adm_filial_divulgador afd ON afd.id_divulgador = d.id_divulgador \
        WHERE afd.id_filial = %d AND d.D_E_L_E_T_ IS NULL" % (int(id_filial))
        c = Consulta(SQL, my_usuario, my_senha, my_banco, my_servidor, 'mysql')
        return c.getRegistros()

    def getIdGrupo(self, nome):
        ''' Retorna o ID do grupo baseado no nome enviado como parametro, caso não seja encontrado retorna o valor 0 '''
        SQL = "SELECT id_grupo FROM adm_grupo WHERE grupo LIKE '%"+nome+"%'"
        c = Consulta(SQL, my_usuario, my_senha, my_banco, my_servidor, 'mysql')
        return [ x for x in c.getRegistros()[0]][0]

    def getDivulgador(self):
        '''Retorna todos os divulgadores cadastrados no sistema até o momento '''
        SQL = "SELECT id_divulgador, nome FROM divulgador WHERE D_E_L_E_T_ IS NULL "
        c = Consulta(SQL, my_usuario, my_senha, my_banco, my_servidor, 'mysql')
        return c.getRegistros()


## Realiza a conversao de uma string em valor monetario
## Converter dinheiro
def converter(valor):
    ## verificar se existe dois numeros apos o ponto
    valor = str(valor)
    verificar = len(valor[(valor.find('.')+1):])
    if verificar == 2:
        pass
    else:
        valor = valor+'0'
    # Substituir o ponto por virgula
    valor = valor.replace('.',',')

    # contador, a cada 3 x inserir um ponto
    x = 0 
    # a string que recebera cada caractere convertido
    d = ''
    # Pega o valor e reverte sua ordem
    rever = valor[::-1]
    # Caminha sobre cada caractere da  string
    for i in rever:
        # Se o x for inferior a 4 entao vamos incrementar x e colocar o caractere
        if x < 4:
            x += 1
            d += i
        # X nao tem resto na divisao por tres, entao incluiremos o ponto e incrementamos x
        elif x % 3 == 0:
            d += '.' + i 
            x += 1
        # X já e maior que 4 e nao e divisivel por 3, entao vamos incrementar x e adicionar o caractere a d
        else:
            d += i
            x += 1
    # Reverte novamente a string para o formato de ordem original
    d = 'R$ '+d[::-1]

    return d
