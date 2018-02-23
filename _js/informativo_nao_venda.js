/*
autor:	Marcos Felipe da Silva Jardim
versão:	1.0
data:	25-08-2017

*******************************************************************
Histórico de versão:

v1.0: Gera a tabela e permite alteração do retorno.
*/

$(document).ready(function(){
  $('#minhaTabela tbody tr').each(function(index, value){
      $(this).children().each(function(ind, val){

          if(ind == 8){
            $(this).text(converter($(this).text()));
          }

          if(ind == 9 && $(this).text() == 'N'){
            $(this).css({'color':'red', 'font-weight':'bold'});
          } else if(ind == 9 && $(this).text() == 'S'){
            $(this).css({'color':'blue', 'font-weight':'bold'});
          }
      });
  });
   tabe = $('#minhaTabela').DataTable({
           // Fixa o cabecalho
          // fixedHeader : true,
           
           // Remove a paginacao da tabela
          "bPaginate": false,
          // Remove ordenacao
          "ordering" : true,
          "order" : [1],
          //"fixedColumns":[1],
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
    var lojas = $("#lojas").val();
    var loja = lojas.toString();

    $.ajax({
        method: 'POST',
        url: '/informativo_nao_venda',
        data: {de: data1, ate: data2, lojas:loja}
        
        }).done(function(data){
          window.setTimeout('location.reload()',100);
            
        }).fail(function(d){
          alert('falhou');
        });
            
            
    
  }

});