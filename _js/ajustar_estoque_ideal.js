/*
Nome: ajustar_estoque_ideal
Autor:	Marcos Felipe da Silva Jardim
versão: 1.0
-----------------------------------------------
Historico de versão:
1.1v	Registros dos grupos coloridos com cinza claro para dar destaque e espaçamento entre grupos
*/
/// A variavel indice define o indice do registro clicado e a variavel clicado permite(ou não) a edição do campo
var indice, clicado = true, tabela = '';
$(document).ready(function(){

  $('table').addClass('minhaTabela');
  $('table:last').attr('id', 'outra_tabela');


	// Inserindo fonte vermelha nos totais
	$('.minhaTabela tbody tr').each(function(){
		$(this).children().each(function(index, value){
			if(index == 1){
				if($(this).text() == 'TOTAIS'){
					$(this).parent().css({'color':'red'});
				}
			}
		});
	});


// Caso um numero receba duplo click quer dizer que o usuario deseja alterar este valor
$('td').dblclick(function(){
    
    console.log(tabela);
    // Armazena o valor atual do td
    var valor = $(this).text();
    // Recupera o valor do segundo campo da linha atual do TD para verificar se ele é igual a TOTAIS
		var pai = $(this).parent().children().eq(1).text();
    // Se o valor for um numero e o pai não ser TOTAIS e clicado for igual a verdadeiro
		if((!isNaN(valor)) &&  (pai.search('TOTAIS') == -1) && clicado){
      // Incremente o campo de entrada de dados com o valor do campo TD no input
      $(this).html("<input class='entrada_de_dados' style='width: 4em' type=number value='"+valor+"' />");
      clicado = false; // Desabilite o clicado, isto impede multiplas alterações
      indice = $(this).context.cellIndex - 2; // Definindo o indice, este sera utilizado para pesquisar no objeto estoques
      // Qual e a tabela ?
      tabela = $(this).parent().parent().parent();
      // Quando a entrada tiver alguma tecla pressionada
      $('.entrada_de_dados').bind('keypress', function(e){
        // Verifique se esta tecla é a tecla enter
        if(e.which == 13){
          // Recupere o td acima do enter
          var paiDoEnter = $(this).parent();
          var td = $(this).val(); // Recupere o valor do campo input 
          var grupo = $(this).parent().parent().children().eq(0).text(); // Obtenha o grupo recuperando o valor do primeiro td da linha
          var grife = $(this).parent().parent().children().eq(1).text(); // Obtenha a grife recuperando o valor do segundo td da linha do enter
          $(this).parent().text(td); // Defina o td com o valor recuperado no campo input e já elimine este campo
          // Verificando qual o id da tabela
          if($(tabela).attr('id') == 'minhaTabela'){
            var ID = estoques[grupo][grife][indice];
          } else if($(tabela).attr('id') == 'outra_tabela'){
            var ID = estoques_oc[grupo][grife][indice];
          }

          // Defina uma fonte de cor azul com negrito e tamanho 10 para destacar as celulas alteradas
          $(paiDoEnter).css({'color':'blue', 'font-weight':'bolder', 'font-size':'10pt'});
          clicado = true; // Ative o clicado, assim deixamos liberado a alteração de outra celula

          // Envie esta alteração para o servidor definindo o ID e a quantidade de estoque
          $.ajax({
              method: 'POST',
              url: '/ajustar_estoque_ideal',
              data: {ID:ID, quantidade: td}
          }).done(function(data){
              console.log('atualizado');
             // alert(data);
          }).fail(function(){
            alert('Falhou ao atualizar, tente novamente');
          });
        }
      });
      
		}
		
});

 $('.minhaTabela').DataTable({
           // Fixa o cabecalho
          "fixedHeader": true,           
           // Remove a paginacao da tabela
          "bPaginate": false,
          // Remove ordenacao
          "ordering" : true,
         // "fixedColumns": {"leftColumns": 2},
          //"order" : [1],
          // Este recurso desativa a ordenaÃƒÂ§ÃƒÂ£o em algumas colunas
          //"columnDefs": [
           //         { "orderable": false, "targets": [1] }
           // ],
          // Ativar a movimentação das colunas
          "colReorder" : true,
          // Ativa a barra de rolagem vertical
          "scrollY": 250,
          // se o eixo Y for menor que onde a tabela deve estar, entÃƒÂ£o nÃƒÂ£o colocar barra de rolagem
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
          "retrieve": true,
          // Atualiza campos no texto informado
          "language": {
        "search": "Procurar na tabela",
        "emptyTable" : "Nao ha dados",
        "zeroRecords": "Sem registros com valor informado",
      "decimal":",",
      "thousands":"."}
  });

 $("#pesquisar").click(function(){

  var grupos = $("#grupos").val();
  var grupo = grupos.toString();
  var grife = $("#grife").val();
  var quantidade = $("#quantidade").val();
  var tipo = $("#tipo").val();
  var tipo = tipo.toString();

if((grife.length >= 3) && (!isNaN(quantidade))){
  $.ajax({
      method: 'POST',
      url: '/ajustar_estoque_ideal2',
      data: {grupo: grupo, grife:grife,quantidade:quantidade, tipo}
      
      }).done(function(data){
        // window.setTimeout('location.reload()',100);
        alert(data);
          
      }).fail(function(d){
        alert('falhou');
      });
  
} else {
  alert('Favor Preencher os campos corretamente. ');
}

});
// Solicitação do Bruno para alteração de cor do registro de grupos, destacar para facilitar entendimento
$('tr td:contains("TOTAIS")').parent().css({'background-color':'#999'}).after('<p style="position:relative;height:2em;"></p>');
});
