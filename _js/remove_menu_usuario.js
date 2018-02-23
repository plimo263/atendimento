/*
Autor:	Marcos Felipe da Silva Jardim
Versao:	1.0
Data:	01-02-2017

*/

$('#enviar').click(function(){
	$("#enviar").unbind('click');
	var nome = $("#lista-usuarios").val();
		// Dados validados submeter formulario pelo ajax
		$.ajax({
			method: 'POST',
			url: '/validaRemoveMenuUsuario',
			data : {nome: nome}
			}).done(function(data){
				$(".formularios div.row").each(function(){
					$(this).remove();
				});
				// Incrementando o novo formulario
				$(".formularios").append(data);
				// Inserindo o estilo de click no botao do formulario
				$("#remover").bind('click');

				$('#remover').click(function(){
					// Gerando segundo ajax agora para realmente incluir os menus
					if($('input.checados').is(':checked')){
						// Recuperando todos os campos
						
						var dados2 = new Array();
						$(".checados:checked").each(function(index, value){
							dados2[index] = $(this).val();
						});
						// Para os dados serem aceitos no servidor, converti para string o array
						dados2 = dados2.join('&');
						$.ajax({
							method: 'POST',
							url: '/validaRemoveMenuUsuario',
							data: { nome: nome, menus: dados2 }
							}).done(function(data){
								alert(data)
								// Recarrega a pagina, assim o cliente não tem risco de submeter o mesmo formulario.
								window.setTimeout('location.reload()', 2000);
							}).fail(function(d){
									alert('Falhou ' + d);
							});
					} else {
						alert('Marque pelo menos um menu');
					}
				});
		});
});
