/**
autor: Marcos Felipe da Silva
data: 12-05-2017
versao: 1.0

*/
$(document).ready(function(){
$("#minhaTabela").DataTable({
 fixedHeader : true,
 fixedColumns : {  leftColumns: 2 },
 "bPaginate": false,
 "ordering" : true,
 "order" : [],
 "colReorder" : true,
 "scrollY": 350,
 "scrollCollapse": true,
 "scrollX": true,
 "info" : false,
 "responsive": true,
 "autoWidth": false,
 "search" : {
   "regex": true
 },
  "language": {
    "search": "Procurar na tabela",
    "emptyTable" : "NÃ£o hÃ¡ dados",
    "zeroRecords": "Sem registros com valor informado",
    "decimal":",",
	"thousands":"."
      }
});



 $("#pesquisar").click(function(){
var data1, data2;data1 = $("#data1").val();data2 = $("#data2").val();
D1 = new Date(data1);D2 = new Date(data2);
if(D1.getTime() > D2.getTime()){
	alert('A data DE nao deve ser maior que a data ATE.');
} else {
	var grupos = $("#grupos").val();var grupo = grupos.toString();
  var lojas = $("#lojas").val();var loja = lojas.toString();

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