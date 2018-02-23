/*

autor: Marcos Felipe da Silva Jardim
versao: 1.0
data: 27-07-2017

*/

$(document).ready(function(){

  var tabe = $('#minhaTabela').DataTable({
           // Fixa o cabecalho
          // fixedHeader : true,
           
           // Remove a paginacao da tabela
          "bPaginate": false,
          // Remove ordenacao
          "ordering" : true,
          "order" : [1],
          "fixedColumns":[1],
          // Este recurso desativa a ordenaÃ§Ã£o em algumas colunas
          //"columnDefs": [
           //         { "orderable": false, "targets": [1] }
           // ],
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

// Define o campo de entrada para alteracao dos dados
var mesColuna = '<select class="atualizaDias" name="mesDias"><option value=2>JAN</option><option value=4>FEV</option><option value=6>MAR</option><option value=8>ABR</option> \
<option value=10>MAI</option><option value=12>JUN</option><option value=14>JUL</option><option value=16>AGO</option> \
<option value=18>SET</option><option value=20>OUT</option><option value=22>NOV</option><option value=24>DEZ</option></select>';


$('[type=search]').parent().html('Ajustar dias trabalhados &nbsp;&nbsp;'+mesColuna+'<input class="entrada_dados" style="width: 5em" type=number value=26 />&nbsp;&nbsp;');

// FUNCAO CHAMADA QUANDO UM MES E ESCOLHIDO
$('.atualizaDias').bind('change', function(e) {
	var diasValor = $(this).next().val();// Recuperando os dias que serao atualizados
	var celulaIndice = $(this).val(); // Definindo a coluna de indice
	$('tbody tr').each(function(index, value){// Iterando sobre cada tr para recuperar cada td
		$(this).children().eq(celulaIndice).text(diasValor); // Determinando um valor
		$(this).children().eq(celulaIndice).trigger('dblclick'); // Executando o gatilho dblclick
		$(this).children().eq(celulaIndice).find('input').trigger('keypress', [13]); // Executando o gatilho keydown
	});
});


});

// Todos os tds que forem clicados a partir da coluna de indice 1 serao alterados pelo usuario
$('td').on('dblclick', function(e){
		
		var indiceColuna = $(this).context.cellIndex;
		
		if(indiceColuna < 1){
			return false;
		}
		var valor = $(this).text(); // Valor do campo atual
		if((indiceColuna % 2) == 0){
			// Define como tipo de entrada
			$(this).html('<input style="width: 4em;" class="entrada_de_dados" type=number autofocus value="'+valor+'" />');
		} else {
			// Define como tipo de entrada
			$(this).html('<input style="width: 6em;" class="entrada_de_dados" type=text autofocus value="'+valor+'" />');
			$('.entrada_de_dados').maskMoney({'prefix':'R$', thousands:'.',decimal:','}); // Definir como monetario
		}
		// Definindo o campo entrada_de_dados para capturar eventos do enter
		$('.entrada_de_dados').bind('keypress', function(e, vEnviado){
			
			if(e.which == 13 || vEnviado == 13){ // Tecla enter pressionada
				var tdPai = $(this).parent();
				var valor = $(this).val();
				// Verifcando se o valor é monetario ou inteiro.
				if(valor.search('R') != -1){
					
				var valor = parseFloat(valor.replace('R$', '').replace('.', '').replace(',','.')).toFixed(2);
				var novoValor = converter(valor);
				} else {
					var valor = $(this).val();
					var novoValor = valor;
				}
				//var indiceColuna = $(tdPai).context.cellIndex; // Campo que precisa ser alterado
				var IDEMpresa = $(tdPai).parent().children().eq(0).find('p').attr('id'); // Recupera o ID da empresa escolhida

				// Enviando tudo pelo ajax
				$.ajax({
					method: 'POST',url: '/meta',
					data: {IDEMPRESA:IDEMpresa, VALOR: valor, IDMES:indiceColuna}
				}).done(function(data){
					
					$(tdPai).text(novoValor);
					$(tdPai).css({'color':'blue', 'font-weight':'bolder'});

				}).fail(function(){
					alert('Valor não atualizado. Possivelmente problema de conexão.');
					$(tdPai).text(novoValor);
					$(tdPai).css({'color':'red', 'font-weight':'bolder'});
				});

			}
			$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();

		});

		$('.entrada_de_dados').on('keydown', function(e){
	
			if(e.which == 9){ // Tecla enter pressionada
				var tdPai = $(this).parent();
				var valor = $(this).val();
				// Verifcando se o valor é monetario ou inteiro.
				if(valor.search('R') != -1){
					
				var valor = parseFloat(valor.replace('R$', '').replace('.', '').replace(',','.')).toFixed(2);
				var novoValor = converter(valor);
				} else {
					var valor = $(this).val();
					var novoValor = valor;
				}
				//var indiceColuna = $(tdPai).context.cellIndex; // Campo que precisa ser alterado
				var IDEMpresa = $(tdPai).parent().children().eq(0).find('p').attr('id'); // Recupera o ID da empresa escolhida

				// Enviando tudo pelo ajax
				$.ajax({
					method: 'POST',url: '/meta',
					data: {IDEMPRESA:IDEMpresa, VALOR: valor, IDMES:indiceColuna}
				}).done(function(data){
					
					$(tdPai).text(novoValor);
					$(tdPai).css({'color':'blue', 'font-weight':'bolder'});

				}).fail(function(){
					alert('Valor não atualizado. Possivelmente problema de conexão.');
					$(tdPai).text(novoValor);
					$(tdPai).css({'color':'red', 'font-weight':'bolder'});
				});

			$(tdPai).parent().children().eq(indiceColuna+1).trigger('dblclick');

			}
			$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();

			
		});


	$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
});

