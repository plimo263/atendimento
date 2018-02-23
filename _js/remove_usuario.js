/*
autor: Marcos Felipe da Silva Jardim
versao: 1.0
Data: 02-02-2017

Objetivo: Validar formulario de envio para remocao de usuario

*/

$("#enviar").click(function(){
	idUsuario = $("#lista-usuarios").val();

	if (idUsuario == null){
		alert('Não existem usuarios para excluir');
	}else {
		// Realiza um requisicao ajax para excluir o usuario selecionado
		$.ajax({
			method: 'POST',
			url: '/validaRemoveUsuario',
			data: {codigo: idUsuario}
			}).done(function(data){
				// Exibe uma mensagem dizendo que o cliente foi excluido com exito
				$("#erro").text(data);

				// Recarrega a pagina, assim o cliente não tem risco de submeter o mesmo formulario.
				window.setTimeout('location.reload()', 2000);
			}).fail(function(d){
				alert('Erro, possivelmente esta tentando excluir um usuario que nem mesmo existe');
			});
	}
});
