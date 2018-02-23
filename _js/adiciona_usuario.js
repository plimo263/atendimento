/*
Autor:	Marcos Felipe da Silva Jardim
Versao:	1.0
Data:	30-01-2017

*/

$('#enviar').click(function(){

	// Recuperando o nome de usuario e a senha
	nome = $('#nome').val();
	senha1 = $('#senha1').val();
	senha2 = $('#senha2').val();
	// Verificando se as senhas são identicas e se os campos foram preenchidos
	if(nome != "" && senha1 != "" && senha2 != ""){
			if(senha1 == senha2){
				// Dados validados submeter formulario pelo ajax
				$.ajax({
					method: 'POST',
					url: '/validaAdicionaUsuario',
					data : {nome: nome, senha1: senha1}
				}).done(function(data){
					// Limpando campo de erro e exibindo a resposta
					$("#erro").text();
					$("#resposta").text(data);
					window.setTimeout('location.reload()', 2000);
				});
			} else {
				$("#erro").text('Senhas nao sao identicas');
			}
	} else {
		$("#erro").text('Preencha os campos corretamente');
	}
});
