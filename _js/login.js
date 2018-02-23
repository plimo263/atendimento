$("#enviar").click(function(){
	 var nome = $("#nome").val();
	 var senha = $("#senha").val();
    if((nome.length >= 2) && (senha.length >=3)){
		$.ajax({ method: 'POST', 
			url: '/validaLogin', 
			data: {nome: nome, senha: senha} 
	  }).done(function(data){
			if(data == 'true'){
				window.location.replace('/logado');
			}else{
				window.setInterval(function(){ $("#erro").css("color", "black").text('Usuario e/ou senha invalidos').fadeToggle(1000);}, 1000);
				}
		}).fail(function(d){
			alert('Erro ao receber resposta. Contate o administrador do site');
		});
	} else {
		$("#erro").css("color", "red").text('Usuario e/ou senha deixados em branco');
	} 
});
