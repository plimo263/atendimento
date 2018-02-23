/*
 *  Autor:  Marcos Felipe da Silva Jardim
 *  Data:   10-02-2017
 *  Versao: 1.1
 * 
 * 
 * 
 * 
 */

$(document).ready(function (){
    $('.minhaTabela').DataTable({
           // Fixa o cabecalho
          // fixedHeader : true,
           
           // Remove a paginacao da tabela
          "bPaginate": false,
          // Remove ordenacao
          "ordering" : true,
          "order" : [1],
          // Este recurso desativa a ordenacao em algumas colunas
          "columnDefs": [
                    { "orderable": false, "targets": [1] }
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
          // Atualiza campos no texto informado
          "language": {
    "search": "Procurar na tabela",
    "emptyTable" : "Nao ha dados",
    "zeroRecords": "Sem registros com valor informado"}
      });
      
 
      
  });
