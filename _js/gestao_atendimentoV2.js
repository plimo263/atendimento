/*
autor:	Marcos Felipe da Silva Jardim
versao: 1.0
data:	07-11-2017

-----------------------------------------------------------------
Historico de versao:

*/


/*************************************************************************************************************************/

// DIVS DOS DIAS DO MES, SEMANA E HORA
var divHora = new Div("","","hora_dia");
var divDiaDaSemana = new Div("","", "dia_da_semana");
var divDiaDoMes = new Div("","","dia_do_mes");

// SELECT PARA CONVERSAO DE QUANTIDADE E PERCENTUAL ABA ATENDIMENTO VENDAS VENDEDOR
var selecaoVendasComSemRx = new Selecao("venda_com_sem_rx", "form-control", "venda_com_sem_rx");

// SELECT PARA CONVERSAO DE QUANTIDADE E PERCENTUAL DA ABA RETORNO NAO VENDA
var selecaoRetornoNaoVendaComSemRx = new Selecao("retorno_nao_venda_com_sem_rx", "form-control", "retorno_nao_venda_comsemrx");

// SELECT PARA OS VENDEDORES NA ABA TIPO ATENDIMENTO
var selecaoTipoAtendimento = new Selecao("tipo_de_atendimento_selecao", "form-control", "tipo_de_atendimento_vendedor");

// SELECT PARA OS VENDEDORES NA ABA MOTIVO NAO VENDA
var selecaoMotivoNaoVenda = new Selecao("tipo_motivo_nao_venda_selecao", "form-control", "motivo_nao_venda_vendedor");

// SELECT PARA OS TIPOS DE ATENDIMENTO NA ABA DIVULGADORES
var selecaoDivulgadores = new Selecao("tipo_divulgadores", "form-control", "tipo_divulgadores")

// Array com os valores para o select da aba ATENDIMENTO VENDAS VENDEDOR e RETORNO NAO VENDA
var opcoesVendasComSemRx = [['quantidade_venda', 'QUANTIDADE'],['percentual_venda', 'PERCENTUAL']];
selecaoVendasComSemRx.addItens(opcoesVendasComSemRx);
selecaoRetornoNaoVendaComSemRx.addItens(opcoesVendasComSemRx);

// Array com os nomes dos vendedores para a aba TIPO DE ATENDIMENTO
var opcoesTipoDeAtendimento = vendedorTipoDeAtendimento;
selecaoTipoAtendimento.addItens(opcoesTipoDeAtendimento);

// Array com os nomes dos vendedores para a aba MOTIVO DE NAO VENDA
var opcoesMotivoNaoVenda = vendedorMotivoNaoVenda;
selecaoMotivoNaoVenda.addItens(opcoesMotivoNaoVenda);

// Array com os tipos de atendimento para a aba DIVULGADORES
var opcoesDivulgadores = atendimentoDivulgador;
selecaoDivulgadores.addItens(opcoesDivulgadores);

// DIV PARA O SELECT DE CONVERSAO DE QUANTIDADE E PERCENTUAL ABA ATENDIMENTO VENDAS VENDEDOR
var divConversaoVendaComSemRx = new DivRow();
divConversaoVendaComSemRx.addDiv('<br/>'+selecaoVendasComSemRx.getSelecao(), 2);
divConversaoVendaComSemRx.addDiv('',5);divConversaoVendaComSemRx.addDiv('',5);

// DIV PARA O SELECT DE CONVERSAO DE QUANTIDADE E PERCENTUAL ABA RETORNO NAO VENDA
var divConversaoRetornoNaoVendaComSemRx = new DivRow();
divConversaoRetornoNaoVendaComSemRx.addDiv('<br/>'+selecaoRetornoNaoVendaComSemRx.getSelecao(), 2);
divConversaoRetornoNaoVendaComSemRx.addDiv('',5);divConversaoRetornoNaoVendaComSemRx.addDiv('',5);

// DIV PARA O SELECT DOS VENDEDORES E SEUS GRAFICOS DA ABA TIPO DE ATENDIMENTO
var divTipoDeAtendimento = new DivRow();
divTipoDeAtendimento.addDiv('<br/>'+selecaoTipoAtendimento.getSelecao(), 2);
divTipoDeAtendimento.addDiv('',1);divTipoDeAtendimento.addDiv('', 9, '', 'tipo_de_atendimento');

// DIV PARA O SELECT DOS VENDEDORES E SEUS GRAFICOS DA ABA MOTIVO NAO VENDA
var divMotivoNaoVenda = new DivRow();
divMotivoNaoVenda.addDiv('<br/>'+selecaoMotivoNaoVenda.getSelecao(), 2);
divMotivoNaoVenda.addDiv('',1);divMotivoNaoVenda.addDiv('', 9, '', 'grafico_motivo_nao_venda');

// Select que altera entre os graficos de hora dia da semana e dia do mes
var selecaoHora = new Selecao("ajuste_hora", "form-control", "hora_semana_dia");
// Array que tem os valores para o select, onde o value é igual ao id das divs de hora, dia, e dia da semana
var opcoesHoraSemanaDia = [['hora_dia', "ATENDIMENTO /HORA"],['dia_da_semana', "DIA DA SEMANA"],['dia_do_mes', "DIA DO MES"]];
selecaoHora.addItens(opcoesHoraSemanaDia); // Apendando o array com as opcoes ao dia, dia da semana e hora

// Ocultando divs de dia da semana e dia do mes
divDiaDaSemana.addAtributo("style='display:none'"); 
divDiaDoMes.addAtributo("style='display:none'");

// Montando as 3 divs dentro de outra div (USAREMOS ESTE ESQUEMA PARA MONTAR A DIV MAIOR)
var divGrafDiaHoraMes = new Div(divHora.getDiv()+divDiaDaSemana.getDiv()+divDiaDoMes.getDiv(), "", "div_hora_semana_mes");

// CRIANDO A DIV PARA ARMAZENAR O GRAFICO DE ENTREGAS
var divEntrega = new Div('', '', 'graf_entregas');

// CRIANDO AS DIVS QUE FARAM PARTE DAS TABS
var divGrafSexo = new Div("", "", "sexo");
var divGrafDias = new DivRow();
divGrafDias.addDiv(divGrafDiaHoraMes.getDiv(), 4);divGrafDias.addDiv("",4);divGrafDias.addDiv('<br/>'+selecaoHora.getSelecao(), 3);divGrafDias.addDiv("",1);

// ** CRIANDO A DIV QUE VAI MONTAR A ABA ATENDIMENTO VENDAS VENDEDOR
var divGrafVendasVendedor = new DivRow();divGrafVendasVendedor.addDiv('',3, '', 'vendedor_com_sem_rx');divGrafVendasVendedor.addDiv('',1);
divGrafVendasVendedor.addDiv('',3,'','vendedor_com_rx');divGrafVendasVendedor.addDiv('',1);
divGrafVendasVendedor.addDiv('',3,'','vendedor_sem_rx');divGrafVendasVendedor.addDiv('',1);

// CRIANDO A DIV QUE VAI MONTAR A ABA RETORNO NAO VENDA
var divGrafRetornoNaoVenda = new DivRow();divGrafRetornoNaoVenda.addDiv('', 3, '', 'retorno_nao_venda_com_sem_rx');divGrafRetornoNaoVenda.addDiv('',1);
divGrafRetornoNaoVenda.addDiv('', 3, '', 'retorno_nao_venda_com_rx');divGrafRetornoNaoVenda.addDiv('',1);
divGrafRetornoNaoVenda.addDiv('', 3, '', 'retorno_nao_venda_sem_rx');divGrafRetornoNaoVenda.addDiv('', 1);

// CRIANDO A DIV QUE VAI ACOMODAR OS DIVULGADORES POR SELECAO
var divDivulgadores = new DivRow();divDivulgadores.addDiv(selecaoDivulgadores.getSelecao(),2);divDivulgadores.addDiv('',1);
divDivulgadores.addDiv('',9, '', 'div_divulgadores')
// CRIANDO UM SUB DIVTAB PARA ACOMODAR O GRAFICO E A TABELA DOS TIPOS DE ATENDIMENTO
var divTaAtendimento = new DivTabs(); // Div que vai separar tabela de grafico NA ABA TIPO DE ATENDIMENTO
divTaAtendimento.addDivTabs("GRAFICO", "grafico_atendimento", divTipoDeAtendimento.getDivRow());
divTaAtendimento.addDivTabs("TABELA", "tabela_atendimento", '');

// CRIANDO A SUB DIVTAB PARA ACOMODAR O GRAFICO E A TABELA DOS MOTIVOS DE NAO VENDA
var divTaMotivoNaoVenda = new DivTabs();
divTaMotivoNaoVenda.addDivTabs("GRAFICO", "sub_motivo_nao_venda", divMotivoNaoVenda.getDivRow());
divTaMotivoNaoVenda.addDivTabs("TABELA", "tabela_motivo_nao_venda", '');

// CRIANDO o tab que vai separar todos os campos dos graficos
var divTa = new DivTabs(); // Div para gerar o tab
divTa.addDivTabs("ATENDIMENTO SEXO", "por_sexo", divGrafSexo.getDiv());
divTa.addDivTabs("ATENDIMENTO VENDAS VENDEDOR", "por_vendedor", divConversaoVendaComSemRx.getDivRow()+divGrafVendasVendedor.getDivRow());
divTa.addDivTabs("ATENDIMENTO HORA/DIA", "hora_dia_mes_semana", divGrafDias.getDivRow());
divTa.addDivTabs("TIPO ATENDIMENTO", "tipo_atendimento", '<br/>'+divTaAtendimento.getDivTabs());
divTa.addDivTabs("MOTIVO NÃO VENDA", "motivo_nao_venda", '<br/>'+divTaMotivoNaoVenda.getDivTabs());
divTa.addDivTabs("RETORNO NÃO VENDA", "retorno_nao_venda", divConversaoRetornoNaoVendaComSemRx.getDivRow()+divGrafRetornoNaoVenda.getDivRow());
divTa.addDivTabs("DIVULGADORES", "divulgadores", '<br/>'+divDivulgadores.getDivRow());
divTa.addDivTabs("ENTREGA", "entrega", divEntrega.getDiv());

$('body').append(divTa.getDivTabs()); // Recuperando a tabulacao e apendando no corpo

/* LOCAL ONDE SE CRIA OS GRAFICOS */

// CRIANDO OS OBJETOS DOS GRAFICOS
var grafSexo = new Grafico(sexo, "", "", 'sexo');

var grafHora = new Grafico(hora_atendimento, "", "", 'hora_dia');
var grafDiaDaSemana = new Grafico(diaDaSemana, "", "", "dia_da_semana");
var grafDiaDoMes = new Grafico(diaDoMes, "", "", "dia_do_mes");

var grafVendedorComSemRx = new Grafico(vendaComSemRx, "", "", "vendedor_com_sem_rx");
var grafVendedorSemRx = new Grafico(vendaSemRx, "", "", "vendedor_sem_rx");
var grafVendedorComRx = new Grafico(vendaComRx, "", "", "vendedor_com_rx");

var grafRetornoNaoVendaComSemRx = new Grafico(retornoNaoVendaComSemRx, "", "", "retorno_nao_venda_com_sem_rx");
var grafRetornoNaoVendaComRx = new Grafico(retornoNaoVendaComRx, "", "", "retorno_nao_venda_com_rx");
var grafRetornoNaoVendaSemRx = new Grafico(retornoNaoVendaSemRx, "", "", "retorno_nao_venda_sem_rx");

try {
	// DESENHANDO O GRAFICO DO TIPO DE ATENDIMENTO RECUPERANDO O VENDEDOR SELECIONADO
	var vendedorSelecionado = $('#tipo_de_atendimento_vendedor').val().replace('&','');
	var grafTipoDeAtendimento = new Grafico(tipoDeAtendimento[vendedorSelecionado], "", "", "tipo_de_atendimento");

	// DESENHANDO O GRAFICO DO MOTIVO DE NAO VENDA RECUPERANDO O VENDEDOR SELECIONADO
	var vendedorSelecionado1 = $('#motivo_nao_venda_vendedor').val().replace('&M', '');
	var grafMotivoNaoVenda = new Grafico(motivoNaoVenda[vendedorSelecionado1], "", "", "grafico_motivo_nao_venda");

	// DESENHANDO O GRAFICO DOS DIVULGADORES COM O TIPO DE ATENDIMENTO SELECIONADO
	var divulgadorSelecionado = $('#tipo_divulgadores').val().replace('&D','');
	var grafDivulgadores = new Grafico(tipoDivulgador[divulgadorSelecionado], "", "", "div_divulgadores")

}catch(err){
	console.log('TENTAMOS CAPTURAR O VALOR DE UM SELECT QUE AINDA NAO TEM VALOR');
}

// DESENHANDO O GRAFICO DAS ENTREGAS
var grafEntrega = new Grafico(dadosEntrega, "", "", "graf_entregas");

// GERANDO OS TOTAIS
grafSexo.setTotal(1); // precisa ser analisado

grafHora.setTotal(1);
grafDiaDaSemana.setTotal(1);
grafDiaDoMes.setTotal(1);

grafVendedorComSemRx.setTotal(1, "ultima");
grafVendedorComRx.setTotal(1, "ultima");
grafVendedorSemRx.setTotal(1, "ultima");

grafRetornoNaoVendaComSemRx.setTotal(1,"ultima");
grafRetornoNaoVendaComRx.setTotal(1, "ultima");
grafRetornoNaoVendaSemRx.setTotal(1, "ultima");

grafEntrega.setTotal(1);

// Opcoes de graficos

/****************************************** OPCOES PARA GRAFICOS DA ABA SEXO ***************************************/
var optGrafSexo = {'title':'ATENDIMENTOS POR SEXO\n TOTAL: '+grafSexo.total,
	'width':650, is3D:true, 'height':400, legend:'right',
	         };

/***************************************** OPCOES PARA GRAFICOS DA ABA ATENDIMENTO /HORA DIA ***************************/
var optHora = {'title':'ATENDIMENTOS LOJA / HORA \n TOTAL: '+grafHora.total, legend: { position: 'none' },
	annotations: { alwaysOutside: true }, 'width':700, 'height':400,
	 bar: {groupWidth: "35%"}, chartArea:{left:50}};

var optDiaDaSemana = {'title':'ATENDIMENTOS LOJA / DIA DA SEMANA \n TOTAL: '+grafDiaDaSemana.total, legend: { position: 'none' }, 
	annotations: { alwaysOutside: true },'width':700, 'height':400,
	bar: {groupWidth: "35%"}, chartArea:{left:50}};

var optDiaDoMes = {'title':'ATENDIMENTOS LOJA / DIA DO MES \n TOTAL: '+grafDiaDoMes.total, chartArea: {left:50, width: '70%'},
	legend: { position: 'none' }, annotations: {
          alwaysOutside: true,
          }, 'width':1200, 'height':400,
	bar: {groupWidth: "20%"}};

/******************************************** OPCOES PARA GRAFICOS DA ABA ATENDIMENTO VENDAS VENDEDOR ************************/
var optVendaComSemRx = {'title':'TOTAL DE VENDAS POR VENDEDOR \n TOTAL: '+grafVendedorComSemRx.total, 'width':450, 'height':600,
 	bar: {groupWidth: "55%"}, legend:'none', annotations: { textStyle: {fontSize:10}, alwaysOutside: true }, hAxis:{minValue:0}};

var optVendaComRx = {'title':'VENDAS POR VENDEDOR COM RX \n TOTAL: '+grafVendedorComRx.total, 'width':450, 'height':600,
 	bar: {groupWidth: "55%"}, legend:'none', annotations: { textStyle: {fontSize:10},alwaysOutside: true}, vAxis:{minValue:0}};

var optVendaSemRx = {'title':'VENDAS POR VENDEDOR SEM RX \n TOTAL: '+grafVendedorSemRx.total, 'width':450, 'height':600,
 	bar: {groupWidth: "55%"}, legend:'none', annotations: { textStyle: {fontSize:10}, alwaysOutside: true }};

/******************************************** OPCOES PARA OS GRAFICOS DA ABA DE RETORNO NAO VENDA **************************/
var optRetonoNaoVendaComSemRx = {'title':'RETORNO DE NAO VENDA COM E SEM RX \n RETORNOS: '+grafRetornoNaoVendaComSemRx.total, 'width':450, 'height':600,
 	bar: {groupWidth: "55%"}, legend:'none', annotations: { alwaysOutside: true}};

var optRetornoNaoVendaComRx = {'title':'RETORNO DE NAO VENDA COM RX \n RETORNOS: '+grafRetornoNaoVendaComRx.total, 'width':450, 'height':600,
 	bar: {groupWidth: "55%"}, legend:'none', annotations: { alwaysOutside: true}};

 var optRetornoNaoVendaSemRx = {'title':'RETORNO DE NAO VENDA SEM RX \n RETORNOS: '+grafRetornoNaoVendaSemRx.total, 'width':450, 'height':600,
 	bar: {groupWidth: "55%"}, legend:'none', annotations: {alwaysOutside: true}};

/******************************************* OPCOES PARA OS GRAFICOS DA ABA TIPO DE ATENDIMENTO ******************************/
var optTipoDeAtendimento = {'title':'TIPO DE ATENDIMENTO VENDEDOR', 'width':950, is3D:true, 'height':400, legend:'right'};

/******************************************* OPCOES PARA OS GRAFICOS DA ABA MOTIVO NAO VENDA *********************************/
var optMotivoNaoVenda = {'title':'MOTIVO NAO VENDA VENDEDOR', 'width':950, is3D:true, 'height':400, legend:'right'};

/******************************************* OPCOES PARA OS GRAFICOS DA ABA DIVULGADORES *************************************/
var optDivulgadores = {'title':'DIVULGADORES', 'width':950, is3D:true, 'height':400, legend:'right'};

/******************************************* OPCOES PARA O GRAFICO DAS ENTREGAS *********************************************/
var optGrafEntregas = {'title':'ENTREGA NO PRAZO TOTAL: '+grafEntrega.total, 'width':650, is3D:true, 'height':400, legend:'right'};

try { 
	// ATRIBUINDO AS OPCOES
	grafSexo.setOpcoes(optGrafSexo);

	grafHora.setOpcoes(optHora);
	grafDiaDaSemana.setOpcoes(optDiaDaSemana);
	grafDiaDoMes.setOpcoes(optDiaDoMes);

	grafVendedorComSemRx.setOpcoes(optVendaComSemRx);
	grafVendedorSemRx.setOpcoes(optVendaSemRx);
	grafVendedorComRx.setOpcoes(optVendaComRx);

	grafRetornoNaoVendaComSemRx.setOpcoes(optRetonoNaoVendaComSemRx);
	grafRetornoNaoVendaComRx.setOpcoes(optRetornoNaoVendaComRx);
	grafRetornoNaoVendaSemRx.setOpcoes(optRetornoNaoVendaSemRx);

	grafTipoDeAtendimento.setOpcoes(optTipoDeAtendimento);

	grafMotivoNaoVenda.setOpcoes(optMotivoNaoVenda);

	grafDivulgadores.setOpcoes(optDivulgadores);

	grafEntrega.setOpcoes(optGrafEntregas);
}catch(err){
	
}
/************************************************************ LOCAL PARA DESENHO DAS TABELAS ***********************************************/
var corpoTabelaTipoDeAtendimento = new Array();
for(var v in tipoDeAtendimento){
	var vendedor = v.replace(/_/g, ' ');
	for(var i = 1;i < tipoDeAtendimento[v].length;i++){
		corpoTabelaTipoDeAtendimento.push([vendedor, tipoDeAtendimento[v][i][0].replace(/[0-9]/g, ''), tipoDeAtendimento[v][i][1]]);
	}
}
var tabelaDeAtendimento = new Tabela(['NOME DO VENDEDOR', 'TIPO DE ATENDIMENTO', 'QUANTIDADE'], corpoTabelaTipoDeAtendimento, 'minhaTabela table table-bordered table-hover table-striped', '', 'bg-success');

$('#tabela_atendimento').empty().html(tabelaDeAtendimento.getTabela());

var corpoTabelaMotivoNaoVenda = new Array();
for(var v in motivoNaoVenda){
	var vendedor = v.replace(/_/g, ' ');
	for(var i = 1;i < motivoNaoVenda[v].length;i++){
		corpoTabelaMotivoNaoVenda.push([vendedor, motivoNaoVenda[v][i][0].replace(/[0-9]/g, ''), motivoNaoVenda[v][i][1]]);
	}
}
var tabelaMotivoNaoVenda = new Tabela(['NOME DO VENDEDOR', 'TIPO DE ATENDIMENTO', 'QUANTIDADE'], corpoTabelaMotivoNaoVenda, 'minhaTabela table table-bordered table-hover table-striped', '', 'bg-success');

$('#tabela_motivo_nao_venda').empty().html(tabelaMotivoNaoVenda.getTabela());


window.onload = function(){
	// Ajustando as letras dos tabs
	$('a[data-toggle="tab"]').css({'font-size':'9pt'});

	try {
		// Desenhando os graficos
		grafSexo.getPizza();
		// Definindo cores dos graficos
		grafHora.setCores(['red']);
		grafDiaDaSemana.setCores(['red']);
		grafDiaDoMes.setCores(['red']);
		// GRAFICOS DA ABA ATENDIMENTO VENDAS VENDEDOR
		grafVendedorComSemRx.getBarra();
		grafVendedorComRx.getBarra();
		grafVendedorSemRx.getBarra();
		// GRAFICOS DA ABA ATENDIMENTO HORA/ DIA
		grafHora.getColuna();
		grafDiaDaSemana.getColuna();
		grafDiaDoMes.getColuna();
		// GRAFICOS DA ABA RETORNO NAO VENDA
		grafRetornoNaoVendaComSemRx.getBarra();
		grafRetornoNaoVendaComRx.getBarra();
		grafRetornoNaoVendaSemRx.getBarra();
		// GRAFICO DA ABA TIPO DE ATENDIMENTO, USANDO O VENDEDOR SELECIONADO
		grafTipoDeAtendimento.getPizza();
		// GRAFICO DA ABA MOTIVO NAO VENDA, USANDO O VENDEDOR SELECIONADO
		grafMotivoNaoVenda.getPizza();
		// GRAFICO DA ABA DIVULGADORES
		grafDivulgadores.getPizza();
		// GRAFICO DA ABA DE ENTREGAS
		grafEntrega.getPizza();
	} catch(err){
		console.log("algum grafico nao pode ser gerado.\n"+err);
	}

}

// QUANDO O DOCUMENTO FOR CARREGADO
$(document).ready(function(){
	// Evento que vai atrelar o botao select da aba ATENDIMENTO HORA/DIA para alterar entre os graficos
	$('#hora_semana_dia').bind('change',function(){
		var selecionado = $(this).val();
		
		$('#div_hora_semana_mes').children().each(function(index, value){
				var ID = $(this).attr('id');
				if(ID == selecionado){

					$(this).slideDown();
				} else {
					$(this).slideUp();
				}
		});
	});

	// EVENTO QUE VAI ATRELAR OS GRAFICOS DA ABA ATENDIMENTO VENDAS VENDEDOR E RETORNO NAO VENDA COM O BOTAO DE ALTERACAO QUANTIDADE, PERCENTUAL
	$('#venda_com_sem_rx, #retorno_nao_venda_comsemrx').bind('change', function(){
		var selecionado = $(this).val();
		if(selecionado == 'quantidade_venda'){
			// VERIFICANDO SE FOI SOLICITADO QUE ALTERASSE O GRAFICO DA ABA ATENDIMENTO VENDAS VENDEDEDOR
			if($(this).attr('id') == 'venda_com_sem_rx'){ 
					grafVendedorComSemRx.getBarra();
					grafVendedorComRx.getBarra();
					grafVendedorSemRx.getBarra();
			} else { // Entao foi modificado o select da aba RETORNO NAO VENDA
					grafRetornoNaoVendaComSemRx.getBarra();
					grafRetornoNaoVendaComRx.getBarra();
					grafRetornoNaoVendaSemRx.getBarra();
			}
		} else {
			// VERIFICANDO SE FOI SOLICITADO QUE ALTERASSE O GRAFICO DA ABA ATENDIMENTO VENDAS VENDEDEDOR
			if($(this).attr('id') == 'venda_com_sem_rx'){ 
				grafVendedorComSemRx.getBarra(true, true);
				grafVendedorComRx.getBarra(true, true);
				grafVendedorSemRx.getBarra(true, true);
			} else { // Entao foi modificado o select da aba RETORNO NAO VENDA
				grafRetornoNaoVendaComSemRx.getBarra(true, true);
				grafRetornoNaoVendaComRx.getBarra(true, true);
				grafRetornoNaoVendaSemRx.getBarra(true, true);
			}
		}
	});
	// EVENTO QUE VAI ALTERAR O GRAFICO TIPO DE ATENDIMENTO E MOTIVO NAO VENDA
	$('#tipo_de_atendimento_vendedor, #motivo_nao_venda_vendedor, #tipo_divulgadores').bind('change', function(){
		if($(this).attr('id') == 'tipo_de_atendimento_vendedor'){
			var vendedor = $(this).val().replace('&','');
			grafTipoDeAtendimento.dadosModificados = tipoDeAtendimento[vendedor];
			grafTipoDeAtendimento.getPizza();
		} else if($(this).attr('id') == 'motivo_nao_venda_vendedor'){
			var vendedor = $(this).val().replace('&M','');
			grafMotivoNaoVenda.dadosModificados = motivoNaoVenda[vendedor];
			grafMotivoNaoVenda.getPizza();
		} else {
			var divulgador = $(this).val().replace('&D','');
			grafDivulgadores.dadosModificados = tipoDivulgador[divulgador];
			grafDivulgadores.getPizza();
		}
	});


$('.minhaTabela').DataTable({"bPaginate": false,"ordering" : true,
  "order" : [1],"scrollY": 250,"scrollCollapse": true,
  "scrollX": true,"info" : false,"responsive": true,"autoWidth": false,
  "search" : {"regex": true}, retrieve: true,"language": {"search": "Procurar na tabela",
  "emptyTable" : "Nao ha dados","zeroRecords": "Sem registros com valor informado"}});

});

$('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
   		$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
 	});

// Botao para atualizar o a pagina
$("#pesquisar").click(function(){
	var data1, data2;
	data1 = $("#data1").val();data2 = $("#data2").val();
	D1 = new Date(data1);D2 = new Date(data2);

	if(D1.getTime() > D2.getTime()){
		alert('A data DE nao deve ser maior que a data ATE.');
	} else {
		var lojas = $("#lojas").val();var loja = lojas.toString();

		$.ajax({
				method: 'POST',	url: '/gestao_atendimento',
				data: {de: data1, ate: data2, lojas:loja}
		}).done(function(data){
			window.setTimeout('location.reload()',100);
		}).fail(function(d){
			alert('falhou');
		});
	}

});