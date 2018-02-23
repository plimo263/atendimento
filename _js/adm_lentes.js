/*
autor:	Marcos Felipe da Silva
data:	02-02-2017
versão:	1.0

Objetivo: Verificar o envido de formularios para validacao,
		  o da criacao de tabela, preenchimento dos valores
		  e remoção dos mesmos

*/

$("#criar").click(function(){
	var quantidade = $("#quantCampo").val();
	var nomeTabela = $("#tabelaNome").val();
	var familiaTabela = $("#tabelaFamilia").val();
	// Vamos verificar quantos campos conteram a tabela,
	// se for 3, 4, 5 não importa, o que importa é que seja um numero
	
	if(nomeTabela.length >= 1 && familiaTabela.length >= 1){
		if(quantidade >= 1){
			$("#formulario1").hide().parent().append("<div id='campos'></div>");
			// Criar os campos pela quantidade informada
			// pelo usuario, para que ele faça a inserção dos valores
			// baseada na quantidade definida pelos usuarios.
			$("#campos").append("<p class='text-center text-uppercase bg-success '>Defina as colunas da tabela <span class='text-danger'>" + nomeTabela + "</span>.</p>");
			for(x = 0; x < quantidade;x++){
				$("#campos").append("Campo numero " + (x+1) + "<input type='text' name='campos[]' class='form-control nomeCampo' /><br/>");
			}
			// Botão de submissão do formulario, na verdade sua unica funcao é ativar o envio
			$("#campos").append("<button class='btn btn-success' id='adicionar'>Adicionar</button>");
			// Ativando o click no botao
			$("#adicionar").bind('click', function(){
				// Criando uma estrutura de array
				var todosCampos = new Array();
				// Variavel que informa problemas nos campos em branco
				var campoEmBranco = false;
				// Realizando um loop e retirando todos os valores dos campos
				$("input.nomeCampo").each(function(index, value){
						// Verificando se o campo esta preenchido
						if($(this).val() == ""){
							alert('Campo em branco não permitido');
							campoEmBranco = true;
							return false
						}
						todosCampos[index] = $(this).val();
					});
				// Se o campo esta em branco, saindo
				if(campoEmBranco == true){
					return false;
				}
				// Convertendo os campos do array em uma string separada por virgula	
				camposTabela = todosCampos.toString();
				// Enviando o relatorio pelo ajax, atualizando e recuperando a resposta
				$.ajax({
				 method: 'POST',
				 url: '/validaAddTabLente',
				 data: {camposTabela: camposTabela, nomeTabela : nomeTabela, familiaTabela: familiaTabela}	
					
				}).done(function(data){
					alert(data);
					window.setTimeout('location.reload()', 1000);
				}).fail(function(data){
					alert('Falhou no recebimento da resposta');
					});
				});
		} else {
			$("#erro").text('Favor colocar somente números e numeros a partir de 1.');
		}
	} else {
			$("#erro").text('Escolha um nome para a tabela.');
		
	}
});

// Variaveis que armazenao os valores do primeiro campo td de todo o corpo.
// Para que isto ? Uso este ID para formular atualizacao/remocao de formularios
/* A logica é simples, removo o primeiro th do cabecalho
 * depois removo o primeiro td do tfoot.
 * No final faco um loop sobre todos os tr's do tbody e apendo o nome da tabela
 * com o id_do primeiro campo do td de cada tr. Assim obtenho nome_da_tabela, id_do_registro
 * */

// Ocultar o primeiro td do cabecalho e do corpo de todas as tabelas.
// Sem se esquecer de recuperar seus valores
$("table thead").children().each(function(index, value){
	
	$(this).children().first().remove();
});
// Remover o primeiro td encontrado
$("table tfoot").children().each(function(){
	$(this).children().first().remove();
});
// Recuperar o valor de id do primerio campo, o nome da tabela e depois remover o primeiro td(que tem o ID)
// E depois cria um novo atributo chamado data que tem os valores 
$("table tbody").children().each(function(index, value){
	var tabelaID = $(this).parent().parent().prev().val() + ','+ $(this).children().first().text();
	$(this).children().first().remove();
	$(this).append("<td class='text-center '><a href='#' data='"+tabelaID+"' class='removerRegistro'>Remover</a>&nbsp;&nbsp;  <a href='#' data='"+tabelaID+"' class='atualizarRegistro'>Atualizar</a></td>");
});

// FUNCAO USADA PARA CRIAR OS CAMPOS DE ENTRADA NA TABELA
$("table thead tr").children().each(function(){
	 $(this).parent().parent().next().next().children().append("<td><input type=text name=valor class='form-control' /></td>");
});
// Incluir ultimo campo do cabecalho
$("table thead tr").append("<th>Remover / Atualizar</th>");

// Para cada tabela criaremos um botao para adicionar dados
$("table").each(function(){
	// $(this).parent().append("<button class='btn btn-danger incluirTabela'>Incluir</button>");
	$(this).children().next().next().children().append("<td class='text-center'><button class='btn btn-danger btn-xs incluirTabela'>Incluir</button></td>");
});

// Se um destes botoes criados forem clicados, devemos validar os campos
$(".incluirTabela").bind('click', function(){
	// Recuperando o nome da tabela para envio no formulario
	 // var nomeDaTabela = $(this).prev().prev().val();
	 var nomeDaTabela = $(this).parent().parent().parent().parent().prev().val();
	
	// Andando na arvore do DOM e pegando os valores dos campos
	// $(botao).(table).(thead).(tbody).(tfoot).(tr).(td);
	// var validar = $(this).prev().children().next().next().children().children();
	var validar = $(this).parent().parent().children().not("td:last");

	// Variavel que define que todos os campos foram preenchidos corretamente
	var preenchidos = true;
	// Array que vai armazenar os valores os campos
	var valorDosCampos = new Array();
	// Sobre cada <td> recuperado, preciso validar os campos de input
	$(validar).each(function(index, value){
		var verificar = $(this).children().val();
		if(verificar.length >= 1){
			valorDosCampos[index] = verificar;
		}else{
			preenchidos = false;
		}
	});
	// Agora vejo se preenchidos for igual á true então vamos exibir os campos
	if(preenchidos){
			var todosOsCampos = valorDosCampos.join('&');
			// Inicio de procedimento ajax, para submissão do formulario
			$.ajax({
				method: 'POST',
				url: '/validaAddRegTabLentes',
				data: {todosOsCampos:todosOsCampos, nomeDaTabela:nomeDaTabela}
			}).done(function(data){
					alert(data);
					window.setTimeout('location.reload()', 1000);
			}).fail(function(d){
				alert('Falha no envio');
			});
	} else{
			alert('Ei bacana, preenche o campo que falta lá por favor');
	}
});

// Se atualizar ou remover tiver sido clicado, vamos remover/atualizar as informacoes
$(".removerRegistro").bind('click', function(){
	// Recuperando o valor do atributo data que contem nome da tabela e ID do registro
	var removerTabela = $(this).attr('data');
	// Somente isto já é o bastante para remover o registro. Submetendo isto via ajax
	$.ajax({
		method: 'POST',
		url: '/removeRegTabela',
		data: {removerTabela: removerTabela}}).done(function(data){
			alert(data);
			window.setTimeout('location.reload()', 1000);
		}).fail(function(){
			alert('Erro ao excluir o registro');
			});
});
//Atualizar a tabela
$(".atualizarRegistro").bind('click', function(){
	// Recuperar o nome e o id da tabela
	var atualizarTabela = $(this).attr('data');
	// Realizar um loop nos tds e transforma-los em inputs
	var TDS = $(this).parent().parent().children().not("td:last");
	$(this).parent().parent().children().last().html("<td class='text-center'><button class='btn btn-danger btn-xs atualizarCampos'>Atualizar</button></td>");
	$(TDS).each(function(){
		// Retira o valor de texto
		var conteudo = $(this).text();
		// Transformar em um campo input
		$(this).html("<input type=text atlDados='dados' name=valor value='"+conteudo+"' class='form-control camposAtualizados' />");
	});
	
	

	// Se o botao for clicado, submeter formulario apos verificacao
	$(".atualizarCampos").bind('click', function(){
		// Retorna todos os campos input onde o atributo é atlDados='dados'
		var $c = $("input[atlDados='dados']");
		// Recebe os dados do cabecalho, nome dos campos para o update
		var nomeDosCampos = new Array();
		$(this).parent().parent().parent().parent().prev().children().children().not("th:last").each(function(index, value){
			nomeDosCampos[index] = $(this).text();
		});
	
		// Cria um array para armazenar os valores de cada campo
		$_VALOR = new Array();
		// Deixa a variavel validado como true, se todos os campos forem ok esta variavel não tera seu valor alterado.
		validado = true;
		// Faz um loop sobre cada campo do formulário para verificar se todos foram preenchidos
		// caso tenham sido então os valores são adicionados no array e a variavel validado retorna true
		$($c).each(function(index, value){
			var valor = $(this).val();
			if(valor.length >= 1){
				$_VALOR[index] = valor;
			} else {
			validado = false;	
			}
		});
		// Transformar o array em uma string separada por '&'
		var valores = $_VALOR.join('&');
		// Transformar o array com o nome dos campos em uma string separada por '&'
		var camposNomes = nomeDosCampos.join('&');
		
		// Momento mais esperado, requisição ajax para o  servidor trabalhar com estes dados	
		$.ajax({
			method: 'POST',
			url: '/removeRegTabela',
			data:{valores: valores, atualizarTabela:atualizarTabela, camposNomes:camposNomes}
		}).done(function(data){
			alert(data);
			window.setTimeout('location.reload()', 1000);
		}).fail(function(d){
			alert('Falha ao atualizar dados');
		});
		
	});

});


// Envia um arquivo .csv
$("#valida-arquivo").click(function(){
	var arquivo = $("#arquivoUpload")[0].files[0];
	var padrao = /.*\.csv$/;
	var nome = arquivo.name;
	
	if((padrao.exec(nome) != null)){
		$(this).parent().submit();
	} else {
		$(this).parent().children().first().text('Favor enviar somente arquivos .csv E/OU não existem tabelas a serem atualizadas');
	}
});


// Remove a tabela informada
$("#remove-tabela").click(function(){
	var nomeTabela = $("#tabelasTodasRM").val();
	
	$.ajax({
		method: 'POST',
		url: '/removeTabelaLente',
		data: {nomeTabela: nomeTabela}
	}).done(function(data){
		alert(data);
		window.setTimeout('location.reload()', 1000);
	}).fail(function(){
		alert('Falha ao excluir tabela de lentes\n Reporte ao administrador do site.');
	});
	
});


