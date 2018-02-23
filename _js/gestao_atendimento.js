/*
autor:	Marcos Felipe da Silva Jardim
versao: 1.2
data:	11-09-2017

---------------------------------------------------------------------------------------------------------------------
versao: 1.2 11-09-2017 Coloca o grafico de vendedor para disponibilizar duas opções, com quantidade e percentual

*/
// Verifica qual o cliente que esta utilizando, se for android criamos o grafico de outra maneira
var larguraSexo, agrupamentoSexo, larguraVendasHora2,larguraVendasHora, chartAreaHora;
var larguraAtendimento, chartAreaAtendimento, larguraMotivoNaoVenda, chartAreaMotivoNaoVenda;
var linkSexo,linkVendasVendedor, linkHora, linkAtendimento, linkMotivoNaoVenda;
var classeAtendimentoDiaDoMes;

if((navegador.indexOf("android") != -1) || (navegador.indexOf("Android") != -1)){
  larguraSexo = '100%'; agrupamentoSexo = '80%';chartAreaMotivoNaoVenda = {left:-60};
  larguraVendasHora = '100%'; chartAreaHora = {left:2}
  larguraVendasHora2 = 1200;
  larguraAtendimento = '100%';chartAreaAtendimento = {'top': 30, 'height':'100%'};
  larguraMotivoNaoVenda = '100%';chartAreaMotivoNaoVenda = {'top':20,'right':30};
  linkSexo = 'SEXO';linkVendasVendedor = 'V. VENDEDOR';linkHora = 'HORA/DIA';
  linkAtendimento = 'T. ATENDIMENTO';linkMotivoNaoVenda = 'NÃO VENDA';
  classeAtendimentoDiaDoMes = 'table table-responsive';

} else {
   larguraSexo = 500;agrupamentoSexo = '35%';
   larguraVendasHora = 700;chartAreaHora = {};
   larguraVendasHora2 = 1200;
   larguraAtendimento = 700;
   chartAreaAtendimento = {'top': 30, 'height':'100%'};
   larguraAtendimento = 800;
   larguraMotivoNaoVenda = 700;chartAreaMotivoNaoVenda = {'top':20};
   linkSexo = 'ATENDIMENTO SEXO';linkVendasVendedor = 'ATENDIMENTO VENDAS VENDEDOR';
   linkHora = 'ATENDIMENTO HORA / DIA';linkAtendimento = 'TIPO ATENDIMENTO';
   linkMotivoNaoVenda = 'MOTIVO NÃO VENDA';
   classeAtendimentoDiaDoMes;
}

// Chamada para criar os graficos
google.charts.setOnLoadCallback(atendimentoSexo);
google.charts.setOnLoadCallback(vendasLojaVendedor);
google.charts.setOnLoadCallback(atendimentoVendasHora);
google.charts.setOnLoadCallback(tipoAtendimento);
google.charts.setOnLoadCallback(motivoNaoVenda);
//google.charts.setOnLoadCallback(obterTempoMedioAtendimento); // Desativado por enquanto
google.charts.setOnLoadCallback(retornoDeNaoVenda);

var cor = ['red','blue','green', 'yellow', 'black', 'pink'];
var divTab = '<div class="tab-content">';
var ulTab = '<ul class="nav nav-tabs"><li class="active"><a data-toggle="tab" href="#sexo">'+linkSexo+'</a></li>';
ulTab += '<li><a data-toggle="tab" href="#atendimento">'+linkVendasVendedor+'</a></li><li><a data-toggle="tab" href="#hora_dia">'+linkHora+'</a></li>';
ulTab += '<li><a data-toggle="tab" href="#tipo_atendimento">'+linkAtendimento+'</a></li>';
ulTab += '<li><a data-toggle="tab" href="#motivo_nao_venda">'+linkMotivoNaoVenda+'</a></li>';
// ulTab += '<li><a data-toggle="tab" href="#tempo_medio_atendimento">TEMPO MEDIO ATENDIMENTO</a></li>'; // DESATIVADO
ulTab += '<li><a data-toggle="tab" href="#retorno_nao_venda">RETORNO NAO VENDA</a></li>';
ulTab += '</ul>';
divTab += '<div id=sexo class="tab-pane fade in active"></div><div id=atendimento class="tab-pane fade"><br/><br/>';
divTab += '<div class=row><div class=col-sm-2><select id="atendimento_vendedor" class="form-control" name="atendimento_vendedor"><option value="percentual">POR CONVERSAO</option><option value="quantidade">POR QUANTIDADE</option></select></div></div>';
divTab += '<div class=row><div class=col-sm-3><div id=atendimento_geral></div></div><div class=col-sm-1></div>';
divTab += '<div class="col-sm-3"><div id=atendimento_com_rx></div></div><div class="col-sm-1"></div>';
divTab += '<div class=col-sm-3><div id=atendimento_sem_rx></div></div></div></div>';
divTab += '<div id=hora_dia class="tab-pane fade"><br/><div class="row"><div class="col-sm-9"></div><div class="col-sm-2"><select class="form-control" name=alteraGraficoDiaHora id=graficoDiaHora>';
divTab += '<option value="hora_atendimento">Atendimento / Hora</option><option value=dia_da_semana> Dia da semana</option>';
divTab += '<option value="dia_do_mes">Dia do mês</option></select></div><div class="col-sm-1"></div></div>';
divTab += '<div class="row" id="hora_atendimento"><div class="col-sm-4"><div id=hora_atendimento_1></div></div><div class="col-sm-1"></div><div class="col-sm-4"><div id="hora_atendimento_media"></div></div></div>';
divTab += '<div class="row" style="display:none" id=dia_da_semana><div class="col-sm-4" id="dia_da_semana_1"></div><div class="col-sm-1"></div><div class="col-sm-4" id="dia_da_semana_media"></div></div>';
divTab += '<div id="dia_do_mes" style="display:none"><div id="dia_do_mes_1"></div>';
divTab += '<div id="dia_do_mes_media"></div></div>';
divTab += '</div>';
divTab += '<div id=tipo_atendimento class="tab-pane fade"><div class="row">';
divTab += '<div class="col-sm-2"><br/><br/><select style="display:none" id="selecao_atendimento_vendedor" class="form-control"></select></div>';
divTab += '<div id="tipo_atendimento_vendedor" class="col-sm-4"></div><div class="col-sm-1"></div>';
divTab +='</div></div>';
divTab += '<div id=motivo_nao_venda class="tab-pane fade"><div class="row">';
divTab += '<div class=col-sm-2><br/><br/><select class="form-control" name=motivo_nao_venda id="selecao_motivo_nao_venda_vendedor"></select></div><div class="col-sm-1"></div>';
divTab += '<div id="motivo_nao_venda_vendedor" class="col-sm-4"></div>';
divTab += '</div></div>';
divTab += '<div id=tempo_medio_atendimento class="tab-pane fade">';
divTab += '<div class=row><div class=col-sm-3><div id=tempo_medio_geral></div></div>';
divTab += '<div class=col-sm-1></div><div class=col-sm-3><br/><br/><select style="display:none" class="form-control" id="tempo_vendedor" name="tempo_vendedor"></select></div>';
divTab += '<div id="medio_geral_vendedor" class=col-sm-3></div>';
divTab += '<div class=col-sm-1></div></div></div>';
divTab += '<div id="retorno_nao_venda" class="tab-pane fade"><br/></br>';
divTab += '<div class=row><div class=col-sm-2><select id="selecao_nao_venda" class="form-control" name="selecao_nao_venda"><option value="percentual">POR CONVERSAO</option><option value="quantidade">POR QUANTIDADE</option></select></div></div><div id="retorno_nao_venda_geral" class="row">';
divTab += '<div id="retorno_nao_venda_com_sem_rx" class="col-sm-3"></div><div class="col-sm-1"></div>';
divTab += '<div id="retorno_nao_venda_com_rx" class="col-sm-3"></div><div class="col-sm-1"></div>';
divTab += '<div id="retorno_nao_venda_sem_rx" class="col-sm-3"></div><div class="col-sm-1"></div>';
divTab += '</div></div>';""
divTab += '</div>';
// APENDANDO NO CORPO
$('#corpo_pagina').append(ulTab + divTab);

/// FUNCAO PARA DESENHAR O GRAFICO DE ATENDIMENTO POR SEXO
function atendimentoSexo(){
	var x = 0;
	var arraySexo = new Array(['SEXO','QUANTIDADE', {role:"style"}]); // array para armazenar os atendimentos por sexo
	var tot = 0; // Total de atendimentos por sexo
	for(var i in sexo){
		arraySexo.push([i+' : '+sexo[i], sexo[i], cor[x]]);
		tot += sexo[i];
		x+= 1;
	}
	var dados = google.visualization.arrayToDataTable(arraySexo);
	var options = {'title':'ATENDIMENTOS POR SEXO \n TOTAL: '+tot, 
	'width':larguraSexo, is3D:true, 'height':400, legend:'right',
	         };
	var chart = new google.visualization.PieChart(document.getElementById('sexo'));
	chart.draw(dados, options);

}

/// FUNCAO PARA DESENHAR O GRAFICO DE VENDAS LOJA / VENDEDOR
function vendasLojaVendedor(){
	var arrayVendasNaoVendaComRxVendedor = new Array(['VENDEDOR', '% VENDA', {role:'annotation'}, '% NAO VENDA', {role:'annotation'}, {role:'style'}]);
	var arrayVendasNaoVendaSemRxVendedor = new Array(['VENDEDOR', '% VENDA', {role:'annotation'}, '% NAO VENDA', {role:'annotation'}, {role:'style'}]);
	var arrayVendasNaoVendas = new Array(['VENDEDOR', '% VENDA',{role:'annotation'}, '% NAO VENDA', {role:'annotation'}, {role:'style'}]);
	
	// criar novo objeto de vendedores e ali armazenar total de venda e naovenda, com ou sem rx
	var vendedores = {};var vendedorTotal = {};
	for(var v in atendimentoVendedor){
		vendedores[v] = {'venda': {'com_rx':0, 'sem_rx':0}, 'nao_venda' : {'com_rx':0, 'sem_rx':0}}; // Instancia o vendedor para ter as nao_vendas e as vendas
		vendedorTotal[v] = {'venda':0, 'nao_venda':0};
		if(atendimentoVendedor[v].venda){ // Verifica se o vendedor teve vendas
			for(var a in atendimentoVendedor[v].venda.com_rx){ // Se venda deve pegar o total das vendas deste vendedor
				vendedores[v]['venda']['com_rx'] += atendimentoVendedor[v]['venda']['com_rx'][a];
				vendedorTotal[v]['venda'] += atendimentoVendedor[v]['venda']['com_rx'][a];
			}
			// Loop para fazer vendas sem rx a quantidade total
			for(var a in atendimentoVendedor[v].venda.sem_rx){ // Se venda deve pegar o total das vendas deste vendedor
				vendedores[v]['venda']['sem_rx'] += atendimentoVendedor[v]['venda']['sem_rx'][a];
				vendedorTotal[v]['venda'] += atendimentoVendedor[v]['venda']['sem_rx'][a];
				
			}
			
		} 
		if(atendimentoVendedor[v].nao_venda){ // Verifica se o vendedor teve nao_venda
			for(var a in atendimentoVendedor[v].nao_venda.com_rx){ // Se nao venda deve pegar o total das nao vendas deste vendedor
				vendedores[v]['nao_venda']['com_rx'] += atendimentoVendedor[v]['nao_venda']['com_rx'][a];
				vendedorTotal[v]['nao_venda'] += atendimentoVendedor[v]['nao_venda']['com_rx'][a];
			}
			for(var a in atendimentoVendedor[v].nao_venda.sem_rx){ // Se nao venda deve pegar o total das nao vendas deste vendedor
				vendedores[v]['nao_venda']['sem_rx'] += atendimentoVendedor[v]['nao_venda']['sem_rx'][a];
				vendedorTotal[v]['nao_venda'] += atendimentoVendedor[v]['nao_venda']['sem_rx'][a];
				
			}
		}
	}

	var totVenda = 0;// Total de vendas da loja
	var totNaoVenda = 0; // Total de nao vendas da loja
	var totVendaSemRx = 0;
	var totNaoVendaSemRx = 0;
	var totVendaNaoVenda = 0; // Total de vendas e nao vendas com e sem rx

	var x = 0;
	var tipo_escolhido = $('#atendimento_vendedor').val();
	// gerar loop e pegar percentual de vendas com_rx
	for(var i in vendedores){ // Fazer um loop somar o total de vendas e nao vendas deste vendedor e convergir
		if(tipo_escolhido == 'percentual'){
		
		var percentVenda2 = parseFloat((vendedorTotal[i]['venda'] / (vendedorTotal[i]['venda']+vendedorTotal[i]['nao_venda'])*100).toFixed(1));
		var percentNaoVenda2 = parseFloat((vendedorTotal[i]['nao_venda'] / (vendedorTotal[i]['venda']+vendedorTotal[i]['nao_venda'])*100).toFixed(1));
		//
		var percentualVenda2 = parseFloat(vendedores[i]['venda']['com_rx'] / (vendedores[i]['venda']['com_rx']+vendedores[i]['nao_venda']['com_rx']));
		var percentualNaoVenda2 = parseFloat(vendedores[i]['nao_venda']['com_rx'] / (vendedores[i]['venda']['com_rx']+vendedores[i]['nao_venda']['com_rx']));

		var percentualVendaSemRx2 = parseFloat(vendedores[i]['venda']['sem_rx'] / (vendedores[i]['venda']['sem_rx']+vendedores[i]['nao_venda']['sem_rx']));
		var percentualNaoVendaSemRx2 = parseFloat(vendedores[i]['nao_venda']['sem_rx'] / (vendedores[i]['venda']['sem_rx']+vendedores[i]['nao_venda']['sem_rx']));

		arrayVendasNaoVendas.push([i.split(' ')[0], percentVenda2, percentVenda2+' % '+'V', percentNaoVenda2, percentNaoVenda2+'%'+' N.V', cor[x]]);
		arrayVendasNaoVendaComRxVendedor.push([i.split(' ')[0], percentualVenda2, parseFloat(percentualVenda2 * 100).toFixed(1)+'%'+' V', percentualNaoVenda2, parseFloat(percentualNaoVenda2 * 100).toFixed(1)+'%'+' N.V',cor[x]]);
		arrayVendasNaoVendaSemRxVendedor.push([i.split(' ')[0], percentualVendaSemRx2, parseFloat(percentualVendaSemRx2 * 100).toFixed(1)+'% V', percentualNaoVendaSemRx2, parseFloat(percentualNaoVendaSemRx2 * 100).toFixed(1)+'% N.V', 'red']);
		
		} else {
			// TOTAIS NUMERAIS DE VENDA E NAO VENDA
			var percentVenda = vendedorTotal[i]['venda'];
			var percentNaoVenda = vendedorTotal[i]['nao_venda'];
			//
			var percentualVenda = vendedores[i]['venda']['com_rx'];
			var percentualNaoVenda = vendedores[i]['nao_venda']['com_rx'];
			var percentualVendaSemRx = vendedores[i]['venda']['sem_rx'];
			var percentualNaoVendaSemRx = vendedores[i]['nao_venda']['sem_rx'];


			arrayVendasNaoVendaComRxVendedor.push([i.split(' ')[0], percentualVenda, percentualVenda+' V', percentualNaoVenda, percentualNaoVenda+' N.V',cor[x]]);
			arrayVendasNaoVendaSemRxVendedor.push([i.split(' ')[0], percentualVendaSemRx, percentualVendaSemRx+' V', percentualNaoVendaSemRx, percentualNaoVendaSemRx+' N.V', 'red']);

			arrayVendasNaoVendas.push([i.split(' ')[0], percentVenda, percentVenda+' V', percentNaoVenda ,  percentNaoVenda+' N.V', 'red']);
		}
		totVenda += vendedores[i]['venda']['com_rx'];
		totNaoVenda += vendedores[i]['nao_venda']['com_rx'];

		totVendaSemRx += vendedores[i]['venda']['sem_rx'];
		totNaoVendaSemRx += vendedores[i]['nao_venda']['sem_rx'];

		if(x < cor.length){
			x = 0;
		} else {
			x += 1;
		}
	}

	if(tipo_escolhido == 'percentual'){
	
	// Definindo o percentual de venda da loja
	var percentualVendaLoja = parseFloat(totVenda / (totVenda + totNaoVenda));
	var percentualNaovendaLoja = parseFloat(totNaoVenda / (totVenda + totNaoVenda));

	var percentualVendaLojaSemRx = parseFloat(totVendaSemRx / (totVendaSemRx + totNaoVendaSemRx));
	var percentualNaoVendaLojaSemRx = parseFloat(totNaoVendaSemRx / (totVendaSemRx + totNaoVendaSemRx));
	// Percentual de vendas com e sem rx
	var percentVendaComSemRx = parseFloat((totVenda+totVendaSemRx) / ((totVendaSemRx+totVenda)+(totNaoVenda+totNaoVendaSemRx)));
	var percentNaoVendaComSemRx = parseFloat((totNaoVenda+totNaoVendaSemRx) / ((totNaoVenda+totNaoVendaSemRx)+(totVenda+totVendaSemRx)));


	arrayVendasNaoVendaComRxVendedor.push(['LOJA ', percentualVendaLoja, parseFloat(percentualVendaLoja * 100).toFixed(1)+'% V', percentualNaovendaLoja, parseFloat(percentualNaovendaLoja * 100).toFixed(1)+'% N.V', 'red']);
	arrayVendasNaoVendaSemRxVendedor.push(['LOJA ', percentualVendaLojaSemRx, parseFloat(percentualVendaLojaSemRx * 100).toFixed(1)+'% V', percentualNaoVendaLojaSemRx, parseFloat(percentualNaoVendaLojaSemRx * 100).toFixed(1)+'% N.V','red']);
	arrayVendasNaoVendas.push(['LOJA ', percentVendaComSemRx*100, parseFloat(percentVendaComSemRx * 100).toFixed(1)+' % V', percentNaoVendaComSemRx*100, parseFloat(percentNaoVendaComSemRx * 100).toFixed(1)+' % N.V', 'red']);

	} else {
		// Definindo o percentual de venda da loja
		var percentualVendaLoja = totVenda;
		var percentualNaovendaLoja = totNaoVenda;

		var percentualVendaLojaSemRx = totVendaSemRx;
		var percentualNaoVendaLojaSemRx = totNaoVendaSemRx;
		// Total de venda e nao venda com e sem rx
		var percentualVendaComSemRx = totVenda+totVendaSemRx;
		var percentualNaoVendaComSemRx = totNaoVenda+totNaoVendaSemRx;


		arrayVendasNaoVendaComRxVendedor.push(['LOJA ', percentualVendaLoja, percentualVendaLoja+' V', percentualNaovendaLoja, percentualNaovendaLoja+' N.V', 'red']);
		arrayVendasNaoVendaSemRxVendedor.push(['LOJA ', percentualVendaLojaSemRx, percentualVendaLojaSemRx+' V', percentualNaoVendaLojaSemRx, percentualNaoVendaLojaSemRx+' N.V','red']);
		arrayVendasNaoVendas.push(['LOJA ', percentualVendaComSemRx, percentualVendaComSemRx+' V', percentualNaoVendaComSemRx, percentualNaoVendaComSemRx+' N.V', 'red']);
	}
	var dados = google.visualization.arrayToDataTable(arrayVendasNaoVendaComRxVendedor);
	var dados2 = google.visualization.arrayToDataTable(arrayVendasNaoVendaSemRxVendedor);
	var dados3 = google.visualization.arrayToDataTable(arrayVendasNaoVendas);

	var options = {'title':'VENDAS POR VENDEDOR COM RX \n TOTAL: '+totVenda, 'width':larguraSexo, 'height':600,
 	bar: {groupWidth: "55%"}, legend:'none', annotations: { textStyle: {fontSize:10},alwaysOutside: true}, vAxis:{minValue:0}};

 	var options2 = {'title':'VENDAS POR VENDEDOR SEM RX \n TOTAL: '+totVendaSemRx, 'width':larguraSexo, 'height':600,
 	bar: {groupWidth: "55%"}, legend:'none', annotations: { textStyle: {fontSize:10}, alwaysOutside: true }};

 	var options3 = {'title':'VENDAS COM E SEM RX POR  VENDEDOR \n TOTAL: '+(totVenda+totVendaSemRx), 'width':larguraSexo, 'height':600,
 	bar: {groupWidth: "55%"}, legend:'none', annotations: { textStyle: {fontSize:10}, alwaysOutside: true }, hAxis:{minValue:0}};

	var chart = new google.visualization.BarChart(document.getElementById('atendimento_com_rx'));
	chart.draw(dados, options);

	var chart2 = new google.visualization.BarChart(document.getElementById('atendimento_sem_rx'));
	chart2.draw(dados2, options2);

	var chart3 = new google.visualization.BarChart(document.getElementById('atendimento_geral'));
	chart3.draw(dados3, options3);
}

// FUNCAO USADA PARA DESENHAR GRAFICO DE ATENDIMENTO / HORA
function atendimentoVendasHora(){
	var arrayAtendimentoVendasHora = new Array(['HORA', 'QTD / HORA', {role:'style'},{role:'annotation'}]);
	// ARRAY PARA A MEDIA DE ATENDIMENTOS POR HORA
	var arrayAtendimentoVendasHoraMedia = new Array(['HORA MEDIA', 'MEDIA ',{role:'style'}, {role:'annotation'}]);

	// Este é um pouco mais complexo, gero um array com as horas e depois somo a quantidade de horas/atendimento
	var horas = ['08','09','10','11','12','13','14','15','16','17','18','19','20','21','22'];
	var x = 0; // Contador para cores
	// Quantidade de atendimentos
	var tot = 0;
	for(var i in hora_atendimento){
		var indice = horas.indexOf(i);
		horas[indice] = [i, hora_atendimento[i]];
		tot += hora_atendimento[i];
		
	}
	// Loop para preencher o array atendimentoVendasHora
	for(var i = 0;i<horas.length;i++){
		arrayAtendimentoVendasHora.push([horas[i][0], horas[i][1], 'red', horas[i][1]]);
		// Calculando a media de tempo
		arrayAtendimentoVendasHoraMedia.push([horas[i][0], parseFloat(horas[i][1]/quantidadeDeDias), 'red', parseFloat(horas[i][1]/quantidadeDeDias).toFixed(1)]);

	}

	var dados = google.visualization.arrayToDataTable(arrayAtendimentoVendasHora);
	// Array da media
	var dadosMedia = google.visualization.arrayToDataTable(arrayAtendimentoVendasHoraMedia);

	var options = {'title':'ATENDIMENTOS LOJA / HORA \n TOTAL: '+tot, legend: { position: 'none' },
	annotations: { alwaysOutside: true }, 'width':larguraVendasHora, 'height':400,
	 bar: {groupWidth: "35%"}, chartArea:chartAreaHora};
	// Opcoes do grafico de media
	var optionsMedia = {'title':'MEDIA LOJA / HORA  \n MEDIA GERAL : '+parseFloat(tot/quantidadeDeDias).toFixed(1), legend: { position: 'none' },
	annotations: { alwaysOutside: true }, 'width':larguraVendasHora, 'height':400,
	bar: {groupWidth: "35%"}, chartArea:chartAreaHora};

	var chart = new google.visualization.ColumnChart(document.getElementById('hora_atendimento_1'));
	chart.draw(dados, options);

	var chartMedia = new google.visualization.ColumnChart(document.getElementById('hora_atendimento_media'));
	chartMedia.draw(dadosMedia, optionsMedia);

	/* ATENDIMENTOS OCOORENDO NOS DIAS DA SEMANA */
	var dias = ['FER', 'SEG','TER','QUA','QUI','SEX','SAB','DOM'];
	var arrayAtendimentoDiaDaSemana = new Array(['DIA', 'QTD / DIA', {role:'style'}, {role:'annotation'}]);
	// Array para a media
	var arrayAtendimentoDiaDaSemanaMedia = new Array(['DIA MEDIA', 'MEDIA',{role:'style'},{role:'annotation'}]);
	
	for(var i in diaDaSemana){
		if(i == 0){

		} else {
			arrayAtendimentoDiaDaSemana.push([dias[i], diaDaSemana[i], 'red', diaDaSemana[i]]);
			arrayAtendimentoDiaDaSemanaMedia.push([dias[i], parseFloat(diaDaSemana[i]/quantidadeDeDias), 'red', parseFloat(diaDaSemana[i]/quantidadeDeDias).toFixed(1)])
			if(x > cor.length){
				x = 0;
			} else {
				x += 1;
			}
		}
	}

	var dadosDiaDaSemana = google.visualization.arrayToDataTable(arrayAtendimentoDiaDaSemana);
	// Desenhando objeto array da media do dia de semana
	var dadosDiaDaSemanaMedia = google.visualization.arrayToDataTable(arrayAtendimentoDiaDaSemanaMedia);

	var options = {'title':'ATENDIMENTOS LOJA / DIA DA SEMANA \n TOTAL: '+tot, legend: { position: 'none' }, 
	annotations: { alwaysOutside: true },'width':larguraVendasHora, 'height':400,
	bar: {groupWidth: "35%"}, chartArea:chartAreaHora};
	var chart2 = new google.visualization.ColumnChart(document.getElementById('dia_da_semana_1'));
	chart2.draw(dadosDiaDaSemana, options);

	var optionsMedia = {'title':'MEDIA DIA DA SEMANA \n MEDIA GERAL : '+parseFloat(tot/quantidadeDeDias).toFixed(1), legend: { position: 'none' }, 
	annotations: { alwaysOutside: true },'width':larguraVendasHora, 'height':400,
	bar: {groupWidth: "35%"}, chartArea:chartAreaHora};
	var chart2Media = new google.visualization.ColumnChart(document.getElementById('dia_da_semana_media'));
	chart2Media.draw(dadosDiaDaSemanaMedia, optionsMedia);

	/* ATENDIMENTO DO DIA DO MES CADA DIA DO MES REGISTRADO */
	var arrayAtendimentoDiaDoMes = new Array(['DIA', 'QTD / DIA DO MES', {role:'style'}, {role:'annotation'}]);
	// Array da media dos dias do mes
	var arrayAtendimentoDiaDoMesMedia = new Array(['DIA MEDIA', 'QTD MEDIA',{role:'style'},{role:'annotation'}]);

	var x = 0; // Contador de cores
	for(var i in diaDoMes){
		arrayAtendimentoDiaDoMes.push([i, diaDoMes[i], 'red', diaDoMes[i]]);
		// Incluindo a media
		arrayAtendimentoDiaDoMesMedia.push([i, parseFloat(diaDoMes[i]/quantidadeDeDias), 'red',parseFloat(diaDoMes[i]/quantidadeDeDias).toFixed(1)]);

		if(x > cor.length){
			x = 0;
		} else {
			x += 1;
		}
	}

	var dadosDiaDoMes = google.visualization.arrayToDataTable(arrayAtendimentoDiaDoMes);
	var dadosDiaDoMesMedia = google.visualization.arrayToDataTable(arrayAtendimentoDiaDoMesMedia);


	var options = {'title':'ATENDIMENTOS LOJA / DIA DO MES \n TOTAL: '+tot, chartArea: {left:1.5, width: '70%'},
	legend: { position: 'none' }, annotations: {
          alwaysOutside: true,
          }, 'width':larguraVendasHora2, 'height':400,
	bar: {groupWidth: "20%"}};
	var chart3 = new google.visualization.ColumnChart(document.getElementById('dia_do_mes_1'));
	chart3.draw(dadosDiaDoMes, options);

	var options = {'title':'MEDIA DIA DO MES \n MEDIA GERAL: '+parseFloat(tot/quantidadeDeDias).toFixed(1), chartArea: {left:1.5, width: '70%'},
	legend: { position: 'none' }, annotations: {
          alwaysOutside: true,
          }, 'width':larguraVendasHora2, 'height':400,
	bar: {groupWidth: "20%"}};
	var chart3 = new google.visualization.ColumnChart(document.getElementById('dia_do_mes_media'));
	chart3.draw(dadosDiaDoMesMedia, options);

}

// FUNCAO PARA DESENHAR O TIPO DE ATENDIMENTO POR VENDEDOR EM GRAFICO DO TIPO PIZZA
function tipoAtendimento(){

	var vendedores = {} // Objeto para armazenar os vendedores
	var loja = {'venda': 0,'nao_venda': 0, 'ajuste_conserto_montagem_pagamento':0, 'entrega':0,
		'troca_assistencia':0}; // Grafico para gerar o total das lojas

	for(var v in atendimentoVendedor){
		vendedores[v] = {'venda': 0,'nao_venda': 0, 'ajuste_conserto_montagem_pagamento':0, 'entrega':0,
		'troca_assistencia':0}; // Instancia o vendedor para ter todos os atendimentos
		if(atendimentoVendedor[v].venda){ // Verifica se o vendedor teve vendas
			for(var a in atendimentoVendedor[v].venda.com_rx){ // Se venda deve pegar o total das vendas deste vendedor
				vendedores[v]['venda'] += atendimentoVendedor[v]['venda']['com_rx'][a];
				loja['venda'] += atendimentoVendedor[v]['venda']['com_rx'][a];
			}
			// Loop para fazer vendas sem rx a quantidade total
			for(var a in atendimentoVendedor[v].venda.sem_rx){ // Se venda deve pegar o total das vendas deste vendedor
				vendedores[v]['venda'] += atendimentoVendedor[v]['venda']['sem_rx'][a];
				loja['venda'] += atendimentoVendedor[v]['venda']['sem_rx'][a];
			}
			
		}

		if(atendimentoVendedor[v].nao_venda){ // Verifica se o vendedor teve nao_venda
			for(var a in atendimentoVendedor[v].nao_venda.com_rx){ // Se nao venda deve pegar o total das nao vendas deste vendedor
				vendedores[v]['nao_venda'] += atendimentoVendedor[v]['nao_venda']['com_rx'][a];
				loja['nao_venda'] += atendimentoVendedor[v]['nao_venda']['com_rx'][a];
			}
			for(var a in atendimentoVendedor[v].nao_venda.sem_rx){ // Se nao venda deve pegar o total das nao vendas deste vendedor
				vendedores[v]['nao_venda'] += atendimentoVendedor[v]['nao_venda']['sem_rx'][a];
				loja['nao_venda'] += atendimentoVendedor[v]['nao_venda']['sem_rx'][a];
			}
		}

		vendedores[v]['ajuste_conserto_montagem_pagamento'] += atendimentoVendedor[v].ajuste_conserto_montagem_pagamento;
		vendedores[v]['entrega'] += atendimentoVendedor[v].entrega;
		vendedores[v]['troca_assistencia'] += atendimentoVendedor[v].troca_assistencia;
		
		// Definindo dados da loja
		loja['ajuste_conserto_montagem_pagamento'] += atendimentoVendedor[v].ajuste_conserto_montagem_pagamento;
		loja['entrega'] += atendimentoVendedor[v].entrega;
		loja['troca_assistencia'] += atendimentoVendedor[v].troca_assistencia;
		

	}
	// Realizar um loop para capturar cada tipo de atendimento
	var contador = 0;
	// Zerando a selecao atendimento para que o ajax recrie os dados
	$('#selecao_atendimento_vendedor').empty();$('#tipo_atendimento_vendedor').empty();
	for(var i in vendedores){
		var arrayTipoAtendimentoVendedor = new Array(['TIPO','QUANTIDADE']);
		
		var nomeVendedor = i.replace(/ /g,'-');
		$('#tipo_atendimento_vendedor').append('<div style="display:none" id="'+nomeVendedor+'"></div>');
		$('#selecao_atendimento_vendedor').append('<option value="'+nomeVendedor+'">'+i+'</option>');

		for(a in vendedores[i]){
			arrayTipoAtendimentoVendedor.push([vendedores[i][a]+' '+a.replace(/_/g, ' '), vendedores[i][a]]);
		}
		// Criando o objeto
		var dad = google.visualization.arrayToDataTable(arrayTipoAtendimentoVendedor);
		var opcoes = {'title':'TIPO DE ATENDIMENTO VENDEDOR \n '+i,
		'width':larguraSexo, is3D:true, 'height':400, legend:'right'};
		var chart = new google.visualization.PieChart(document.getElementById(nomeVendedor));
		chart.draw(dad, opcoes);
		if(contador == 0){
			contador = 1;
			$('#selecao_atendimento_vendedor').fadeIn(); // Exibindo o select
			$('#'+nomeVendedor).fadeIn(); // Exibindo o primeiro grafico
		}

		
	}
	// Agora para a loja vamos desenhar seu grafico e incluir a loja na selecao do atendimento
	$('#tipo_atendimento_vendedor').append('<div style="display:none" id="l-o-j-a"></div>');
	$('#selecao_atendimento_vendedor').append('<option value="l-o-j-a">LOJA</option>');
	var arrayLoja = new Array(['TIPO','QUANTIDADE']);
	for(var a in loja){
		arrayLoja.push([loja[a]+' '+a.replace(/_/g, ' '), loja[a]]);
	}
	var daL = google.visualization.arrayToDataTable(arrayLoja);
	var opcoes = {'title':'TIPO DE ATENDIMENTO LOJA ', 
		'width':larguraSexo, is3D:true, 'height':400, legend:'right'};
	var chart = new google.visualization.PieChart(document.getElementById('l-o-j-a'));
	chart.draw(daL, opcoes);

	// CRIAR ROTINA PARA LIGAR A ALTERAÇAO DE VENDEDOR PARA OCULTAR O ATUAL E EXIBIR SOMENTE O SELECIONADO
	$('#selecao_atendimento_vendedor').bind('change',function(e){
		e.preventDefault();
		var valor = $(this).val();
		// Ocultando todas as divs
		$('#tipo_atendimento_vendedor div').each(function(index, value){
			if($(this).attr('id') == valor){
				// Exibindo somente a div selecionada
				$('#'+valor).fadeIn();
				return true;
			} else if($(this).attr('id')){
				$(this).fadeOut();
			}
			
		});
		// Exibindo somente a div selecionada
		$('#'+valor).fadeIn();
	});
	
}

// FUNCAO PARA TRAZER OS GRAFICOS DO MOTIVO DE NAO VENDA
function motivoNaoVenda(){
	
	var vendedores = {}; // Realizar loop para pegar o nome dos vendedores
	var loja = {'restricao_spc':0,'preco':0,'prazo_de_entrega':0,'reserva':0,'falta_de_produto':0,
		'orcamento':0, 'encaminhamento_medico':0}; // Motivos nao venda para a loja, gera um somatorio de todos os motivos de não venda

	for(var v in atendimentoVendedor){
		vendedores[v] = {'restricao_spc':0,'preco':0,'prazo_de_entrega':0,'reserva':0,'falta_de_produto':0,
		'orcamento':0,'encaminhamento_medico':0};
		
		if(atendimentoVendedor[v].nao_venda){ // Verifica se o vendedor teve nao_venda
			for(var a in atendimentoVendedor[v].nao_venda.com_rx){ // Se nao venda deve pegar o total das nao vendas deste vendedor
				vendedores[v][a] += atendimentoVendedor[v]['nao_venda']['com_rx'][a];
				loja[a] += atendimentoVendedor[v]['nao_venda']['com_rx'][a];
			}
			for(var a in atendimentoVendedor[v].nao_venda.sem_rx){ // Se nao venda deve pegar o total das nao vendas deste vendedor
				vendedores[v][a] += atendimentoVendedor[v]['nao_venda']['sem_rx'][a];
				loja[a] += atendimentoVendedor[v]['nao_venda']['sem_rx'][a];
			}
		}
	}
	
	var contador = 0;
	var x = 0; // Variavel para incrementar o id de cada vendedor
	// Limpando o motivo não venda para adicionar os novos dados
	$('#motivo_nao_venda_vendedor').empty();$('#selecao_motivo_nao_venda_vendedor').empty();
	for(var e in vendedores){
		var arrayMotivoNaoVendaVendedor = new Array(['TIPO','QUANTIDADE']);
		var nomeVendedor = e.replace(/ /g, 'c')+x;
		for(var n in vendedores[e]){
			arrayMotivoNaoVendaVendedor.push([vendedores[e][n]+' '+n.replace(/_/g, ' '), vendedores[e][n]]);
		}
		$('#motivo_nao_venda_vendedor').append('<div style="display:none" id="'+nomeVendedor+'"></div>');
		$('#selecao_motivo_nao_venda_vendedor').append('<option value="'+nomeVendedor+'">'+e+'</option>');
		var dado = google.visualization.arrayToDataTable(arrayMotivoNaoVendaVendedor);
		var opcoes = {'title':'MOTIVO NAO VENDA VENDEDOR \n '+e, 
		'width':larguraSexo, is3D:true, 'height':400, legend:'right'};
		var chart = new google.visualization.PieChart(document.getElementById(nomeVendedor));
		chart.draw(dado, opcoes);
		if(contador == 0){
			contador = 1;
			$('#selecao_motivo_nao_venda_vendedor').fadeIn(); // Exibindo o select
			$('#'+nomeVendedor).fadeIn(); // Exibindo o primeiro grafico
		}
	x += 1
	} // Fim do for vendedores
	// Criando um array bidimensional para armazenar os motivos não venda da loja
	var arrayMotivoNaoVendaLoja = new Array(['TIPO','QUANTIDADE']);
	
	$('#motivo_nao_venda_vendedor').append('<div style="display:none" id="lcocjca"></div>');
	$('#selecao_motivo_nao_venda_vendedor').append('<option value="lcocjca">LOJA</option>');
	for(var a in loja){
		arrayMotivoNaoVendaLoja.push([loja[a]+' '+a.replace(/_/g, ' '), loja[a]]);
	}
	var daL = google.visualization.arrayToDataTable(arrayMotivoNaoVendaLoja);
	var opcoes = {'title':'MOTIVO NAO VENDA LOJA', 
		'width':larguraSexo, is3D:true, 'height':400, legend:'right'};
		var chart = new google.visualization.PieChart(document.getElementById('lcocjca'));
		chart.draw(daL, opcoes);

	// CRIAR ROTINA PARA LIGAR A ALTERAÇAO DE VENDEDOR PARA OCULTAR O ATUAL E EXIBIR SOMENTE O SELECIONADO
	$('#selecao_motivo_nao_venda_vendedor').bind('change',function(e){
		e.preventDefault();
		var valor = $(this).val();
		// Ocultando todas as divs
		$('#motivo_nao_venda_vendedor div').each(function(index, value){
			if($(this).attr('id') == valor){
				// Exibindo somente a div selecionada
				$('#'+valor).fadeIn();
				return true;
			} else if($(this).attr('id')){
				$(this).fadeOut();
			}
			
		});
		// Exibindo somente a div selecionada
		$('#'+valor).fadeIn();
	});

}

// FUNCAO PARA GERAR O TEMPO MEDIO DE ATENDIMENTO
function obterTempoMedioAtendimento(){
	var contador = 0; // Contador do grafico vendedor, para definir o primeiro grafico para ser exibido
	var arrayTempoMedioGeral = new Array(['ATENDIMENTO', 'MEDIO', {role:'annotation'}, {role:'style'}]);
	var tempoGeral = {};
	// Limpar dados das divs antes de introduzir os novos dados (para compatibilidade com json)
	$('#tempo_vendedor').empty();$('#medio_geral_vendedor').empty();
	for(var i in tempoMedioAtendimento){
		var arrayVendedor = new Array(['ATENDIMENTO','MEDIO', {role:'annotation'},{role:'style'}]); // Criando o array do vendedor selecionado
		var nomeVendedor = i.replace(/ /g, '_'); // Para o id do vendedor
		$('#tempo_vendedor').append('<option value="'+nomeVendedor+'">'+i+'</option>');
		// Incluindo uma div para o grafico no tempo medio geral vendedor
		$('#medio_geral_vendedor').append('<div style="display:none" id="'+nomeVendedor+'"></div>');
		// Realizar um loop para percorrer os dados de cada vendedor
		for(var x in tempoMedioAtendimento[i]){
			if((typeof tempoGeral[x]) == "undefined"){
				tempoGeral[x] = {'tempo':0, 'quantidade':0}
			}
			var tempoVendedor = (tempoMedioAtendimento[i][x][0] / tempoMedioAtendimento[i][x][1]);
			// Calcular a quantidade e o tempo total de cada atendimento
			tempoGeral[x].tempo += tempoMedioAtendimento[i][x][0];tempoGeral[x].quantidade += tempoMedioAtendimento[i][x][1];
			arrayVendedor.push([x.split('_').slice(0,2).join(' ').toUpperCase(), Math.round(tempoVendedor), Math.round(tempoVendedor), 'red']);
		}
		
		// Depois de finalizar o loop criar o objeto de dados
		var da = google.visualization.arrayToDataTable(arrayVendedor);
		var opcoes =  {'title':'TEMPO MEDIO POR VENDEDOR (em Minutos) \n '+i,titleTextStyle:{fontSize:13}, 'width':larguraSexo, 'height':600,
 		bar: {groupWidth: "55%"}, legend:'none', fontSize: 7, bold: true, annotations: { textStyle: {fontSize:15},
          alwaysOutside: true}};
		var chart = new google.visualization.BarChart(document.getElementById(nomeVendedor));
		chart.draw(da, opcoes);
		if(contador == 0){
			contador = 1;
			$('#tempo_vendedor').fadeIn(); // Exibindo o select
			$('#'+nomeVendedor).fadeIn(); // Exibindo o primeiro grafico
		}

	}
	// Loop para registrar os atendimentos
	for(var y in tempoGeral){
		var calculo = tempoGeral[y].tempo / tempoGeral[y].quantidade;
		arrayTempoMedioGeral.push([y.split('_').slice(0,2).join(' ').toUpperCase(), Math.round(calculo), Math.round(calculo), 'red']);
	}
	var dados = google.visualization.arrayToDataTable(arrayTempoMedioGeral);
	var options = {'title':'TEMPO MEDIO DE ATENDIMENTO (em Minutos)',titleTextStyle:{fontSize:13}, 'width':larguraSexo, 'height':600,
 	bar: {groupWidth: "55%"}, legend:'none', fontSize: 7, bold: true, annotations: { textStyle: {fontSize:15},
          alwaysOutside: true}};

    var chart = new google.visualization.BarChart(document.getElementById('tempo_medio_geral'));
	chart.draw(dados, options);

	// CRIAR ROTINA PARA LIGAR A ALTERAÇAO DE VENDEDOR PARA OCULTAR O ATUAL E EXIBIR SOMENTE O SELECIONADO
	$('#tempo_vendedor').bind('change',function(e){
		e.preventDefault();
		var valor = $(this).val();
		// Ocultando todas as divs
		$('#medio_geral_vendedor div').each(function(index, value){
			if($(this).attr('id') == valor){
				// Exibindo somente a div selecionada
				$('#'+valor).fadeIn();
				return true;
			} else if($(this).attr('id')){
				$(this).fadeOut();
			}
			
		});
		
	});

}

// FUNCAO PARA GERAR GRAFICO DE INFORMATIVO DE NAO VENDA
function retornoDeNaoVenda(){
	var totRetorno = 0;var totRetornoComRx = 0;var totRetornoSemRx = 0;
	// VARIAVEIS COM OS TOTAIS DE NAO RETORNO
	var totNaoRetornoComRx = 0;var totNaoRetornoSemRx = 0;

	var arrayRetornoNaoVendaGeral = new Array(['RETORNO', 'SIM',{'role':'annotation'}, 'NAO',{'role':'annotation'}]);
	var arrayRetornoNaoVendaComRx = new Array(['RETORNO', 'SIM',{'role':'annotation'}, 'NAO',{'role':'annotation'}]);
	var arrayRetornoNaoVendaSemRx = new Array(['RETORNO', 'SIM',{'role':'annotation'}, 'NAO',{'role':'annotation'}]);
	// recuperando o valor selecionado
	var selecionado = $('#selecao_nao_venda').val();
	// Realizar loop para pegar de todos os vendedores os retornos e nao retornos atendimentos
	for(var i in retornoNaoVenda){
		var RX = {'com_rx':[0,0],'sem_rx':[0,0]};
		// Realizar um loop para percorrer as nao vendas com_rx e sem_rx de cada vendedor
		for(var x in retornoNaoVenda[i]){
			
			RX[x][0] += retornoNaoVenda[i][x][0];RX[x][1] += retornoNaoVenda[i][x][1];
			
			// Verificando se a opcao escolhida é por quantidade
			if(selecionado == 'quantidade'){
				if(x == 'com_rx'){
					totRetornoComRx += RX[x][0];totNaoRetornoComRx += RX[x][1];
					arrayRetornoNaoVendaComRx.push([i.split(' ')[0], RX[x][0], RX[x][0]+' S',RX[x][1] ,RX[x][1]+' N']);
				} else if(x == 'sem_rx'){
					totRetornoSemRx += RX[x][0];totNaoRetornoSemRx += RX[x][1];
					arrayRetornoNaoVendaSemRx.push([i.split(' ')[0], RX[x][0], RX[x][0]+' S',RX[x][1] ,RX[x][1]+' N']);
				}

			} else {

				var percentualRetorno = parseFloat(RX[x][0]/(RX[x][0]+RX[x][1]));
				var percentualNaoRetorno = parseFloat(RX[x][1] /(RX[x][0]+RX[x][1]));

				if(x == 'com_rx'){
					totRetornoComRx += RX[x][0];totNaoRetornoComRx += RX[x][1];
					arrayRetornoNaoVendaComRx.push([i.split(' ')[0], percentualRetorno * 100, parseFloat(percentualRetorno*100).toFixed(0)+' % S',percentualNaoRetorno * 100 ,parseFloat(percentualNaoRetorno*100).toFixed(0)+' % N']);
				} else if(x == 'sem_rx'){
					totRetornoSemRx += RX[x][0];totNaoRetornoSemRx += RX[x][1];
					arrayRetornoNaoVendaSemRx.push([i.split(' ')[0], percentualRetorno * 100, parseFloat(percentualRetorno*100).toFixed(0)+' % S',percentualNaoRetorno * 100 ,parseFloat(percentualNaoRetorno*100).toFixed(0)+' % N']);
				}

			}
		}
		// Somando os retornos com e sem RX e os nao retornos com ou sem rx
		var ret = RX['com_rx'][0] + RX['sem_rx'][0];totRetorno += ret;
		var retNao = RX['com_rx'][1] + RX['sem_rx'][1];
		// Verificnado a opção tambem para o grafico principal
		if(selecionado == 'quantidade'){
			arrayRetornoNaoVendaGeral.push([i.split(' ')[0], ret,ret+' S',retNao,retNao+' N']);
		} else {
			var percentRetornoTotal = parseFloat(ret/(ret+retNao));
			var percentNaoRetornoTotal = parseFloat(retNao/(ret+retNao));
			arrayRetornoNaoVendaGeral.push([i.split(' ')[0], percentRetornoTotal*100,parseFloat(percentRetornoTotal*100).toFixed(0)+' % S',percentNaoRetornoTotal*100,parseFloat(percentNaoRetornoTotal*100).toFixed(0)+' % N']);
		}
	}
	// Colocando os retornos gerais da loja
	var totNaoRetorno = totNaoRetornoComRx+totNaoRetornoSemRx;
	if(selecionado == 'quantidade'){
		
		arrayRetornoNaoVendaGeral.push(['LOJA ',totRetorno, totRetorno+' S', totNaoRetorno, totNaoRetorno+' N']);
		arrayRetornoNaoVendaComRx.push(['LOJA ',totRetornoComRx, totRetornoComRx+' S', totNaoRetornoComRx, totNaoRetornoComRx+' N']);
		arrayRetornoNaoVendaSemRx.push(['LOJA ',totRetornoSemRx, totRetornoSemRx+' S', totNaoRetornoSemRx, totNaoRetornoSemRx+' N']);
	} else {
		var percentTotNaoRetorno = parseFloat(totNaoRetorno/(totNaoRetorno+totRetorno));
		var percentTotRetorno = parseFloat(totRetorno/(totRetorno+totNaoRetorno));
		
		var percentTotRetornoComRx = parseFloat(totRetornoComRx/(totRetornoComRx+totNaoRetornoComRx));
		var percentTotNaoRetornoComRx = parseFloat(totNaoRetornoComRx/(totNaoRetornoComRx+totRetornoComRx));

		var percentTotRetornoSemRx = parseFloat(totRetornoSemRx/(totRetornoSemRx+totNaoRetornoSemRx));
		var percentTotNaoRetornoSemRx = parseFloat(totNaoRetornoSemRx/(totNaoRetornoSemRx+totRetornoSemRx));

		arrayRetornoNaoVendaGeral.push(['LOJA ',percentTotRetorno*100,parseFloat(percentTotRetorno*100).toFixed(0)+' % S', percentTotNaoRetorno*100, parseFloat(percentTotNaoRetorno*100).toFixed(0)+' % N']);
		arrayRetornoNaoVendaComRx.push(['LOJA ', percentTotRetornoComRx*100, parseFloat(percentTotRetornoComRx*100).toFixed(0)+' % S', percentTotNaoRetornoComRx*100, parseFloat(percentTotNaoRetornoComRx*100).toFixed(0)+' % N']);
		arrayRetornoNaoVendaSemRx.push(['LOJA ', percentTotRetornoSemRx*100, parseFloat(percentTotRetornoSemRx*100).toFixed(0)+' % S', percentTotNaoRetornoSemRx*100, parseFloat(percentTotNaoRetornoSemRx*100).toFixed(0)+' % N']);
	}
	// Colocando as opcoes
	var options = {'title':'RETORNO DE NAO VENDA COM E SEM RX \n RETORNOS: '+totRetorno, 'width':larguraSexo, 'height':600,
 	bar: {groupWidth: "55%"}, legend:'none', annotations: {
          alwaysOutside: true}};
          var options2 = {'title':'RETORNO DE NAO VENDA COM RX \n RETORNOS: '+totRetornoComRx, 'width':larguraSexo, 'height':600,
 	bar: {groupWidth: "55%"}, legend:'none', annotations: {
          alwaysOutside: true}};
          var options3 = {'title':'RETORNO DE NAO VENDA SEM RX \n RETORNOS: '+totRetornoSemRx, 'width':larguraSexo, 'height':600,
 	bar: {groupWidth: "55%"}, legend:'none', annotations: {
          alwaysOutside: true}};
    // Array de dados para o google charts
    var dados = google.visualization.arrayToDataTable(arrayRetornoNaoVendaGeral);
    var dados2 = google.visualization.arrayToDataTable(arrayRetornoNaoVendaComRx);
    var dados3 = google.visualization.arrayToDataTable(arrayRetornoNaoVendaSemRx);
    // Grafico
    var chart = new google.visualization.BarChart(document.getElementById('retorno_nao_venda_com_sem_rx'));
	chart.draw(dados, options);
	var chart2 = new google.visualization.BarChart(document.getElementById('retorno_nao_venda_com_rx'));
	chart2.draw(dados2, options2);
	var chart3 = new google.visualization.BarChart(document.getElementById('retorno_nao_venda_sem_rx'));
	chart3.draw(dados3, options3);
}

$("#pesquisar").click(function(){
	var data1, data2;
	data1 = $("#data1").val();
	data2 = $("#data2").val();


	D1 = new Date(data1);
	D2 = new Date(data2);


	if(D1.getTime() > D2.getTime()){
		alert('A data DE nao deve ser maior que a data ATE.');
	} else {
	    var lojas = $("#lojas").val();
	    var loja = lojas.toString();

		$.ajax({
				method: 'POST',
				url: '/gestao_atendimento',
				data: {de: data1, ate: data2, lojas:loja}
				
				}).done(function(data){
					//window.setTimeout('location.reload()',100);
					for(var i in data){
						
						if(i == 'sexo'){
							sexo = data[i];
							
						} else if(i == 'atendimentoVendedor'){
							atendimentoVendedor = data[i];
							
						} else if(i == 'hora_atendimento'){
							hora_atendimento = data[i];
						} else if(i == 'diaDaSemana'){
							diaDaSemana = data[i];
						} else if(i == 'diaDoMes'){
							diaDoMes = data[i];
						} else if(i == 'venda'){
							venda = data[i];
						} else if(i == 'nao_venda'){
							nao_venda = data[i];
						} else if(i == 'tempoMedioAtendimento'){
							tempoMedioAtendimento = data[i];
						} else if(i == 'retornoNaoVenda'){
							retornoNaoVenda = data[i];
						} else if(i == 'quantidadeDeDias'){
							quantidadeDeDias = data[i];
						}
						
					}
					// Chamando as funções para redesenhar todos os graficos
					atendimentoSexo();vendasLojaVendedor();
					atendimentoVendasHora();tipoAtendimento();
					motivoNaoVenda();// obterTempoMedioAtendimento(); // DESATIVADO
					retornoDeNaoVenda();
					// Atualizando a data do filtro no paragrafo
					var arr = document.cookie.split(';');
					var de,ate,filial;
					for(var i =0;i < arr.length;i++){
						if(arr[i].indexOf('de') != -1){
							de = arr[i].split('=')[1];
	    				} else if(arr[i].indexOf('ate') != -1){
	    					ate = arr[i].split('=')[1];
	    				} else if(arr[i].indexOf('loja_selecionada') != -1){
	    					filial = arr[i].split('=')[1];
	    				}
					}
					// Atualizando data e descrição da gestao de atendimentos
					$('p:contains("DE")').text("DE "+de+" ATE "+ate);
					$('h4:contains("GESTAO")').text("GESTAO DE ATENDIMENTOS FILIAL "+filial);
				}).fail(function(d){
					alert('falhou');
				});

						
		}

});

$(document).ready(function(){
	$('#graficoDiaHora').change(function(e){
		var arrayDeGrafico = ['hora_atendimento', 'dia_da_semana', 'dia_do_mes'];
		var valorAtual = $(this).val();
		for(var i =0;i< arrayDeGrafico.length;i++){
			if(arrayDeGrafico[i] == valorAtual){
				$('#'+arrayDeGrafico[i]).slideDown();
			} else {
				$('#'+arrayDeGrafico[i]).slideUp();
			}
		}
	});
});

// Evento disparado todas as vezes que altero o grafico de vendas por vendedor de conversao para quantidade
$('#atendimento_vendedor').bind('change', function(e) {
	//
	e.preventDefault();
	vendasLojaVendedor();
});
// Evento executado quando se altera o retorno de nao venda, por convresao e por quantidade
$('#selecao_nao_venda').bind('change', function(e){
	e.preventDefault();
	retornoDeNaoVenda();
})