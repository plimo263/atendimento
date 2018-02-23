/*
autor	: Marcos Felipe da Silva Jardim
data	:	04-05-2017
versao	:	1.0
*/
// Cores utilizadas nos graficos
var cores = ['red','green','blue','magenta', 'yellow', 'black', 'cyan', 'aqua', 'chocolate', 'cornsilk', 'gray', 'orange', 'pink'];

/*
Funcao utilizada para montar um grafico do google charts
Recebe os parametros:
objeto --> O objeto que ira realizar o loop
idDaDiv --> O Id da div que vai comportar o grafico
parametros --> São os parametros passados para iniciar o array de dados do grafico
titulo --> Titulo do grafico
tipo_grafico --> O tipo do grafico, sendo pizza, coluna, barra

*/
function desenhaGrafico(objeto, idDaDiv, parametros, titulo, tipo_grafico){
	var dados = new Array(parametros); // Inicia um array com outro array com os parametros preenchidos
	dados[0].push({'role':'style'});
	dados[0].push({'role':'annotation'});var x = 0; // Inserindo um campo de cores criando uma variavel contadora
	var qtdItem = 0; // A quantidade de itens para ser exibido no titulo do grafico
	var outros = 0; // Todos os outros produtos vendidos
	// Realizando um loop para preencher o array
	for(var i in objeto){ // Realizando um loop para preencher o array de dados solares
		var item, quantidade;
		if(x < 7){
			item = objeto[i][0]+' QTD: '+objeto[i][1]; quantidade = objeto[i][1];
			dados.push([item, quantidade, cores[x], item]);
		} else {
			outros += objeto[i][1]
		}
		x += 1;
		qtdItem += objeto[i][1];
		}
		dados.push(['OUTROS QTD: '+outros, outros, cores[8], outros]);
	var dS = google.visualization.arrayToDataTable(dados, false);// Adicionando os dadosSolar para um array do grafico
	if(tipo_grafico == 'pizza'){
		var chart = new google.visualization.PieChart(document.getElementById(idDaDiv));
	}else if(tipo_grafico == 'barra'){
		var chart = new google.visualization.BarChart(document.getElementById(idDaDiv));
	} else if(tipo_grafico == 'coluna'){
		var chart = new google.visualization.ColumnChart(document.getElementById(idDaDiv));
	} else {
		var chart = new google.visualization.PieChart(document.getElementById(idDaDiv));
	}
	// Define as opções do grafico, opçoes padrao.
	var opcoes = {'chartArea': {'left':3}, 'height': 450,//'slices':{0:{'offset':0.1}},
	'is3D': 'true', 'width': 550, 'fontSize': 9, 
	'title': titulo[0]+' VENDIDOS \n\n\n TOTAL DE '+titulo[1]+' '+qtdItem}; // Opcoes para o grafico
	chart.draw(dS, opcoes); // Desenhando o grafico
}

function graficoVendas(objeto, idDaDiv, parametros){
	var dados = new Array(parametros);
	dados[0].push({'role':'style'});dados[0].push({'role':'annotation'});var x = 0;
	var vlrTotal = 0.0;
	for(var i in objeto){
		var legenda, valor, item;
		item = objeto[i][0];
		legenda = objeto[i][0]+' - '+objeto[i][2];valor = objeto[i][1];
		vlrTotal += valor;
		dados.push([item, valor, cores[x], legenda]);
		x += 1;
	}
	var dS = google.visualization.arrayToDataTable(dados, false);// Adicionando os dadosSolar para um array do grafico
	var chart = new google.visualization.BarChart(document.getElementById(idDaDiv));
	chart.draw(dS,{'chartArea':{'left':1},'legend':'none', 'title':'Valor Anual Vendido', 'width':488, 'height':700});
}

$("#pesquisar").click(function(e){// Depois que a empresa é escolhida verifique se a data de é menor ou igual a data ate
	e.preventDefault();
	var data1, data2; data1 = $("#data1").val(); data2 = $("#data2").val();
	D1 = new Date(data1); D2 = new Date(data2);
	if(D1.getTime() > D2.getTime()){ // Data de é maior então retorne uma mensagem de erro.
	 alert('A data DE nao deve ser maior que a data ATE.');
	} else { // A data de é menor que a data ate
		// Crie um objeto de dados com os dados do grupo selecionado, data de e ate
		var empresa = {'empresa': $("#grupos :selected").val().slice(5).split(' ')[0], 'de':data1,'ate':data2};
		// Realize uma chamada ajax enviando o objeto javascript empresa para a pagina /obter_vendedor
		$.post('/obter_vendedor', empresa, function(dados){
			var d = JSON.parse(dados); // Converta o objeto json de dados para um objeto javascript e armazene em d
			// Crie um select com os vendedores retornados
			var lista = '<select class="form-control" name="vendedores" id="vendedores">'; 
			var botao = '<div class="col-sm-2"><button id="pesqVendedor" class="btn btn-success"><span class="glyphicon glyphicon-search"> Pesquisar</span></button></div>';
			var btnVoltar = '<div class"col-sm-2"><button id="voltarEmp" class="btn btn-danger"><span class="glyphicon glyphicon-log-out"> Voltar</span></button></div>';
			for(var i in d){
				if(i == 0){
					lista += '<option selected value="'+d[i][0]+'">'+d[i][1]+'</option>';
				} else {
					lista += '<option value="'+d[i][0]+'">'+d[i][1]+'</option>';
				}
			}
			lista += '</select>';

			$('#vendedores').prev().fadeOut('slow'); // Ocultando a div acima que exibe as empresas e data de,ate
			// Apendando na div vendedores uma div class=row
			$("#vendedores").append('<div class="row"><div class="col-sm-2"></div><div class="col-sm-2">'+lista+'</div>'+botao+btnVoltar+'</div>');
			/*
			$("#voltarEmp").bind('click', function(){ 
				$('#vendedores').prev().slideDown('slow'); $("#vendedores").empty();
				$("#lentes").empty();$("#armacao").empty();$("#solar").empty();
				$("#nome_vendedor").empty();$("#data_vendedor").empty();
				$("#anual").empty();
			});
			*/
			// Se o botao de pesquisa de vendedor for clicado vamos gerar os graficos para ele
			$("#pesqVendedor").click(function(){
				$("#lentes").empty();$("#armacao").empty();$("#solar").empty();
				 // Definindo o nome do vendedor e data para facil identificacao do relatorio
				$("#nome_vendedor").text('Dados do Vendedor '+$("#vendedores :selected").text());
				$("#data_vendedor").text('Dados do dia '+$("#data1").val()+' Até o dia '+$("#data2").val());
				// GRAFICO LENTES, ARMACOES E SOLARES
				$("#lentes").append('<img src="/imagens/carregando.gif" />');
				$("#armacao").append('<img src="/imagens/carregando.gif" />');
				$("#solar").append('<img src="/imagens/carregando.gif"/>');

				var codVendedor = {'codigo': $("#vendedores :selected").val(), 'empresa': $("#grupos :selected").val().slice(5).split(' ')[0]}; //Criando um objeto javascript para armazenar o codigo do vendedor
				$.post('/obter_vendedor', codVendedor, function(dados){ // Realizando uma chamada ajax para obter dados deste vendedor
					var dV = JSON.parse(dados); // Convertendo os dados JSON em um objeto javascript
					desenhaGrafico(dV.solar, 'solar', ['Solar', 'quantidade'],['SOLARES', 'SOLAR']);
					desenhaGrafico(dV.lentes, 'lentes',['Lentes', 'quantidade'],['LENTES', 'LENTES'], 'pizza');
					desenhaGrafico(dV.armacao, 'armacao',['AR', 'quantidade'],['AR', 'AR'], 'pizza');
					graficoVendas(dV.anual, 'anual',['VALOR', 'TOTAL']);
					//desenhaGrafico(dV.tipo_lentes, '#tipo_lentes',['TIPO', 'QUANTIDADE'],['LENTES', 'LENTES'],'barra');
				}); // Fim do post para obter os dados dos vendedores
			}); // Fim do click no botao pesqVendedor
	  	}); // Fim do post para obter vendedores
	} // Fim do else
});

