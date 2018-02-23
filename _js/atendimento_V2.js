
/*

autor: Marcos Felipe da Silva Jardim
versao: 1.0
data: 13-10-2017

---------------------------------------------------------------------------
v1.0: 13-10-2017 Desenvolvimento da classe Loja para manipular questionario, envio de respostas e organização dos vendedores 

*/
// CLASSE LOJA QUE MONITORA OS ATENDIMENTOS E MANTEM AS FILAS
var Loja = function(vendedores){
	this.empresa = '';
	this.loja = '';
	this.vendedorRespondendoQuestionario = {};
	this.vendedores = vendedores;
	this.vendedoresEmAtendimento = [];
	this.objetosVendedores = [];
	this.perguntas = [];
	this.divulgadores = {};
	this.respostas = [];
};

// Metodo para inserir os divulgadores
Loja.prototype.setDivulgadores = function(divulgadores){
	if(typeof divulga == "object"){
		this.divulgadores = divulgadores;
	} else {
		console.log("Somente é aceito objetos divulgadores {}");
	}
}
// Metodo que retorna a representacao html dos divulgadores
Loja.prototype.getDivulgadores = function(){
	var select = '<br/><select style="display:none;position:absolute;margin-left:1em;width:30%" class="form-control" id="divulga" name="divulga"><option selected value="0">NENHUM</option>';
	for(var d in this.divulgadores){
		select += '<option value="'+d+'">'+this.divulgadores[d]+'</option>';
	}
	select += '</select><br/>';
	return select;
}

// Metodo para inserir uma nova pergunta
Loja.prototype.setPergunta = function(pergunta){
	// Verificando se a pergunta é uma string e se a mesma ja existe
	if(typeof pergunta == "string" && this.perguntas.indexOf(pergunta) == -1){
		this.perguntas.push(pergunta);
	}
}

// Metodo que recebe uma matriz de perguntas e insere-as no local
Loja.prototype.setPerguntas = function(perguntas){
	// Verifica se as perguntas sao um array e a coloca em substituicao a this.perguntas
	if(perguntas instanceof Array){
		this.perguntas = perguntas;
	}
}
// Metodo que recebe um array de idVendedor e tempo e salva-o em vendedoresEmAtendimento
Loja.prototype.setVendedoresEmAtendimento = function(array){
	// Primeiro verifica se o parametro enviado e um array e se tem 2 dados;
		if(array instanceof Array && array.length == 3){
			var existe = false;
			// Verifica se o id do vendedor consta em vendedoresEmAtendimento.
			for(var x = 0;x< this.vendedoresEmAtendimento.length;x++){
				if(this.vendedoresEmAtendimento[x].indexOf(array[0]) != -1){
					console.log("O vendedor já existe nos vendedoresEmAtendimento");
					existe = true;
					break;
				}
			}
			if(!existe){ // Se o vendedor nao existe, apende-o no array
				this.vendedoresEmAtendimento.push(array);
			}
		}
};

// Salva Localmente o estado do atendimento. Isto resolve problemas em caso de desligamento ou a pagina web ser fechada.
Loja.prototype.salvarEstadoAtendimento = function(){
	// VERIFICANDO SE O NAVEGADOR TEM SUPORTE AO ARMAZENAMENTO LOCAL
	if(typeof(Storage) !== "undefined"){

		// Gravar os vendedores em atendimento
		localStorage['emAtendimento'] = JSON.stringify(this.vendedoresEmAtendimento); // Gravando localmente o estamos em atendimento
	} else {
		console.log("Navegador não tem suporte ao armazenamento local. Caso fique sem internet ou atualize a pagina, a ordem nao será salva.");
	}
}

// Metodo usado para carregar os vendedores em atendimento
Loja.prototype.carregarEstadoAtendimento = function(){
	// VERIFICANDO SE O NAVEGADOR TEM SUPORTE AO ARMAZENAMENTO LOCAL
	if(typeof(Storage) !== "undefined"){
		// Carrega os vendedores em atendimento
		var vendedores = localStorage.getItem('emAtendimento') != null ? JSON.parse(localStorage.getItem('emAtendimento')) : [] ;
		if(vendedores.length > 0){ // Verifica se existiam vendedores no atendimento, caso exista carrega-os
			this.vendedoresEmAtendimento = vendedores;
		}
	} else {
		console.log("Navegador não tem suporte ao armazenamento local. Caso fique sem internet ou atualize a pagina, a ordem nao será salva.");
	}
}

// Metodo cria os vendedores com base no dicionario enviado e ativa as funcionalidades drag in drop de objetos naFila e emAtendimento
Loja.prototype.iniciaLoja = function(){
	var loja = this; // Recupera a referencia para a loja, vamos usar ela quando precisarmos manipular os vendedores
	loja.salvaEnvioDeDadosOffLine(); // Gera o registro da numeracao local caso a mesma nao exista;

	loja.carregarEstadoAtendimento(); // Carrega os vendedores salvos em atendimento
	// Faz um loop nos vendedores, coloca eles naFila
	for(var v in this.vendedores){
		var vend = new Vendedor(this.vendedores[v][0], this.vendedores[v][1], v);
		this.objetosVendedores[v] = vend; // Recuperando a instancia dos vendedores
		var existe = false; // Verifica se o vendedor estava em atendimento, caso ele estivesse, coloque-o no atendimento com seu tempo
		// Faz um loop para verificar se o vendedor esta ou nao em atendimento
		for(var x = 0;x< this.vendedoresEmAtendimento.length;x++){
			if(this.vendedoresEmAtendimento[x].indexOf(v) != -1){
				vend.tempoAtendimento = this.vendedoresEmAtendimento[x][1];
				vend.dataAtendimento = this.vendedoresEmAtendimento[x][2];
				$('#emAtendimento').append(vend.getVendedor());
				existe = true; // Vendedor encontrado, quebrando busca interna
				break;
			} 
		}
		// Verificando se existe não é verdadeiro, se não é então apendar o vendedor na fila
		if(!existe){
			$('#naFila').append(vend.getVendedor());
		}
	}


	// 
	$('#naFila').sortable({
		opacity: 0.8,
		connectWith:"#emAtendimento",
		start: function() {
			ultimaOrdem = $("#naFila").sortable("toArray");
		},
		stop : function() {
			novaOrdem = $('#naFila').sortable("toArray");
		},
		receive: function(e,ui){ // Evento ativo somente quando o item é recebido
			// Retira fulano da fila e coloca-o em ultimo
			var idDoVendedor = $(ui.item).attr('id');
			var item = $('#naFila #'+idDoVendedor).detach();
			$('#naFila').append($(item));
			// Chamar metodo interno para iniciar o questionario
			var numPerg = 0;
			loja.objetosVendedores[idDoVendedor].finalizaAtendimento();
			loja.vendedorRespondendoQuestionario = loja.objetosVendedores[idDoVendedor];
			loja.iniciaQuestionario(numPerg);

		}

	});

	$('#emAtendimento').sortable({
		connectWith:'#naFila',
					
		start : function(){
			// Recuperando a ultima atualizacao da fila
			var ultimosEmAtendimento = $('#emAtendimento').sortable("toArray");
			
		},
		receive: function(e,ui){ // Evento ativo somente quando o item é recebido
			// Recuperando a ultima atualizacao da fila
			var ultimosEmAtendimento = $('#emAtendimento').sortable("toArray");
			
			// Registrando a hora do vendedor e gravando no armazenamento local seu ID e tempo, para ser usado quando a pagina for recarregada.
			var IDVendedor = $(ui.item).attr('id');
			loja.objetosVendedores[IDVendedor].iniciaAtendimento(); // Registrando tempo de inicio do atendimento
			// Definindo o vendedor no array de vendedoresEmAtendimento
			loja.setVendedoresEmAtendimento([loja.objetosVendedores[IDVendedor].id, loja.objetosVendedores[IDVendedor].tempoAtendimento, loja.objetosVendedores[IDVendedor].dataAtendimento]);
			loja.salvarEstadoAtendimento(); // Salvando localmente o estado dos vendedores em atendimento
					
			}
		
	});
}

// Metodo que inicia o questionario colocando as perguntas para serem feitas(claro, se tiver perguntas)
Loja.prototype.iniciaQuestionario = function(numPerg){
	var fechar = false; // Esta variavel controla quando todas as respostas foram repassadas e o modal de perguntas nao pode ser mais aberto

	// Exclui qualquer possibilidade de existir um modal
	$('#modalPerguntas').remove();// Remove algum modal caso ele exista, para ser criado outro modal;

	// Variaveis que faram referencia ao cabecalho, corpo e rodape do modal
	var cabecalho, corpo, rodape;

	// Salva a referencia do objeto loja para ser usado em outros lugares
	var loja = this;
	// Variavel que vai representar o modal
	var mod = "";
	// Somente retoques, insere a logo da Diniz no modal
	var logo = new Img("/imagens/favicon.ico");
	cabeModal = new Titulo(logo.getImg()+" ATENDIMENTO DINIZ", 5, "text-left text-danger", "erro");

	cabecalho = cabeModal.getTitulo();// Como é algo comum em todas as perguntas, vou manter aqui, caso precise sera alterado em outro lugar
	// Verifica se a quantidade de perguntas é igual a zero
	if(numPerg == 0){
		// Criando botao do rodape, com enviar
		var btEnviar = new Botao("&nbsp;ENVIAR&nbsp;", "btn btn-xs btn-success pull-right", "enviar");
		var btCancelar = new Botao("&nbsp;CANCELAR&nbsp;", "btn btn-xs btn-danger", "retornar");
		btCancelar.addAtributo("style='position:relative;margin-right:34.3em;'");
		var rodapeModal = new Para(btCancelar.getBotao()+btEnviar.getBotao());
		rodape = rodapeModal.getPara();
		corpo = loja.perguntas[numPerg]; // Gerando corpo baseado na pergunta
		
	} else if(numPerg < this.perguntas.length){
		
		// Criando botao do rodape, com enviar e retornar
		var btEnviar = new Botao("&nbsp;ENVIAR&nbsp;", "btn btn-xs btn-success pull-right", "enviar");
		var btVoltar = new Botao("&nbsp;RETORNAR&nbsp;", "btn btn-xs btn-danger", "retornar");
		btVoltar.addAtributo("style='position:relative;margin-right:34.3em;'");
		var rodapeModal = new Para(btVoltar.getBotao()+btEnviar.getBotao(), "", "rodape_do_modal");
		rodape = rodapeModal.getPara();
		// Verificar qual atende a proxima pergunta e defini-la
		switch(numPerg){
			case 1:
				corpo = loja.perguntas[numPerg];
				break;
			case 2:
				// Agora precisamos verificar a resposta para montar a proxima pergunta
				switch(loja.respostas[numPerg-1]){
					case "venda":
						// Montar a proxima pergunta
						corpo = loja.perguntas[numPerg];
						break;
					case "nao_venda":
						// Montar a proxima pergunta
						corpo = loja.perguntas[numPerg];
						break;
					case "ajuste_conserto_montagem_pagamento":
						// Montar a proxima pergunta
						fechar = true;
						break;
					case "entrega":
						// Montar a proxima pergunta
						corpo = loja.perguntas[numPerg+3];
						break;
					case "troca_assistencia":
						// Montar a proxima pergunta
						fechar = true;
						break;
				}
				break;
			case 3:
				// Vamos verificar entre as opçoes que restaram para montar o proximo estagio da pergunta
				switch(loja.respostas[numPerg-2]){
					// Esta parte e confusa, mas facil de entender, estou verificando a penultima resposta, com base
					// nela vou escolher a 4 pergunta a ser feita, se foi venda, mostro opcoes de venda, nao_venda ou entrega
					// Se foi uma venda entao vamos exibir a pergunta de venda
					case "nao_venda":
						corpo = loja.perguntas[numPerg];
						break;
					// Se for nao venda exibir a pergunta que sucede
					case "venda":
						corpo = loja.perguntas[numPerg+1];
						break;
					// Agora verificar se neste caso foi uma entrega
					case "entrega":
						fechar = true;
						break;
				}
				break;
			case 4:
				// Agora as perguntas acabaram, vou alterar a opcao fechar para poder montar as respostas a serem exibidas
				fechar = true;
				break;
			
		}

	}

// EXIBE AO USUARIO TODAS AS RESPOSTAS, E PEDE SUA CONFIRMACAO
	if(fechar){
		var para = new Para();
		para.setConteudo("As respostas estão corretas ? ");
		corpo = '<br/>'+para.getPara()+'<br/>';
		// Verificar se todas as respostas repassadas estao corretas
		for(var x = 0;x < loja.respostas.length;x++){
			if(x == 0){// Primeira pergunta a respondida, sexo masculino e feminino
				para.setConteudo("SEXO: "+'<span style="padding-left:13.8em">'+loja.respostas[x]+'</span>');
				corpo += para.getPara();
			} else if(x == 1){

				para.setConteudo("TIPO DE ATENDIMENTO: "+'<span style="padding-left:5em">'+loja.respostas[x]+'</span>');
				corpo += para.getPara();
			} else if(x == 2){ // Agora tenho que verificar como foi a segunda resposta para definir o que colocar no corpo
				switch(loja.respostas[x-1]){
					case "venda":
					case "nao_venda":
						para.setConteudo("COM RX: "+'<span style="padding-left:12.5em">'+loja.respostas[x]+'</span>');
						corpo += para.getPara();
						break;
					case "entrega":
						para.setConteudo("NO PRAZO: "+'<span style="padding-left:11.3em">'+loja.respostas[x]+'</span>');
						corpo += para.getPara();
						break;
				}

			} else if(x == 3){ // Aqui somente venda e nao venda chegam, teremos que verificar se foi venda ou nao venda
				switch(loja.respostas[x-2]){
					case "venda":
						para.setConteudo("TIPO DA VENDA: "+'<span style="padding-left:8.8em">'+loja.respostas[x]+'</span>');
						corpo += para.getPara();
						break;
					case "nao_venda":
						para.setConteudo("MOTIVO DE NÃO VENDA: "+'<span style="padding-left:4.8em">'+loja.respostas[x]+'</span>');
						corpo += para.getPara();
				}

			}
		}
		
	}
	mod = new Modal(cabecalho, corpo, rodape, "", "modalPerguntas");
	// Define que o modal sera estatico e seta a pergunta atual	
	mod.setTipoModal(false);
	// Excluir eventos vinculados a enviar e retornar
	$('#enviar, #retornar').unbind('click');

	$('body').append(mod.getModal()); // Apenda o modal no corpo de body


// VERIFICA AS RESPOSTAS E POSICIONA OS BOTOES AUXILIARES NO LAYOUT DE FORMA ORGANIZADA
	if(fechar){ // Depois que o modal foi criado adicionamos um botao caso o questionario tenha sido respondido
		// Criando o botao que informa quais sao os divulgadores "Como conheceu a loja"
		var btDivul = new Botao("Como conheceu a loja ?", "btn btn-xs", "divulgador");	
		
		// Verificando se o tipo de atendimento não é uma venda e não é uma não venda.Isto vai posicionar o layout com seguranca
		if(loja.respostas[1] != "venda" && loja.respostas[1] != "nao_venda"){
			btDivul.addAtributo('style="display:inline-block;background-color:#8B8989;color:white;font-weight:bold;margin-right:10em"');
			$('#retornar').css({"margin-right":"11.5em"});
		} else if(loja.respostas[1] == "venda"){
			var btRetorno = new Botao("Retorno", "btn btn-xs", "retorno_nao_venda"); // Botao que vai exibir os clientes que nao retornaram da nao venda
			btRetorno.addAtributo('style="display:inline-block;background-color:#8B8989;color:white;font-weight:bold;margin-right:5em"'); // Ajustando o botao no modal
			btDivul.addAtributo('style="display:inline-block;background-color:#8B8989;color:white;font-weight:bold;margin-right:5em"'); // Adicionando atributo no modal
			// VERIFICANDO QUANDO O NAVEGADOR É UM ANDROID E QUANDO NAO É PARA DETERMINAR A MARGIN DO RETORNO
			if(navigator.appVersion.toLocaleLowerCase().search('android') == -1){
				$('#retornar').css({"margin-right":"6.3em"}); // Quando tiver quatro campos no rodape, ajustar o retornar para um recuo de 6.3em
			} else {
				$('#retornar').css({"margin-right":"8em"});
			}

			$('#enviar').before(btRetorno.getBotao()); // Apendar o retorno antes do enviar
		} else if(loja.respostas[1] == "nao_venda"){
			var btDadosDoCLiente = new Botao("Dados do Cliente", "btn btn-xs", "mais_info"); // Botao que exibira um formulario para adicao de mais dados do cliente
			btDadosDoCLiente.addAtributo('style="display:inline-block;background-color:#8B8989;color:white;font-weight:bold;margin-right:4.3em"'); // Atributos para posicionar o botao no modal
			btDivul.addAtributo('style="display:inline-block;background-color:#8B8989;color:white;font-weight:bold;margin-right:3.5em"'); // Adicionando atributo no modal
			// VERIFICANDO QUANDO O NAVEGADOR E UM ANDROID PARA DETERMINAR A MARGIN DO BOTAO RETORNAR
			if(navigator.appVersion.toLocaleLowerCase().search('android') == -1){
				$('#retornar').css({"margin-right":"4em"}); // Quando tiver quatro campos no rodape, ajustar o retornar para um recuo de 6.3em
			} else {
				$('#retornar').css({"margin-right":"5.7em"});
			}

			
			$('#enviar').before(btDadosDoCLiente.getBotao()); // Apenda o botao que vai exibir um form com os dados do cliente

		}

		$('#retornar').after(btDivul.getBotao()); // Adicionando o botao apos o retorno
		// Inclusao de uma div que vai registrar os dois tipos de formularios auxiliares, do divulgador / retorno ou divulgador / dados do cliente
		$('#rodape_do_modal').append('<div id=formularios></div>');
		// Apendando o formulario dos divulgadores
		$('#formularios').append(this.getDivulgadores());
		// Apendando o formulario para preenchimento dos dados referentes a informacoes do cliente
		$('#formularios').append(this.getDadosDoCliente());
		// INCLUINDO OS CAMPOS DE NUMERO E VALOR DE TELEFONE
		$("input.valor").mask('000.000,00', {reverse:true});
		$("input.telefone").mask("(99) 99999-9999");
		// Capturando evento de campos input quando pressionado enter
		$('input').bind('keypress',
		 function(e){ 
		 	if(e.which == 13 || e.keyCode == 13){ // Se o enter for pressionado
		 		var atual = $('input:visible'); // Recuperando todos os inputs visiveis
		 		var indice = atual.index(e.target) + 1; // Alterando para o proximo input
		 		var seletor = $(atual[indice]).focus(); // Usando o indice para acessar o array e definir focus para o proximo campo
		 		// Se o proximo nao existir, entao manter foco no atual
		 		if(seletor.length == 0){
		 			e.target.focus();
		 		}
		 	} 
		 });
		$('#formularios').append('<div id="tabela" style="display:none;"></div>'); // Adicionando a div para a tabela de retorno de nao venda
		// Apendar a tabela de retorno de nao venda
		this.setRetornoNaoVenda();
		// Criando o evento do divulgador que quando o botao é clicado ele exibe o formulario
		loja.exibirFormulario();
	}

	
	// Cria um evento de click que vai fazer o rodizio das perguntas
	$('#enviar').bind('click', function(e){
		e.preventDefault();
		if(fechar){// Vamos montar o array para submeter os dados para o metodo de envio
			loja.respostas[4] = $('.nome').val();loja.respostas[5] = $('.telefone').val();
			loja.respostas[6] = $('.produto').val();loja.respostas[7] = $('.valor').val().replace('.','').replace(',','.');
			loja.respostas[8] = $('#divulga').val();
			if(loja.respostas[1] == "venda"){ // Se for uma venda, vamos ver se é retorno
				var retorno = $('[name=id_do_atendimento]:checked').val();
				if(retorno != "N"){ // É um retorno, vamos registrar esta informacao
					loja.respostas[9] = retorno;

				}
			}
			loja.enviarQuestionario();// Enviando o questionario para validacao
			
		} else {
			// Recupera a resposta, e passa para a proxima pergunta
			loja.respostas[numPerg] = $('[name="tipoAtendimento"]:checked').val();
			numPerg++;
			$("#modalPerguntas").remove();

			loja.iniciaQuestionario(numPerg);
		}
	});
	// Cria um evento de click para retornar a pergunta
	$('#retornar').bind('click', function(e){
		e.preventDefault();
		var texto = $(this).text();
		// Se o botao for o de cancelar, zerar as respostas e nao reabrir o modal
		if(texto.search('CANCELAR') != -1){
			numPerg = 0;
			loja.respostas = new Array();
			$('#modalPerguntas').remove();
			var devolverVendedor = $('#naFila p#'+loja.vendedorRespondendoQuestionario.id).detach();
			$('#emAtendimento').append(devolverVendedor);
			return false;
		}
		numPerg--;
		$('#modalPerguntas').remove();
		loja.iniciaQuestionario(numPerg);
	});

	mod.executaModal(); // Executa o modal com a pergunta atual
	$('.modal-header img, .modal-body p:first').css({'margin-top':'-1.5em'}); // Ajustando a imagem no modal para nao ocupar muito na tela
	$('.modal-header img').css({'margin-bottom':'-1.5em'}); // Ajustando para o cabecalho caber na tela
			
}

Loja.prototype.trocaImagemNome = function(idDoBotao){
	var loja = this;
	// faz um loop por todos os vendedores e troca suas imagens, caso o botao tenha sido clicado
	$('#'+idDoBotao).bind('click', function(e){
		e.preventDefault();
		if($(this).text().search('EXIBIR NOMES') != -1){
			$(this).text('EXIBIR IMAGENS');
			$(this).removeClass('btn-danger').addClass('btn-success');
		} else {
			$(this).text('EXIBIR NOMES');
			$(this).removeClass('btn-success').addClass('btn-danger');
		}


		for(var v in loja.objetosVendedores){
			loja.objetosVendedores[v].trocaExibicao();
		}
	});
}

// Metodo que vai definir qual formulario exibir, dependendo a segunda resposta no formulario
Loja.prototype.exibirFormulario = function(){
	// Verifica quais formularios estaram disponiveis
	if(this.respostas[1] == "venda"){
		var loja = this;
		// Formularios disponiveis são do divulgador e retorno de nao venda, lincar eventos para os botoes divulgador e retorno_nao_venda
		$('#divulgador, #retorno_nao_venda').bind('click', function(e) {
			e.preventDefault();
			var idDoBotao = $(this).attr('id');
			if(idDoBotao == 'divulgador'){ // Verificando se o formulario ja esta sendo exibido
				$('#tabela').slideUp();$('#divulga').slideDown();  // Exibir formulario do divulgador e oculta o retorno de nao venda
				
			} else {
				$('#divulga').slideUp();$('#tabela').slideDown(); // Oculta o divulgador e exibe os retornos
				$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
			}

		});
	} else if(this.respostas[1] == "nao_venda"){
		var loja = this;
		// Formularios disponiveis sao o divulgador e dados do cliente, para futuro retorno de nao venda
		$('#divulgador, #mais_info').bind('click', function(e){
			e.preventDefault();
			var idDoBotao = $(this).attr('id');
			if(idDoBotao == 'divulgador'){ // Verificando se o formulario ja esta sendo exibido
				$('#dados_do_cliente').slideUp();$('#divulga').slideDown();  // Exibir formulario do divulgador e oculta o formulario de retorno
			} else {
				$('#divulga').slideUp();$('#dados_do_cliente').slideDown(); // Oculta o divulgador e exibe o formulario de retorno
			}
		});
	} else {
		$('#divulgador').bind('click', function(e){
			e.preventDefault();	$('#divulga').slideDown();});
	}
}

//Metodo onde se obtem os dados do cliente
Loja.prototype.getDadosDoCliente = function(){
	var formu = '<div style="display:none;" id="dados_do_cliente">';
	formu += '<label style="margin-right:70%">NOME: <input type=text value="" name=nome_cliente class="nome form-control" /></label>';
	formu += '<br/><label style="margin-right:70%">TELEFONE: <input type=text value="" name=telefone class="telefone form-control" /></label>';
	formu += '<br/><label style="margin-right:70%">PRODUTO: <input type=text value="" name=produto class="produto form-control" /></label>';
	formu += '<br/><label style="margin-right:70%">VALOR: <input type=text value="" name=valor class="valor form-control" /></label></div>';


	return formu;

}

// Metodo para recuperar os clientes que nao compraram por algum motivo
Loja.prototype.setRetornoNaoVenda = function(){

	$('#tabela').empty(); // Remove a tabela se ela existir

	var lojas = this;
	// Consulta ajax para recuperar todos as as não vendas
	$.ajax({
		url:'/recupera_nao_venda', method: 'POST', data:{loja:lojas.loja}
	}).done(function(data){
		
		// Criando a tabela
		 t = new Tabela(['CLIENTE','ID ATENDIMENTO'], JSON.parse(data), 'table responsive table-striped minhaTabela');
		 $('#tabela').html(t.getTabela()); // Apenda a tabela criada

		$('.minhaTabela').DataTable({"bPaginate": false,"ordering" : true,
            "order" : [1],"fixedColumns":[1],"scrollY": 250,"scrollCollapse": true,
            "scrollX": true,"info" : false,"responsive": true,"autoWidth": false,
            "search" : {"regex": true}, retrieve: true,"language": {"search": "Procurar na tabela",
      		"emptyTable" : "Nao ha dados","zeroRecords": "Sem registros com valor informado","decimal":",","thousands":"."}});
	}).fail(function(f){
		console.log('Erro');
	});
};

// Metodo que envia o questionario para ser respondido
Loja.prototype.enviarQuestionario = function(){
	var loja = this;
	/* CRIANDO O ARRAY PARA ENVIO DOS DADOS, VINCULANDO CADA DADO A SUA POSICAO E ENVIANDO */
	var arrayDeDados = new Array();
	arrayDeDados[0] = loja.vendedorRespondendoQuestionario.id;
	arrayDeDados[1] = loja.vendedorRespondendoQuestionario.tempoAtendimento;
	arrayDeDados[2] = loja.vendedorRespondendoQuestionario.tempoFinalizaAtendimento;
	arrayDeDados[3] = loja.vendedorRespondendoQuestionario.dataAtendimento;
	arrayDeDados[4] = loja.respostas[0];
	arrayDeDados[5] = loja.respostas[1];
	arrayDeDados[6] = typeof loja.respostas[2] != "undefined" ? loja.respostas[2] : "";
	arrayDeDados[7] = typeof loja.respostas[3] != "undefined" ? loja.respostas[3] : "";

	arrayDeDados[8] =  loja.respostas[4] != "" ? loja.respostas[4] : "";
	arrayDeDados[9] =  loja.respostas[5] != "" ? loja.respostas[5] : "";
	arrayDeDados[10] = loja.respostas[6] != "" ? loja.respostas[6] : "";
	arrayDeDados[11] = loja.respostas[7] != "" ? loja.respostas[7] : 0.00;

	arrayDeDados[12] = typeof loja.respostas[8] != "undefined" ? loja.respostas[8] : "";
	if( typeof loja.respostas[9] != "undefined"){ // Se teve algum retorno, enviamos o ID do atendimento de retorno
		arrayDeDados[13] = loja.respostas[9];
	} 
	// Lipando o tempo do vendedor que respondeu o formulario e retirando ele dos que estao em atendimento
	for(var x=0;x < loja.vendedoresEmAtendimento.length;x++){
		var indice = loja.vendedoresEmAtendimento[x].indexOf(loja.vendedorRespondendoQuestionario.id);
		if(indice != -1){
			loja.vendedoresEmAtendimento.splice(indice, 1); // Removendo o vendedor dos atendimentos e salvando o armazenamento local
			loja.salvarEstadoAtendimento();
			// Retirando o tempo registrado neste vendedor
			$('p#'+loja.vendedorRespondendoQuestionario.id).find('time').empty();
			break;
		}
	}
	console.log(arrayDeDados); // Log do array

	// Enviando as respostas para o servidor
		$.ajax({
			method: 'POST', url: '/atendimento', data: {dados:arrayDeDados.toString()}
		}).done(function(data){
		//	console.log(JSON.parse(data));
			
		}).fail(function(){

			// Armazenar localmente os dados e deixar um script de loop verificando até que a conexão seja 
			// estabelecida
			var ID_LOCAL = parseInt(localStorage.getItem('numeracaoLocal'))+1; // Obter o ID atual para gerir o armazenamento Local
			localStorage.setItem(ID_LOCAL, arrayDeDados); // Usando o ID atual para salvar os dados no armazenamento local
			localStorage.setItem('numeracaoLocal', parseInt(ID_LOCAL)); // Acumulando o ID para ser o proximo usado
		});

	$("#modalPerguntas").remove(); // Fechando o modal, foi encerrado o envio de respostas

};

// Metodo que faz envio de dados offline
Loja.prototype.enviarQuestionarioOffLine = function () {
		
		if(parseInt(localStorage.getItem('numeracaoLocal')) >= 1){
			// Realizar loop sobre cada dado do armazenamento Local e tentar enviar os dados para o servidor
			for(var i in localStorage){
				// Se a chave (i) nao for numeracaoLocal realizaremos uma chamada de ajax
				if(i != 'numeracaoLocal'){
					// Enviando as respostas para o servidor
				
					$.ajax({
						method: 'POST', url: '/atendimento', data: {dados:localStorage.getItem(i)}
					}).done(function(data){
						console.log(data);
						if(data){
							var contagem = parseInt(localStorage.getItem('numeracaoLocal')) - 1; // Decrementando o contador em um
							localStorage.setItem('numeracaoLocal', contagem); // definindo o contador de numeracaoLocal
							localStorage.removeItem(parseInt(i)); // Removendo o item enviado
						}
					}).fail(function(){
						console.log('continue tentando');
						$('#erro').text('* VERIFICAR CONEXÃO COM A INTERNET');
					});
				}
			}

		} else {
			localStorage.clear(); // Zerando o localStorage e gerando a numeracaoLocal a partir do zero
			localStorage.setItem('numeracaoLocal',0);
			loja.salvarEstadoAtendimento();
			$('#erro').text('');
		}
};

// Metodo que gera a numeracao local, caso a mesma nao exista
Loja.prototype.salvaEnvioDeDadosOffLine = function(){
	// Somente cria a variavel de armazenamento local caso a mesma nao exista
	if(localStorage.getItem('numeracaoLocal') == null){
		localStorage.setItem('numeracaoLocal', 0);
	}
}


//// TODAS AS PERGUNTAS


var perguntas = ['<div class="radio"><p class="text-center text-uppercase">Qual o sexo do cliente ?</p> \
  <label><input type="radio" value="M" name="tipoAtendimento"> Masculino </label><br/><br/> \
  <label><input type="radio" value="F" checked name="tipoAtendimento"> Feminino </label> \
  </div>', 
  
  '<div class="radio"><p class="text-center text-uppercase">Qual foi o tipo de atendimento ?</p> \
  <label><input type="radio" value="venda" checked name="tipoAtendimento"> Venda</label><br/><br/> \
  <label><input type="radio" value="nao_venda" name="tipoAtendimento"> Não Venda</label><br/><br/> \
  <label><input type="radio" value="ajuste_conserto_montagem_pagamento" name="tipoAtendimento"> Ajuste-conserto-montagem-pagamento</label><br/><br/> \
  <label><input type="radio" value="entrega" name="tipoAtendimento"> Entrega</label><br/><br/> \
  <label><input type="radio" value="troca_assistencia" name="tipoAtendimento"> Troca/assistência</label><br/></div>',

  '<div class="radio"><p class="text-center text-uppercase"> COM RX OU SEM RX</p> \
  <label><input type="radio" value="com_rx" checked name="tipoAtendimento"> Com RX</label><br/><br/> \
  <label><input type="radio" value="sem_rx" name="tipoAtendimento"> Sem RX</label> \
  </div>',

  '<div class="radio"><p class="text-center text-uppercase"> MOTIVO DA NAO VENDA</p> \
  <label><input type="radio" value="restricao_spc" checked name="tipoAtendimento"> Restrição SPC</label><br/><br/> \
  <label><input type="radio" value="preco" name="tipoAtendimento"> Preço</label><br/><br/> \
  <label><input type="radio" value="prazo_de_entrega" name="tipoAtendimento"> Prazo de entrega</label><br/><br/> \
  <label><input type="radio" value="falta_de_produto" name="tipoAtendimento"> Falta de produto</label><br/><br/> \
  <label><input type="radio" value="reserva" name="tipoAtendimento"> Reserva</label><br/><br/> \
  <label><input type="radio" value="encaminhamento_medico" name="tipoAtendimento"> Encaminhamento médico</label><br/><br/> \
  <label><input type="radio" value="orcamento" name="tipoAtendimento"> Orçamento</label><br/></div>',

  '<div class="radio"><p class="text-center text-uppercase">VENDA</p> \
  <label><input type="radio" value="ajuste" checked name="tipoAtendimento"> Ajuste / Pagamento </label><br/><br/> \
  <label><input type="radio" value="retorno_encaminhamento_medico" name="tipoAtendimento"> Retorno encaminhamento médico </label><br/><br/> \
  <label><input type="radio" value="retorno_reserva" name="tipoAtendimento"> Retorno de reserva </label><br/><br/> \
  <label><input type="radio" value="indicacao" name="tipoAtendimento"> Indicação </label><br/><br/> \
  <label><input type="radio" value="retorno_orcamento" name="tipoAtendimento"> Retorno de orçamento </label><br/><br/> \
  <label><input type="radio" value="normal" checked name="tipoAtendimento"> Normal </label></div>',

  '<div class="radio"><p class="text-center text-uppercase">ENTREGUE NO PRAZO ? </p> \
  <label><input type="radio" value="sim" checked name="tipoAtendimento"> SIM </label><br/><br/> \
  <label><input type="radio" value="nao" name="tipoAtendimento"> NÃO </label> \
  </div>'];

 /* TODO O SITE EXECUTA AQUI CRIANDO UM OBJETO LOJA, REGISTRANDO SUA EMPRESA/FILIAL, CONFIGURANDO AS PERGUNTAS, OS DIVULGADORES, INICIANDO A LOJA,
 COLOCANDO A ROTINA DE QUESTIONARIO OFFLINE PARA RODAR E ADICIONANDO O EVENTO QUE TROCA IMAGENS POR NOMES NO ATENDIMENTO */

var loja = new Loja(vendedores); // Instancia a loja inserindo as informacoes para criacao dos vendedores
//loja.empresa = emp;
loja.loja = loj; // Recupera a empresa e a loja disponivel
loja.setPerguntas(perguntas); // Realizando uma pergunta
loja.setDivulgadores(divulga); // Define os divulgadores

loja.iniciaLoja(); // Inicia a criacao da loja

setInterval("loja.enviarQuestionarioOffLine()", 30000); // Rotina para verificar e reenviar os questionarios que nao foram enviados ainda.

loja.trocaImagemNome('trocaImagemNome'); // Envia o id de um botao para alterar entre as imagens e nomes

// ESTA FUNCAO TENTA ENVIARA IMAGEM DO VENDEDOR, CASO TUDO OCORRA CORRETAMENTE ENTÃO A IMAGEM É ENVIADA
function enviarImagemDoVendedor(){
	$('#enviarFoto').bind('click', function(e){
		e.preventDefault();
		var formulario = new Formulario();
		var validado = formulario.validaArquivo('foto', ['jpg','JPG', 'PNG', 'png', 'jpeg','JPEG']);
		var nomeVendedorValidado = $('#vendedoresImagem').val();
		if(validado){
			$('form').submit();
		}
	});
}

$(document).ready(function(){
	var navegador = navigator.userAgent.toUpperCase();
	if((navegador.indexOf("ANDROID") == -1)){
		return false;
	}
	$('#baixar').html('<a href=# id="atualizaImagemVendedor"><span class="text-danger glyphicon glyphicon-camera"></span> IMAGEM </a>').removeClass('loja01').fadeIn();
	// Ligar o evento onclick para que desça um modal com um formulario para envio da imagem do vendedor selecionado
	$('#atualizaImagemVendedor').bind('click',function(e){
		e.preventDefault();
		// Excluindo o modal do vendedor para criar outro
		$('#meuModalFotoVendedor').remove();
		// Realizar um loop para criar um array com o id do vendedor e seu nome
		var nomeEIdVendedor = [];
		for(var i in vendedores){
			nomeEIdVendedor.push([i, vendedores[i][0]]);
		}
		// Bom, agora montar um select com todos os vendedores
		var selecao = new Selecao('vendedoresImagem', 'form-control','vendedoresImagem');
		selecao.addItens(nomeEIdVendedor);
		var botao = new Botao('ENVIAR FOTO', 'btn btn-xs btn-danger', 'enviarFoto');
		// Vamos agora criar o form responsavel por compactar o file e a selecao de vendedores
		var form = '<form enctype="multipart/form-data" action="/atualiza_imagem_do_vendedor" method="post" >';
		form += selecao.getSelecao();
		form += '<br/><input type=file class="form-control" name=foto id=foto /><br/>';
		form += botao.getBotao()+'</form>';
		// Agora vamos criar o modal
		var mo = new Modal('<h5 class="text-left text-danger"><img src="/imagens/favicon.ico" class="" id="" style="margin-top: -1.5em; margin-bottom: -1.5em;"> ATUALIZE A IMAGEM</h5>',
			form, '<button type="button" class="btn btn-default" data-dismiss="modal">FECHAR</button>', '', 'meuModalFotoVendedor');
		// Define o tipo estatico
		mo.setTipoModal('static');
		// Apendando o modal
		$('body').append(mo.getModal());
		// Chama o modal para fireground
		mo.executaModal();
		// EXECUTA A FUNCAO QUE LIGA O EVENTO DE ENVIO DA IMAGEM DO VENDEDOR
		enviarImagemDoVendedor();

	});

});
