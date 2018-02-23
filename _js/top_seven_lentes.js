/*
autor: Marcos Felipe da Silva Jardim
versao: 1.0
data: 02-05-2017
*/
var titulo = ''; // VARIAVEL QUE DEFINE O NO DO GRAFICO

// FUNÇÃO PARA ATUALIZAR OS DADOS, REALIZA UMA REQUISIÇÃO AJAX, RECEBE OS DADOS E GERA NOVO GRAFICO
function atualizaDados(valor, desativar, tab){ $.post('/json_top_seven_lentes', valor, function(dados){
	var d2 = new Array();
	var total = 0;
	var titulo =  $("#lentes :selected").text();
	var dTabela = tab ? new Array() : false;
	d2.push(['Lente', 'Quantidade',{'role':'style'}]);
	for(i in dados){ // Gerando um loop nos dados retornados para criar o array Multidimensional para a tabela
		if(i == 0){ 
			total = dados[i][1];
		} else { 
			d2.push(dados[i]); 
			if(dTabela instanceof Array){
				var lente = dados[i][0].slice(0,dados[i][0].search('- QTD'));
				if(lente.search('OUTROS') == -1){
					dTabela.push([lente, dados[i][1]]); // Inserindo dados na tabela dTabela
				} else if(dados[i][1] > 0){
					dTabela.push(['OUTROS', dados[i][1]])
				}
			}
		}
	}

    var options = {'chartArea': {'left':3}, 'height': 650, 'is3D': 'true', 'width': 605, 'fontSize': 9, 'title': 'TOP SEVEN LENTES '+titulo+ '\n\nTOTAL DE '+total};
	var data = google.visualization.arrayToDataTable(d2, false);// Adicionando os dados
	$('#grafico').html();
	var chart = new google.visualization.PieChart(document.getElementById('grafico'));
	function detalheLentes() {
	var selectedItem = chart.getSelection()[0];
    var grupoLente = d2[selectedItem.row+1][0].slice(0, d2[selectedItem.row+1][0].search('-'));
	if(grupoLente.search('OUTROS') != -1){ alert('Não é possível detalhar.'); 
	} else {
		$('#grafico').html('<img src="/imagens/carregando.gif"/>');
	  	atualizaDados({'analitico':grupoLente}, true, true); }
	}
    	if(!desativar){
			google.visualization.events.addListener(chart, 'select', detalheLentes);
		} else {
			dTabela.push(['TOTAL', total]);
			var tb = new Tabela(['LENTE', 'QUANTIDADE'], dTabela, 'table-bordered table-hover');
			$("#tabDetalhes").html(tb.getTabela());
		}
		
		chart.draw(data, options);
		}, 'json');
}
// inicializar o desenho de um grafico BIFOCAL de forma inicial
google.charts.setOnLoadCallback(desenhar);
// Funçao que inicia o desenho de um grafico
function desenhar(){

	d1 = new Array(); var tot = 0;
	for(var i = 0;i< dados.length;i++){
		if(i == 0){
			tot = dados[i][1];
		} else {
			d1.push(dados[i]);
		}
	}

	d3 = google.visualization.arrayToDataTable(d1);
	var chart = new google.visualization.PieChart(document.getElementById('grafico'));
	var options = {'chartArea': {'left':6}, 'height': 600, 'is3D': 'true', 'width': 605, 'fontSize': 9, 'title': 'TOP SEVEN LENTES BIFOCAIS \n\nTOTAL DE '+tot};
	function detalheLentes() {
		var selectedItem = chart.getSelection()[0];
    	var grupoLente = d1[selectedItem.row+1][0].slice(0, d1[selectedItem.row+1][0].search('-'));
		if(grupoLente.search('OUTROS') != -1){ alert('Não é possível detalhar.'); 
		} else {
			$('#grafico').html('<img src="/imagens/carregando.gif"/>');

    	  	atualizaDados({'analitico':grupoLente}, true, true); }
    	}

    google.visualization.events.addListener(chart, 'select', detalheLentes);
	chart.draw(d3, options);
}
// Caso altere o tipo de lente desejado o grafico é atualizado
$('#lentes').change(function(){
	var valor = $(this).val(); // VALOR DO GRAFICO, B,M OU P
	$("#tabDetalhes").empty();
	$('#grafico').html('<img src="/imagens/carregando.gif"/>');
	atualizaDados({'data':valor}, false); // FUNCAO UTILIZADA PARA GERAR O GRAFICO, RECEBENDO OS DADOS E O VALOR
});



