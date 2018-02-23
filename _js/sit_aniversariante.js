/*
autor: Marcos Felipe da Silva Jardim

*/

$(document).ready(function(){

	$("#tabela").DataTable({
		// Fixa o cabecalho
        //fixedHeader : true,
        // Fixar a coluna, necessita do plugin de fixação de colunas
        fixedColumns : {  leftColumns: 1 },
        // Remove a paginacao da tabela
        "bPaginate": false,
        // Remove ordenacao
        "ordering" : true,
        "colReorder" : true,
        // Ativa a barra de rolagem vertical
        "scrollY": 350,
        // se o eixo Y for menor que onde a tabela deve estar, então não colocar barra de rolagem
        "scrollCollapse": true,
        // E ordena em rolagem horizontal
        "scrollX": true,
        // Por padrão ativa a ordenação desta coluna
        "order" : [],
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
		"emptyTable" : "Não há dados",
		"zeroRecords": "Sem registros com valor informado"},
		// Retorna dados de uma tabela dinamicamente
		"ajax": '/retorna'
		
		});
    
  });
