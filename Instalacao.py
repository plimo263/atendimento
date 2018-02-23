"""
Autor	: Marcos Felipe da Silva Jardim
versao	: 1.0
data	: 22-02-2018
----------------------------------------------
Historico de versão
v0.1 22-02-2018 Inicio do assistente de instalacao 
v0.2 22-02-2018 Coloracao das mensagens exibidas no terminal
"""
## Tentando realizar as importações
try:
	import os, pymysql, config, sys, time
except ImportError as err:
	print('Uma das bibliotecas não esta presente: \x1b[1;31m%s\x1b[0m' % str(err))
	quit()

# Funcao de criacao das tabelas
def instalar():
	"""
	Esta funcao inicia a instalacao do projeto. Ele 
	percorre por todos os diretorios (exceto template e static) 
	e procura dentro deles o diretorio banco_de_dados. Uma vez 
	encontrado executa o arquivo base.sql para a instalação inicial do 
	aplicativo.
	"""
	print('* Tentativa de conexão ao banco de dados')
	time.sleep(2)
	try: # Tentando se conectar a base de dados
		con = pymysql.Connect(user = config.MY_USUARIO, password = config.MY_SENHA, database = config.MY_BANCO, host = config.MY_SERVIDOR)
		print('\x1b[1;32mOK\x1b[0m')
	except pymysql.err.InternalError as err:
		print('Não foi possível se conectar ao banco de dados %s, ele existe ? :\x1b[1;31m%s\x1b[0m' % (config.MY_BANCO, str(err)));
		print('Abortando ...')
		quit()
	except pymysql.err.OperationalError as err:
		print('Não foi possível se conectar ao SGBD ou o usuario não tem acesso ao banco %s: \x1b[1;31m%s\x1b[0m' % (config.MY_BANCO, str(err)))
		print('Abortando ...')
		quit()
	time.sleep(2)
	
	
	# Lendo o conteudo do arquivo
	with open('banco_de_dados/base.sql') as arq:
		for f in arq.readlines():
			try:
				# Executando a consulta
				cur = con.cursor()
				cur.execute(f);
				cur.close()
			except pymysql.err.ProgrammingError as err:
				print('\x1b[1;31mPossível erro de sintaxe, reportar erro pelo email plimo263@gmail.com:\x1b[0m %s ' % str(err))
			# Quando a tabela existe, preciso que o usuario diga se deseja sobreescreve-la
			except pymysql.err.InternalError as err: 
				# Fatiando a string do erro para pegar o nome da tabela
				aspa_inicio = 1 + str(err).find("'") 
				aspa_fim = aspa_inicio + str(err)[aspa_inicio:].find("'") 
				# Armazenando o nome da tabela aqui
				tabe = str(err)[aspa_inicio:aspa_fim]
				# Pergunta se ela deseja sobreescreve-la
				resp = input('Possívelmente a tabela \x1b[1;31m%s\x1b[0m já existe, deseja sobreescreve-la ? S/N ' % tabe)[0]
				if resp.upper() == 'S':
					cur.execute('DROP TABLE %s' % tabe)
					cur.close()
					print('---------->RECRIANDO A TABELA %s' % tabe)
					cur = con.cursor()
					cur.execute(f);
					cur.close();
				else: # Não deseja sobreescrever ou colocou incorretamente a opção, Mantendo a tabela
					print('Não desejou sobreescreve-la, mantendo a tabela %s' % tabe)
					continue
				
		print('* TABELAS CRIADAS COM SUCESSO!')
		time.sleep(2)


## Ok, verificando se todos os parametros de conexao ao banco de dados estão configurados no config.py
parametros = ['MY_USUARIO', 'MY_SENHA', 'MY_SERVIDOR', 'MY_BANCO'];
print('* Verificando parametros de conexão no modulo config');
time.sleep(2)
for para in parametros:
	if not para in dir(config):
		print('O parametro \x1b[1;31m%s\x1b[0m não existe abortando ...' % para)
		quit()
	if para == 'MY_PORTA' and not isinstance(config.MY_PORTA, int):
		print('A variavel \x1b[1;31mMY_PORTA\x1b[0m em config deve ser um inteiro.')
		print('Abortando ...')
		quit()

print('\x1b[1;32mOK\x1b[0m')

## Tudo certo e verificado, bom, os parametros existem, vamos tentar fazer a conexão ao banco de dados
## Verificando o argumento passado
if sys.argv[1] == 'instalar':
	instalar()

