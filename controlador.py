# -*- coding: utf8 -*- #

'''
 autor: 		Marcos Felipe da Silva Jardim
 versao: 		1.8
 data:			13-11-2017

 Observações: Programa de atendimento que registra os atendimentos para que os gestores possam trabalhar no controle do fluxo de sua loja/empresa
 
 Nota: 		FAVOR MANTER AUTOR ORIGINAL E CREDITOS A MARCOS FELIPE DA SILVA, CODIGOS MODIFICADOS POR FAVOR INCLUIR AUTOR EM NOTAS DE VERSÃO.
 --------------------------------------------------------------------------------------------------------------------------------------------------------------
 NOTAS DE VERSÃO:

VERSÃO  DATA         OBSERVACOES                                                                                         AUTOR
++++++  ++++++++     ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++    +++++++++++++++
 v1.0:  03-10-2017	 Criação da área administrativa, página de Login, usuario padrão: admin senha padrão: $ODamemodb	 Marcos Felipe
 v1.1:	03-10-2017	 Pagina de criação do usuario, remoção, adicão de menu, remoção, adição de loja,remoção.			 Marcos Felipe
 v1.2:	04-10-2017	 Inclusa pagina para adição de filiais, assim é mais fácil incluir novas filiais ao projeto.		 Marcos Felipe
 v1.3:	04-10-2017	 Inclusão da pagina de cadastro de vendedores, assim como remoção de VENDEDORES.					 Marcos Felipe
 v1.4:	04-10-2017	 Inclusão da pagina para cadastro de divulgadores  													 Marcos Felipe 
 v1.5:	04-10-2017	 Inclusão da pagina de informativo de não vendas   													 Marcos Felipe
 v1.6:	04-10-2017	 Inclusão da pagina de gestao de ATENDIMENTOS 														 Marcos Felipe	
 v1.7:	04-10-2017	 Inclusão da pagina de ATENDIMENTOS 																 Marcos Felipe 
 v1.8:	13-11-2017	 Incluso área de backup e restore dos bancos de dados da aplicacao									 Marcos Felipe
'''
# Modulos a serem importados
from bottle import run, route, request, response, static_file, redirect
from datetime import datetime
import VisaoHTML, Modelo, time, json, os, re, string, shutil, math, subprocess, platform
from openpyxl import Workbook
from PIL import Image

if platform.sys.platform.lower() == 'linux':

	### Cabecalhos de uso para montar o layout do site relatorio.
	cabe = '_template/adm_cabecalho.tpl'
	roda = '_template/adm_rodape.tpl'
	erro_cabe = '_template/cabe_negado.tpl'
	erro_roda = '_template/roda_negado.tpl'
	dir_backupdb = 'banco_de_dados/bkp'
	tpl_login = '_template/login.tpl'
	tpl_roda_login = '_template/login_roda.tpl'
	dir_salva_imagem = '_imagem/'
else:
	### Cabecalhos de uso para montar o layout do site relatorio.
	cabe = '_template\\adm_cabecalho.tpl'
	roda = '_template\\adm_rodape.tpl'
	erro_cabe = '_template\\cabe_negado.tpl'
	erro_roda = '_template\\roda_negado.tpl'
	dir_backupdb = 'banco_de_dados\\bkp'
	tpl_login = '_template\\login.tpl'
	tpl_roda_login = '_template\\login_roda.tpl'
	dir_salva_imagem = '_imagem\\'


## Um array com cores para os graficos
cores = ['red','green','blue','magenta', 'yellow', 'black', 'cyan', 'aqua', 'chocolate', 'cornsilk', 'gray', 'orange', 'pink']

###########********************************** ARQUIVOS ESTATICOS POSICIONADOS NESTES LOCAIS. JS, CSS E IMAGENS *********************************##################
##
@route('/planilha/<filename:re:.*>')
def planilha(filename):
    return static_file(filename, root='_planilhas')

@route('/js/<filename:re:.*>')
def js(filename):
    return static_file(filename, root='_js')

##
@route('/imagens/<filename:re:.*>')
def imagens(filename):
    return static_file(filename, root='_imagem')

##
@route('/css/<filename:re:.*>')
def css(filename):
    return static_file(filename, root='_css')

##  Pagina para armazenar o backup da base de dados mysql
@route('/backup/<filename:re:.*>')
def backup(filename):
	return static_file(filename, root=dir_backupdb)


#### SE O USUARIO TIVER COOKIES REDIRECIONAR PARA /logado, SENAO EXIBIR TELA DE LOGIN
@route('/', method='GET')
def login():
    pag = VisaoHTML.Pagina(tpl_login, tpl_roda_login)
    if request.get_cookie('id'):
        redirect('/logado')
    
    return pag.getPagina()

## (RESPOSTA AJAX) VERIFICA SE O USUARIO DIGITOU CORRETAMENTE SEU NOME E SENHA
@route('/validaLogin', method='POST')
def validaLogin():
	nome = request.forms.get('nome')
	senha = request.forms.get('senha')
	
	usuario = Modelo.Usuario(nome, senha)
	if usuario.getNome() is None or usuario.getNome() == '':
		return 'false'
	else:
		## Gerando os cookies para o login bem sucedido

		# Variavel tempo para os cookies
		tempo_cookie = (time.time() +(60 * 60 * 24 * 2))
		response.set_cookie('id', str(usuario.getID()), expires = tempo_cookie)
		response.set_cookie('nome', usuario.getNome(), expires = tempo_cookie)
		
		## Data atual
		data = datetime.now()
		de = '%04d-%02d-%02d' % (data.year, data.month, data.day)
		ate = '%04d-%02d-%02d' % (data.year, data.month, data.day)
		## Lojas selecionadas, caso nenhuma, selecionar a primeira
		if len(usuario.getLojas()) >= 1:
			lojas = usuario.getLojas()[0]
		else:
			lojas = ''
		response.set_cookie('loja_selecionada', lojas, expires = tempo_cookie)
		
		# Configurando cookies de data, de e ate
		response.set_cookie('de', de, expires = tempo_cookie)
		response.set_cookie('ate', ate, expires = tempo_cookie)
				
		return 'true'

# ********************************************************************************************************* #
## AJAX PARA GRAVAR OS ACESSOS AS PAGINAS
@route('/grava_visita', method = 'POST')
def gravaVisita():
	paginaVisitada = request.forms.get('pagina')
	usuario = Modelo.Usuario()
	if(usuario.getID() == 1):
		return 'OK'
	else:
		usuario.gravaVisita(paginaVisitada)
		return 'GRAVADO'


@route('/logado')
def adm_logado():
	## Requisitando cookies e gerando o menu
	usuario = Modelo.Usuario()
	if usuario.getID() == 1:
		redirect('/adicionar_usuario')
	elif usuario.getNome()[:-2].upper() == 'LOJA':
		redirect('/atendimento')
	
	## Verificando se o usuario tem cookies
	if usuario.getID() != 0: 
		## Gerando a pagina do site com o menu
		pag = VisaoHTML.Pagina(cabe, roda);
		pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
		
		corpo = ''

		# Define o corpo da pagina e a retorna em seguida
		pag.setCorpo(corpo)

		return pag.getPagina()
	else:
		redirect('/')


#### SUA FUNCAO É SOMENTE LIMPAR OS COOKIES SALVOS PARA QUE O USUARIO POSSA ENCERRAR LOGIN COM SEGURANCA
@route('/logout')
def logout():
	tempo_cookie = (time.time() - (60 * 60 * 24 * 2))
	idUsuario = response.set_cookie('id', '', expires = tempo_cookie)
	nome = response.set_cookie('nome', '', expires = tempo_cookie)
	de = response.set_cookie('de', '', expires = tempo_cookie)
	ate = response.set_cookie('ate', '', expires = tempo_cookie)
	loja_selecionada = response.set_cookie('loja_selecionada', '', expires = tempo_cookie)
	grupo_selecionado = response.set_cookie('grupo_selecionado', '', expires = tempo_cookie)
	grupo_temporario = response.set_cookie('grupo_temporario', '', expires = tempo_cookie)
	nome = response.set_cookie('nome', '', expires = tempo_cookie)
	tipo_ar_oc = response.set_cookie('tipo_ar_oc', '', expires = tempo_cookie)
    
	redirect('/logado')

## Resetar senha usuario
@route('/resetar_senha_usuario')
def alteraSenhaUsuario():
	usuario = Modelo.Usuario()
	if usuario.getID() != 1:
		redirect('/')
	## Gerando a pagina do site com o menu
	pag = VisaoHTML.Pagina(cabe, roda)
	pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
	## Criar o corpo da pagina
	titu = VisaoHTML.titulo('Resetar senha do Usuario', 3, 'text-danger text-center')
	# Criando um objeto consulta para recuperar todos os usuarios
	sql = "SELECT id_usuario, nome FROM adm_usuario WHERE id_usuario != 1"
	consulta = Modelo.Consulta(sql, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	diciUsuarios = dict()
	for reg in consulta.getRegistros():
		valor, chave = reg
		diciUsuarios[chave] = valor

	## Criando uma lista de divs que formaram o corpo da pagina
	divs = [ VisaoHTML.DivRow() for i in range(3) ]
	divs[0].addDiv('',4)
	divs[0].addDiv(VisaoHTML.selecao('Usuarios', 'usuarios', diciUsuarios, Identificador = 'lista-usuarios'), 4)
	divs[0].addDiv('',4)

	divs[1].addDiv('',4)
	divs[1].addDiv('<br/>' + VisaoHTML.button('Enviar', classe = 'btn-success', Identificador = 'enviar'), 4)
	divs[1].addDiv('',4)

	divs[2].addDiv('',4)
	divs[2].addDiv(VisaoHTML.para('', 'text-uppercase text-danger', 'erro'), 4)
	divs[2].addDiv('',4)

	corpo = titu
	conteudo = ''
	for div in  divs:
		conteudo += div.getDivRow()

	corpo += VisaoHTML.div(conteudo, classe = 'formularios', Identificador = 'formularios')
	corpo += VisaoHTML.script('/js/resetar_senha_usuario.js')
	pag.setCorpo(corpo)
	return pag.getPagina()	

### LOCAL PARA VALIDAR O RESET DE SENHA DE UM USUARIO
@route('/validaResetarSenhaUsuario', method = 'POST')
def valResetaSenhaUsuario():
	idUsuario = request.forms.get('nome')
	padrao = 'diniztibh10'
	SQL = "UPDATE adm_usuario SET senha = SHA('%s') WHERE id_usuario = %d " % (padrao, int(idUsuario))
	Modelo.executarConsulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, tipo_sgbd = 'mysql')
	return 'Senha alterada com sucesso. A senha padrao inserida é diniztibh10'

#### LOCAL PARA ALTERACAO DE SENHA. RECEBE A SENHA ANTIGA E A NOVA SENHA REPETIDA, VALIDA E RETORNA A RESPOSTA
@route('/altera_senha', method='GET')
def alteraSenha():
    ## Requisitando cookies e gerando o menu
    usuario = Modelo.Usuario()
    ## Verificando se tem cookies
    if usuario.getID == 0:
        redirect('/')
    
    ## Gerando a pagina do site com o menu
    pag = VisaoHTML.Pagina(cabe, roda);
    pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
    ## Criar o corpo da pagina
    titu = VisaoHTML.titulo('Troque sua senha aqui', 3, 'text-danger text-center')
    
    ## Cria o formulario para atualizacao de senha
    divRow = VisaoHTML.DivRow() 
    divRow.addDiv('', 4)
    divRow.addDiv('Senha Atual' + VisaoHTML.entrada('password', 'senha_antiga', '', '', 'senha1')+
     VisaoHTML.para('','text-danger text-uppercase', Identificador='erro'), 4)
    divRow.addDiv('',4)
    
    div2 = VisaoHTML.DivRow()
    div2.addDiv('',4)
    div2.addDiv('Senha nova' + VisaoHTML.entrada('password', 'senha_nova2', '', '', 'senha2'), 4)
    div2.addDiv('',4)
    
    div3 = VisaoHTML.DivRow()
    div3.addDiv('',4)
    div3.addDiv('Repetir senha' + VisaoHTML.entrada('password', 'senha_nova3', '', '', 'senha3'), 4)
    div3.addDiv('',4)
    
    div4 = VisaoHTML.DivRow()
    div4.addDiv('',4)
    div4.addDiv(VisaoHTML.button('Enviar', 'btn-success', 'enviar'), 4)
    div4.addDiv('',4)
    corpo =  titu + VisaoHTML.div(divRow.getDivRow()+div2.getDivRow()+div3.getDivRow()+div4.getDivRow()
      + VisaoHTML.titulo('', 2, 'text-center text-success text-uppercase', 'resposta') + VisaoHTML.script('/js/altera_senha.js'))
    pag.setCorpo(corpo)
    del corpo
    return pag.getPagina()

## (RESPOSTA AJAX) ALTERA A SENHA DO USUARIO INFORMADA NO FORMULARIO
@route('/atualizaSenha', method='POST')
def validaDados():
	senha = request.forms.get('senha')
	nova = request.forms.get('novaSenha')
	
	usuario = Modelo.Usuario()
	
	## Verificando se a senha pode ser atualizada
	resposta = usuario.atualizaSenha(senha, nova)
	return resposta

# ********************************************************************************************************* #
@route('/adicionar_usuario')
def adicionarUsuario():
	usuario = Modelo.Usuario()
	if usuario.getID() != 1:
		redirect('/')
	## Gerando a pagina do site com o menu
	pag = VisaoHTML.Pagina(cabe, roda)
	pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
	## Criar o corpo da pagina
	titu = VisaoHTML.titulo('Criação de Usuario', 3, 'text-danger text-center')
	divs = [ VisaoHTML.DivRow() for i in range(5)]
	divs[0].addDiv('',4)
	divs[0].addDiv('Nome '+ VisaoHTML.entrada('text', 'nome', Identificador = 'nome')+VisaoHTML.para('','text-uppercase text-danger', 'erro'),4)
	divs[0].addDiv('',4)
	divs[1].addDiv('',4)
	divs[1].addDiv('Senha '+ VisaoHTML.entrada('password', 'senha1', Identificador = 'senha1'),4)
	divs[1].addDiv('',4)
	divs[2].addDiv('',4)
	divs[2].addDiv('Repetir Senha '+ VisaoHTML.entrada('password', 'senha2', Identificador = 'senha2'),4)
	divs[2].addDiv('',4)
	divs[3].addDiv('',4)
	divs[3].addDiv(VisaoHTML.button('Enviar', 'btn-success', 'enviar'), 4)
	divs[3].addDiv('',4)
	divs[4].addDiv('',4)
	divs[4].addDiv(VisaoHTML.para('', 'text-uppercase text-success', 'resposta'), 4)
	divs[4].addDiv('',4)
    
	pag.setCorpo(titu + divs[0].getDivRow() +divs[1].getDivRow() +divs[2].getDivRow() 
	+divs[3].getDivRow() +divs[4].getDivRow() +VisaoHTML.script('/js/adiciona_usuario.js'))
    
	return pag.getPagina()

## Valida via ajax a solicitacao de criacao do usuario. Se o usuario não existir cria-o no banco para ele poder usar o sistema.
@route('/validaAdicionaUsuario', method='POST')
def validaAddusuario():
	nome = request.forms.get('nome')
	senha = request.forms.get('senha1')
	
	sql = "SELECT * FROM adm_usuario WHERE nome = '%s'" % nome
	consulta = Modelo.Consulta(sql, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	# Verificando se o a consulta retorna algo.
	if consulta.procuraDados(nome):
		return 'Usuario ja existe'
	# Insere o usuario no banco de dados
	sqlInserir = "INSERT INTO adm_usuario (nome, senha) VALUES('%s', SHA('%s'))" % (nome, senha)
	Modelo.executarConsulta(sqlInserir, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	# Verifica se o usuario foi inserido com sucesso
	consulta.setConsulta(sql)
	if consulta.procuraDados(nome):
		return 'Usuario adicionado com sucesso'
	else:
		return 'Erro ao adicionar o usuario'

# Pagina para escolher entre os usuarios que se deseja remover	
@route('/remover_usuario')
def removerUsuario():
	usuario = Modelo.Usuario()
	if usuario.getID() != 1:
		redirect('/')
	## Gerando a pagina do site com o menu
	pag = VisaoHTML.Pagina(cabe, roda)
	pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
	## Criar o corpo da pagina
	titu = VisaoHTML.titulo('Remoção de Usuario', 3, 'text-danger text-center')
	# Criando um objeto consulta para recuperar todos os usuarios
	sql = "SELECT id_usuario, nome FROM adm_usuario WHERE id_usuario != 1"
	consulta = Modelo.Consulta(sql, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	diciUsuarios = dict()
	for reg in consulta.getRegistros():
		valor, chave = reg
		diciUsuarios[chave] = valor

	## Criando uma lista de divs que formaram o corpo da pagina
	divs = [ VisaoHTML.DivRow() for i in range(3) ]
	divs[0].addDiv('',4)
	divs[0].addDiv(VisaoHTML.selecao('Usuarios', 'usuarios', diciUsuarios, Identificador = 'lista-usuarios'), 4)
	divs[0].addDiv('',4)

	divs[1].addDiv('',4)
	divs[1].addDiv('<br/>' + VisaoHTML.button('enviar', classe = 'btn-success', Identificador = 'enviar'), 4)
	divs[1].addDiv('',4)

	divs[2].addDiv('',4)
	divs[2].addDiv(VisaoHTML.para('', 'text-uppercase text-danger', 'erro'), 4)
	divs[2].addDiv('',4)

	corpo = titu
	for div in  divs:
		corpo += div.getDivRow()

	corpo += VisaoHTML.script('/js/remove_usuario.js')
	pag.setCorpo(corpo)
	return pag.getPagina()

# Valida via ajax a solicitacao de remoção de usuario.
@route('/validaRemoveUsuario', method='POST')
def remUsuario():
	# Recuperando os campos

	idUsuario = request.forms.get('codigo')
	if idUsuario is None:
		return 'Erro ao excluir usuario, ele não existe'
	else:
		idUsuario = int(idUsuario)
	## Consulta para verificar se usuario existe usuario
	sql = "SELECT * from adm_usuario WHERE id_usuario = %d" % idUsuario
	consulta = Modelo.Consulta(sql, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	# Se o usuario nao existir retorna mensagem de erro
	if len(consulta.getRegistros()) < 1:
		return 'Não foi possivel excluir o usuario. Ele não existe'

	# Consultas para serem executadas para remoção do usuario com seus menus, filiais e consultas personalizadas
	querys = []
	querys.append("DELETE FROM adm_usuario_filial WHERE id_usuario = %d")
	querys.append("DELETE FROM adm_usuario_menu WHERE id_usuario = %d")
	querys.append("DELETE FROM adm_usuario WHERE id_usuario = %d")

	for query in querys:
		query = query % idUsuario
		Modelo.executarConsulta(query, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	return 'Usuario excluido com sucesso'

## Exibe formulario de adição de filial para usuario
@route('/adiciona_loja_usuario')
def addLojaUsuario():
	usuario = Modelo.Usuario()
	if usuario.getID() != 1:
		redirect('/')
	## Gerando a pagina do site com o menu
	pag = VisaoHTML.Pagina(cabe, roda)
	pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
	## Criar o corpo da pagina
	titu = VisaoHTML.titulo('Adição de Filiais para o Usuario', 3, 'text-danger text-center')
	# Criando um objeto consulta para recuperar todos os usuarios
	sql = "SELECT id_usuario, nome FROM adm_usuario WHERE id_usuario != 1"
	consulta = Modelo.Consulta(sql, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	diciUsuarios = dict()
	for reg in consulta.getRegistros():
		valor, chave = reg
		diciUsuarios[chave] = valor

	## Criando uma lista de divs que formaram o corpo da pagina
	divs = [ VisaoHTML.DivRow() for i in range(3) ]
	divs[0].addDiv('',4)
	divs[0].addDiv(VisaoHTML.selecao('Usuarios', 'usuarios', diciUsuarios, Identificador = 'lista-usuarios'), 4)
	divs[0].addDiv('',4)

	divs[1].addDiv('',4)
	divs[1].addDiv('<br/>' + VisaoHTML.button('Enviar', classe = 'btn-success', Identificador = 'enviar'), 4)
	divs[1].addDiv('',4)

	divs[2].addDiv('',4)
	divs[2].addDiv(VisaoHTML.para('', 'text-uppercase text-danger', 'erro'), 4)
	divs[2].addDiv('',4)

	corpo = titu
	conteudo = ''
	for div in  divs:
		conteudo += div.getDivRow()

	corpo += VisaoHTML.div(conteudo, classe = 'formularios', Identificador = 'formularios')
	corpo += VisaoHTML.script('/js/adiciona_loja_usuario.js')
	pag.setCorpo(corpo)
	return pag.getPagina()

## Valida via ajax a solicitacao de adicao de loja para o usuario
@route('/validaAdicionaLojaUsuario', method='POST')
def validaAddValida():
	# Recuperando os campos	
	lojas = request.forms.get('filiais')
	idUsuario = request.forms.get('nome')

	if not lojas is None:
		# As lojas foram enviadas, splitar elas para uma lista
		listaLojas = lojas.split('&')
		# Criando query para inserir as lojas para o usuario
		sql = "INSERT INTO adm_usuario_filial VALUES(%d, %d)"
		for item in listaLojas:
			Modelo.executarConsulta(sql % (int(idUsuario), int(item)), Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
		return 'As Filiais foram adicionadas com sucesso.'


	if idUsuario is None:
		return 'Erro ao excluir usuario, ele não existe'
	else:
		idUsuario = int(idUsuario)
	
	## Consulta para verificar se usuario existe usuario
	sql = "SELECT * from adm_usuario WHERE id_usuario = %d" % idUsuario
	consulta = Modelo.Consulta(sql, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	
	# Se o usuario nao existir retorna mensagem de erro
	if len(consulta.getRegistros()) < 1:
		return 'Não foi incluir loja para o usuario. Ele não existe'

	

	sql = "SELECT id_filial, filial FROM adm_filial where id_filial NOT IN(SELECT auf.id_filial FROM adm_filial af INNER JOIN adm_usuario_filial auf ON af.id_filial = auf.id_filial INNER JOIN adm_usuario au 	ON auf.id_usuario = au.id_usuario WHERE au.id_usuario = %d)" % idUsuario

	consulta.setConsulta(sql)

	dadosEntrada = ''
	for reg in consulta.getRegistros():
		valor, chave = reg
		dadosEntrada += VisaoHTML.checkBox(chave, 'lojas', valor, classe = 'checados')

	## Criando uma lista de divs que formaram o corpo da pagina
	divs = [ VisaoHTML.DivRow() for i in range(3) ]
	divs[0].addDiv('',4)
	divs[0].addDiv(dadosEntrada, 4)
	divs[0].addDiv('',4)

	divs[1].addDiv('',4)
	divs[1].addDiv('<br/>' + VisaoHTML.button('Adicionar', classe = 'btn-success', Identificador = 'adicionar'), 4)
	divs[1].addDiv('',4)

	divs[2].addDiv('',4)
	divs[2].addDiv(VisaoHTML.para('', 'text-uppercase text-danger', 'erro'), 4)
	divs[2].addDiv('',4)

	corpo = ''
	for div in  divs:
		corpo += div.getDivRow()

	return corpo


## Formulario de remoção de loja para o usuario
@route('/remove_loja_usuario')
def remLojaUsuario():
	usuario = Modelo.Usuario()
	if usuario.getID() != 1:
		redirect('/')
	## Gerando a pagina do site com o menu
	pag = VisaoHTML.Pagina(cabe, roda)
	pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
	## Criar o corpo da pagina
	titu = VisaoHTML.titulo('Remoção de Filiais para o Usuario', 3, 'text-danger text-center')
	# Criando um objeto consulta para recuperar todos os usuarios
	sql = "SELECT id_usuario, nome FROM adm_usuario WHERE id_usuario != 1"
	consulta = Modelo.Consulta(sql, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	diciUsuarios = dict()
	for reg in consulta.getRegistros():
		valor, chave = reg
		diciUsuarios[chave] = valor

	## Criando uma lista de divs que formaram o corpo da pagina
	divs = [ VisaoHTML.DivRow() for i in range(3) ]
	divs[0].addDiv('',4)
	divs[0].addDiv(VisaoHTML.selecao('Usuarios', 'usuarios', diciUsuarios, Identificador = 'lista-usuarios'), 4)
	divs[0].addDiv('',4)

	divs[1].addDiv('',4)
	divs[1].addDiv('<br/>' + VisaoHTML.button('Enviar', classe = 'btn-success', Identificador = 'enviar'), 4)
	divs[1].addDiv('',4)

	divs[2].addDiv('',4)
	divs[2].addDiv(VisaoHTML.para('', 'text-uppercase text-danger', 'erro'), 4)
	divs[2].addDiv('',4)

	corpo = titu
	conteudo = ''
	for div in  divs:
		conteudo += div.getDivRow()

	corpo += VisaoHTML.div(conteudo, classe = 'formularios', Identificador = 'formularios')
	corpo += VisaoHTML.script('/js/remove_loja_usuario.js')
	pag.setCorpo(corpo)
	return pag.getPagina()	

## Requisição ajax de resposta a remocao de loja para o usuario
@route('/validaRemoveLojaUsuario', method='POST')
def valRemLojaUsuario():
	## Recuperando os campos
	idUsuario = request.forms.get('nome')
	lojas = request.forms.get('filiais')
	# Se lojas não for Nulo, saberei que é a segunda requisição de envio
	if not lojas is None:
		# As lojas foram enviadas, splitar elas para uma lista
		listaLojas = lojas.split('&')
		# Criando query para inserir as lojas para o usuario
		sql = "DELETE FROM adm_usuario_filial WHERE id_usuario = %d AND id_filial = %d"
		for item in listaLojas:
			Modelo.executarConsulta(sql % (int(idUsuario), int(item)), Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
		return 'As Filiais foram removidas com sucesso.'


	if idUsuario is None:
		return 'Erro ao excluir loja para o usuario, ele não existe'
	else:
		idUsuario = int(idUsuario)
	
	## Consulta para verificar se usuario existe usuario
	sql = "SELECT * from adm_usuario WHERE id_usuario = %d" % idUsuario
	consulta = Modelo.Consulta(sql, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	
	# Se o usuario nao existir retorna mensagem de erro
	if len(consulta.getRegistros()) < 1:
		return 'Não foi possivel excluir loja para o usuario. Ele não existe'

	

	sql = "SELECT id_filial, filial FROM adm_filial where id_filial IN(SELECT auf.id_filial FROM adm_filial af INNER JOIN adm_usuario_filial auf ON af.id_filial = auf.id_filial INNER JOIN adm_usuario au 	ON auf.id_usuario = au.id_usuario WHERE au.id_usuario = %d)" % idUsuario

	consulta.setConsulta(sql)

	dadosEntrada = ''
	for reg in consulta.getRegistros():
		valor, chave = reg
		dadosEntrada += VisaoHTML.checkBox(chave, 'lojas', valor, classe = 'checados')

	## Criando uma lista de divs que formaram o corpo da pagina
	divs = [ VisaoHTML.DivRow() for i in range(3) ]
	divs[0].addDiv('',4)
	divs[0].addDiv(dadosEntrada, 4)
	divs[0].addDiv('',4)

	divs[1].addDiv('',4)
	divs[1].addDiv('<br/>' + VisaoHTML.button('Remover', classe = 'btn-success', Identificador = 'adicionar'), 4)
	divs[1].addDiv('',4)

	divs[2].addDiv('',4)
	divs[2].addDiv(VisaoHTML.para('', 'text-uppercase text-danger', 'erro'), 4)
	divs[2].addDiv('',4)

	corpo = ''
	for div in  divs:
		corpo += div.getDivRow()

	return corpo

## Formulario de adicao de menus para o usuario
@route('/adicionar_menu_usuario')
def addMenuUsuario():
	usuario = Modelo.Usuario()
	if usuario.getID() != 1:
		redirect('/')
	## Gerando a pagina do site com o menu
	pag = VisaoHTML.Pagina(cabe, roda)
	pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
	## Criar o corpo da pagina
	titu = VisaoHTML.titulo('Adição de menu para o Usuario', 3, 'text-danger text-center')
	# Criando um objeto consulta para recuperar todos os usuarios
	sql = "SELECT id_usuario, nome FROM adm_usuario WHERE id_usuario != 1"
	consulta = Modelo.Consulta(sql, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	diciUsuarios = dict()
	for reg in consulta.getRegistros():
		valor, chave = reg
		diciUsuarios[chave] = valor

	## Criando uma lista de divs que formaram o corpo da pagina
	divs = [ VisaoHTML.DivRow() for i in range(3) ]
	divs[0].addDiv('',4)
	divs[0].addDiv(VisaoHTML.selecao('Usuarios', 'usuarios', diciUsuarios, Identificador = 'lista-usuarios'), 4)
	divs[0].addDiv('',4)

	divs[1].addDiv('',4)
	divs[1].addDiv('<br/>' + VisaoHTML.button('Enviar', classe = 'btn-success', Identificador = 'enviar'), 4)
	divs[1].addDiv('',4)

	divs[2].addDiv('',4)
	divs[2].addDiv(VisaoHTML.para('', 'text-uppercase text-danger', 'erro'), 4)
	divs[2].addDiv('',4)

	corpo = titu
	conteudo = ''
	for div in  divs:
		conteudo += div.getDivRow()

	corpo += VisaoHTML.div(conteudo, classe = 'formularios', Identificador = 'formularios')
	corpo += VisaoHTML.script('/js/adiciona_menu_usuario.js')
	pag.setCorpo(corpo)
	return pag.getPagina()	

## Resposta da requisicao ajax para adicao de Menu para o usuario
@route('/validaAdicionaMenuUsuario', method='POST')
def valAddMenuUsuario():
	idUsuario = request.forms.get('nome')
	menus = request.forms.get('menus')
	# Se menus não for Nulo, saberei que é a segunda requisição de envio
	if not menus is None:
		# As lojas foram enviadas, splitar elas para uma lista
		listaMenus = menus.split('&')
		# Criando query para inserir as lojas para o usuario
		sql = "INSERT INTO adm_usuario_menu VALUES(%d, %d)"
		for item in listaMenus:
			Modelo.executarConsulta(sql % (int(idUsuario), int(item)), Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
		return 'Os menus foram inclusos com sucesso.'


	if idUsuario is None:
		return 'Erro ao incluir menu para o usuario, ele não existe'
	else:
		idUsuario = int(idUsuario)
	
	## Consulta para verificar se usuario existe usuario
	sql = "SELECT * from adm_usuario WHERE id_usuario = %d" % idUsuario
	consulta = Modelo.Consulta(sql, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	
	# Se o usuario nao existir retorna mensagem de erro
	if len(consulta.getRegistros()) < 1:
		return 'Não foi possivel incluir Menu para o usuario. Ele não existe'

	

	sql = "SELECT id_menu, nome FROM adm_menu where id_menu NOT IN(SELECT aum.id_menu FROM adm_menu am INNER JOIN adm_usuario_menu aum ON am.id_menu = aum.id_menu INNER JOIN adm_usuario au ON aum.id_usuario = au.id_usuario WHERE au.id_usuario = %d) AND familia != 'Usuarios' " % idUsuario

	consulta.setConsulta(sql)

	dadosEntrada = ''
	for reg in consulta.getRegistros():
		valor, chave = reg
		dadosEntrada += VisaoHTML.checkBox(chave+'&nbsp;&nbsp;', 'menus', valor, classe = 'checados')

	## Criando uma lista de divs que formaram o corpo da pagina
	divs = [ VisaoHTML.DivRow() for i in range(3) ]
	divs[0].addDiv('',4)
	divs[0].addDiv(dadosEntrada, 4)
	divs[0].addDiv('',4)

	divs[1].addDiv('',4)
	divs[1].addDiv('<br/>' + VisaoHTML.button('Adicionar', classe = 'btn-success', Identificador = 'adicionar'), 4)
	divs[1].addDiv('',4)

	divs[2].addDiv('',4)
	divs[2].addDiv(VisaoHTML.para('', 'text-uppercase text-danger', 'erro'), 4)
	divs[2].addDiv('',4)

	corpo = ''
	for div in  divs:
		corpo += div.getDivRow()

	return corpo

## Formulario de exclusao de menu para o usuario
@route('/remove_menu_usuario')
def remMenuUsuario():
	usuario = Modelo.Usuario()
	if usuario.getID() != 1:
		redirect('/')
	## Gerando a pagina do site com o menu
	pag = VisaoHTML.Pagina(cabe, roda)
	pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
	## Criar o corpo da pagina
	titu = VisaoHTML.titulo('Remoção de menu para o Usuario', 3, 'text-danger text-center')
	# Criando um objeto consulta para recuperar todos os usuarios
	sql = "SELECT id_usuario, nome FROM adm_usuario WHERE id_usuario != 1"
	consulta = Modelo.Consulta(sql, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	diciUsuarios = dict()
	for reg in consulta.getRegistros():
		valor, chave = reg
		diciUsuarios[chave] = valor

	## Criando uma lista de divs que formaram o corpo da pagina
	divs = [ VisaoHTML.DivRow() for i in range(3) ]
	divs[0].addDiv('',4)
	divs[0].addDiv(VisaoHTML.selecao('Usuarios', 'usuarios', diciUsuarios, Identificador = 'lista-usuarios'), 4)
	divs[0].addDiv('',4)

	divs[1].addDiv('',4)
	divs[1].addDiv('<br/>' + VisaoHTML.button('Enviar', classe = 'btn-success', Identificador = 'enviar'), 4)
	divs[1].addDiv('',4)

	divs[2].addDiv('',4)
	divs[2].addDiv(VisaoHTML.para('', 'text-uppercase text-danger', 'erro'), 4)
	divs[2].addDiv('',4)

	corpo = titu
	conteudo = ''
	for div in  divs:
		conteudo += div.getDivRow()

	corpo += VisaoHTML.div(conteudo, classe = 'formularios', Identificador = 'formularios')
	corpo += VisaoHTML.script('/js/remove_menu_usuario.js')
	pag.setCorpo(corpo)
	return pag.getPagina()	

## Formulario de ajax
@route('/validaRemoveMenuUsuario', method='POST')
def remMenuUsuario():
	idUsuario = request.forms.get('nome')
	menus = request.forms.get('menus')
	# Se menus não for Nulo, saberei que é a segunda requisição de envio
	if not menus is None:
		# As lojas foram enviadas, splitar elas para uma lista
		listaMenus = menus.split('&')
		# Criando query para deletar menus para o usuario
		sql = "DELETE FROM adm_usuario_menu WHERE id_usuario = %d AND id_menu = %d"
		for item in listaMenus:
			Modelo.executarConsulta(sql % (int(idUsuario), int(item)), Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
		return 'Os menus foram removidos com sucesso.'


	if idUsuario is None:
		return 'Erro ao excluir menu para o usuario, ele não existe'
	else:
		idUsuario = int(idUsuario)
	
	## Consulta para verificar se usuario existe usuario
	sql = "SELECT * from adm_usuario WHERE id_usuario = %d" % idUsuario
	consulta = Modelo.Consulta(sql, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	
	# Se o usuario nao existir retorna mensagem de erro
	if len(consulta.getRegistros()) < 1:
		return 'Não foi possivel excluir Menu para o usuario. Ele não existe'

	

	sql = "SELECT id_menu, nome FROM adm_menu where id_menu IN(SELECT aum.id_menu FROM adm_menu am INNER JOIN adm_usuario_menu aum ON am.id_menu = aum.id_menu INNER JOIN adm_usuario au ON aum.id_usuario = au.id_usuario WHERE au.id_usuario = %d) AND familia != 'Usuarios' " % idUsuario

	consulta.setConsulta(sql)

	dadosEntrada = ''
	for reg in consulta.getRegistros():
		valor, chave = reg
		dadosEntrada += VisaoHTML.checkBox(chave+'&nbsp;&nbsp;', 'menus', valor, classe = 'checados')

	## Criando uma lista de divs que formaram o corpo da pagina
	divs = [ VisaoHTML.DivRow() for i in range(3) ]
	divs[0].addDiv('',4)
	divs[0].addDiv(dadosEntrada, 4)
	divs[0].addDiv('',4)

	divs[1].addDiv('',4)
	divs[1].addDiv('<br/>' + VisaoHTML.button('Remover', classe = 'btn-success', Identificador = 'remover'), 4)
	divs[1].addDiv('',4)

	divs[2].addDiv('',4)
	divs[2].addDiv(VisaoHTML.para('', 'text-uppercase text-danger', 'erro'), 4)
	divs[2].addDiv('',4)

	corpo = ''
	for div in  divs:
		corpo += div.getDivRow()

	return corpo

## Adição de outras filiais
@route('/cadastro_filial')
def cadastro_filial():
	usuario = Modelo.Usuario()
	if usuario.getID() != 1:
		redirect('/')
	## Gerando a pagina do site com o menu
	pag = VisaoHTML.Pagina(cabe, roda)
	pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
	## Verificando quantas filiais estão cadastradas
	SQL = "SELECT * from adm_filial"
	c = Modelo.Consulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	total_filial = len(c.getRegistros()) # A quantidade de filiais que tem cadastro
	corpo = VisaoHTML.titulo('Inclusão de novas filiais', 4, 'text-center text-uppercase bg-success')
	corpo += VisaoHTML.para('No momento o aplicativo tem <span id="qtd_atual"style="font-size:1.5em;font-weight:bolder;" class="text-danger">%d</span> filiais cadastradas, deseja incluir mais filiais ? \
		Informe a quantidade de novas filiais a serem inclusas abaixo.' % (total_filial),'text-center')
	div = [VisaoHTML.DivRow() for x in range(2) ]
	div[0].addDiv('',4);div[0].addDiv(VisaoHTML.entrada('number', 'qtd', 1, '','qtd', 'QTD FILIAIS', "min=1"), 4);div[0].addDiv('',4)
	div[1].addDiv('',4);div[1].addDiv(VisaoHTML.button('<span class="glyphicon glyphicon-plus"></span> Incluir', 'btn-danger', 'enviar'), 4);div[1].addDiv('',4)
	for d in div:
		corpo += d.getDivRow() 
	corpo += VisaoHTML.script('/js/cadastro_filial.js?v='+str(time.time()))
	pag.setCorpo(corpo)

	return pag.getPagina()

# Atualização da quantidade de filiais cadastradas
@route('/cadastro_filial', method = 'POST')
def qtd_filial():
	qtd_inclusao = int(request.forms.get('QTD'))
	SQL = "SELECT * from adm_filial"
	c = Modelo.Consulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	total_filial = len(c.getRegistros()) + 1  # A quantidade de filiais que tem cadastro
	SQL = "INSERT INTO adm_filial VALUES "
	SQL2 = "INSERT INTO adm_usuario_filial VALUES "
	novas_filiais = '';
	inclusao_admin = '' # Filiais que já faram parte do usuário administrador
	for x in range(total_filial, total_filial+qtd_inclusao):
		novas_filiais += "(%d, '%02d')," % (x, x)
		inclusao_admin += "(1, %d)," % (x)
	SQL += novas_filiais[:-1];
	SQL2 += inclusao_admin[:-1]

	Modelo.executarConsulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	Modelo.executarConsulta(SQL2, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	return str(total_filial+qtd_inclusao-1)


###################### LOCAL PARA BACKUP E RESTORE DA APLICACAO ###########################
# Pagina que vai realizar um backup da base de dados Mysql e retornar-la para o usuario
@route('/backup_banco')
def backup_app():
	usuario = Modelo.Usuario()
	# Se Id é diferente de um sei que o usuario nao tem acesso a pagina
	if usuario.getID() != 1:
		redirect('/')
	# String que realiza a execução do comando de backup da base de dados atual
	CMD = "mysqldump -u %s --password=%s -h %s -e %s > banco_de_dados/bkp/backup.sql && echo '-- ARQUIVO DE BACKUP;' >> banco_de_dados/bkp/backup.sql && chmod 777 banco_de_dados/backup/backup.sql" % (Modelo.my_usuario, Modelo.my_senha, Modelo.my_servidor, Modelo.my_banco)
	## Executando o backup
	subprocess.Popen(CMD, shell=True);
	## Gerando a pagina do site com o menu
	pag = VisaoHTML.Pagina(cabe, roda)
	pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
	## Criar o corpo da pagina
	titu = VisaoHTML.titulo('Backup da base de dados', 3, 'text-danger text-center')
	corpo = titu
	corpo += VisaoHTML.para('Esta página tem como objetivo retornar um backup atual da base de dados onde se executa o aplicativo. Clique no botão abaixo para baixar o backup.', 'text-center')
	corpo += VisaoHTML.para(VisaoHTML.link('/backup/backup.sql', 'Backup', 'btn btn-success btn-xs'),'text-center');
	pag.setCorpo(corpo)

	return pag.getPagina()

# Pagina que cria um restore do banco de dados para a aplicação
@route('/restore_banco')
def restore_banco():
	usuario = Modelo.Usuario()
	# Se Id é diferente de um sei que o usuario nao tem acesso a pagina
	if usuario.getID() != 1:
		redirect('/')
	## Gerando a pagina do site com o menu
	pag = VisaoHTML.Pagina(cabe, roda)
	pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
	# Cria o titulo e um paragrafo com a descrição da pagina
	corpo = VisaoHTML.titulo('Restauração do banco de dados', 4, 'text-danger text-center')
	corpo += VisaoHTML.para('Esta página tem como objetivo receber um arquivo .sql de backup da aplicação e restaura-lo.', 'text-center')
	divs = [VisaoHTML.DivRow() for r in range(4)]
	divs[0].addDiv('',4);divs[0].addDiv('<form method="POST" action="/restore_banco" enctype="multipart/form-data">', 4);divs[0].addDiv('',4)
	divs[1].addDiv('',4);divs[1].addDiv(VisaoHTML.entrada('file', 'arquivo', '', 'form-control', 'arquivo', 'ARQUIVO'), 4);divs[1].addDiv('',4)
	divs[2].addDiv('',4);divs[2].addDiv(VisaoHTML.button('ENVIAR','btn btn-xs btn-danger', 'enviar'), 4);divs[2].addDiv('',4)
	divs[3].addDiv('',4);divs[3].addDiv('</form>',4);divs[3].addDiv('',4)
	for d in divs:
		corpo += d.getDivRow()

	corpo += VisaoHTML.script('/js/restore_banco.js?v='+str(time.time()))
	pag.setCorpo(corpo)
	return pag.getPagina()

# Recebendo o arquivo, manipulando o mesmo e verificando se esta correto para restaura-lo.
@route('/restore_banco', method = 'POST')
def valRestoreBanco():
	## Recuperando o arquivo
	arquivo = request.files.get('arquivo');
	# Local para salvar o arquivo
	local = 'banco_de_dados/restore/backup.sql'
	nome = arquivo.filename.lower();
	if not nome.endswith('.sql'):
		return 'Arquivo enviado é invalido.'
	# Arquivo tem a extensao .sql, agora vamos ver se ele parece ser um arquivo de restore do banco.
	# Vamos salva-lo primeiro
	try:
		arquivo.save(local)
	except IOError:
		os.remove(local);
		arquivo.save(local)
	# Agora vamos abrir o arquivo e fazer um loop procurando na ultima linha dele vendo se contém a assinatura de backup
	with open(local) as arq:
		arqBackup = arq.readlines()[-1]
		# Se nao for um arquivo de backup retorne a mensagem. Os arquivos de backup tem uma assinatura
		if arqBackup.find("-- ARQUIVO DE BACKUP;") == -1:
			return 'ARQUIVO NAO E UM ARQUIVO PARA RESTAURAR O BANCO'
	# O arquivo é realmente um arquivo de backup. Agora vamos restaurar nesta base.
	subprocess.Popen("mysql -u %s --password=%s -h %s %s < %s" % (Modelo.my_usuario, Modelo.my_senha, Modelo.my_servidor, Modelo.my_banco, local), shell = True);
	## Dados restaurados.
	redirect('/restore_banco')	


############################### @@@@@@@@@@@@@@@@@@@@@@@ BLOCO DO PROGRAMA DE ATENDIMENTO @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ################################

## Criando pagina de atendimento
@route('/atendimento')
def atendimento():
	usuario = Modelo.Usuario()

	# Se Id é igual á zero, sei que o usuario nao tem acesso a pagina
	if usuario.getID() == 0:
		redirect('/')
	elif not usuario.verificaMenu('/atendimento'):
		redirect('/')
	## Gerando a pagina do site com o menu
	pag = VisaoHTML.Pagina(cabe, roda)
	pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
	## Obtendo ID de grupo e filial para recuperar os divulgadores desta loja
	lojaID = usuario.getLojas(com_id = True)[0][0];

	# Recuperando os divulgadores
	DIVULGA_FILIAL = usuario.getDivulgadorFilial(lojaID)
	divulga = {ID:NOME for ID, NOME in DIVULGA_FILIAL}

	# Obtendo o nome da empresa e filial para buscar os vendedores para o atendimento
	numeroFilial = usuario.getNome()[len(usuario.getNome())-2:]
	## Montando a query para buscar os vendedores da empresa/filial informada
	SQL = "SELECT * FROM vendedor WHERE filial = '%s' " % (numeroFilial)
	c = Modelo.Consulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
	## Iniciando a montagem das telas, aguardando cliente e atendimento
	corpo = VisaoHTML.titulo('ROTINA DE ATENDIMENTO FILIAL %s' % (numeroFilial), 4, 'text-center text-uppercase bg-success');
	
	corpo += VisaoHTML.para('','text-danger text-center','erro');
	
	## Gerando a divRow para os quadros de atendimento e aguardando cliente
	div = VisaoHTML.DivRow()
	
	## Obtendo a lista de vendedores
	vendedores = {}
	for reg in c.getRegistros():
		id_vendedor, nome, codigo_protheus, imagem, filial = reg;
		vendedores[id_vendedor] = [nome, imagem]

	aguardando_cliente = VisaoHTML.titulo('AGUARDANDO CLIENTE &nbsp;&nbsp;&nbsp', 4, 'text-center text-danger') +'<div id="naFila" class="ui-sortable"></div>';
	em_atendimento = VisaoHTML.titulo('EM ATENDIMENTO', 4, 'text-center text-danger') + '<div id="emAtendimento" class="ui-sortable"></div>';
	div.addDiv('',1)
	div.addDiv(aguardando_cliente,4)
	div.addDiv(VisaoHTML.para(VisaoHTML.button('EXIBIR NOMES', 'btn-xs btn-danger', 'trocaImagemNome'), 'text-center'),1)
	div.addDiv(em_atendimento,4)
	div.addDiv('',1)

	corpo += VisaoHTML.tagScript('var divulga = '+str(divulga)+';var loj = "'+str(numeroFilial)+'";')
	corpo += VisaoHTML.tagScript('var vendedores = '+str(vendedores)+';');
	corpo += div.getDivRow() + VisaoHTML.script('/js/atendimento_V2.js?v='+str(time.time()))

	pag.setCorpo(corpo)

	return pag.getPagina()

@route('/atendimento', method = 'POST')
def valAtendimento():
	## Colunas com as informacoes dos atendimentos, suas datas
	colunas_tabela = ['id_atendimento', 'id_vendedor', 'inicio_atendimento', 'hora_atendimento', 'data_atendimento', 'sexo', 
	'atendimento', 'segundo_atendimento', 'terceiro_atendimento', 'cliente','telefone','produto','valor', 'id_divulgador']

	coluna_resultado = dict()

	dados = str(request.forms.get('dados')).split(',')
	ID_RETORNO = ''
	## Verifica se a lista é de tamanho 14
	if len(dados) == 14:
		ID_RETORNO = dados.pop() # Recupera o ID do retorno
	# Inserindo os dados na ordem correta da coluna
	dados.insert(0,0);
	try:
		dados[3] = '%02d:%02d' % (int(dados[3].split(':')[0]), int(dados[3].split(':')[1]))
	except ValueError:
		dados[3] = '%02d:%02d' % (10,00)
	try:
		dados[4] = '%04d-%02d-%02d' % (int(dados[4].split('-')[0]), int(dados[4].split('-')[1]), int(dados[4].split('-')[2]))
	except ValueError:
		data_atuali = datetime.now()
		dados[4] = '%04d-%02d-%02d' % (data_atuali.year, data_atuali.month, data_atuali.day)
	# Verificando se a hora esta correspondente, senão definir hora da meia noite
	hora_inicio = int(dados[2].split(':')[0]) if dados[2].split(':')[0] != '' else dados[3].split(':')[0]
	try:
		minuto_inicio = int(dados[2].split(':')[1]) if dados[2].split(':')[1] != '' else 0
	except IndexError as err:
		minuto_inicio = 0

	dados[2] = '%02d:%02d' % (hora_inicio, minuto_inicio)


	# CONSULTA SQL
	SQL = "INSERT INTO atendimento ("
	## loop para gerar as colunas
	for y, valor in enumerate(dados):
		SQL += colunas_tabela[y] + ","

	SQL = SQL[:-1];SQL += ") VALUES("

	for x, valor in enumerate(dados):
		if x <= 1:
			SQL += str(valor)+","
		else:
			SQL += "'"+valor+"',"

	SQL = SQL[:-1];SQL += ")"
	#return SQL
	## INSERIR DADOS NO BANCO DE DADOS
	Modelo.executarConsulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql');
	if ID_RETORNO:
		## Atualiza o status da não venda colocando S para o ID_RETORNO informado
		SQL = "UPDATE atendimento SET retorno = 'S' WHERE id_atendimento = %d" % (int(ID_RETORNO))
		Modelo.executarConsulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql');
	return 'OK'

@route('/recupera_nao_venda', method = 'POST')
def recuperaNaovenda():
	loj = request.forms.get('loja')
	SQL = "SELECT id_atendimento, a.cliente FROM atendimento a INNER JOIN vendedor v WHERE  v.filial = '%s' \
	AND a.atendimento = 'nao_venda' AND a.telefone <> '' AND a.cliente <> '' AND a.retorno <> 'S' GROUP BY id_atendimento " % (loj)
	c = Modelo.Consulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
	# Iniciando o retorno de uma lista aninhada que contenha o nome do cliente, seu codigo e o nome do vendedor
	nao_venda_em_aberto = [['NENHUM', "NENHUM <input type=radio checked class='form-group' name=id_do_atendimento value=N />"]]
	if len(c.getRegistros()) >= 1:
		for reg in c.getRegistros():
			temp = []
			nome_cliente = str(reg[1]).upper();
			radio_id_atendimento = "%d <input type=radio class='form-group' name='id_do_atendimento' value=%d />" % (reg[0], reg[0])

			temp.append(nome_cliente);temp.append(radio_id_atendimento)
			nao_venda_em_aberto.append(temp)
	
	return json.dumps(nao_venda_em_aberto)
	
@route('/gestao_atendimento')
def gestao_atendimento():
	usuario = Modelo.Usuario()
	# Se Id é igual á zero, sei que o usuario nao tem acesso a pagina
	if usuario.getID() == 0:
		redirect('/')
	elif not usuario.verificaMenu('/gestao_atendimento'):
		redirect('/')
	## Gerando a pagina do site com o menu
	pag = VisaoHTML.Pagina(cabe, roda)
	pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
	# Obter a filial sendo recuperado somente a primeira
	
	lj = str(request.cookies.getunicode('loja_selecionada')).split(',')[0]
	# Recuperando as datas
	datas = usuario.getDataForm()
	## Calculando a diferenca de dias da data ate - de
	####################################################
	formato_data = '%Y-%m-%d'
	a = datetime.strptime(datas[0], formato_data);
	b = datetime.strptime(datas[1], formato_data);
	delta = b - a # Calculo de dias entre a e b
	qtd_dias = delta.days+1 # Quantidade de dias


	####################################################
	
	# Consulta SQL
	SQL = "SELECT v.nome, a.hora_atendimento, a.data_atendimento, a.sexo, a.atendimento, a.segundo_atendimento, \
	a.terceiro_atendimento, a.inicio_atendimento, a.retorno, a.cliente, a.telefone FROM atendimento a INNER JOIN vendedor v ON v.id_vendedor = a.id_vendedor \
	WHERE v.filial = '%s' AND a.data_atendimento BETWEEN '%s' AND '%s' " % (lj, datas[0], datas[1])
	c = Modelo.Consulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
	#return str(c.getRegistros())
		## dicionario que registras as informações para gerar os graficos
	hora = {'08':0,'09':0,'10':0,'11':0,'12':0,'13':0,'14':0,'15':0,'16':0,'17':0,'18':0,'19':0,'20':0,
	'21':0,'22':0};

	# Dicionario para definir os dias da semana FER NAO É USADO, SOMENTE CRIADO PARA MANTER A ESTRUTURA
	dias_da_semana = {0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0}
	## Dicionario para armazenar dias do mes, 1 ate 31
	dias_do_mes = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0,
	17:0, 18:0, 19:0, 20:0, 21:0, 22:0, 23:0, 24:0, 25:0, 26:0, 27:0, 28:0, 29:0, 30:0, 31:0}
	# Quantidade de atendimentos de cada vendedor e tipos de atendimento
	atendimentoVendedor = dict();
	## Tempo medio de atendimento de cada atendimento
	tempoMedioAtendimento = dict();
	#### Retorno de nao venda 05-09-2017
	retornoNaoVenda = dict();

	sexo = {'M':0,'F':0};venda = {'com_rx':dict(),'sem_rx':dict()}; nao_venda = {'com_rx':dict(),'sem_rx':dict()}
	for reg in c.getRegistros():
		# Guardando a hora
		h = reg[1][:2]
		try:
			hora[h] += 1
		except KeyError:
			print("Nao foi possivel registrar a hora.");
		# Armazenando sexo do cliente
		s = reg[3]
		sexo[s] += 1
		# Verificando as vendas realizadas por vendedor(somente vendas, onde atendimento é igual a venda)
		vend = reg[0]
		if not vend in atendimentoVendedor.keys(): # verificando se o vendedor nao existe como chave de atendimentoVendedor
			atendimentoVendedor[vend] = {'venda':{'com_rx':dict(), 'sem_rx':dict()}, 
			'nao_venda':{'com_rx':dict(),'sem_rx':dict()}, 
			'ajuste_conserto_montagem_pagamento':0,'entrega':0,'troca_assistencia':0,'encaminhamento_medico':0}
		## Verificando se o vendedor esta no tempo medio de atendimento
		if not vend in tempoMedioAtendimento.keys():
			tempoMedioAtendimento[vend] = dict()
		## Verificando se o vendedor contem no retorno de nao venda
		if not vend in retornoNaoVenda.keys():
			retornoNaoVenda[vend] = {'com_rx': [0,0],'sem_rx':[0,0]}
		## Somando o retorno de nao venda
		if reg[4] == 'nao_venda':
			## Verificando se o cliente e o telefone nao foram preenchidos
			if reg[9] is None or reg[9] == "" or reg[10] is None or reg[10] == "":
				pass
			elif reg[5] == 'com_rx':
				if 'S' == reg[8]:
					retornoNaoVenda[vend]['com_rx'][0] += 1
				elif 'N' == reg[8]:
					retornoNaoVenda[vend]['com_rx'][1] += 1
			elif reg[5] == 'sem_rx':
				if 'S' == reg[8]:
					retornoNaoVenda[vend]['sem_rx'][0] += 1
				elif 'N' == reg[8]:
					retornoNaoVenda[vend]['sem_rx'][1] += 1


		if reg[4] == 'venda':
			#### SE VENDA TEM RX VAMOS COLOCAR COMPUTAR PARA VENDA
			if reg[5] == 'com_rx':
				## Verificar se o motivo de venda existe no dicionario de venda, senao incluir
				if not reg[6] in atendimentoVendedor[vend]['venda']['com_rx'].keys():
					atendimentoVendedor[vend]['venda']['com_rx'][reg[6]] = 1
				else:
					atendimentoVendedor[vend]['venda']['com_rx'][reg[6]] += 1

				if not reg[6] in venda['com_rx'].keys(): # Se este motivo nao tiver sido preenchido ainda , colocar um
					venda['com_rx'] = {reg[6]: 1}
				else: # Complementar o que ja tem
					venda['com_rx'][reg[6]] += 1
			######## SE VENDA NAO TEM RX VAMOS COMPUTAR PARA A VENDA
			elif reg[5] == 'sem_rx':
				## Verificar se o motivo de venda sem_rx existe no dicionario sem_rx de venda do vendedor
				if not reg[6] in atendimentoVendedor[vend]['venda']['sem_rx'].keys():
					atendimentoVendedor[vend]['venda']['sem_rx'][reg[6]] = 1
				else:
					atendimentoVendedor[vend]['venda']['sem_rx'][reg[6]] += 1

				if not reg[6] in venda['sem_rx'].keys(): # Se este motivo nao tiver sido preenchido ainda no sem_rx, colocar 1
					venda['sem_rx'] = {reg[6]: 1}
				else: # Complementar o que ja tem
					venda['sem_rx'][reg[6]] += 1
		####################################################################################################################################

		# Armazenando motivo de não_venda, com_rx e sem_rx
		if reg[4] == 'nao_venda':

			########### VERIFICA SE A VENDA TEM RX OU NAO
			if reg[5] == 'com_rx': # verifica se a nao_venda tem rx
				## Verificar se o motivo de venda existe no dicionario de venda, senao incluir
				if not reg[6] in atendimentoVendedor[vend]['nao_venda']['com_rx'].keys():
					atendimentoVendedor[vend]['nao_venda']['com_rx'][reg[6]] = 1
				else:
					atendimentoVendedor[vend]['nao_venda']['com_rx'][reg[6]] += 1

				if not reg[6] in nao_venda['com_rx'].keys(): # Se o vendedor nao tiver feito nenhuma venda com rx inclua uma para ele
					nao_venda['com_rx'] = {reg[6]: 1}
				else:
					nao_venda['com_rx'][reg[6]] += 1
			## VERIFICAR SE A VENDA NAO TEM RX		
			elif reg[5] == 'sem_rx':
				if not reg[6] in atendimentoVendedor[vend]['nao_venda']['sem_rx'].keys():
					atendimentoVendedor[vend]['nao_venda']['sem_rx'][reg[6]] = 1
				else:
					atendimentoVendedor[vend]['nao_venda']['sem_rx'][reg[6]] += 1

				if not reg[6] in nao_venda['sem_rx'].keys():
					nao_venda['sem_rx'] = {reg[6]: 1}
				else:
					nao_venda['sem_rx'][reg[6]] += 1
		### VERIFICANDO SE ATENDIMENTO FOI MONTAGEM, ENTREGA, TROCA_ASSITENCIA OU ENCAMINHAMENTO MEDICO
		
		if reg[4] == 'ajuste_conserto_montagem_pagamento':
			atendimentoVendedor[vend]['ajuste_conserto_montagem_pagamento'] += 1
		elif reg[4] == 'entrega':
			atendimentoVendedor[vend]['entrega'] += 1
		elif reg[4] == 'troca_assistencia':
			atendimentoVendedor[vend]['troca_assistencia'] += 1
		elif reg[4] == 'encaminhamento_medico':
			atendimentoVendedor[vend]['encaminhamento_medico'] += 1

		## Verificando se o tipo de atendimento existe no atendimento do vendedor
		if not reg[4] in tempoMedioAtendimento[vend].keys():
			tempoMedioAtendimento[vend][reg[4]] = [0,0]
		## Calculando a diferença de minutos
		fmt = '%H:%M'
		d1 = datetime.strptime(reg[1], fmt)
		d2 = datetime.strptime(reg[7], fmt)
		diferencaDeTempo = (d1-d2).seconds / 60
		tempoMedioAtendimento[vend][reg[4]][0] += diferencaDeTempo
		tempoMedioAtendimento[vend][reg[4]][1] += 1



		## Definindo dia da semana de atendimento
		ano_atendimento, mes_atendimento, dia_atendimento = str(reg[2]).split('-')
		daSm = datetime(int(ano_atendimento),int(mes_atendimento),int(dia_atendimento))
		dias_da_semana[daSm.isoweekday()] += 1
		
		##Definindo os atendimentos do dia do mes
		dias_do_mes[int(dia_atendimento)] += 1

	######### CONVERSAO DE DADOS PARA LISTA ############
	
	## CONVERTENDO A HORA PARA UMA LISTA HORA
	hora_lista = [['HORA', 'QUANTIDADE', {'role':'annotation'}]];
	for key in sorted(hora.keys()):
		hora_lista.append([key, hora[key], hora[key]]);

	## CONVERTENDO DIA DA SEMANA EM UMA LISTA
	dias_da_semana_lista = [['DIA DA SEMANA', 'QUANTIDADE', {'role':'annotation'}]];
	for key in dias_da_semana:
		nova_chave = ''
		if key == 0:
			continue
		elif key == 1:
			nova_chave = 'SEG'
		elif key == 2:
			nova_chave = 'TER'
		elif key == 3:
			nova_chave = 'QUA'
		elif key == 4:
			nova_chave = 'QUI'
		elif key == 5:
			nova_chave = 'SEX'
		elif key == 6:
			nova_chave = 'SAB'
		elif key == 7:
			nova_chave = 'DOM'
		dias_da_semana_lista.append([nova_chave, dias_da_semana[key], dias_da_semana[key]]);

	## CONVERTENDO DIAS DO MES EM UMA LISTA
	dias_do_mes_lista = [['DIA DO MES', 'QUANTIDADE', {'role':'annotation'}]];
	for key in sorted(dias_do_mes.keys()):
		dias_do_mes_lista.append([str(key), dias_do_mes[key], dias_do_mes[key]]);

	## CONVERTENDO O SEXO PRA UMA LISTA
	sexo_lista = [['SEXO', 'QUANTIDADE', {'role':'annotation'}]];
	for key in sorted(sexo.keys()):
		sexo_lista.append([key+' : '+str(sexo[key]), sexo[key], sexo[key]]);

	## CONVERTENDO OS ATENDIMENTOS VENDA / VENDEDOR
	venda_com_sem_rx = [['VENDEDORES', 'VENDA', {'role':'annotation'}, 'NAO VENDA', {'role':'annotation'}]];
	venda_com_rx = [['VENDEDORES','VENDA', {'role':'annotation'}, 'NAO VENDA', {'role':'annotation'}]];
	venda_sem_rx = [['VENDEDORES','VENDA', {'role':'annotation'}, 'NAO VENDA', {'role':'annotation'}]];
	vendedores_dici = dict();
	for key in atendimentoVendedor.keys():
		if not key in vendedores_dici.keys():
			vendedores_dici[key] = {'venda':{'com_rx':0,'sem_rx':0}, 'nao_venda':{'sem_rx':0,'com_rx':0}}
			
		# Fazer um loop agora para somar as vendas com e sem rx
		for key3 in atendimentoVendedor[key]['venda']['com_rx']:
			vendedores_dici[key]['venda']['com_rx'] += atendimentoVendedor[key]['venda']['com_rx'][key3];

		for key3 in atendimentoVendedor[key]['venda']['sem_rx']:
			vendedores_dici[key]['venda']['sem_rx'] += atendimentoVendedor[key]['venda']['sem_rx'][key3];
		# Fazer outro loop para pegar a soma das nao_vendas com e sem rx
		for key3 in atendimentoVendedor[key]['nao_venda']['sem_rx']:
			vendedores_dici[key]['nao_venda']['sem_rx'] += atendimentoVendedor[key]['nao_venda']['sem_rx'][key3];

		for key3 in atendimentoVendedor[key]['nao_venda']['com_rx']:
			vendedores_dici[key]['nao_venda']['com_rx'] += atendimentoVendedor[key]['nao_venda']['com_rx'][key3];
	## ESTAS VARIAVEIS VAO COMPETIR OS TOTAIS DA LOJA COM_SEM_RX, COM_RX E SEM_RX
	tot_com_sem_rx = [0,0];tot_com_rx = [0,0];tot_sem_rx = [0,0];

	# Depois de toda esta complexibilidade, criaremos o array que compete as vendas com RX ou sem RX por vendedor
	for key in vendedores_dici.keys():

		VENDA_COM_RX = vendedores_dici[key]['venda']['com_rx'];	VENDA_SEM_RX = vendedores_dici[key]['venda']['sem_rx'];
		NAO_VENDA_COM_RX = vendedores_dici[key]['nao_venda']['com_rx']; NAO_VENDA_SEM_RX = vendedores_dici[key]['nao_venda']['sem_rx'];

		VENDA = (VENDA_COM_RX+VENDA_SEM_RX);NAO_VENDA = (NAO_VENDA_SEM_RX+NAO_VENDA_COM_RX)

		venda_com_sem_rx.append([key.split(' ')[0], VENDA, str(VENDA)+' V', NAO_VENDA, str(NAO_VENDA)+' N.V']);
		venda_com_rx.append([key.split(' ')[0], VENDA_COM_RX, str(VENDA_COM_RX)+' V', NAO_VENDA_COM_RX, str(NAO_VENDA_COM_RX)+' N.V']);
		venda_sem_rx.append([key.split(' ')[0], VENDA_SEM_RX, str(VENDA_SEM_RX)+' V', NAO_VENDA_SEM_RX, str(NAO_VENDA_SEM_RX)+' N.V']);
		# SOMANDO O TOTAL DA LOJA
		tot_com_sem_rx[0] += VENDA;tot_com_sem_rx[1] += NAO_VENDA;
		tot_com_rx[0] += VENDA_COM_RX;tot_com_rx[1] += NAO_VENDA_COM_RX;
		tot_sem_rx[0] += VENDA_SEM_RX;tot_sem_rx[1] += NAO_VENDA_SEM_RX;
	## Agora apendar como ultimo elemento o array dos totais da loja
	venda_com_sem_rx.append(['LOJA', tot_com_sem_rx[0], str(tot_com_sem_rx[0])+' V', tot_com_sem_rx[1], str(tot_com_sem_rx[1])+' N.V']);
	venda_com_rx.append(['LOJA', tot_com_rx[0], str(tot_com_rx[0])+' V', tot_com_rx[1], str(tot_com_rx[1])+' N.V']);
	venda_sem_rx.append(['LOJA', tot_sem_rx[0], str(tot_sem_rx[0])+' V', tot_sem_rx[1], str(tot_sem_rx[1])+' N.V']);

	### CONVERTENDO O RETORNO DE NAO VENDA
	## GERANDO AS VARIAVEIS QUE REGISTRARAM O TOTAL DE RETORNO NAO VENDA DA LOJA
	tot_retorno_com_sem_rx =[0, 0];tot_retorno_com_rx = [0, 0];tot_retorno_sem_rx = [0,0]
	retorno_nao_venda = [['VENDEDOR', 'RETORNO',{'role':'annotation'},'NAO RETORNO', {'role':'annotation'}]]
	retorno_nao_venda_com_rx = [['VENDEDOR', 'RETORNO', {'role':'annotation'},'NAO RETORNO', {'role':'annotation'}]]
	retorno_nao_venda_sem_rx = [['VENDEDOR', 'RETORNO', {'role':'annotation'},'NAO RETORNO', {'role':'annotation'}]]

	for key in retornoNaoVenda.keys():
		RETORNO_COM_RX = retornoNaoVenda[key]['com_rx'][0]; RETORNO_SEM_RX = retornoNaoVenda[key]['sem_rx'][0];
		NAO_RETORNO_COM_RX = retornoNaoVenda[key]['com_rx'][1]; NAO_RETORNO_SEM_RX = retornoNaoVenda[key]['sem_rx'][1];

		RETORNO = (RETORNO_COM_RX+RETORNO_SEM_RX);NAO_RETORNO = (NAO_RETORNO_SEM_RX+NAO_RETORNO_COM_RX);

		retorno_nao_venda.append([key.split(' ')[0], RETORNO, str(RETORNO)+' S', NAO_RETORNO, str(NAO_RETORNO)+' N']);
		retorno_nao_venda_com_rx.append([key.split(' ')[0], RETORNO_COM_RX, str(RETORNO_COM_RX)+' S', NAO_RETORNO_COM_RX, str(NAO_RETORNO_COM_RX)+' N']);
		retorno_nao_venda_sem_rx.append([key.split(' ')[0], RETORNO_SEM_RX, str(RETORNO_SEM_RX)+' S', NAO_RETORNO_SEM_RX, str(NAO_RETORNO_SEM_RX)+' N']);

		tot_retorno_com_sem_rx[0] += RETORNO;tot_retorno_com_sem_rx[1] += NAO_RETORNO;
		tot_retorno_com_rx[0] += RETORNO_COM_RX; tot_retorno_com_rx[1] += NAO_RETORNO_COM_RX;
		tot_retorno_sem_rx[0] += RETORNO_SEM_RX; tot_retorno_sem_rx[1] += NAO_RETORNO_SEM_RX;

	retorno_nao_venda.append(['LOJA', tot_retorno_com_sem_rx[0], str(tot_retorno_com_sem_rx[0])+' S', tot_retorno_com_sem_rx[1], str(tot_retorno_com_sem_rx[1])+' N']);
	retorno_nao_venda_com_rx.append(['LOJA', tot_retorno_com_rx[0], str(tot_retorno_com_rx[0])+' S', tot_retorno_com_rx[1], str(tot_retorno_com_rx[1])+' N']);
	retorno_nao_venda_sem_rx.append(['LOJA', tot_retorno_sem_rx[0], str(tot_retorno_sem_rx[0])+' S', tot_retorno_sem_rx[1], str(tot_retorno_sem_rx[1])+' N']);

	### CONVERTENDO OS TIPOS DE ATENDIMENTO DE CADA VENDEDOR
	tipo_de_atendimento = {}; # ['TIPO DE ATENDIMENTO', 'QUANTIDADE', {'role':'annotation'}];
	vendedor_tipo_de_atendimento = []; # Esta lista vai conter o nome do vendedor e seu nome como ID do vendedor com a letra T no final
	for key in atendimentoVendedor.keys():
		nome = key.replace(' ','_')
		vendedor_tipo_de_atendimento.append([nome+'&', key]); # Apendando o vendedor a lista do select do tipo de atendimento
		tipo_de_atendimento[nome] = [['TIPO DE ATENDIMENTO', 'QUANTIDADE']];
		## Fazer um loop nos tipos de atendimento para realizar a contagem deles
		for key2 in atendimentoVendedor[key].keys():
			if key2 == 'venda' or key2 == 'nao_venda':
				total = 0
				for key3 in atendimentoVendedor[key][key2].keys():
					for key4 in atendimentoVendedor[key][key2][key3].keys():
						total += atendimentoVendedor[key][key2][key3][key4];
				
				tipo_de_atendimento[nome].append([str(total)+' '+key2, total]);
			else:
				total = atendimentoVendedor[key][key2];
				tipo_de_atendimento[nome].append([str(total)+' '+key2, total]);

	### CONVERTENDO OS MOTIVOS DE NAO VENDA DE CADA VENDEDOR
	tipo_motivo_nao_venda = {}; # ['MOTIVO NAO VENDA', 'QUANTIDADE', {'role':'annotation'}];
	vendedor_motivo_nao_venda = []; # Armazena os vendedores para o select do motivo nao venda
	for key in atendimentoVendedor.keys():
		nome = key.replace(' ','_');
		vendedor_motivo_nao_venda.append([nome+'&M', key]);
		tipo_motivo_nao_venda[nome] = [['MOTIVO NAO VENDA', 'QUANTIDADE']];
		os_motivos_nao_venda = dict(); # Dicionario que armazena os tipos de nao venda e soma-os
		## Fazer um loop para pegar as não vendas
		for key2 in atendimentoVendedor[key]['nao_venda'].keys():
			## Fazer outor loop para preencher as nao vendas
			for key3 in atendimentoVendedor[key]['nao_venda'][key2].keys():
				if key3 in os_motivos_nao_venda.keys():
					os_motivos_nao_venda[key3] += atendimentoVendedor[key]['nao_venda'][key2][key3]
				else:
					os_motivos_nao_venda[key3] = atendimentoVendedor[key]['nao_venda'][key2][key3]
		## Fazer um loop em os_motivos_nao_venda para pegar os motivos e os totais
		for chave in os_motivos_nao_venda.keys():
			tipo_motivo_nao_venda[nome].append([str(os_motivos_nao_venda[chave])+' '+chave, os_motivos_nao_venda[chave]]);

	### CONVERSAO DOS DIVULGADORES
	## Consulta que recupera os divulgadores e os tipos de atendimento
	SQL = "SELECT d.nome, a.atendimento, COUNT(*) AS CAMPOS FROM atendimento a INNER JOIN divulgador d ON d.id_divulgador = a.id_divulgador \
	INNER JOIN vendedor v ON v.id_vendedor = a.id_vendedor \
	WHERE v.filial = '%s' AND a.data_atendimento BETWEEN '%s' AND '%s' GROUP BY nome, atendimento " % (lj, datas[0], datas[1])
	c.setConsulta(SQL)
	## Loop para montar os dados com os divulgadores
	tipo_divulgador = {};
	selecao_tipo_divulgador = [];
	dados_tipo_divulgador = {}
	for reg in c.getRegistros():
		if not reg[1] in tipo_divulgador.keys():
			tipo_divulgador[reg[1]] = dict();
		if not reg[0] in tipo_divulgador[reg[1]].keys():
			tipo_divulgador[reg[1]][reg[0]] = 0

		tipo_divulgador[reg[1]][reg[0]] += reg[2]
	## Loop para criar o select dos divulgadores
	for key in tipo_divulgador.keys():
		selecao_tipo_divulgador.append([key+'&D', key.replace('_', ' ').upper()]);
		## Agora fazer o loop final para gerar a lista com o tipo de divulgador e a quantidade
		dados_tipo_divulgador[key] = [['DIVULGADOR', 'QUANTIDADE']];
		# Recuperar os divulgadores e a quantidade e adicionar na lista
		for key2 in tipo_divulgador[key].keys():
			dados_tipo_divulgador[key].append([str(tipo_divulgador[key][key2])+' '+key2, tipo_divulgador[key][key2]]);

	#### CONVERSAO DAS ENTREGAS
	# Consulta para recuperar as entregas
	SQL = "select a.segundo_atendimento, COUNT(*) FROM atendimento a INNER JOIN vendedor v ON v.id_vendedor = a.id_vendedor \
	WHERE v.filial = '%s' AND a.atendimento = 'entrega' AND NOT a.segundo_atendimento IS NULL AND a.data_atendimento BETWEEN '%s' AND '%s' GROUP BY atendimento, segundo_atendimento" % (lj, datas[0], datas[1]);
	c.setConsulta(SQL)
	entregas = [['ACONTECEU', 'QUANTIDADE']];
	for reg in c.getRegistros():
		entregas.append([str(reg[1])+' '+reg[0], reg[1]]);

	## Primeira div para os itens do formulario. Grupos, data de e data ate alem do botao pesquisar
	divForm = VisaoHTML.DivRow();divForm.addDiv('',2)
	divForm.addDiv('', 2)
	divForm.addDiv(VisaoHTML.selecaoPer('LOJAS', 'lojas', usuario.getLojas(), lj[0], '', 'lojas', uni = True), 2)
	divForm.addDiv(VisaoHTML.entrada('date', 'data1', datas[0], nome = 'DE', Identificador = 'data1'), 2)
	divForm.addDiv(VisaoHTML.entrada('date', 'data1', datas[1], nome = 'ATE', Identificador = 'data2'), 2)
	divForm.addDiv('<br/>'+VisaoHTML.button(' Pesquisar', 'btn-danger glyphicon glyphicon-search', 'pesquisar'), 2)
	# Corpo
	corpo = divForm.getDivRow() + VisaoHTML.titulo('GESTAO DE ATENDIMENTOS FILIAL %s' % (lj), 4, 'text-center text-uppercase bg-success') 
	corpo += VisaoHTML.para('DE %s ATE %s ' % (datas[0], datas[1]), 'text-center text-danger text-uppercase') + VisaoHTML.div('','','corpo_pagina')
	
	corpo += VisaoHTML.tagScript('var sexo = '+str(sexo_lista)+';var vendaComSemRx = '+str(venda_com_sem_rx)+';var vendaComRx = '+str(venda_com_rx)+';var vendaSemRx = '+str(venda_sem_rx)+';');
	corpo += VisaoHTML.tagScript('var nao_venda = '+str(nao_venda)+';var hora_atendimento = '+str(hora_lista)+';')
	corpo += VisaoHTML.tagScript('var diaDaSemana = '+str(dias_da_semana_lista)+';var venda = '+str(venda)+';var diaDoMes = '+str(dias_do_mes_lista)+';var tempoMedioAtendimento = '+str(tempoMedioAtendimento)+';')
	corpo += VisaoHTML.tagScript('var retornoNaoVendaComSemRx = '+str(retorno_nao_venda)+';var retornoNaoVendaComRx = '+str(retorno_nao_venda_com_rx)+';var retornoNaoVendaSemRx = '+str(retorno_nao_venda_sem_rx)+';');
	corpo += VisaoHTML.tagScript('var quantidadeDeDias = '+str(qtd_dias)+';')
	corpo += VisaoHTML.tagScript('var vendedorTipoDeAtendimento = '+str(vendedor_tipo_de_atendimento)+';var tipoDeAtendimento = '+str(tipo_de_atendimento)+';')
	corpo += VisaoHTML.tagScript('var vendedorMotivoNaoVenda = '+str(vendedor_motivo_nao_venda)+';var motivoNaoVenda = '+str(tipo_motivo_nao_venda)+';');
	corpo += VisaoHTML.tagScript('var tipoDivulgador = '+str(dados_tipo_divulgador)+';var atendimentoDivulgador = '+str(selecao_tipo_divulgador)+';')
	corpo += VisaoHTML.tagScript('var dadosEntrega = '+str(entregas)+';')
	corpo += VisaoHTML.script('/js/gestao_atendimentoV2.js?v='+str(time.time()))
	
	pag.setCorpo(corpo)
	return pag.getPagina()

@route('/gestao_atendimento', method = 'POST')
def val_gestao_atendimento():
	# Obtendo os dados submetivdos pelo ajax, datas de, ate e os grupos
	de = request.forms.get('de')
	ate = request.forms.get('ate')
	lojas = str(request.forms.get('lojas'))

	usuario = Modelo.Usuario()
	# Gravando as datas de, ate, lojas e grupos
	usuario.setData(de,ate)
	usuario.gravaData()
	usuario.gravaLojas(lojas)
	
	return 'OK'

## Pagina para os vendedores monitorarem os clientes que deixaram de comprar por algum motivo e que foram (ou não) atendidos neste momento
@route('/informativo_nao_venda')
def informativo_nao_venda():
	usuario = Modelo.Usuario()
	# Se Id é igual á zero, sei que o usuario nao tem acesso a pagina
	if usuario.getID() == 0:
		redirect('/')
	elif not usuario.verificaMenu('/informativo_nao_venda'):
		redirect('/')
	## Gerando a pagina do site com o menu
	pag = VisaoHTML.Pagina(cabe, roda)
	pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
	# Obter filial sendo recuperado somente o primeiro 
	
	lj = str(request.cookies.getunicode('loja_selecionada')).split(',')[0]
	# Recuperando as datas
	datas = usuario.getDataForm()
	d1 = str(datas[0]);d2 = str(datas[1])
	

	### CONSULTA PARA RETORNAR TODOS OS ATENDIMENTOS DE NÃO VENDA DA DATA INFORMADA
	SQL = "SELECT id_atendimento, UPPER(REPLACE(a.terceiro_atendimento, '_',' ')), a.data_atendimento, a.hora_atendimento, UPPER(v.nome), UPPER(a.cliente), a.telefone, UPPER(a.produto), a.valor, a.retorno FROM atendimento a \
	INNER JOIN vendedor v ON v.id_vendedor = a.id_vendedor WHERE a.data_atendimento BETWEEN '%s' AND '%s' AND a.atendimento = 'nao_venda' AND a.cliente <> '' AND a.telefone <> '' \
	AND v.filial = '%s' ORDER BY a.data_atendimento " 
	SQL = SQL % (d1, d2, lj)
	c = Modelo.Consulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor)
	## Cabecalho da tabela
	tabeCabe = ['NUM. ORÇAMENTO', 'MOTIVO NAO VENDA', 'DATA', 'HORA', 'VENDEDOR','CLIENTE','TELEFONE','PRODUTO','VALOR','RETORNO']
	tabeCorpo = c.getRegistros()
	tabe = VisaoHTML.Tabela(tabeCabe, tabeCorpo, [])
	#return tabe.getTabela()
	## Primeira div para os itens do formulario. Grupos, data de e data ate alem do botao pesquisar
	divForm = VisaoHTML.DivRow();divForm.addDiv('',2)
	divForm.addDiv(VisaoHTML.selecaoPer('LOJAS', 'lojas', usuario.getLojas(), lj, '', 'lojas', uni = True), 2)
	divForm.addDiv(VisaoHTML.entrada('date', 'data1', datas[0], nome = 'DE', Identificador = 'data1'), 2)
	divForm.addDiv(VisaoHTML.entrada('date', 'data1', datas[1], nome = 'ATE', Identificador = 'data2'), 2)
	divForm.addDiv('<br/>'+VisaoHTML.button(' Pesquisar', 'btn-danger glyphicon glyphicon-search', 'pesquisar'), 2)
	corpo = divForm.getDivRow();
	corpo += VisaoHTML.titulo('INFORMATIVO DE NÃO VENDA FILIAL %s ' % (lj), 4, 'text-center bg-success')
	corpo += VisaoHTML.para('DE %s ATE %s ' % (datas[0], datas[1]), 'text-center text-danger text-uppercase')
	corpo += tabe.getTabela()
	corpo += VisaoHTML.script('/js/informativo_nao_venda.js?v='+str(time.time()))
	pag.setCorpo(corpo)
	return pag.getPagina()

@route('/informativo_nao_venda', method = 'POST')
def val_informativo_nao_venda():
	usuario = Modelo.Usuario()
	de = request.forms.get('de');
	ate = request.forms.get('ate');
	loja = request.forms.get('lojas');
	usuario.setData(de, ate);usuario.gravaData();
	usuario.gravaLojas(loja);
	return 'OK'

## CADASTRO DE DIVULGADORES
@route('/cadastro_divulgadores')
def cadastro_divulgadores():
	usuario = Modelo.Usuario()
	# Se Id é igual á zero, sei que o usuario nao tem acesso a pagina
	if usuario.getID() == 0:
		redirect('/')
	elif not usuario.verificaMenu('/cadastro_divulgadores'):
		redirect('/')
	## Gerando a pagina do site com o menu
	pag = VisaoHTML.Pagina(cabe, roda)
	pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
	#Lojas que o usuario tem acesso
	lojas = usuario.getLojas(com_id = True)
	lojasDici = {nome:ID for ID, nome in lojas}
	# Divulgadores
	divulga = usuario.getDivulgador()
	divulgaDici = {nome:ID for ID, nome in divulga}
	# Dicionario para o objeto javascript de divulgadores
	divulgadores = {ID:nome for ID, nome in divulga}
	
	
	divForm = [VisaoHTML.DivRow() for n in range(5)]
	divForm[0].addDiv('',4)
	divForm[0].addDiv(VisaoHTML.selecao('FILIAL', 'lojas', lojasDici, '', 'lojas'),4)
	divForm[0].addDiv('',4)
	divForm[1].addDiv('',4)
	divForm[1].addDiv(VisaoHTML.selecao('DIVULGADOR', 'divulgador', divulgaDici, '','divulgador')+'<p><span style="margin-right:30%"><a href="#" id="excluir_divulgador">Exclua o divulgador</a></span><span style="margin-left:10%;"><a href="#" id="incluir_divulgador">Inclua o divulgador</a></span></p>',4)
	divForm[1].addDiv('',4)
	divForm[2].addDiv('',4)
	divForm[2].addDiv(VisaoHTML.para('','text-danger text-uppercase','erro'),4)
	divForm[2].addDiv('',4)
	divForm[3].addDiv('',4)
	divForm[3].addDiv(VisaoHTML.button('INCLUIR', 'btn-danger', 'enviar'),4)
	divForm[3].addDiv('',4)
	# Gerar tabela dos divulgadores cadastrados
	SQL = "SELECT d.nome, af.filial, CONCAT(d.id_divulgador, '_',  af.id_filial) FROM divulgador d INNER JOIN adm_filial_divulgador afd ON afd.id_divulgador = d.id_divulgador \
	INNER JOIN adm_filial af ON afd.id_filial = af.id_filial WHERE afd.id_filial IN(%s) AND d.D_E_L_E_T_ IS NULL"
	id_das_filiais = list()
	for nome,ID in lojasDici: # Obtendo oID dos grupos para retornar todos os divulgadores afiliados aos grupos/lojas
		id_das_filiais.append(ID)
	SQL = SQL % (','.join(id_das_filiais))
	c = Modelo.Consulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
	tabeCorpo = []
	for reg in c.getRegistros():
		rem = '<span id="%s" class="text-danger glyphicon glyphicon-trash"> REMOVER</span>' % str(reg[2])
		temp = []
		temp.append(reg[0]);temp.append(str(reg[1]));temp.append(rem)
		tabeCorpo.append(tuple(temp))
	
	## Criação da tabela
	tabeCabe = ['DIVULGADOR','FILIAL', 'REMOVER']
	tabe = VisaoHTML.Tabela(tabeCabe, tabeCorpo, [])
	## Colocando a tabela dentro de uma div
	divForm[4].addDiv('',2)
	divForm[4].addDiv(tabe.getTabela(), 8);divForm[4].addDiv('',2)
	corpo = VisaoHTML.titulo('CADASTRO DE DIVULGADORES', 4, 'text-center bg-success')
	for div in divForm:
		corpo += div.getDivRow()

	corpo += VisaoHTML.tagScript('var divulgadores = '+str(divulgadores)+';');
	corpo += VisaoHTML.script('/js/cadastro_divulgadores.js?v='+str(time.time()))
	pag.setCorpo(corpo)

	return pag.getPagina()

@route('/cadastro_divulgadores', method = 'POST')
def val_cadastro_divulgadores():
	### RECUPERA LOJA E DIVULGADOR PARA INCLUIR NA TABELA DE GRUPO_FILIAL_DIVULGADOR
	loja = request.forms.get('lojas')
	divulgador = request.forms.get('divulgadores')
	## SE ELES ESTIVEREM PREENCHIDOS 
	if loja != "" and divulgador != "":
		# VERIFICAMOS SE O MESMO FILIAL COM O DIVULGADOR JA EXISTE
		SQL = "SELECT * FROM adm_filial_divulgador where id_filial = %d AND id_divulgador = %d" % (int(loja), int(divulgador))
		c = Modelo.Consulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
		if len(c.getRegistros()) >= 1:
			## EXISTE, RETORNAR MENSAGEM INFORMANDO QUE O DIVULGADOR JA EXISTE PARA ESTA LOJA
			return 'O DIVULGADOR JA EXISTE PARA ESTA LOJA'
		## PARECE QUE NAO EXISTE, VAMOS INCLUI-LO NA TABELA DE DIVULGADOR FILIAL
		SQL = "INSERT INTO adm_filial_divulgador VALUES(%d, %d)" % (int(loja), int(divulgador))
		Modelo.executarConsulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
		# RETORNE OK, TUDO OCORREU PERFEITAMENTE
		return 'OK'
	else:
		## CAMPO DO GRUPO, FILIAL OU DIVULGADOR ESTA EM BRANCO, RETORNAR MENSAGEM DE ERRO
		return 'ERRO TENTE NOVAMENTE'

@route('/incluir_divulgador', method = 'POST')
def incluir_divulgador():
	nomeDivulgador = request.forms.nome # Problemas com caracteres de acentuação enviados pelo formulario
	
	if nomeDivulgador != "":
		SQL = "SELECT nome FROM divulgador WHERE nome = '%s' AND D_E_L_E_T_ IS NULL" % (nomeDivulgador)
		c = Modelo.Consulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
		if len(c.getRegistros()) >= 1:
			return 'ERRO'
		SQL = "INSERT INTO divulgador VALUES(0, '%s', NULL)" % (nomeDivulgador)
		Modelo.executarConsulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
		SQL = "SELECT id_divulgador, nome FROM divulgador WHERE D_E_L_E_T_ IS NULL"
		c = Modelo.Consulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
		todosDivulgadores = {ID:nome for ID, nome in c.getRegistros()}
		
		return todosDivulgadores
	else:
		return 'BRANCO'

@route('/exclui_divulgador', method = 'POST')
def exclui_divulgador():
	IDDIVULGADOR = str(request.forms.get('divulgadorGrupoFilial'))
	if IDDIVULGADOR != "":
		divulgador, filial = IDDIVULGADOR.split('_')
		SQL = "DELETE FROM adm_filial_divulgador WHERE id_filial = %d AND id_divulgador = %d " % (int(filial), int(divulgador))
		Modelo.executarConsulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
		return 'OK'
	else:
		return 'ERRO'

@route('/remover_divulgador', method = 'POST')
def val_removerDivulgador():
	usuario = Modelo.Usuario()

	ID = request.forms.get('nome')
	if ID == "":
		return 'BRANCO'
	SQL = "UPDATE divulgador SET D_E_L_E_T_ = '*' WHERE id_divulgador = %d " % (int(ID))
	Modelo.executarConsulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
	
	divulga = usuario.getDivulgador()
	# Dicionario para o objeto javascript de divulgadores
	divulgadores = {ID:nome for ID, nome in divulga}
	return divulgadores
	

@route('/cadastro_vendedor')
def cadastro_vendedor():
	usuario = Modelo.Usuario()
	# Se Id é igual á zero, sei que o usuario nao tem acesso a pagina
	if usuario.getID() == 0:
		redirect('/')
	elif not usuario.verificaMenu('/cadastro_vendedor'): # Se o cara não tem o menu, redirecione-o
		redirect('/')
	## Gerando a pagina do site com o menu
	pag = VisaoHTML.Pagina(cabe, roda)
	pag.setMenuAdm(usuario.getMenuAdm(), usuario.getNome())
	# Obter as filiais
	lj = ["'"+d+"'" for d in str(request.cookies.getunicode('loja_selecionada')).split(',')]
	##OBTER TODAS AS FILIAIS SEM O ID
	lj_sem_id = ["'"+x+"'" for x in usuario.getLojas()];
	## Obtendo as lojas do usuario para usar em casos de alteração de filial do vendedor
	filiais = {ID:fil for ID,fil in usuario.getLojas(True)};

	## OBTENDO OS VENDEDORES CADASTRADOS PARA A FILIAL QUE SE TEM ACESSO.
	SQL = "SELECT codigo_protheus,id_vendedor, nome, imagem, filial FROM vendedor WHERE filial IN(%s) " % (','.join(lj_sem_id))
	
	c = Modelo.Consulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
	# MATRIZ PARA ARMAZENAR OS DADOS DA TABELA
	tabeCorpo = []
	# Codigos existentes no sistema, vendedores ja cadastrados para esta filial
	codigos_existentes = "'000001',"
	for cod in c.getRegistros():
		corpoTemp = [] # Lista para armazenar os itens do td
		corpoTemp.append(cod[2])# Apenda nome
		corpoTemp.append(cod[0])# Codigo do protheus
		# Se nao tiver imagem coloca sem imagem
		image = ''
		if cod[3] == "" or cod[3] is None:
			image = '/imagens/sem_foto.png'
		else:
			image = cod[3]

		corpoTemp.append('<a href="%s" target="_blank">Exibir</a>' % (image)) # Armazena o caminho para a imagem
		corpoTemp.append('<span class="filial">'+str(cod[4])+'</a>') # Armazena a filial
		corpoTemp.append('<span id=%d style="font-size:1.5em" class="text-danger glyphicon glyphicon-trash"></span>' % cod[1]) # Cria o link para exclusao
		tabeCorpo.append(tuple(corpoTemp)) # Apenda no corpo da tabela como tupla

	# Cabecalho da tabela
	tabeCabe = ['NOME', 'CODIGO PROTHEUS', 'IMAGEM', 'FILIAL', 'EXCLUIR']
	tabe = VisaoHTML.Tabela(tabeCabe, tabeCorpo, []) # Cria a tabela

	# Divs para o formulario de cadastro de usuarios
	divs = [VisaoHTML.DivRow() for i in range(6)]
	divs[0].addDiv('',4);divs[0].addDiv('<br/>'+VisaoHTML.selecaoPer('LOJAS', 'lojas', usuario.getLojas(), lj[0], '', 'lojas', uni = True), 4);divs[0].addDiv('',4)
	divs[1].addDiv('',4);divs[1].addDiv('<br/>CODIGO PROTHEUS'+VisaoHTML.entrada('CODIGO PROTHEUS','cod_vendedor','', '', 'cod_vendedor'), 4);divs[1].addDiv('',4)
	divs[2].addDiv('',4);divs[2].addDiv('NOME VENDEDOR'+VisaoHTML.entrada('NOME','nome_vendedor', '', '', 'nome_vendedor'), 4);divs[2].addDiv('',4)
	divs[3].addDiv('',4);divs[3].addDiv('IMAGEM<br/><input class="form-control" type=file name="foto" id="foto" />', 4);divs[3].addDiv('',4)
	divs[4].addDiv('',4);divs[4].addDiv('<br/>'+VisaoHTML.button(' INCLUIR', 'btn-danger glyphicon glyphicon-plus', 'incluir'), 4);divs[4].addDiv('',4)
	divs[5].addDiv('',2);divs[5].addDiv(tabe.getTabela(), 8);divs[5].addDiv('',2)

	corpo = VisaoHTML.titulo('CADASTRO DE VENDEDORES SISTEMA ATENDIMENTO ', 4, 'text-center bg-success')
	corpo += '<form action=/cadastro_vendedor method=POST enctype=multipart/form-data>'+divs[0].getDivRow() + divs[1].getDivRow() + divs[2].getDivRow()+ divs[3].getDivRow() + divs[4].getDivRow() +'</form>'
	corpo += VisaoHTML.tagScript('var filiais = '+str(filiais)+';')
	corpo += VisaoHTML.script('/js/cadastro_vendedor.js?v='+str(time.time()))
	corpo += '<br/>'+ VisaoHTML.titulo('VENDEDORES CADASTRADOS ATENDIMENTO ', 4,'text-center bg-info text-uppercase')
	corpo += divs[5].getDivRow()

	pag.setCorpo(corpo)
	return pag.getPagina()
## Cadastra o vendedor no sistema de atendimento
@route('/cadastro_vendedor', method = 'POST')
def val_cadastro_vendedor():
	loja = request.forms.get('lojas')
	codVendedor = request.forms.get('cod_vendedor')
	nomeVendedor = request.forms.get('nome_vendedor')
	foto = request.files.get('foto')
	try:
		nome, extensao = os.path.splitext(foto.filename);
		nomeImagem = str(loja)+str(codVendedor)+str(extensao)
	except AttributeError as err:
		nomeImagem = 'sem_foto.png'

	#TENTA SALVAR A IMAGEM, CASO NAO CONSIGA NAO SALVA NADA
	try:
		# INSERINDO A IMAGEM DO VENDEDOR
		foto.save(dir_salva_imagem+nomeImagem)
	except IOError:
		pass
	except AttributeError:
		pass

	## Consulta para inserir os dados
	SQL = "INSERT INTO vendedor VALUES(0,'%s', '%s', '%s', '%s')" % (nomeVendedor, codVendedor, '/imagens/'+nomeImagem, loja)
	Modelo.executarConsulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')

	redirect('/cadastro_vendedor')

## Chamada ajax para recuperar o vendedor que ainda nao foi cadastrado no sistema
@route('/recupera_codigo_vendedor', method = 'POST')
def recupera_vendedor_cadastro():
	## Recuperando codigo do protheus
	codigo_protheus = str(request.forms.get('cod_vendedor'))

	## OBTENDO OS VENDEDORES CADASTRADOS
	SQL = "SELECT codigo_protheus FROM vendedor where codigo_protheus = '%s'" % (str(codigo_protheus))
	c = Modelo.Consulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
	if len(c.getRegistros()) >= 1:
		return 'FALSE'
	else:
		return 'OK'

## PAGINA PARA RESPONDER REQUISICAO AJAX PARA EXCLUSAO DO REGISTRO
@route('/excluir_vendedor', method = 'POST')
def excluir_vendedor():
	ID = request.forms.get('ID')
	## Recuperar local da imagem
	SQLIMAGEM = "SELECT imagem FROM vendedor WHERE id_vendedor = %d " % (int(ID))
	c = Modelo.Consulta(SQLIMAGEM, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
	imagem = c.getRegistros()[0][0].replace('/imagens/', dir_salva_imagem)
	if 'sem_foto' in imagem:
		pass
	else:
		try:
			os.remove(imagem)
		except FileNotFoundError as err:
			pass

	
	SQL = "UPDATE atendimento SET id_vendedor = 1 WHERE id_vendedor = %d" % (int(ID))
	SQL2 = "DELETE FROM vendedor WHERE id_vendedor = %d" % (int(ID))
	Modelo.executarConsulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
	Modelo.executarConsulta(SQL2, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
	return 'OK'

## PAGINA PARA RESPONDER A ATUALIZACAO DO CADASTRO DO VENDEDOR
@route('/atualiza_cadastro_vendedor', method = 'POST')
def atualiza_cadastro_vendedor():
	ID,ID_LOJA = str(request.forms.get('ID')).split('&')
	SQL = "UPDATE vendedor SET filial = '%s' WHERE id_vendedor = %d" % (ID_LOJA, int(ID))
	Modelo.executarConsulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
	return 'OK'

## ESTE LOCAL RECEBE O ID E A IMAGEM QUE SE DESEJA ATUALIZAR DO VENDEDOR ESTA INTIMAMENTE LIGADO A CLASSE VENDEDOR EM VISAO_HTML.js
@route('/atualiza_imagem_do_vendedor',method = 'POST')
def val_atualiza_imagem_vendedor():
	ID = request.forms.get('vendedoresImagem')
	imagem = request.files.get('foto')
	## SPLITAMOS O NOME DO ARQUIVO E A EXTENSAO
	nome, ext = os.path.splitext(imagem.filename);
	nomeClassificado = str(ID)+str(ext)
	caminho = dir_salva_imagem+nomeClassificado
	#TENTA SALVAR A IMAGEM
	try:
		# INSERINDO A IMAGEM DO VENDEDOR
		imagem.save(caminho)
	except IOError:
		os.remove(caminho);
		imagem.save(caminho)
	# Agora redimensionando a imagem
	im = Image.open(caminho)
	# Redimensiona a imagem para o tamanho padrao
	im = im.resize((128,128));
	# Rotaciona a imagem a 180 graus. Estou supondo que vão tirar as fotos com o tablet inclinado
	im = im.rotate(90)
	try:
		im.save(caminho)
	except IOError:
		os.remove(caminho)
		im.save(caminho)

	# CASO EXISTA SOBREESCREVE ELA
	SQL = "UPDATE vendedor SET imagem = '%s' WHERE id_vendedor = %d " % ('/imagens/'+nomeClassificado, int(ID))
	Modelo.executarConsulta(SQL, Modelo.my_usuario, Modelo.my_senha, Modelo.my_banco, Modelo.my_servidor, 'mysql')
	redirect('/atendimento')

#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

## Colocando a pagina no ar

run(host = '0.0.0.0', server = 'paste', port = 8080, reloader = True, debug = True)
