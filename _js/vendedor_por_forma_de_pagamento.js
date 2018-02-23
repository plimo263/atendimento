/*
 *  Autor:  Marcos Felipe da Silva Jardim
 *  Data:   20-10-2016
 *  Versão: 1.0
 * 
 * 
 * 
 * 
 */

$(document).ready(function (){
    $('#minhaTabela').DataTable({
           // Fixa o cabecalho
           //fixedHeader : true,
           
           // Fixar a coluna, necessita do plugin de fixação de colunas. O número de colunas fixadas reflete no valor seguinte ex: 2 colunas
            fixedColumns : {  leftColumns: 2 },
          
           // Remove a paginacao da tabela
          "bPaginate": false,
          // Remove ordenacao
          "ordering" : true,
          "order" : [],
          "colReorder" : true,
          // Ativa a barra de rolagem vertical
          "scrollY": 350,
          // se o eixo Y for menor que onde a tabela deve estar, então não colocar barra de rolagem
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
    "emptyTable" : "Não há dados",
    "zeroRecords": "Sem registros com valor informado",
	"decimal": ",",
	"thousands": "."},
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
      //  alert(data);
        window.setTimeout('location.reload()',100);
          
      }).fail(function(d){
        alert('falhou');
      });
          
          
  
}

});

   
  });