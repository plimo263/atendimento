/*
    AUTOR:      MARCOS FELIPE DA SILVA JARDIM
    VERSAO:     1.0
    DATA:       08-09-2016
    
    OBJETIVO:   VALIDAR CAMPOS DE SENHA DIGITADOS NA PAGINA altera_senha da área admin
*/

$("#enviar").click(function(){
   var senhaAntiga = $("#senha1").val();
   var senhaAtual = $("#senha2").val();
   var senhaAtual2 = $("#senha3").val();
   $("#erro").text();
    
   if((senhaAntiga != "") && (senhaAtual != "") && (senhaAtual2 != "")){
       if(senhaAtual == senhaAtual2){
         // Dados validados submeter formulario pelo ajax
          $.ajax({
			type: 'POST',
			url: '/atualizaSenha',
			data: {senha: senhaAntiga, novaSenha : senhaAtual}  
		   }).done(function(data){
			   $("#erro").text();
			   $("#resposta").text(data);
			   });
       } else {
           // Os campos repetir senha e nova senha não são identicos.
           $("#erro").text(' Os campos \'Nova senha\' e \'Repetir senha\' não são idênticos.');
       }
   } else {
       $("#erro").text(' Preencha todos os campos.');
   } 
});
