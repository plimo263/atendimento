/*
autor	:	Marcos Felipe da Silva Jardim
versão	:	1.0
data	:	27-06-2017

*/
var tabe;
$(document).ready(function(){
	tabe = $('#minhaTabela').DataTable({
          // Fixar a coluna, necessita do plugin de fixação de colunas. O número de colunas fixadas reflete no valor seguinte ex: 2 colunas
          fixedColumns : {  leftColumns: 2 },
          // Remove a paginacao da tabela
          "bPaginate": false,
          // Remove ordenacao
          "ordering" : true,
          "order" : [1],
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
// SELECIONANDO OS GRUPOS E FILTRANDO NA TABELA
$("#grifes").change(function(){
  	// Para cada grupo selecionado faça
  	var filtro = [];
  	$("#grifes option:selected").each(function(){
        if($(this).text() == 'Todas'){
          var todos = $(this).val().split(',');
          for(var i = 0;i < todos.length;i++){
              filtro.push(todos[i].trim());
          }
        } else {
		      filtro.push($(this).val().trim());
        }
	 });

	//console.log(filtro);
	$('[type=search]').val('"'+filtro.join('|')+'"');
	$('[type=search]').trigger('keyup').trigger('change');
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