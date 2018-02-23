/*
autor: Marcos Felipe da Silva Jardim
versao: 1.0
data: 10-05-2017
*/
var meses = ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'];
var grupoP = '';var mes = '';var da1 = [];var nomeVendedores = [];

google.charts.setOnLoadCallback(iniciarGrafico);
google.charts.setOnLoadCallback(iniciaGrafico2);



$("#pesquisar").click(function(){
var data1, data2;
	data1 = $("#data1").val();
	data2 = $("#data2").val();


D1 = new Date(data1);
D2 = new Date(data2);


if(D1.getTime() > D2.getTime()){
	alert('A data DE nao deve ser maior que a data ATE.');
} else {
	var grupos = $("#grupos").val();
	var grupo = grupos.toString();
  var lojas = $("#lojas").val();
  var loja = lojas.toString();

	$.ajax({
			method: 'POST',
			url: '/vendas_por_loja',
			data: {de: data1, ate: data2, grupos: grupo, lojas:loja}
			
			}).done(function(data){
				window.setTimeout('location.reload()',100);
					
			}).fail(function(d){
				alert('falhou');
			});
}

});


function iniciarGrafico(){
	var options = {
		'title':'DADOS DA EMPRESA '+emp+' FILIAL(IS) '+filial+'\n\n TOTAL DE SOLARES '+totSolar,
		'width': 480,
		'height': 650,
		'fontSize':9,
		'legend':'none',
		'chartArea':{'left':4}
	}
	// Montando objeto de dados
	var data =  google.visualization.arrayToDataTable(dados, false);// Adicionando os dados
	var chart = new google.visualization.BarChart(document.getElementById('ano_solar'));
	google.visualization.events.addListener(chart, 'select', obterDados);
	function obterDados(){
		var itemSelecionado = chart.getSelection()[0];
		mes = itemSelecionado.row+1;
		grupoP = $("#grupos :selected").val().slice(5).split(' ')[0];
		dados1 = {'mes':mes, 'grupo':grupoP};
		$('#analitico_solar').empty();
		$('#analitico_solar').append('<img src="/imagens/carregando.gif" />');
		$('#analitico_solar2').empty();
		
		$.post('/analitico_vendedor_x_solar', dados1, function(dados){
			var totGrupo = 0;
			da1 = JSON.parse(dados);
			var d2 = [];
			for(var i in da1){
				d2.push(da1[i])
				if(i > 0){
					totGrupo += da1[i][1];
				}
			}
			var data = google.visualization.arrayToDataTable(d2, false);
			var chart2 = new google.visualization.PieChart(document.getElementById('analitico_solar'));
			google.visualization.events.addListener(chart2, 'select', obterDados2);

			var opcoes = {
				'title': 'SOLARES VENDIDOS MES DE '+meses[itemSelecionado.row]+'\n\n TOTAL DE '+totGrupo+' SOLARES ',
				'width':480,
				'height':650,
				'is3D':true,
				'fontSize':9,
				'chartArea':{'left':4}
			}
			function obterDados2(){
				var itemSelecionado2 = chart2.getSelection()[0];
				var grpSolar = da1[itemSelecionado2.row+1][2];
				var dados2 = {'mes':mes,'grupo':grupoP,'grpSolar':grpSolar};
				$('#analitico_solar2').empty();
				$('#analitico_solar2').append('<img src="/imagens/carregando.gif" />');
				$.post('/analitico_vendedor_x_solar', dados2, function(dados){
					var totGrupo2 = 0;
					var da2 = JSON.parse(dados);
					var d3 = [];
					for(var i in da2){
						d3.push(da2[i])
						if(i > 0){
							totGrupo2 += da2[i][1];
						}
					}
					var data2 = google.visualization.arrayToDataTable(d3, false);
					var chart3 = new google.visualization.PieChart(document.getElementById('analitico_solar2'));
					var opcoes2 = {
						'title': 'ANALITICO SOLAR DO GRUPO '+grpSolar+'\n\n TOTAL DE '+totGrupo2+' SOLARES DESTE GRUPO',
						'width':480,
						'height':650,
						'is3D':true,
						'fontSize':9,
						'chartArea':{'left':4}
					}
					chart3.draw(data2, opcoes2);
				});
			}
			chart2.draw(data, opcoes);
		});
	}
	chart.draw(data, options);
}

function iniciaGrafico2(){
var arr = new Array(['MES']);
arr.push(['JAN']);arr.push(['FEV']);arr.push(['MAR']);arr.push(['ABR']);
arr.push(['MAI']);arr.push(['JUN']);arr.push(['JUL']);arr.push(['AGO']);
arr.push(['SET']);arr.push(['OUT']);arr.push(['NOV']);arr.push(['DEZ']);

for(var i in dadosVendedor){
	nomeVendedores.push([i,dadosVendedor[i][0]]);
    arr[0].push(i.split(' ').slice(0,2).join(' '));
	arr[1].push(dadosVendedor[i][1]);arr[2].push(dadosVendedor[i][2]);arr[3].push(dadosVendedor[i][3]);
	arr[4].push(dadosVendedor[i][4]);arr[5].push(dadosVendedor[i][5]);arr[6].push(dadosVendedor[i][6]);
	arr[7].push(dadosVendedor[i][7]);arr[8].push(dadosVendedor[i][8]);arr[9].push(dadosVendedor[i][9]);
	arr[10].push(dadosVendedor[i][10]);arr[11].push(dadosVendedor[i][11]);arr[12].push(dadosVendedor[i][12]);
}

 var options = {
 	
          chart: {
            title: 'Vendedores de Solar',
            legend:'top',
            subtitle: 'Quantidade de solares vendidas no ano de 2017',
          },width : 580, height: 1200,  bar: { groupWidth: "90%" },
                      chartArea:{'left':-19},

          bars: 'horizontal'       
    }

var  dataVend = google.visualization.arrayToDataTable(arr,false);
var grafV = new google.charts.Bar(document.getElementById('ano_vendedor_solar'));
//var grafV = new google.visualization.BarChart(document.getElementById('ano_vendedor_solar'));
google.visualization.events.addListener(grafV, 'select', function(){
 var selecionado = grafV.getSelection()[0];
 console.log(selecionado.row);
 console.log(selecionado.column);
 console.log(nomeVendedores[selecionado.column-1]);
});
 grafV.draw(dataVend,google.charts.Bar.convertOptions(options));
//grafV.draw(dataVend,options);
}