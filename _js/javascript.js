// Verificando qual a plataforma de acesso
var navegador = navigator.userAgent;
navegador += navigator.appVersion;

function trocaImg(){
    var $atual = $(".ativa");
    var $proxima;
        if($("img.ativa").next().length > 0){
            $proxima = $("img.ativa").next();
        } else {
            
            $proxima = $(".imagens img:first");
        }
    $($atual).fadeOut(function(){
       $($atual).removeClass("ativa");
       $($proxima).fadeIn().addClass("ativa");
    });
}

if((navegador.indexOf("android") != -1) || (navegador.indexOf("Android") != -1)){
   $("div.imagens").remove();
} else {
   setInterval("trocaImg();", 3000);
}

// Carregando um tooltip que é uma pequena caixa que exibe a mensagem quando o mouse encosta acima de um link
/*
$( function() {
    $( document ).tooltip();
  } );
*/
// Alterando os links para a cor vermelha como solicitado
$("a").addClass("text-danger");

// Mudando o comportamento dos links para que quando o mesmo for clicado exibir o menu inferior relacionado á ele
var cliqueMenu = true;

$(".menu li").click(function(){
   if(cliqueMenu){
	$(this).children(".submenu").css("display", "block").css("margin-left", "-1.5vw");
    $(this).children(".submenu").children().children().css("color", "black").css("font-weight", "normal");
	cliqueMenu = false;
   } else {
	$(this).children(".submenu").css("display", "none");
    cliqueMenu = true;
   }
});
// Acordeon
  $( function() {
    $( "#accordion" ).accordion();
  } );


// Colocando um tamanho de fonte menor em todas as tabelas
$("table").addClass("small");



// Verificando se os campos do formulario inclusao de usuario foram preenchidos corretamente

$("#enviarAddUser").click(function(){
		var nome = $("#nome").val();
		var senha1 = $("#senha1").val();
		var senha2 = $("#senha2").val();
	if(nome != ""){
	   if((senha1 != "") && (senha2 != "")){
		   if(senha1 == senha2){
			  $("#formAddUser").submit(); 
		   } else {
			   $("#erroAddUser").text('As senhas não são identicas.');
          }
		} else {
				$("#erroAddUser").text('Algum campo de senha deixado em branco.');
		}
	} else {
		$("#erroAddUser").text('Campo nome esta em branco.');
	}
});

// Validar formulario de exclusao de usuarios
$("#enviarDelUser").click(function(){
    $("#formDelUser").submit();
});

$("#enviarMenuUser").click(function(){
    $("#formMenuUser").submit();
});

$("#ativarMenu").click(function(){
   $("#formMenuAdd").submit(); 
});

$(document).ready(function(){
  // INCLUSO PARA REGISTRAR ACESSO DO USUARIO, ENVIANDO DADOS AO CONTADOR
  $('.navbar-nav:first li a').click(function(e){
    var href = $(this).attr('href');
    if(href.search('#') == -1 && href.search('/logado') == -1){ // Vamos verificar se é um link normal ou UM SUBMENU, SE FOR LINK NORMAL VAMOS EXECUTAR O CONTADOR
      href = href.slice(1);
      $.ajax({
        method: 'POST',
        url: '/grava_visita',
        data: {pagina: href}
      }).done(function(data){
          console.log('ok');
      }).fail(function(){
        console.log('falha');
      });
    }
  });

});

// FUNCAO USADA PARA CONVERTER VALORES MONETARIOS
function converter(valor){
    valor = valor.replace('.',',');// Substituindo ponto por virgula
    var valorReverso = valor.split("").reverse(); // Reverte a string
    var recebeConvertido = '';
    var x = 0;// Contado a cada 3 vai incluir ponto
    for(var i =0;i< valorReverso.length;i++){
        // Se o x for inferior a 4 entao vamos incrementar x e colocar o caractere
        if(x < 4){
            x += 1
            recebeConvertido += valorReverso[i];
        } else if(x % 3 == 0){ // X nao tem resto na divisao por tres, entao incluiremos o ponto e incrementamos x
            recebeConvertido += '.' + valorReverso[i];
            x += 1
        // X já e maior que 4 e nao e divisivel por 3, entao vamos incrementar x e adicionar o caractere a d
        } else {
            recebeConvertido += valorReverso[i];
            x += 1
        }
    }
    //# Reverte novamente a string para o formato de ordem original
    var valor2 = 'R$ '+recebeConvertido.split("").reverse().join("");
    return valor2;

}