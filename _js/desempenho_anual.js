/*
autor: Marcos Felipe da Silva Jardim
versao: 1.0
data: 09-08-2017

*/
var larguraBarra, larguraColuna, larguraLinha, alturaBarra, alturaColuna, alturaLinha;
var chartAreaBarra;
var totalAnos;

if((navegador.indexOf("android") != -1) || (navegador.indexOf("Android") != -1)){
  larguraBarra = '100%';alturaBarra = 900;
  $('li a:contains("GRAFICO COLUNA")').remove(); 
  $('li a:contains("GRAFICO LINHA")').remove();
  chartAreaBarra = {'top': 30, 'left':40};
  //larguraColuna = '100%';larguraLinha = '100%';
  //alturaColuna = 900;alturaLinha = 400;
} else {
   larguraBarra = 850;larguraColuna = 1368;larguraLinha = 1350;
   alturaBarra = 1600;alturaColuna = 450;alturaLinha = 400;
   chartAreaBarra = {'top': 30, 'left':70};
   // Oculta os graficos, caso em um futuro eles sejam interessantes
     $('li a:contains("GRAFICO COLUNA")').remove(); 
  $('li a:contains("GRAFICO LINHA")').remove();
}


google.charts.setOnLoadCallback(comparativoAnual);


$(document).ready(function(){
	jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "date-range-pre": function ( a ) {
        var monthArr = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
        return monthArr.indexOf(a);	
    },
     "date-range-asc": function ( a, b ) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },
     "date-range-desc": function ( a, b ) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});
     $('#minhaTabela').DataTable({
             // Fixa o cabecalho
            // fixedHeader : true,
             
             // Remove a paginacao da tabela
            "bPaginate": false,
            // Remove ordenacao
            "ordering" : true,
                      
            // Este recurso desativa a ordenaÃ§Ã£o em algumas colunas
            "columnDefs": [
               { "type": 'date-range', "targets": 0 }
            ],
            
            // Ativar a movimentaÃ§Ã£o das colunas
            "colReorder" : true,
            // Ativa a barra de rolagem vertical
            "scrollY": 250,
            // se o eixo Y for menor que onde a tabela deve estar, entÃ£o nÃ£o colocar barra de rolagem
            "scrollCollapse": true,
            // E ordena em rolagem horizontal
            "scrollX": true,
            
            // Retira a informacao inferior
            "info" : false,
            // Ativa a responsividade
      "responsive": true,
            // Desativar largura inteligente
            "autoWidth": false,
            
            // Utilizar expressoes regulares
            "search" : {
                "regex": true
             },
            // Reiniciar o datatables
            retrieve: true,
            // Atualiza campos no texto informado
            "language": {
      "search": "Procurar na tabela",
      "emptyTable" : "Nao ha dados",
      "zeroRecords": "Sem registros com valor informado",
    "decimal":",",
    "thousands":"."}
    });

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

 });

function comparativoAnual(){
  // Array que contem os meses do ano, usado para gerar a legenda do grafico
  var mesComp = ['ANO', 'JAN','FEV','MAR','ABR','MAI', 'JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
  totalAnos = {}; // Total de anos, de todos os anos
  // Array usado para criar o cabecalho do grafico, inicialmente somente com o nome Mes, depois recebera os anos
  var arrComparativoAnual = new Array(['MES']); // Estrutura de array por mes
  var arrComparativoAnualLinha = new Array(['MES']); // Estrutura array por mes para grafico de linha
  var mesesGrafico = new Array(); // Array para armazenar os meses do grafico
  var mesesGraficoLinha = new Array(); // Array para armazenar os meses do grafico de linha
  for(var i in anos){ // Passa por todas as chaves dos anos
    arrComparativoAnual[0].push(i.toString()); // Adiciona o ano no array do cabecalho
    arrComparativoAnualLinha[0].push(i.toString()); // Adiciona o ano no array do cabecalho para o grafico de linha
    totalAnos[i.toString()] = 0.0; // Inicia o valor do ano com 0.0

    arrComparativoAnual[0].push({role:'annotation'}); // Adiciona a anotação para cada mes do grafico
    // Faz um loop e percorre o array contido dentro doo ano selecionado para preencher os meses graficos
    for(var x = 0;x< anos[i].length;x++){
       // Se tiver sido definido a posicao do array no mesesGrafico (isto é tera um array dentro deste) nao faça nada
      if(typeof mesesGrafico[x] == "object"){
          
      } else { // Caso contrario crie um array dentro deste array usando o indice informado(valor de x) e ja configure o mes
        // usando mesComp[x+1] que vai retornar JAN, FEV, MAR, etc ...
        mesesGrafico[x] = new Array(mesComp[x+1]);
        mesesGraficoLinha[x] = new Array(mesComp[x+1]);
        
      }

      // Apende o mes do ano informado no mes correto de mesesGrafico
      mesesGrafico[x].push(anos[i][x]);
      mesesGraficoLinha[x].push(anos[i][x]);
      mesesGrafico[x].push(converter(parseFloat(anos[i][x]).toFixed(2))); // Incluindo a anotação no grafico
      totalAnos[i.toString()] += anos[i][x]; // Soma total dos anos
    } // Fim do loop do array do ano selecionado
      
  } // Fim do loop dos anos
  // Inicia outro loop no mesesGrafico para desempacotar os arrays dentro do array mesesGrafico e 
  // incluir eles no array arrComparativoAnual
  for(var y = 0;y< mesesGrafico.length;y++){
    arrComparativoAnual.push(mesesGrafico[y]);
    arrComparativoAnualLinha.push(mesesGraficoLinha[y]);
  }
  
  // Gerar um loop para recuperar o valor dos totais e incrementar como rotulo da coluna
  var x = 1; // Contador para colocar os rotulos no array de linha
  for(var i = 1;i <  arrComparativoAnual[0].length;i++){
    if(i % 2 != 0){
      var nomeAno = arrComparativoAnual[0][i] + ' '+ converter(parseFloat(totalAnos[arrComparativoAnual[0][i]]).toFixed(2));
        arrComparativoAnual[0][i] = nomeAno;
        arrComparativoAnualLinha[0][x] = nomeAno;
        x+= 1;


    }

  }
  
  console.log(JSON.stringify(arrComparativoAnual));
  // Cria o objeto de dados usando o array arrComparativoAnual  
  var dados = google.visualization.arrayToDataTable(arrComparativoAnual);
  var dadosLinha = google.visualization.arrayToDataTable(arrComparativoAnualLinha);

    var options = { // Escreve as opções para o gráfico de coluna. As outras opçoes fazem o mesmo para os outros tipos de graficos
        title: 'COMPARATIVO DE VENDAS ANO x ANO',
        width: larguraColuna, height: alturaColuna,  bar:{groupWidth:'85%'},chartArea:{'left':100},
        annotations: { style:'line', alwaysOutside: true},hAxis:{title:'MESES'}
        
      };

     var options2 = {
        title: 'COMPARATIVO DE VENDAS ANO x ANO',
        width: larguraBarra, height: alturaBarra, chartArea:chartAreaBarra,
        bar:{groupWidth:'80%'}, annotations: { alwaysOutside: true}
      };

     var options3 = {
        title: 'COMPARATIVO DE VENDAS ANO x ANO',selectionMode:'multiple',
        tooltip:{trigger:'selection'},aggregationTarget:'category',hAxis:{title:'MESES'},
        width: larguraLinha, height: alturaLinha, chartArea:{'top': 30, left:100}
        
      };

    // Cria os objetos dos graficos e desenha-os em seus IDs correspondentes
    var chart = new google.visualization.ColumnChart(document.getElementById('grafico'));
    var chart2 = new google.visualization.BarChart(document.getElementById('grafico2'));
    var chart3 = new google.visualization.LineChart(document.getElementById('grafico3'));
    chart.draw(dados, options);
    chart2.draw(dados, options2);
    chart3.draw(dadosLinha, options3);

}
