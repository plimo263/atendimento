/*
autor: 	MARCOS FELIPE DA SILVA JARDIM
versão:	1.0
data:	19-06-2017

*/
// Consulta usando o JSON
function atualizaTabela(){
	$.ajax({
		method: 'POST',
		url: '/relatorio_visitante',
		data:{atualizar:'atualizar'}
	}).done(function(data){
		$('.col-sm-8 .table-responsive:first').empty();
		$('.col-sm-8 .table-responsive:first').append($.parseHTML(data));

		$('#minhaTabela').DataTable({
       
           // Remove a paginacao da tabela
          "bPaginate": false,
          // Remove ordenacao
          "ordering" : true,
          "order" : [[2, "desc"]],
          // Este recurso desativa a ordenaÃ§Ã£o em algumas colunas
          //"columnDefs": [
           //         { "orderable": false, "targets": [1] }
           // ],
          // Ativar a movimentaÃ§Ã£o das colunas
          "colReorder" : true,
          // Ativa a barra de rolagem vertical
          "scrollY": 300,
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
	$('#minhaTabela tbody tr').slice(0, 4).css({color:'red', 'font-weight':'bold', 'font-size':'1.5em'});
  // Data da atualizacao
  var d = new Date();
  $('h5').empty();$('h5').append('Atualizado em: <time>'+d+'</time>');
	});
}


$(document).ready(function(){
	$('#minhaTabela').DataTable({
		 // Fixa o cabecalho
          // fixedHeader : true,
           
           // Remove a paginacao da tabela
          "bPaginate": false,
          // Remove ordenacao
          "ordering" : true,
          "order" : [[2, "desc"]],
          // Este recurso desativa a ordenaÃ§Ã£o em algumas colunas
          //"columnDefs": [
           //         { "orderable": false, "targets": [1] }
           // ],
          // Ativar a movimentaÃ§Ã£o das colunas
          "colReorder" : true,
          // Ativa a barra de rolagem vertical
          "scrollY": 300,
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

window.setInterval("atualizaTabela()", 30000);
});