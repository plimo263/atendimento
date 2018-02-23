
$(document).ready(function(){

  $('table').addClass('minhaTabela');
  $('table:last').attr('id', 'outra_tabela');

  // Inserindo fonte vermelha nos totais
 $(".minhaTabela tbody tr").each(function(){
		var filho = $(this).children().eq(0).text();
		if(filho.search('GRUPO') != -1){
			$(this).css({'color':'red', 'font-size':'10pt', 'font-weight':'bolder'});
			
		}
	});


	$('.minhaTabela').DataTable({
           // Fixa o cabecalho
          "fixedHeader": true,           
           // Remove a paginacao da tabela
          "bPaginate": false,
          // Remove ordenacao
          "ordering" : false,
          //"fixedColumns": {"leftColumns": 2},
          //"order" : [8],
          // Este recurso desativa a ordenaÃƒÂ§ÃƒÂ£o em algumas colunas
          //"columnDefs": [
          //         { "orderable": false, "targets": [0,1,2] }
          // ],
          // Ativar a movimentação das colunas
          "colReorder" : true,
          // Ativa a barra de rolagem vertical
          "scrollY": 250,
          // se o eixo Y for menor que onde a tabela deve estar, entÃƒÂ£o nÃƒÂ£o colocar barra de rolagem
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
          "retrieve": true,
          // Atualiza campos no texto informado
          "language": {
        "search": "Procurar na tabela",
        "emptyTable" : "Nao ha dados",
        "zeroRecords": "Sem registros com valor informado",
      "decimal":",",
      "thousands":"."}
  });

 $("#pesquisar").click(function(){

	var grupos = $("#grupos").val();
	var grupo = grupos.toString();
	var lojas = $("#lojas").val();
	var loja = lojas.toString();

	$.ajax({
			method: 'POST',
			url: '/estoque_ideal',
			data: {grupos: grupo, lojas:loja}
			
			}).done(function(data){
				window.setTimeout('location.reload()',100);
					
			}).fail(function(d){
				alert('falhou');
			});
	});


  // Renderizando a tabela automaticamente quando clicado nas abas do tabs
  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  });
// Destaque registros do grupo com a cor cinza e espace entre os grupos
$('tr td:contains("GRUPO")').parent().css({'background-color':'#999'}).after('<p style="position:relative;height:2em;"></p>');
});
