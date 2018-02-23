/*

autor: Marcos Felipe da Silva Jardim
versão: 1.3
data: 23-10-2017

Objetivo: Reune as principais tags e as exibe pelas chamadas das funcoes
------------------------------------------------------------------------------------
Historico de versao:
v1.0: 26-04-2017 Inclusao das classes div,para,titulo,classeid,img,link
v1.1: 17-10-2017 Inclusao das classes divrow, divtabs, vendedor, grafico, modal
v1.2: 23-10-2017 Inclusao da classe Formulario
v1.3: 26-10-2017 Inclusos os metodos filtro e removeColuna para a classe tabela.

************************* ------ CLASSES ------ ******************************************
*/
// Classe pai para as propriedade classe, id e conteudo
var ClasseId = function(conteudo, classe, id){
	this.conteudo = conteudo ? conteudo : '';
	this.classe = classe ? classe : '';
	this.id = id ? id : '';
	this.attr = new Array();
}

ClasseId.prototype.setClasse = function(classe){ if(classe){this.classe  = classe;} };
ClasseId.prototype.setId = function(id){if(id){this.id = id;} };
ClasseId.prototype.getClasse = function(){ return this.classe;};
ClasseId.prototype.getId = function(){ return this.id;};
ClasseId.prototype.addAtributo = function(atributo){ if(atributo){ this.attr.push(atributo);} };
ClasseId.prototype.getConteudo = function(){ return this.conteudo;};
ClasseId.prototype.setConteudo = function(conteudo){ if(conteudo){this.conteudo = conteudo;} };
ClasseId.prototype.getAtributo = function(){
	var at = '';
	for(var x = 0;x<this.attr.length;x++){
		at += this.attr[x];
	}
	return at;
}

// Classe que cria uma instancia de Paragrafo
var Para = function(conteudo, classe, id){ClasseId.call(this, conteudo, classe, id);}

Para.prototype = new ClasseId();
Para.prototype.constructor = Para;
Para.prototype.setPara = function(conteudo){ this.conteudo = conteudo; }
Para.prototype.getPara = function(){
	var atributos = '';
	for(var i = 0;i < this.attr.length;i++){ 
		atributos += ' ' +this.attr[i]; 
	} 
	return '<p class="'+this.classe+'" id="'+this.id+'" '+atributos+ ' >'+this.conteudo+'</p>'; 
};

// Classe que cria uma instancia do titulo
var Titulo = function(conteudo, tamanho, classe, id){ClasseId.call(this, conteudo, classe, id);this.tamanho = tamanho > 0 ? tamanho : 1;}

Titulo.prototype = new ClasseId();
Titulo.prototype.constructor = Titulo;
Titulo.prototype.setTitulo = function(titulo){ this.titulo = titulo; }
Titulo.prototype.getTitulo = function(){
	var atributos = '';	
	for(var i = 0;i < this.attr.length;i++){ 
		atributos += ' ' +this.attr[i]; 
	} 
	return '<h'+this.tamanho+' class="'+this.classe+'" id="'+this.id+'" '+atributos+ ' >'+this.conteudo+'</h'+this.tamanho+'>'; 
};

// Classe que cria uma instancia de uma Div comum
var Div = function(conteudo, classe, id){ClasseId.call(this, conteudo, classe, id);}; 

Div.prototype = new ClasseId();
Div.prototype.constructor = Div;
Div.prototype.getDiv = function(){
	var atributos = ''; 
	for(var i = 0;i < this.attr.length;i++){ 
		atributos += ' ' +this.attr[i]; 
	} 
	return '<div class="'+this.classe+'" id="'+this.id+'" '+atributos+ ' >'+this.conteudo+'</div>'; 
};

// Classe que cria uma instancia de Img
var Img = function(conteudo, classe, id){ ClasseId.call(this, conteudo, classe, id);}; 
Img.prototype = new ClasseId(); 
Img.prototype.constructor = Img; 
Img.prototype.getImg = function(){ 
	var atributos = ''; 
	for(var i = 0;i< this.attr.length;i++){
		atributos += ' ' +this.attr[i];
	} 
	return '<img src="'+this.conteudo+'" class="'+this.classe+'" id="'+this.id+'" '+atributos+' />';
};

// Classe que instancia uma tabela
var Tabela = function(cabecalho, corpo, classe, id, classeCabecalho){ this.classeCabecalho = classeCabecalho; this.cabecalho = cabecalho instanceof Array ? cabecalho : []; this.corpo = corpo ? corpo : [[]]; ClasseId.call(this, '', classe, id);}

Tabela.prototype = new ClasseId();
Tabela.prototype.constructor = Tabela; 
Tabela.prototype.setCorpo = function(corpo){
	// Verificando se o corpo é um array e seu conteudo é um array também
	if(corpo instanceof Array && corpo[0] instanceof Array){
		// Agora verificar se um dos conteudos do corpo não tem o tamanho do cabecalho.
		var linha = -1;
		for(var x = 0;x < corpo.length;x++){
			if(corpo[x].length != this.cabecalho.length){
				linha = x;
				break;
			}
		}
		if(linha >= 0){
			console.log("Um dos elementos do corpo não é compativel com o tamanho do cabecalho. O array "+linha+" tem tamanho incompativel.");
		} else {
			this.corpo = corpo;
		}
	} else {
		console.log("O corpo enviado não é um array ou não contém um array alinhado.");
	}
}
Tabela.prototype.getTabela = function(){
	var tabe = '<table class="'+this.classe+'" id="'+this.id+'">'; 
	var corpo = '<tbody>'; 
	var cabe = '<thead><tr class="'+this.classeCabecalho+'">'; 
	var cabecalho = this.cabecalho; 
	var arrCorpo = this.corpo; 
	for(var i = 0;i < arrCorpo.length;i++){ 
		if(arrCorpo[i].length != cabecalho.length){ 
			return 'O cabecalho e o registro do corpo não são identicos ';	
		} else { 
			var tr = '<tr>'; 
			for(var x = 0;x < arrCorpo[i].length;x++){ 
				tr += '<td>'+arrCorpo[i][x]+'</td>';  
			} 
			corpo += tr + '</tr>'; 
		} 
	} 
	corpo += '</tbody>'; 
	for(var i =0;i < cabecalho.length;i++){ 
		cabe += '<th>'+cabecalho[i]+'</th>'; 
	} 
	cabe += '</tr></thead>'; 
	tabe += cabe + corpo + '</table>'; 
	return tabe; 
};

Tabela.prototype.setClasseCabecalho = function(classe){
	this.classeCabecalho = classe;
};
// Metodo que exclui uma determinada coluna Ele recebe o index da coluna e a exclui gerando um novo corpo e cabecalho.
Tabela.prototype.removeColuna = function(indexColuna){
	// Verifica se a coluna existe
	if(typeof this.corpo[0][indexColuna] == "undefined" || typeof this.cabecalho[indexColuna] == "undefined"){
		console.log('O indice informado não existe no corpo e/ou no cabecalho da tabela. Favor informar um indice dentro da faixa.');
		return false;
	}
	// O indice existe, vamos recriar o corpo
	for(var x = 0;x < this.corpo.length;x++){
		this.corpo[x].splice(indexColuna,1); // Remove a coluna solicitada
	}
	// Agora removendo o indice do cabecalho
	this.cabecalho.splice(indexColuna,1);
	// Tudo correto, retorne true.
	return true;
};
// Metodo usado para retornar cabecalho e corpo de dados filtrados. Recebe uma string para filtro e retorna [[cabecalho][corpo],[corpo]]
Tabela.prototype.filtro = function(palavra){
	// Cria um novo array para criar o novo corpo com os dados filtrados.
	var filtrados = new Array();
	for(var x = 0;x< this.corpo.length;x++){
		if(this.corpo[x].indexOf(palavra) != -1){// Se a palavra foi encontrada no corpo, vamos anexar ao array filtrados.
			filtrados.push(this.corpo[x]);
		}
	}
	if(filtrados.length < 1){ // Dados filtrados são menores que 1, então nada foi encontrado, retorne false.
		return false;
	}
	// Retorna um array com o cabecalho e o corpo com os dados filtrados.
	var cabecalhoComCorpo = [this.cabecalho, filtrados];
	return cabecalhoComCorpo;
};
// Classe que instancia um link
var Link = function(link, conteudo, classe, id){ this.link = link; ClasseId.call(this, conteudo, classe, id);}

Link.prototype = new ClasseId(); 
Link.prototype.constructor = Link; 
Link.prototype.getLink = function(){
	var atributos = '';
	for(var i = 0;i< this.attr.length;i++){ 
		atributos += ' ' +this.attr[i];
	} 
	return '<a href="'+this.link+'" class="'+this.classe+'" id="'+this.id+'" '+atributos+' >'+this.conteudo+'</a>';
};

// Classe utilizada para criar listas ordenadas ou não ordenadas
var Lista = function(itens, ordenada, classe, id){ this.itens = itens instanceof Array ? itens : []; this.ordenada = ordenada ? 'ol' : 'ul'; ClasseId.call(this, '', classe, id); }

Lista.prototype = new ClasseId();
Lista.prototype.constructor = Lista;
Lista.prototype.getLista = function(){
	var lista = ''; 
	var atributos = '';
	for(var i = 0;i< this.attr.length;i++){ 
		atributos += ' ' +this.attr[i];
	} 
	var itens = this.itens; 
	for(var i = 0;i < itens.length;i++){ 
		lista += '<li>'+itens[i]+'</li>'; 
	} 
	return '<'+this.ordenada+' class="'+ this.classe + '" id="'+this.id+'" '+atributos+' >'+lista+'</'+this.ordenada+'>';
};

// Classe utilizada para criar botoes
var Botao = function(conteudo, classe, id){ ClasseId.call(this, conteudo, classe, id);}

Botao.prototype = new ClasseId(); 
Botao.prototype.constructor = Botao;
Botao.prototype.getBotao = function(){
	var atributos = ''; 
	for(var i = 0;i< this.attr.length;i++){ 
		atributos += ' ' +this.attr[i];
	} 
	return '<button class="'+this.classe+'" id="'+this.id+'" '+atributos+' >'+this.conteudo+'</button>'; 
}

// CLASSE QUE CRIA FORM.SELECTS
var Selecao = function(nome, classe, id){
	this.itens = [];
	this.nome = nome;
	ClasseId.call(this, "",classe, id);
};

Selecao.prototype = new ClasseId();

// Metodo utilizado para incluir um item no array
Selecao.prototype.addItem = function(arrayItem){
	if(arrayItem instanceof Array && arrayItem.length == 2){
		this.itens.push(arrayItem);
	} else {
		console.log("É necessario enviar um array com dois itens, um sendo o valor e outro o rotulo");
	}
};

// Metodo utilizado para incluir um array com arrays de itens
Selecao.prototype.addItens = function(arrayItens){
	if(arrayItens instanceof Array && arrayItens[0] instanceof Array){
		for(var x = 0;x < arrayItens.length;x++){
				this.itens.push(arrayItens[x]);
		}
	} else {
		console.log("É necessario enviar arrays aninhados, sendo que cada um deles deve ter o tamanho de 2. EX: [['hora','HORAS'],['dia','DIAS']]");
	}
}

// Metodo utilizado para retornar um  select usando os dados repassados
Selecao.prototype.getSelecao = function(){
	var select = "<select name='"+this.nome+"' id='"+this.id+"' class='"+this.classe+"' "+this.getAtributo()+">";
	for(var x = 0;x < this.itens.length;x++){
		select += "<option value='"+this.itens[x][0]+"'>"+this.itens[x][1]+"</option>";
	}
	select += "</select>";
	return select;
};

// Classe usada para criar um DivRow no sistema de grids do bootstrap
var DivRow = function(classe, id){this.tamanho = 0; this.corpo = new Array(); ClasseId.call(this, "", classe, id); };

DivRow.prototype = new ClasseId();
DivRow.prototype.constructor = DivRow;
DivRow.prototype.addDiv = function(conteudo, tamanho, classe, id){ 
	// Verificando se o tamanho atual somado com o tamanho enviado é menor ou igual a 12
	var tamanhoAtual = this.tamanho + tamanho;
	if(tamanhoAtual <= 12){
		this.tamanho += tamanho;
		// Para classe o ids nao configurados, insira uma string vazia
		var classe = typeof classe == "undefined" ? "" : classe;
		var id =  typeof  id == "undefined" ? "" : id;
		this.corpo.push([conteudo, tamanho, classe, id]);
	} else {
		console.log('Tamanho enviado excede o limite de 12 grids.');
		return false;
	}
}
DivRow.prototype.getDivRow = function(){
	// Realizar um loop e criar o corpo da divRow, retorna-lo
	var di = '<div class="row">';
	for(var x = 0;x < this.corpo.length;x++){
		di += '<div class="col-sm-'+this.corpo[x][1]+' '+this.corpo[x][2]+'" id="'+this.corpo[x][3]+'">'+this.corpo[x][0]+'</div>';
	}
	di += '</div>';
	return di;
}

// Classe utilizada para criar abas
var DivTabs = function(){
	this.lista = [];
	this.conteudo = [];
	
}

// Metodo utilizado para acrescentar um tab, Nome, idDaDiv e div
DivTabs.prototype.addDivTabs = function(nome, idDaDiv, conteudo){
	if(typeof nome == "string" && nome.search('@') == -1 && idDaDiv.search('@') == -1 && typeof idDaDiv == "string" && typeof conteudo == "string"){
		this.lista.push(nome+'@'+idDaDiv); // Concatenando o nome com o idDaDiv
		this.conteudo.push(conteudo);
	} else {
		console.log("Alguma das informacoes nao foram repassadas corretamente, um simbolo de '@'' esta no nome ou no idDadiv e todos os parametros devem ser strings");
	}
}
// Metodo que retorna um tab com as informacoes repassadas
DivTabs.prototype.getDivTabs = function(){
	if(this.lista.length < 1){
		console.log("Não é possivel criar um divTab sem as informacoes");
		return false;
	}
	var ulTab = "<ul class='nav nav-tabs'>";
	var divs = "<div class='tab-content'>";
	for(var x = 0;x < this.lista.length;x++){ // Fazer um loop e preencher o ulTab
		var divisao = this.lista[x].split('@'); // Divide o nome do link com o id que vai identificar a div
		if(x == 0){ // Se x e igual a 0 entao esta e a primeira aba, entao ela deve estar ativa
			// O item da lista e a div do content devem ser criadas
			ulTab += "<li class='active'><a data-toggle='tab' href='#"+divisao[1]+"'>"+divisao[0]+"</a></li>";
			divs += "<div id='"+divisao[1]+"' class='tab-pane fade in active'>"+this.conteudo[x]+"</div>";
		} else {
			// O item da lista e a div do content devem ser criadas
			ulTab += "<li><a data-toggle='tab' href='#"+divisao[1]+"'>"+divisao[0]+"</a></li>";
			divs += "<div id='"+divisao[1]+"' class='tab-pane fade '>"+this.conteudo[x]+"</div>";
		}
	}
	ulTab += "</ul>";divs += "</div>";
	return ulTab + divs;
}

// Classe que configura a criaçao de um objeto modal
var Modal = function(cabeModal, corpoModal, rodapeModal, classe, id){ 
	this.cabeModal = cabeModal;
	this.corpoModal = corpoModal;
	this.rodapeModal = rodapeModal;
	this.tipoModal = true;
	ClasseId.call(this, "", classe, id);
};

Modal.prototype = new ClasseId();
Modal.prototype.constructor = Modal;
// Metodos configuradores das partes do modal
Modal.prototype.setCabeModal = function(cabeModal){ this.cabeModal = typeof cabeModal == "undefined" ? "" : cabeModal;};
Modal.prototype.setCorpoModal = function(corpoModal){ this.corpoModal = typeof corpoModal == "undefined" ? "" : corpoModal;};
Modal.prototype.setRodapeModal = function(rodapeModal){ this.rodapeModal = typeof rodapeModal == "undefined" ? "" : rodapeModal;};
// Metodos configurador do comportamento do modal
Modal.prototype.setTipoModal = function(tipoModal){this.tipoModal = typeof tipoModal == "undefined" ? false : tipoModal;};

Modal.prototype.getModal = function(){
	var conteudoDoModal = '<div '+this.getAtributo()+' class="modal fade '+this.classe+'" id="'+this.id+'" role="dialog"><div class="modal-dialog"><div class="modal-content">';
	conteudoDoModal += '<div class="modal-header">'+this.cabeModal+'</div>';
	conteudoDoModal += '<div class="modal-body">'+this.corpoModal+'</div>';
	conteudoDoModal += '<div class="modal-footer">'+this.rodapeModal+'</div>';
    conteudoDoModal += '</div></div></div>';
    return conteudoDoModal;
};
Modal.prototype.executaModal = function(){
	// Este metodo é dependente de jquery, apos executado o modal é exibido
	$('#'+this.id).modal({backdrop:this.tipoModal});
}

//Classe vendedor que cria o registro dos vendedores
var Vendedor = function(nome, imagem, id){
	this.nome = nome; this.imagem = imagem;
	this.tempoAtendimento = "";
	this.tempoFinalizaAtendimento = "";
	this.dataAtendimento = "";
	this.isImagem = true;
	ClasseId.call(this, "", "",id);
};



Vendedor.prototype = new ClasseId();
Vendedor.prototype.constructor = Vendedor;
// Metodos do vendedor
Vendedor.prototype.alteraImagem = function(){};

Vendedor.prototype.setNome = function(nome){ 
	this.nome = nome;
};
Vendedor.prototype.getVendedor = function(){
	var vend = ""; // Representa como um vendedor é exibido
	// Verificando a forma como o vendedor deve ser exibido, se é imagem ou nome
	if(this.isImagem){
		vend += '<p id="'+this.id+'">';
		vend += '<img class="img img-circle" style="width:48px;height:48px;" title="'+this.nome+'" src="'+this.imagem+'" alt="'+this.nome+'" />'+this.nome.split(' ')[0];
	} else{
		vend += '<p id="'+this.id+'" imagem="'+this.imagem+'" title="'+this.nome+'"><span class="glyphicon glyphicon-user"> </span> '+this.nome;
	}
	vend += ' <time style="font-weight:bold" class="text-danger">'+this.tempoAtendimento+'</time></p>';
	return vend;

};
Vendedor.prototype.iniciaAtendimento = function(){
	// Inicia o atendimento, definindo o tempo de atendimento
	var hora = new Date();
	this.tempoAtendimento = (hora.getHours()<10?'0':'')+hora.getHours()+':'+(hora.getMinutes()<10?'0':'')+hora.getMinutes();
	$('#'+this.id).find('time').html(this.tempoAtendimento);
	// Registrando a data do atendimento
	this.dataAtendimento = hora.getUTCFullYear() +'-'+(hora.getUTCMonth()+1)+'-'+hora.getUTCDate();

};


Vendedor.prototype.finalizaAtendimento = function(){
	// Registra tempo de finalizacao do atendimento
	var hora = new Date();
	this.tempoFinalizaAtendimento = (hora.getHours()<10?'0':'')+hora.getHours()+':'+(hora.getMinutes()<10?'0':'')+hora.getMinutes();
};

Vendedor.prototype.trocaExibicao = function(){
	// Se a imagem e verdadeira, exiba nomes e troque isImagem para false
	if(this.isImagem){
		this.isImagem = false;

		$('#'+this.id).html(this.getVendedor());
	} else { // Imagem nao e verdadeira, troque isImagem para true e reexiba os vendedores
		this.isImagem = true;
		$('#'+this.id).html(this.getVendedor());
	}

};

// CLASSE QUE GERA OBJETO PARA CRIAR GRAFICOS
var Grafico = function(dados, opcoes, classe, id){
	this.setDados(dados); // Validando o cadastro de dados
	this.dadosModificados = []; // Os dados modificados
	this.opcoes = opcoes;
	this.cores = []; // Define o array de cores
	this.total = 0; // Define a variavel total somando todos os atendimentos
	ClasseId.call(this, "", classe, id);
}

Grafico.prototype = new ClasseId();

Grafico.prototype.constructor = Grafico;
// Metodo para validacao de dados, recebe um array bidimencional e valida-o
Grafico.prototype.setDados = function(dados){
	if(dados instanceof Array && dados[0] instanceof Array && dados[0].length > 1){
		if(this.dadosModificados instanceof Array && this.dadosModificados.length >= 1){
			this.dadosModificados = dados;
		} else {
			this.dados = dados;
		}
	} else {
		console.log("Dados mal formatados.");
	}
}
// Metodo capaz de gerar percentual de todos os dados do grafico
Grafico.prototype.getPercentual = function(linha){
	var arr = [];
	if(this.dadosModificados.length > 1){
		arr = JSON.stringify(this.dadosModificados);
	} else{
		arr = JSON.stringify(this.dados);
	}
	var arrayLocal = JSON.parse(arr); // Tive que converter em um JSON para remover a referencia e poder alterar o array
	arr = null;
	// Vamos inciar fazendo um loop e pegando o valor total de cada coluna que for Integer
	// e/ou Float E somando elas
	var total = ['TOTAL'];
	for(var x = 1;x < arrayLocal.length;x++){
		if(linha){ // Linha é verdadeiro, então vamos calcular o percentual de cada array dentro do array
			var total = 0;
			// Fazendo loop interno para pegar o valor de cada campo
			for(var y = 1;y < arrayLocal[x].length;y++){
				if(!isNaN(arrayLocal[x][y])){ // Se este campo e um numero
					total += arrayLocal[x][y]; // Somando o valor total
				}
				
			}
			// Agora calculando o percentual, substituindo os valores das colunas
			for(var y = 1;y < arrayLocal[x].length;y++){
				if(!isNaN(arrayLocal[x][y])){
					arrayLocal[x][y] = parseFloat(parseFloat((arrayLocal[x][y] / total) * 100).toFixed(1));
				} else if(!isNaN(parseFloat(arrayLocal[x][y].split(' ')[0]))){
					arrayLocal[x][y] = arrayLocal[x][y-1]+' %';
				}
			}	
		} else {
			// Fazendo loop interno para pegar o valor de cada campo
			for(var y = 1;y < arrayLocal[x].length;y++){
				if(!isNaN(arrayLocal[x][y])){ // Se este campo e um numero
					if(total[y]){ // Verificando se a referencia ja existe
						total[y] += arrayLocal[x][y]; // Somando o valor total
					} else {
						total[y] = arrayLocal[x][y];
					}
				}
			}
		}
		

	}
	/* Agora faremos um loop para gerar a percentagem dividindo d asoma
		
	*/
	if(!linha){
		for(var x = 1;x < arrayLocal.length;x++){
			for(var y = 1;y < arrayLocal[x].length;y++){
				if(!isNaN(arrayLocal[x][y])){ // Se este campo e um numero
					var valor = parseFloat(parseFloat((arrayLocal[x][y] / total[y]) * 100).toFixed(2)) ; // Calcular percentual
					arrayLocal[x][y] = valor;
				}
			}
		}
	}
	// Retorna o arrayLocal com percentual
	return arrayLocal;

}
// Metodo que adiciona mais uma coluna aos dados Sempre adicionado a partir da segunda coluna
Grafico.prototype.addColuna = function(coluna){
	
	arrayLocal = [];
	if(this.dadosModificados > 1){ // Verifica se vamos usar o array modificado ou nao para gerar os novos dados
		arrayLocal = this.dadosModificados;
	} else {
		arrayLocal = this.dados;
	}
	// Verificar se a coluna tem a mesma extensao da coluna original
	if(arrayLocal.length == coluna.length){
		// Vamos fazer um loop e incluir a coluna na terceira parte
		for(var x = 0;x < arrayLocal.length;x++){
			arrayLocal[x].splice(2,0, coluna[x]);
		}
		this.dadosModificados = arrayLocal;
	} else {
		console.log("O tamanho da coluna esta incorreto.");
		return false;
	}
}
// Metodo que gera o novo array de dados retornando-o (Metodo somente usado dentro do metodo setCores)
Grafico.prototype.getCores = function(usarModificado){
	var arrayLocal = [];
	if(usarModificado){ // Verifica se vamos usar o array modificado ou nao para gerar os novos dados
		arrayLocal = this.dadosModificados;
	} else {
		arrayLocal = this.dados;
	}
	var qtdCores = this.cores.length; // Conta a quantidade de cores
	var x = 0; // Variavel que vai contar as cores
	var novo = []; // Array auxiliar para inclusao dos dados
	// Verificar se ja  temos cores definidas
	for(var i = 2;i < arrayLocal[0].length;i++){ 
		if(arrayLocal[0][i].role == "style"){ // Verificando se o campo pesquisado tem
			// o atributo role com valor style.
			// Fazer um loop no array e excluir o campo de referencia
			for(var e = 0;e < arrayLocal.length;e++){
				arrayLocal[e].splice(i, 1); // Removendo a coluna do array
			}
		}
	}
	novo.push(arrayLocal[0]);
	novo[0].push({role:'style'});
	// Iniciando o loop para preencher a cor
	for(var y = 1;y < arrayLocal.length;y++){
		if(x == qtdCores){
			x = 0;
		}
		novo.push(arrayLocal[y]);
		novo[y].push(this.cores[x]);
		x++;
	}
  return novo;
}
// metodo que define a cor ou as cores do grafico
Grafico.prototype.setCores = function(cores){
	// Verifica se as cores enviadas sao um array
	if(cores instanceof Array && cores.length >= 1){
		this.cores = cores;
		if(this.dadosModificados.length > 1){
			var novo = this.getCores(true); // Informo que desejo usar o array modificado
		} else{
			var novo = this.getCores(); // Retorna o array original modificado
		}
		// Definindo os novos dadosModificados
		this.dadosModificados = novo;
	}
}
// Metodo para colocar rotulo em anotacoes 
/* METODO DESATIVADO NO MOMENTO
Grafico.prototype.setRotulo = function(){
	
	var arrayLocal = [];
	if(this.dadosModificados.length > 1){ // Verifica se vamos usar o array modificado ou nao para gerar os novos dados
		arrayLocal = this.dadosModificados;
	} else {
		arrayLocal = this.dados;
	}

	var novo = []; // Novo array bidimensional para formatar os dados
	for(var i = 2;i < arrayLocal[0].length;i++){ 
		if(arrayLocal[0][i].role == "annotation"){ // Verificando se o campo pesquisado tem
			// o atributo role com valor annotation.
			// Fazer um loop no array e excluir o campo de referencia
			for(var e = 0;e < arrayLocal.length;e++){
				arrayLocal[e].splice(i, 1); // Removendo a coluna do array
			}
	  	}
	}
	//novo.push(arrayLocal[0]);
	// Iniciar a movimentacao das colunas para que possamos colocar as anotacoes nos locais corretos
	var coluna = [];
	for(var x = 1;x < arrayLocal[1].length;x++){
		// Verificando se o campo é um numero, se for incluir um role:annotation apos o numero de indice
		if(typeof arrayLocal[1][x] == "number"){
			if(arrayLocal[1][x+1]){
				coluna[x+1] = {role:"annotation"};
				coluna[x+2] = null;
			} else {
				coluna[x+1] = {role:"annotation"};
			}
		} else {
			if(typeof arrayLocal[1][x-1] == "number"){
				coluna[x+2] = arrayLocal[1][x];
			} else {
				coluna[x+1] = arrayLocal[1][x];;
			}
		}
	}
	return coluna;
	novo[0].push({role:'annotation'});
	// Iniciando o loop para preencher o rotulo
	for(var y = 1;y < arrayLocal.length;y++){
		novo.push(arrayLocal[y]); // Insere o conteudo do array original
		novo[y].push(arrayLocal[y][1]); // Insere o rotulo na posicao correta
	}
	
	this.dadosModificados = novo; // Apenda o array ao array personalizado
}
*/
// Metodo para ajustar a variavel total
Grafico.prototype.setTotal = function(coluna, linhaNaoRegistrada){

	if(!isNaN(coluna)){// Se a coluna usada para a soma foi definida, vamos somar
		var tot = 0; // Total a ser somado
		if(this.dadosModificados.length > 1){
			var arrayLocal = this.dadosModificados;
		} else {
			var arrayLocal = this.dados
		}

		// Verificando se a opçao de linha nao registrada foi informada
		if(linhaNaoRegistrada == "ultima"){ // Se for ultima, entao registrar a ultima linha como nao participante da soma
			linhaNaoRegistrada = arrayLocal.length - 1; 
		} else if(isNaN(linhaNaoRegistrada)){
			linhaNaoRegistrada = undefined;
		}
		// Fazer o loop, somar a coluna e colocar no atributo this.total
		for(var x = 1;x < arrayLocal.length;x++){
			if(x == linhaNaoRegistrada){
				continue;
			} else {
				tot += arrayLocal[x][coluna];
			}
		}
		// Atualizando o valor do total
		this.total = tot;
	} else {
		console.log("É necessario informar pelo menos uma coluna");
	}
};
// Metodo para definir as opcoes do grafico
Grafico.prototype.setOpcoes = function(opcoes){
	this.opcoes = opcoes;
}

// Metodo que prepara os dados para a criacao do grafico
Grafico.prototype.getDados = function(percent, linha){
	// Verificando os dados são um array bidimensional e se as opcoes sao um objeto
	if(this.dados instanceof Array && this.dados[0] instanceof Array && this.opcoes instanceof Object){
		if(percent){
			var dado = google.visualization.arrayToDataTable(this.getPercentual(linha));
		} else if(this.dadosModificados.length > 1){
			var dado = google.visualization.arrayToDataTable(this.dadosModificados);
		} else {
			var dado = google.visualization.arrayToDataTable(this.dados);
		}
	}
	return dado;
}
// Metodo que cria um grafico de pizza
Grafico.prototype.getPizza = function(){
		var dado = this.getDados(); // Recebendo o array de dados para montar o grafico
		var chart = new google.visualization.PieChart(document.getElementById(this.id));
		chart.draw(dado, this.opcoes);
	
}
// Metodo que cria grafico de coluna
Grafico.prototype.getColuna = function(percent, linha){
	var dado = this.getDados(percent, linha);
	var chart = new google.visualization.ColumnChart(document.getElementById(this.id));
	chart.draw(dado, this.opcoes);
	
}
//Metodo que cria grafico de barra
Grafico.prototype.getBarra = function(percent, linha){
	var dado = this.getDados(percent, linha);
	var chart = new google.visualization.BarChart(document.getElementById(this.id));
	chart.draw(dado, this.opcoes);
}
// Metodo para criar grafico de linha
Grafico.prototype.getLinha = function(percent, linha){
	var dado = this.getDados(percent, linha);
	var chart = new google.visualization.LineChart(document.getElementById(this.id));
	chart.draw(dado, this.opcoes);
}

/*
	CLASSE UTILIZADA PARA VALIDAR DADOS DE UM FORMULARIO
*/

var Formulario = function(){
	this.dados = {};
};

// Metodo para validar uma data, retorna true se a data foi validada
Formulario.prototype.validaData = function(idOuClasse){
	
	// Se a classe ou id não for encontrado, retorne erro
	if(typeof $(idOuClasse).val() == "undefined"){
		console.log('Não foi possível encontrar este campo. '+idOuClasse);
		return false;
	}
	// Agora vamos verificar se o valor pode ser convertido em uma data
	var data = $(idOuClasse).val();
	// Regex para validar a data
	var re = /^[2][0][0-9][0-9]-([0][0-9]|[1][0-2])-([0-2][0-9]|[3][0-1])$/g;
	// Se a data seguir o padrao, exiba correto, senao exiba um alert informando que a data esta incorreta
	if(data.search(re) == -1){
		alert("A data informada esta no formato incorreto.");
		return false;
	}
	// Data esta correta, vamos retornar o objeto Date da data informada
	var d = new Date(data);
	return d;
};

// Método que compara dois objetos data para verificar se De é menor ou igual a ate
Formulario.prototype.deMenorQueAte = function(data1, data2){
	
	// Recebemos dados do tipo string (supostamente classe ou id e os atribuem a data1 e data2)

	if(typeof data1 == "string" && typeof data2 == "string"){
		var data1 = this.validaData(data1);var data2 = this.validaData(data2);
	} else if(typeof data1 == "undefined" || typeof data2 == "undefined" || typeof data1 == false || typeof data2 == false){
		console.log("Os objetos enviados não são datas.");
		return false;
	}

	// Verificando se a data1 é menor/igual a data2
	if(data1.getTime() > data2.getTime()){
  	alert('A data DE nao deve ser maior que a data ATE.');
  	return false;
  	} else {
		var de2 = data1.getUTCFullYear() +'-'+(data1.getUTCMonth()+1 > 9 ? data1.getUTCMonth()+1 : '0'+data1.getUTCMonth()+1)+'-'+(data1.getUTCDate() > 9 ? data1.getUTCDate() : '0'+data1.getUTCDate());
		var ate2 = data2.getUTCFullYear() +'-'+(data2.getUTCMonth()+1 > 9 ? data2.getUTCMonth()+1 : '0'+data2.getUTCMonth()+1)+'-'+(data2.getUTCDate()> 9 ? data2.getUTCDate() : '0'+data2.getUTCDate());
		this.dados.de = de2;this.dados.ate = ate2;
  		return true;
  	}
};
// Método para validar um campo verificando se o mesmo não está em branco
Formulario.prototype.validaCampo = function(idOuClasse){
	// Se a classe ou id não for encontrado, retorne erro
	if(typeof $(idOuClasse).val() == "undefined"){
		console.log('Não foi possível encontrar este campo. '+idOuClasse);
		return false;
	}
	// Existe, então vamos recuperar o seu valor
	var valor = $(idOuClasse).val();

	// Verificando se o valor esta em branco ou e indefinido
	if(valor == "" || typeof valor == "undefined"){
		console.log("Valor do campo não foi definido.");
		alert('Um campo não foi preenchido.');
		return false;
	}
	// Recuperando o IdOuClasse para usa-lo como chave do dicionario this.dados
	this.dados[idOuClasse.slice(1)] = valor.toString();
	return true;
};
// Metodo para validar arquivos, recebe dois parametros, o id do campo file e um array com os tipos aceitos
Formulario.prototype.validaArquivo = function(ID, arrayDeTipos){
	if(!arrayDeTipos instanceof Array){
		console.log("Os tipos enviados não estão na forma de array.");
		return false;
	}
	// Os tipos estão na forma de array, agora vamos procurar o ID do arquivo
	if(!(document.getElementById(ID)) || !(document.getElementById(ID).files)){
		console.log("O id escolhido não existe ou este ID informado não é de um input file: "+ID);
		return false;
	}
	// O id esta correto, agora vamos fazer um loop para ver se os arquivos enviados estão de acordo com os tipos aceitos
	var arq = document.getElementById(ID).files;
	// Verificando se existe pelo menos um arquivo, caso nao exista retorne a mensagem informando que nao temos arquivos
	if(arq.length < 1){
		alert('Por favor envie pelo menos um arquivo.');
		return false;
	}
	for(var x = 0;x < arq.length;x++){
		// Retirar a extensao do arquivo
		var nome = arq[x].name.split('.');
		// Fazer loop sobre as extensoes
		console.log(nome[1]);
			if(arrayDeTipos.indexOf(nome[1]) == -1){
				// Falhou, tipo nao aceito
				alert('Tipo incorreto, somente é aceito tipos: '+ arrayDeTipos.join(','));
				return false;
				break;
			}
	}
	// Se chegou aqui, o arquivo foi validado, então retorne true.
	return true;
};
