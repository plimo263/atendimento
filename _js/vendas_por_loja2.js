/*
Autor:	Marcos Felipe da Silva Jardim
Versão: 1.0
Data:	23-02-2017

Ola

*/

var tabe;
// FUNCAO QUE RECRIA A TABELA PARA PERMITIR ORDENACAO DOS CAMPOS
function recriaTabela(diasTrabalhados){
     tabe = $('#minhaTabela').DataTable({
             // Fixa o cabecalho
            // fixedHeader : true,
             
             // Remove a paginacao da tabela
            "bPaginate": false,
            // Remove ordenacao
            "ordering" : true,
            "order" : [1],
            "fixedColumns":[1],
            // Este recurso desativa a ordenaÃ§Ã£o em algumas colunas
            //"columnDefs": [
             //         { "orderable": false, "targets": [1] }
             // ],
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
  // Define o campo de entrada para alteracao dos dados
  $('[type=search]').parent().html('Ajustar dias trabalhados &nbsp;&nbsp;<input class="entrada_dados" style="width: 5em" type=number value="" autofocus/>&nbsp;&nbsp;');
  $('.entrada_dados').val(diasTrabalhados);

  $('.entrada_dados').bind('change', function(){
    var valorAtualDiasTrabalhados = $(this).val();

      $('tbody tr').each(function(index, value){ // Passe por cada registro e calcule as colunas
         
         if($(this).children().eq(3).text().search('DIAS') != -1){

          } else {
            // COLUNA 3 'DIAS TRABALHADOS'
            $(this).children().eq(3).text(valorAtualDiasTrabalhados).css({'color':'blue','font-weight':'bolder'});

            // COLUNA 2 'DIAS METAS'
            var metaDias = $(this).children().eq(2).text();

            // VALOR DIAS TRABALHADOS COLUNA 3
            //valorAtualDiasTrabalhados = valorAtualDiasTrabalhados;

            // VALOR DA COLUNA 4 'VENDA DIAS TRABALHADOS'
            var vendaDiasTrabalhados = parseFloat($(this).children().eq(4).text().replace('R$','').replace('.','').replace(',','.')).toFixed(2);
            
            // VALOR DA COLUNA 7 'VENDA MEDIA DIARIA'
            var vendas_media_diaria = (parseFloat($(this).children().eq(4).text().replace('R$','').replace('.','').replace(',','.')) / valorAtualDiasTrabalhados).toFixed(2);
            // Convertendo o valor para monetario
            $(this).children().eq(7).text(converter(vendas_media_diaria));

            // VALOR DA COLUNA 10 'PROJECAO VENDA MENSAL ' Multiplicar (COLUNA 2 * COLUNA 7) o segundo campo com o setimo, meta_dias * venda_media_diaria 
            var projecaoVendaMensal = parseFloat(vendas_media_diaria * metaDias).toFixed(2);
            // Definindo valor da coluna de projecao_venda_mensal
            $(this).children().eq(10).text(converter(projecaoVendaMensal));

            // 8 * 3 = 5 oitava coluna(contando do zero) vezes a terceira  gera resultado da quinta 
            // meta_diaria * dias_trabalhados = meta dias trabalhados
            // VALOR COLUNA 8 'META DIARIA'
            var valorMetaDiaria = parseFloat($(this).children().eq(8).text().replace('R$','').replace('.','').replace(',','.')); // coluna 8

            // VALOR DA COLUNA 5
            var metaDiasTrabalhados = Math.round(parseFloat(valorMetaDiaria * valorAtualDiasTrabalhados)).toFixed(2); // coluna 5
            $(this).children().eq(5).text(converter(metaDiasTrabalhados)); // coluna 5

            // VALOR COLUNA 6 'SALDO DE VENDA'
            var saldoDeVenda = parseFloat(vendaDiasTrabalhados - metaDiasTrabalhados).toFixed(2);            
            // 4 - 5 = 6 venda_dias_trabalhados - meta_dia_trabalhados = saldo_de_venda
            $(this).children().eq(6).text(converter(saldoDeVenda)).css({'color':corSaldoDeVenda(saldoDeVenda),'font-weight':'bolder'});
            
            // (6C *-1)/(2C-3C)+8C = 9C
            // VALOR COLUNA 9 'META DIARIA ATUAL'
            var metaDiariaAtual = parseFloat(((saldoDeVenda * -1)/(metaDias - valorAtualDiasTrabalhados))+valorMetaDiaria).toFixed(2);
            var metaDiariaAtual1 = (saldoDeVenda * -1);
            var metaDiariaAtual2 = (metaDias - valorAtualDiasTrabalhados);
            var metaDiariaAtual3 = metaDiariaAtual1 / metaDiariaAtual2;
            var metaDiariaAtual4 = parseFloat(parseFloat(metaDiariaAtual3) + valorMetaDiaria).toFixed(2);

            // Se der numero infinito definir meta diaria pra 0,
            // a pedido do Bruno sera necessario dar a meta diaria atual o mesmo valor da meta diaria
            if(metaDiariaAtual4.search('fini') != -1 || metaDiariaAtual4 < 1){
              metaDiariaAtual4 = parseFloat($(this).children().eq(8).text().replace('R$','').replace('.','').replace(',','.')).toFixed(2);
              
            } 
            
            $(this).children().eq(9).text(converter(metaDiariaAtual4));
            // COLUNA 11
            var metaValor = parseFloat($(this).children().eq(11).text().replace('R$','').replace('.','').replace(',','.')).toFixed(2);
            // Percentual de meta COLUNA 12
            var percentualMeta = Math.round((projecaoVendaMensal /metaValor)*100).toFixed(0);
            if(percentualMeta.search('fini') != -1){
              percentualMeta = 0;
            }
            
            $(this).children().eq(12).text(percentualMeta+'%').css({'color':corPercentualMeta(percentualMeta),'font-weight':'bolder'});;

          } // FIM DO ELSE
      }); // FIM DO TBODY

      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
      tabe.destroy();

      // gerar os totais abaixo no rodape calculando todas as colunas 4 até 11
      var totalGeral = $('.rodape td').eq(4).text();
      var totais = ['TOTAL GERAL','DESCONTO MEDIO', 'DIAS META', 'DIAS TRABALHADOS', totalGeral, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
      // Percorrendo todos os registros e calcunando o rodape
      $('tbody tr').each(function(index, value){
          // Realizand o loop sobre cada registro e somando os totais
          $(this).children().each(function(index, value){
              // Se index for maior que 4 e menor que 12 realize a soma
              
              if(index > 4 && index < 12){
                totais[index] = (totais[index] + parseFloat($(this).text().replace('R$','').replace('.','').replace(',','.')));
              }
          });
      });

      // Realizar um loop para definir os valores do rodape
      $('.rodape td').each(function(index, value){
          if(index > 4 && index < 12){
            // Colocar 2 casas decimais depois converter o valor para string para depois transformar em monetario
              var valor = converter(totais[index].toFixed(2).toString());
              $(this).text(valor);
          } else {
            $(this).text(totais[index]);
          }

          if(index == 6){ // Definir cor para o saldo de venda, ver se esta no vermelho
            $(this).css({'color':corSaldoDeVenda(valor), 'font-weight':'bolder'});
          }
      });

    recriaTabela(valorAtualDiasTrabalhados);
            
  });
  
}

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
    var valorConvertido = recebeConvertido.split("").reverse().join("");
    valor = 'R$ '+valorConvertido;
    return valor;

}
// Funcao para definir cor do saldo de venda
function corSaldoDeVenda(valor){
  if(valor.search('-') != -1){
    return 'red';
  } else {
    return 'blue';
  }
}
// Funcao para definir cor de percentagemAtual
function corPercentualMeta(valor){
  if(valor < 100){
    return 'red';
  } else {
    return 'blue';
  }
}


$(document).ready(function(){
   tabe = $('#minhaTabela').DataTable({
           // Fixa o cabecalho
          // fixedHeader : true,
           
           // Remove a paginacao da tabela
          "bPaginate": false,
          // Remove ordenacao
          "ordering" : true,
          "order" : [1],
          "fixedColumns":[1],
          // Este recurso desativa a ordenaÃ§Ã£o em algumas colunas
          //"columnDefs": [
           //         { "orderable": false, "targets": [1] }
           // ],
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

  // Define o campo de entrada para alteracao dos dados
  $('[type=search]').parent().html('Ajustar dias trabalhados &nbsp;&nbsp;<input class="entrada_dados" style="width: 5em" type=number value="" autofocus/>&nbsp;&nbsp;');
  $('.entrada_dados').val();

  $('.entrada_dados').bind('change', function(){
    var valorAtualDiasTrabalhados = $(this).val();

    $('tbody tr').each(function(index, value){ // Passe por cada registro e calcule as colunas
         
      if($(this).children().eq(3).text().search('DIAS') != -1){

      } else {
          // COLUNA 3 'DIAS TRABALHADOS'
          $(this).children().eq(3).text(valorAtualDiasTrabalhados).css({'color':'blue','font-weight':'bolder'});
          // COLUNA 2 'DIAS METAS'
          var metaDias = $(this).children().eq(2).text();

          // VALOR DIAS TRABALHADOS COLUNA 3
          //valorAtualDiasTrabalhados = valorAtualDiasTrabalhados;

          // VALOR DA COLUNA 4 'VENDA DIAS TRABALHADOS'
          var vendaDiasTrabalhados = parseFloat($(this).children().eq(4).text().replace('R$','').replace('.','').replace(',','.')).toFixed(2);
            
          // VALOR DA COLUNA 7 'VENDA MEDIA DIARIA'
          var vendas_media_diaria = (parseFloat($(this).children().eq(4).text().replace('R$','').replace('.','').replace(',','.')) / valorAtualDiasTrabalhados).toFixed(2);

          // Convertendo o valor para monetario
          $(this).children().eq(7).text(converter(vendas_media_diaria));

          // VALOR DA COLUNA 10 'PROJECAO VENDA MENSAL ' Multiplicar (COLUNA 2 * COLUNA 7) o segundo campo com o setimo, meta_dias * venda_media_diaria 
          var projecaoVendaMensal = parseFloat(vendas_media_diaria * metaDias).toFixed(2);
          // Definindo valor da coluna de projecao_venda_mensal
          $(this).children().eq(10).text(converter(projecaoVendaMensal));

          // 8 * 3 = 5 oitava coluna(contando do zero) vezes a terceira  gera resultado da quinta 
          // meta_diaria * dias_trabalhados = meta dias trabalhados
          // VALOR COLUNA 8 'META DIARIA'
          var valorMetaDiaria = parseFloat($(this).children().eq(8).text().replace('R$','').replace('.','').replace(',','.')); // coluna 8

          // VALOR DA COLUNA 5
          var metaDiasTrabalhados = Math.round(parseFloat(valorMetaDiaria * valorAtualDiasTrabalhados)).toFixed(2); // coluna 5
          $(this).children().eq(5).text(converter(metaDiasTrabalhados)); // coluna 5

          // VALOR COLUNA 6 'SALDO DE VENDA'
          var saldoDeVenda = parseFloat(vendaDiasTrabalhados - metaDiasTrabalhados).toFixed(2);            
          // 4 - 5 = 6 venda_dias_trabalhados - meta_dia_trabalhados = saldo_de_venda
          $(this).children().eq(6).text(converter(saldoDeVenda)).css({'color':corSaldoDeVenda(saldoDeVenda),'font-weight':'bolder'});
            
          // (6C *-1)/(2C-3C)+8C = 9C
          // VALOR COLUNA 9 'META DIARIA ATUAL'
          var metaDiariaAtual = parseFloat(((saldoDeVenda * -1)/(metaDias - valorAtualDiasTrabalhados))+valorMetaDiaria).toFixed(2);
          var metaDiariaAtual1 = (saldoDeVenda * -1);
            var metaDiariaAtual2 = (metaDias - valorAtualDiasTrabalhados);
            var metaDiariaAtual3 = metaDiariaAtual1 / metaDiariaAtual2;
            var metaDiariaAtual4 = parseFloat(parseFloat(metaDiariaAtual3) + valorMetaDiaria).toFixed(2);

            // Se der numero infinito definir meta diaria pra 0,
            // a pedido do Bruno sera necessario dar a meta diaria atual o mesmo valor da meta diaria
            if(metaDiariaAtual4.search('fini') != -1 || metaDiariaAtual4 < 1){
              metaDiariaAtual4 = parseFloat($(this).children().eq(8).text().replace('R$','').replace('.','').replace(',','.')).toFixed(2);
              
            } 
            
          $(this).children().eq(9).text(converter(metaDiariaAtual4));
          // COLUNA 11
          var metaValor = parseFloat($(this).children().eq(11).text().replace('R$','').replace('.','').replace(',','.')).toFixed(2);
          // Percentual de meta COLUNA 12
          var percentualMeta = Math.round((projecaoVendaMensal /metaValor)*100).toFixed(0);
          if(percentualMeta.search('fini') != -1){
            percentualMeta = 0;
          }
            
            $(this).children().eq(12).text(percentualMeta+'%').css({'color':corPercentualMeta(percentualMeta),'font-weight':'bolder'});;

        } // FIm do else
      }); // Fim do $(tbody tr).each

      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
      // Destruindo a tabela
      tabe.destroy();

      // gerar os totais abaixo no rodape calculando todas as colunas 4 até 11
      var totalGeral = $('.rodape td').eq(4).text();
      var totais = ['TOTAL GERAL','DESCONTO MEDIO', 'DIAS META', 'DIAS TRABALHADOS', totalGeral, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
      // Percorrendo todos os registros e calcunando o rodape
      $('tbody tr').each(function(index, value){
          // Realizand o loop sobre cada registro e somando os totais
          $(this).children().each(function(index, value){
              // Se index for maior que 4 e menor que 12 realize a soma
              
              if(index > 4 && index < 12){
                totais[index] = (totais[index] + parseFloat($(this).text().replace('R$','').replace('.','').replace(',','.')));
              }
          });
      });

      // Realizar um loop para definir os valores do rodape
      $('.rodape td').each(function(index, value){
          if(index > 4 && index < 12){
            // Colocar 2 casas decimais depois converter o valor para string para depois transformar em monetario
              var valor = converter(totais[index].toFixed(2).toString());
              $(this).text(valor);
          } else {
            $(this).text(totais[index]);
          }

          if(index == 6){ // Definir cor para o saldo de venda, ver se esta no vermelho
            $(this).css({'color':corSaldoDeVenda(valor), 'font-weight':'bolder'});
          }
      });

    recriaTabela(valorAtualDiasTrabalhados);
            
  });



//$('.entrada_dados').trigger('change');
// Verificando se o cliente (navegador) esta correto antes de liberar o download

var navegador = navigator.userAgent;
if(!((navegador.indexOf("android") != -1) || (navegador.indexOf("Android") != -1)) && window.location.pathname
 == '/vendas_por_loja'){
  // Assumo que o cliente nao é mobile. Vamos liberar acesso para download do relatorio
  $("#baixar").fadeIn();
}    
// Se clicar em baixar, vamos trazer a planilha para download
$("#baixar").click(function(){
  var nome = $(this).attr('class');
  window.location.href = '/planilha/VENDAS_POR_LOJA_'+nome+'.xlsx';
});

 $("#pesquisar").click(function(){
    var data1, data2;
   	data1 = $("#data1").val();
   	data2 = $("#data2").val();

    D1 = new Date(data1);
    D2 = new Date(data2);


  if(D1.getTime() > D2.getTime()){
  	alert('A data DE nao deve ser maior que a data ATE.');
  } else {
  	var grupos = $("#grupos").val();
  	var grupo = grupos.toString();
    var lojas = $("#lojas").val();
    var loja = lojas.toString();

  	$.ajax({
  			method: 'POST',
  			url: '/vendas_por_loja',
  			data: {de: data1, ate: data2, grupos: grupo, lojas:loja}
  			
  			}).done(function(data){
  				window.setTimeout('location.reload()',100);
  					
  			}).fail(function(d){
  				alert('falhou');
  			});
  					
  					
  	
  }

});

//DEFININDO AS CORES DO SISTEMA
$('tr').each(function(){
   $(this).children().each(function(index, value){
    if(index == 6){
      if($(this).text().search('-') != -1){
        $(this).css({'color':'red','font-weight':'bolder'});
        
            } else if($(this).text().search('SALDO') != -1){
        
      } else{
        $(this).css({'color':'blue','font-weight':'bolder'});
      }
        } else if(index == 12){
      var meta = parseFloat($(this).text().replace(' ','').replace('%',''));
      if(meta < 100.00){
        $(this).css({'color':'red','font-weight':'bolder'});
      } else if($(this).text().search('META') != -1){

       } else{
        $(this).css({'color':'blue','font-weight':'bolder'});
      }
    }
  }); 
});




});

