/*
Autor: 		Marcos Felipe da Silva Jardim
versão: 	1.0
data: 		04-10-2017
*/

$('#enviar').click(function(){
	
	if($('#qtd').val() > 0){
		var quantidade = $('#qtd').val();
		// Enviando a quantidade desejada de inclusao de novas filiais
		$.ajax({
			method:'POST',url:'/cadastro_filial', data:{QTD:quantidade}
		}).done(function(data){
			console.log(data);
			$('#qtd_atual').text(data);

		}).fail(function(){
			alert('Erro ao enviar os dados.');
		});
		
	}
});