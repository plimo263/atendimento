/*
Autor:	Marcos Felipe da Silva Jardim
Versao:	1.0
Data:	30-01-2017

*/

$('#enviar').click(function(){
	$("#enviar").unbind('click');
	var nome = $("#lista-usuarios").val();
		// Dados validados submeter formulario pelo ajax
		$.ajax({
			method: 'POST',
			url: '/validaRemoveLojaUsuario',
			data : {nome: nome}
			}).done(function(data){
				$(".formularios div.row").each(function(){
					$(this).remove();
				});
				// Incrementando o novo formulario
				$(".formularios").append(data);

			$("#adicionar").bind('click', function(){
				if($('input.checados').is(':checked')){
						// Gerando um array com as filiais escolhidas pelo usuario
						var dados = new Array();
						// Gerando um loop e retirando todas as filiais escolhidas pelo usuario
						$(".checados:checked").each(function(index, value){
							// Incrementando no array dados
							dados[index] = $(this).val();
						});
						// Convertendo os dados do array para serem enviados no servidor. Converter para string
						dados = dados.join('&');
						$.ajax({
								method: 'POST',
								url: '/validaRemoveLojaUsuario',
								data: {nome: nome, filiais: dados}
								}).done(function(data){
									alert(data);
									window.setInterval('location.reload()', 2000);
								}).fail(function(d){
									alert('Erro ao excluir as filiais');
								});
							} else {
								alert('Favor escolher pelo menos uma filial');
							}
						});
		
					});
			});
		
