/*
 autor: 	Marcos Felipe da Silva Jardim
 versao:	1.0
 data:		06-02-2017
*/


$(document).ready(function(){
	$('table tfoot').remove();

/*
	 var table = $('table').DataTable({
	 
	 // Fixa o cabecalho
           //fixedHeader : true,
           // Fixar a coluna, necessita do plugin de fixaÃ§Ã£o de colunas
            fixedColumns : {  leftColumns: 2 },
           // Remove a paginacao da tabela
          "bPaginate": false,
          // Remove ordenacao
          "ordering" : true,
           
          // Remover uma coluna
          columnDefs:[{"orderable": false, targets:[0], visible:false}],     
            // Por padrÃ£o ativa a ordenaÃ§Ã£o desta coluna, array em branco nao ordena nenhuma
          "order" : [],
          // Disponibiliza a capacidade de selecionar uma coluna e ordenar ela para onde desejar.
          "colReorder" : true,
          // Ativa a barra de rolagem vertical
          "scrollY": 350,
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
          // Atualiza campos no texto informado
          "language": {
                    "search": "Procurar na tabela",
                    "emptyTable" : "NÃ£o hÃ¡ dados",
                    "zeroRecords": "Sem registros com valor informado"
                }
         
	 });
*/


var table = $(".tabelaLentes").DataTable({"scrollY":"280px",
	 "scrollX":true,
	  "scrollCollapse": true,
	   columnDefs:[{"orderable": false, targets:[0], visible:false}],
       fixedColumns : {  leftColumns: 2 }, 
       "autoWidth":false,
       "responsive":true,
       "colReorder" : true,
       "ordering" : true,
       "bPaginate": false,
	    "language": {
					"lengthMenu": "Exibir _MENU_ linhas",
                    "search": "Procurar na tabela",
                    "emptyTable" : "Nao ha dados",
                    "zeroRecords": "Sem registros com valor informado",
                    "info": "Exibindo linhas de _START_ ate _END_ de um total de _TOTAL_ linhas",
					"infoEmpty":      "Exibindo de 0 para 0 de um total de 0 linhas",
					"infoFiltered":   "(Total de  _MAX_ linhas)",
                    "paginate": {
						"first":"Primeira",
						"last": "Ultima",
						"next": "Proxima",
						"previous": "Anterior"}
                    },
        "search" : {
              "regex": true
           }
       });
});

