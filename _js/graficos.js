/*
autor: 	Marcos Felipe da Silva Jardim
versao: 1.0
data:	2017-02-28

*/

$(document).ready(function(){
	
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
			//	alert(data);
				window.setTimeout('location.reload()',100);
					
			}).fail(function(d){
				alert('falhou');
			});
					
		}

	});

});