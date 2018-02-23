# atendimento
Aplicativo web que controla fluxo de entrada e saída das lojas
# Instalação
Para instalar este aplicativo é necessário atender os seguintes pré-requisitos


* SGBD MySQL instalado e uma base de dados criada
* Python3.5 e/ou superior
* Bibliotecas Python de terceiros: bottle pyllow openpyxl paste requests pymysql

Depois de atendidos, configure o arquivo config.py preenchendo as variaveis corretamente

* MY_USUARIO = 'usuario_do_banco'
* MY_SENHA = 'senha_usuario_do_banco'
* MY_SERVIDOR = 'endereco_do_servidor'
* MY_BANCO = 'nome_do_banco_de_dados_criado'

Execute o script Python chamado Instalacao.py passando o parametro instalar dentro da pasta do projeto

* python3 Instalacao.py instalar

As tabelas para armazenamento dos dados serão criadas e no fim do processo se tudo ocorrer bem receberá uma mensagem informando que as tabelas foram instaladas com sucesso.

# Execução do aplicativo
Para executa-lo, dentro da pasta do projeto digite o seguinte comando

* python3 controlador.py 

O projeto é iniciado na porta 8080, caso não queira esta porta altere o arquivo controlador.py na ultima linha no parametro port coloque a porta desejada.

Abra no navegador e digite o usuario e senha informados abaixo:

usuario: admin
senha: $ODamemodb

Pronto, terá acesso a parte inicial do aplicativo, poderá criar usuarios, atribuir menus, criar vendedores, divulgadores e outras coisas mais.


