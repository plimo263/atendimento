$('#enviar').click(function(){
	$("#enviar").unbind('click');
	var nome = $("#lista-usuarios").val();
		// Dados validados submeter formulario pelo ajax
		$.ajax({
			method: 'POST',
			url: '/validaResetarSenhaUsuario',
			data : {nome: nome}
			}).done(function(data){
				// Retorna as informacoes informando que os menus foram inclusos com sucesso
					alert(data);
				// Recarrega a pagina, assim o cliente não tem risco de submeter o mesmo formulario.
				window.setTimeout('location.reload()', 1000);
				}).fail(function(d){
					alert('Falhou ' + d);

				});
		
});
