/*
autor:	Marcos Felipe da Silva Jardim
versão:	1.0
data:	01-03-2017

*/

$(document).ready(function(){

  var tabe = $('#minhaTabela').DataTable({
           
           // Remove a paginacao da tabela
          "bPaginate": false,
          // Remove ordenacao
          "ordering" : true,
          
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
    "zeroRecords": "Sem registros com valor informado"
    }
});

 $("#pesquisar").click(function(){
	var grupos = $("#grupos").val();
	var grupo = grupos.toString();
	var tipos = $("#tipos").val();
	var tipo = tipos.toString();
  var tiposGrife = $("#tipos_grife").val();
  var tipoGrife = tiposGrife.toString();

	$.ajax({
			method: 'POST',
			url: '/referencia_ar_oc',
			data: {grupos: grupo, tipos: tipo, tipoGrife: tipoGrife}
			
			}).done(function(data){
			//	alert(data);
				window.setTimeout('location.reload()',100);
					
			}).fail(function(d){
				alert('falhou');
			});
	});

});
