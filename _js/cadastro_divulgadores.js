/*
autor: 	Marcos Felipe da Silva Jardim
versão: 1.0
data:	27-08-2017

*/
var mod = '<div class="modal fade" id="myModal" role="dialog"><div class="modal-dialog"><div class="modal-content">';
mod += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal">×</button><h4 class="modal-title">INCLUSAO DE DIVULGADOR</h4></div>';
mod += '<div class="modal-body"><div class="row"><div class="col-sm-4"></div><div class="col-sm-4">DIVULGADOR: <input type=text name=divul id="divul" class="form-control" />';
mod += '<p class="text-danger text-uppercase" id="erro_divul"></p></div><div class="col-sm-4"></div></div>';
mod += '<br/><div><p class="text-center "><button id="inclui_divul" class="btn btn-danger btn-xs">INCLUIR</button></p></div></div>';
mod += '<div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>';

var mod2 = '<div class="modal fade" id="myModal2" role="dialog"><div class="modal-dialog"><div class="modal-content">';
mod2 += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal">×</button><h4 class="modal-title">EXCLUSAO DE DIVULGADOR</h4></div>';
mod2 += '<div class="modal-body"><div class="row"><div class="col-sm-4"></div><div class="col-sm-4">DIVULGADOR: <select id="exclu" name=exclu class="form-control"></select>';
mod2 += '<p class="text-danger text-uppercase" id="erro_exclu"></p></div><div class="col-sm-4"></div></div>';
mod2 += '<br/><div><p class="text-center "><button id="exclu_divul" class="btn btn-danger btn-xs">EXCLUIR</button></p></div></div>';
mod2 += '<div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>';

$('body').append(mod+mod2);

$(function(){

	tabe = $('#minhaTabela').DataTable({
           // Fixa o cabecalho
          // fixedHeader : true,
           
           // Remove a paginacao da tabela
          "bPaginate": false,
          // Remove ordenacao
          "ordering" : true,
          "order" : [1],
                    
          "colReorder" : true,
          // Ativa a barra de rolagem vertical
          "scrollY": 250,
          // se o eixo Y for menor que onde a tabela deve estar, entÃ£o nÃ£o colocar barra de rolagem
          "scrollCollapse": true,
          // E ordena em rolagem horizontal
          "scrollX": true,
          
          // Retira a informacao inferior
          "info" : false,
          // Ativa a responsividade
          "responsive": true,
          // Desativar largura inteligente
          "autoWidth": false,
          
          // Utilizar expressoes regulares
          "search" : {
              "regex": true
           },
          // Reiniciar o datatables
          retrieve: true,
          // Atualiza campos no texto informado
          "language": {
              "search": "Procurar na tabela",
              "emptyTable" : "Nao ha dados",
              "zeroRecords": "Sem registros com valor informado",
              "decimal":",",
              "thousands":"."}
    });
	
});

$("#enviar").click(function(){
	var lojas, divulgadores;
  lojas = $("#lojas").val();divulgadores = $('#divulgador').val();

    if(lojas != "" && divulgadores != ""){
    $.ajax({
        method: 'POST',
        url: '/cadastro_divulgadores',
        data: {lojas:lojas, divulgadores:divulgadores}
        
        }).done(function(data){
          if(data == 'OK'){
          	window.setTimeout('location.reload()',100);
          } else {
          	alert(data);
          }
            
        }).fail(function(d){
          alert('falhou');
        });
    } else{
    	$('#erro').empty();
    	$('#erro').html('<span class="glyphicon glyphicon-asterisk"></span> Preencha o divulgador corretamente');
    }
            
});

// Quando deseja incluir um divulgador que não existe clica-se no link de inclusão de divulgador
$('#incluir_divulgador').click(function(e){
	e.preventDefault();
	$('#myModal').modal({backdrop:"static"}); // O modal desce liberando as opções
	$('#inclui_divul').bind('click', function(e){ // Depois de preenchido e clicado em incluir verificar se o nome do divulgador foi preenchido
		e.preventDefault();
		var novoDivul = $('#divul').val();
    
		if(novoDivul != ""){
			$('#erro_divul').empty(); // Dados validados, limpando mensagem de erro
			$.ajax({
        contentType:"charset=utf-8",
				method:'POST',url:'/incluir_divulgador',data:{nome:novoDivul}
        
			}).done(function(data){
				if(data == 'ERRO'){ // Retornou mensagem de erro, divulgador já existe
					alert('Não foi possível incluir divulgador, verifique se o mesmo já existe');
				} else if(data == 'BRANCO'){ // Foi enviado dados em branco do divulgador. Tentado passar pelo formulario sem validação
					alert('O Divulgador esta em branco, favor preencher corretamente');
					
				} else{ // LImpar select do divulgador e incluir novos option para os divulgadores cadastrados
        	$('#divulgador').empty();
          divulgadores = data;
          var opt = '';
          for(var i in divulgadores){
             opt += '<option value="'+i+'">'+divulgadores[i]+'</option>';
          }
					$('#divulgador').append(opt); 
					$('#divul').val(""); // Limpando o campo preenchido do modal
					$('[data-dismiss="modal"]').trigger('click'); // Ocultando o modal
          $('#inclui_divul').unbind('click');
				}

			}).fail(function(){
				alert('Falhou');
			});
		} else { // Divulgador sem nome, incluir mensagem de erro
			$('#erro_divul').empty();
			$('#erro_divul').html('<span class="glyphicon glyphicon-asterisk"></span> Favor incluir o nome do divulgador');
		}
	});

});

//FUNCAO UTILIZADA QUANDO SE DESEJA EXCLUIR UM DIVULGADOR
// Quando deseja incluir um divulgador que não existe clica-se no link de inclusão de divulgador
$('#excluir_divulgador').click(function(e){
  e.preventDefault();
  var opt = '';
  for(var i in divulgadores){
    opt += '<option value="'+i+'">'+divulgadores[i]+'</option>';
  }
  $('#exclu').empty();$('#exclu').append(opt);

  $('#myModal2').modal({backdrop:"static"}); // O modal desce liberando as opções
  $('#exclu_divul').bind('click', function(e){ // Depois de preenchido e clicado em excluir o divulgador é excluido
    e.preventDefault();
    var excluDivul = $('#exclu').val();
    if(excluDivul != ""){
      $('#erro_exclu').empty(); // Dados validados, limpando mensagem de erro
      $.ajax({
        method:'POST',url:'/remover_divulgador',data:{nome:excluDivul}

      }).done(function(data){
        if(data == 'BRANCO'){ // Foi enviado dados em branco do divulgador. Tentado passar pelo formulario sem validação
          alert('O Divulgador esta em branco, favor escolher um para exclusao');
          
        } else{ // LImpar select do divulgador e incluir novos option para os divulgadores cadastrados
          $('#divulgador').empty();
          divulgadores = data;
          var opt = '';
          for(var i in divulgadores){
             opt += '<option value="'+i+'">'+divulgadores[i]+'</option>';
          }
          $('#divulgador').append(opt); // Apendando os dados
         
          $('[data-dismiss="modal"]').trigger('click'); // Ocultando o modal
        }

      }).fail(function(){
        alert('Falhou');
      });
    } else { // Divulgador sem nome, incluir mensagem de erro
      $('#erro_divul').empty();
      $('#erro_divul').html('<span class="glyphicon glyphicon-asterisk"></span> Favor incluir o nome do divulgador');
    }
  });
});


// Funcao utilizada para excluir divulgadores não mais utilizados
$('.glyphicon-trash').click(function(e){
	var regPai = $(this).parent().parent();
	var divulgadorGrupoFilial = $(this).attr('id'); // Recuperando o id
	$.ajax({
		method: 'POST',url:'/exclui_divulgador', data:{divulgadorGrupoFilial:divulgadorGrupoFilial}
	}).done(function(data){
		if(data == 'OK'){
			$(regPai).fadeOut('slow');
		}
	}).fail(function(){
		alert('Falhou');
	});

});