/*

autor: Marcos Felipe da Silva Jardim
versão: 1.0
data: 31-07-2017

*/

$("#incluir").click(function(e){
	e.preventDefault();
	var cod_vendedor;

	if($('#nome_vendedor').val() == "" || $('#nome_vendedor').val() == null){
    	alert('Escreva o nome do vendedor.');
    	return false;
    } else if($('#cod_vendedor').val() == "" || $('#cod_vendedor').val() == null){
    	alert('Defina um codigo de vendedor para o vendedor a ser cadastrado');
    	return false;
    } else if(isNaN($('#cod_vendedor').val())){
      alert('São aceitos somente números.');
      return false;
    }

	cod_vendedor = $('#cod_vendedor').val();
	$.ajax({
		method: 'POST', url: '/recupera_codigo_vendedor', data:{cod_vendedor:cod_vendedor}
	}).done(function(d){
		 if(d == 'FALSE'){
    	alert('Este código já foi cadastrado para um vendedor. Favor informar outro codigo ou recadastrar vendedor.');

    } else{
		$('form').submit();
	}

	});
	


	
});

// Ao carregar a pagina faça algumas coisas para mim
$(document).ready(function(){
	$('.glyphicon-trash').css({'cursor':'pointer'}); // Coloca a mãozinha na lixeira :)	
  $('.filial').css({'cursor':'pointer'}); 

	$('.glyphicon-trash').click(function(e){
		e.preventDefault();
		console.log('click');
		var ID = $(this).attr('id');
		// Enviar dados para realizar a exclusao do registros
		$.ajax({
			method:'POST',url:'/excluir_vendedor',
			data:{ID:ID}
		}).done(function(data){
			$('#'+ID).parent().parent().fadeOut();

	   		$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();

		}).fail(function(){
			alert('Erro');
		});
	});

/*
// Evento que controla a alteração de filial para o vendedor
$('.filial').dblclick(function(){
    var loja = $(this);
    
    var select = "<select style='width:5em;' name=fil class='form-control altera_fil'>";
    // Montando select com as filiais disponiveis
    for(var f in filiais){
        if(filiais[f] == $(loja).text()){
          select += "<option selected value="+f+">"+filiais[f]+"</option>";
        } else {
          select += "<option value="+f+">"+filiais[f]+"</option>";
        }
    }
    select += "</select>";

    $(loja).parent().empty().append(select);

    $('.altera_fil').bind('keydown', function(e){
        if(e.which == 13){
          var valor = $(this).val();
          var ID = $(this).parent().parent().children().eq(4).children().eq(0).attr('id')+'&'+valor;
          $.ajax({
            method: 'POST',url:'/atualiza_cadastro_vendedor', data:{ID:ID}
          }).done(function(data){
             alert(data);
          }).fail(function(e){
            alert('FALHOU');
          });

          $(this).unbind('keydown');
          $(this).parent().empty().append('<span class="filial">'+filiais[valor]+'</a>');
          vinculaEventoDblclick();
        }
    });

});
*/
vinculaEventoDblclick();

	var tabe = $('#minhaTabela').DataTable({
           // Fixa o cabecalho
          // fixedHeader : true,
           
           // Remove a paginacao da tabela
          "bPaginate": false,
          // Remove ordenacao
          "ordering" : true,
          //"order" : [1],
          //"fixedColumns":[1],
          // Este recurso define a largura das colunas
          
          "columns": [
              { "width": '10%'},
	           { "width": '10%'},
	            { "width": '10%'},
	             { "width": '10%'},
	              { "width": '5%'},
	               { "width": '10%'}
          ],
          

          // Ativar a movimentaÃ§Ã£o das colunas
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

// Funcao para sempre vincular o evento dlbclick
function vinculaEventoDblclick(){
  $('.filial').css({'cursor':'pointer'}); 
    $('.filial').dblclick(function(){
            var loja = $(this);
            var select = "<select style='width:5em;' name=fil class='form-control altera_fil'>";
            // Montando select com as filiais disponiveis
            for(var f in filiais){
              if(filiais[f] == $(loja).text()){
                select += "<option selected value="+filiais[f]+">"+filiais[f]+"</option>";
              } else {
                select += "<option value="+filiais[f]+">"+filiais[f]+"</option>";
              }
            }
            select += "</select>";

            $(loja).parent().empty().append(select);

            $('.altera_fil').bind('keydown', function(e){
              if(e.which == 13){
                var valor = $(this).val();
                var ID = $(this).parent().parent().children().eq(4).children().eq(0).attr('id')+'&'+valor;
                $.ajax({
                    method: 'POST',url:'/atualiza_cadastro_vendedor', data:{ID:ID}
                }).done(function(data){
                 
                }).fail(function(e){
                  alert('FALHOU');
                });
                $(this).unbind('keydown');
                $(this).parent().empty().append('<span class="filial">'+valor+'</a>');
                vinculaEventoDblclick();

              }
            });
          });
}