/*

autor: Marcos Felipe da Silva Jardim
versao: 1.0
data: 27-07-2017

*/
var masculinoFeminino, tipoAtendimento, tipoVenda, com_sem_rx, motivo_nao_venda, no_prazo;
var ultimaOrdemNaFila, novaOrdemNaFila; // Os integrantes da ultima vez que a fila existia e da nova fila atualizada
var ultimosEmAtendimento; // Sera um array que vai armazenar os individuos em atendimento
var estamosEmAtendimento = []; // Array com os venderores e seus tempos que ese encontram em atendimento
var conferido, conferido2, conferido3; // Os botoes de cancelar e enviar
var divulgadorLoja; // Variavel para armazenar um select com o divulgador da loja
var formu; // Formulario com nome do cliente, telefone, produto e valor
var exibeDivulgador = true;var exibir = true; // EXIBE OU NÃO O CAMPO DO DIVULGADOR QUANDO CLICADO NO BOTAO, POR PADRAO EXIBE QUANDO CLICAR
// Função que recupera os codigos de nao vendas que ainda não retornaram
function recuperaNaoVenda(loja){
	// Consulta ajax para recuperar todos as as não vendas
	$.ajax({
		url:'/recupera_nao_venda', method: 'POST', data:{loja:loja}
	}).done(function(data){
		
		$('#formulario').empty();
		$('#formulario').html('<select name="retornoNaoVenda" id="retornoNaoVenda"><option selected value="N">NENHUM</option>'+data+'</select>');
		
	}).fail(function(f){
		console.log('Erro');
	});
}

// FUNCÃO PARA CRIAR O SELECT COM OS DIVULGADORES DA LOJA
function divulgadoresLoja(){
	divulgadorLoja = '<label>Como conheceu a loja ? <select class="form-control" id="divulga" name="divulga"><option selected value="0">NENHUM</option>';
	for(var i in divulga){
		divulgadorLoja += '<option value="'+i+'">'+divulga[i]+'</option>';
	}
	divulgadorLoja += '</select></label>';
}

divulgadoresLoja();

// FUNCAO QUE VAI EXIBIR O DIVULGADOR
function incluiDivulgador(){
	// Botao para exibir o divulgador
	$('#divulgador').bind('click', function(e){
		e.preventDefault();
		
		// Se exibir for falso, ocultar o formulario e exibir somente o como conheceu a loja
		if(!exibir){
			exibir = true;
			$('#formulario').slideUp();
		}

		if(exibeDivulgador){
			$('#mais_divulgador').slideDown();
			exibeDivulgador = false;
		} else {
			$('#mais_divulgador').slideUp();
			exibeDivulgador = true;
		}
		
	});
}

var respostas = [0]; // Sera um array que vai armazenar as respostas corretas e envia-las
// VERIFICANDO SE O NAVEGADOR TEM SUPORTE AO ARMAZENAMENTO LOCAL
if(typeof(Storage) !== "undefined"){
	// Se numeracao local estiver ok passa direto
	if(localStorage.getItem('numeracaoLocal') != null){
	
	} else {
			localStorage.setItem('numeracaoLocal', 0); // Iniciando o contador
	}
	// Verificando se existem vendedores em atendimento neste momento.
	if(localStorage.getItem('emAtendimento') != null){
		// Retornando o array para o ultimos atendimentos. Vamos usa-lo quando a pagina for carregada para colocarmos os vendedores de volta.
		// Para os seus atendimentos
		estamosEmAtendimento = JSON.parse(localStorage.getItem('emAtendimento'));
	}
} else {
	alert('Navegador sem suporte ao armazenamento Local, caso fique sem internet seus dados não serão transmitidos');
}

setInterval("enviaDadosOffLine();", 20000); // Realizando a chamada para enviar dados offline a cada 50 segundos

// FUNCAO PARA GERIR LOOP E ENVIAR DADOS QUE AINDA ESTAO AGUARDANDO SEREM ENVIADOS
function enviaDadosOffLine(){

	if(parseInt(localStorage.getItem('numeracaoLocal')) >= 1){
		// Realizar loop sobre cada dado do armazenamento Local e tentar enviar os dados para o servidor
		for(var i in localStorage){
			// Se a chave (i) nao for numeracaoLocal realizaremos uma chamada de ajax
			if(i != 'numeracaoLocal'){
				// Enviando as respostas para o servidor
				
				$.ajax({
					method: 'POST', url: '/atendimento', data: {dados:localStorage.getItem(i)}
				}).done(function(data){
					console.log(data);
					if(data){
						var contagem = parseInt(localStorage.getItem('numeracaoLocal')) - 1; // Decrementando o contador em um
						localStorage.setItem('numeracaoLocal', contagem); // definindo o contador de numeracaoLocal
						localStorage.removeItem(parseInt(i)); // Removendo o item enviado
					}
				}).fail(function(){
					console.log('continue tentando');
					$('#erro').text('* VERIFICAR CONEXÃO COM A INTERNET');

			});
			}
		}

	} else {
		localStorage.clear(); // Zerando o localStorage e gerando a numeracaoLocal a partir do zero
		localStorage.setItem('numeracaoLocal',0);
		localStorage['emAtendimento'] = JSON.stringify(estamosEmAtendimento);
		$('#erro').text('');
	}

}

// VARIAVEL QUE ARMAZENARÁ TODAS AS PERGUNTAS
var perguntas = '<h5 class="text-danger text-uppercase" id="erro"></h5> \
<div id="radio1" class="radio"><p class="text-center text-uppercase">Qual o sexo do cliente ?</p> \
        	<label><input type="radio" value="M" name="tipoAtendimento"> Masculino </label><br/><br/> \
        	<label><input type="radio" value="F" checked name="tipoAtendimento"> Feminino </label> \
        </div><div id="radio2" style="display:none;" class="radio"> \
        	<p class="text-center text-uppercase">Qual foi o tipo de atendimento ?</p> \
        	<label><input type="radio" value="venda"  name="tipoAtendimento2"> Venda</label><br/><br/> \
        	<label><input type="radio" value="nao_venda" name="tipoAtendimento2"> Não Venda</label><br/><br/> \
        	<label><input type="radio" value="ajuste_conserto_montagem_pagamento" name="tipoAtendimento2"> Ajuste-conserto-montagem-pagamento</label><br/><br/> \
        	<label><input type="radio" value="entrega" name="tipoAtendimento2"> Entrega</label><br/><br/> \
        	<label><input type="radio" value="troca_assistencia" name="tipoAtendimento2"> Troca/assistência</label><br/><br/></div>';

perguntas += '<div id="radio3" style="display:none;" class="radio"> \
        	   <p class="text-center text-uppercase">VENDA</p> \
        	<label><input type="radio" value="ajuste" name="tipoAtendimento3"> Ajuste / Pagamento </label><br/><br/> \
        	<label><input type="radio" value="retorno_encaminhamento_medico" name="tipoAtendimento3"> Retorno encaminhamento médico </label><br/><br/> \
        	<label><input type="radio" value="retorno_reserva" name="tipoAtendimento3"> Retorno de reserva </label><br/><br/> \
        	<label><input type="radio" value="indicacao" name="tipoAtendimento3"> Indicação </label><br/><br/> \
        	<label><input type="radio" value="retorno_orcamento" name="tipoAtendimento3"> Retorno de orçamento </label><br/><br/> \
        	<label><input type="radio" value="normal"  name="tipoAtendimento3"> Normal </label></div>';

perguntas += '<div id="radio4" style="display:none;" class="radio"> \
        	   <p class="text-center text-uppercase"> NÃO VENDA COM RX OU SEM RX</p> \
        	<label><input type="radio" value="com_rx"  name="tipoAtendimento4"> Com RX</label><br/><br/> \
        	<label><input type="radio" value="sem_rx" name="tipoAtendimento4"> Sem RX</label> \
        	</div>';

perguntas += '<div id="radio5" style="display:none;" class="radio"> \
        	   <p class="text-center text-uppercase"> MOTIVO DA NAO VENDA</p> \
        	<label><input type="radio" value="restricao_spc" name="tipoAtendimento5"> Restrição SPC</label><br/><br/> \
        	<label><input type="radio" value="preco" name="tipoAtendimento5"> Preço</label><br/><br/> \
        	<label><input type="radio" value="prazo_de_entrega" name="tipoAtendimento5"> Prazo de entrega</label><br/><br/> \
        	<label><input type="radio" value="falta_de_produto" name="tipoAtendimento5"> Falta de produto</label><br/><br/> \
        	<label><input type="radio" value="reserva" name="tipoAtendimento5"> Reserva</label><br/><br/> \
        	<label><input type="radio" value="encaminhamento_medico" name="tipoAtendimento5"> Encaminhamento médico</label><br/><br/> \
        	<label><input type="radio" value="orcamento" name="tipoAtendimento5"> Orçamento</label><br/></br/></div>';
perguntas += '<div id="radio6" style="display:none;" class="radio"> \
				<h3 class="text-center text-danger">As respostas estão corretas ?</h3> \
				</div>';
perguntas += '<div id="radio7" style="display:none;" class="radio"> \
				<p class="text-center text-uppercase">ENTREGUE NO PRAZO ? </p> \
        	<label><input type="radio" value="sim" name="tipoAtendimento6"> SIM </label><br/><br/> \
        	<label><input type="radio" value="nao" name="tipoAtendimento6">NÃO </label><br/><br/> \
				</div>';
// FORMULARIO COM OS CAMPOS A SEREM PREENCHIDOS DO CLIENTE
formu = '<br/><br/><div style="display:none;margin-right:70%" id=formulario><label>NOME: <input type=text value="" name=nome_cliente class="nome form-control" /></label>';
formu += '<br/><label>TELEFONE: <input type=text value="" name=telefone class="telefone form-control" /></label>';
formu += '<br/><label>PRODUTO: <input type=text value="" name=produto class="produto form-control" /></label>';
formu += '<br/><label>VALOR: <input type=text value="" name=valor class="valor form-control" /></label></div>';

// Botao de conferido 3 para incluir campo de "como conheceu a loja ?"
conferido3 = '<span style="margin-right:5em"><button style="display:inline-block" class="btn btn-xs btn-basic" id="divulgador">Como conheceu a loja</button></span>';
conferidoVenda = '<span style="margin-right:5em;"><button style="display:inline;" class="btn btn-xs btn-danger" id="cancelar">CANCELAR</button></span>';
conferidoVenda += conferido3+'<span style="margin-right:5em;"><button style="display:inline" id="mais_info2" class="btn btn-xs btn-basic">Retorno</button></span>';
conferidoVenda += '<span><button style="display:inline;" class="btn btn-xs btn-success pull-right" id="enviar">ENVIAR</button></span>';
conferidoVenda += '<br/><br/>'+formu+'<div style="display:none;margin-right:40%" id="mais_divulgador">'+divulgadorLoja+'</div>';
conferido = '<span style="margin-right:10em;"><button style="display:inline;" class="btn btn-xs btn-danger" id="cancelar">CANCELAR</button></span>'+conferido3+'<span><button style="display:inline;" class="btn btn-xs btn-success pull-right" id="enviar">ENVIAR</button></span>';
conferido += '<br/><br/><div style="display:none;margin-right:40%" id="mais_divulgador">'+divulgadorLoja+'</div>';
// Mudanda das opçoes quando o atendimento escolhido e não venda
conferido2 = '<span style="margin-right:2em;"><button style="display:inline-block;" class="btn btn-xs btn-danger" id="cancelar">CANCELAR</button></span>'+conferido3;
conferido2 += '<span style="margin-right:5em;"><button style="display:inline-block" class="btn btn-xs btn-info" id="mais_info">Dados do cliente</button></span>';
conferido2 += '<span><button style="display:inline-block;" class="btn btn-xs btn-success pull-right" id="enviar">ENVIAR</button></span>';
conferido2 += formu+'<div style="display:none;margin-right:40%" id="mais_divulgador">'+divulgadorLoja+'</div>';


// FUNÇÃO PARA EXIBIR A CONFIRMACAO DAS OPÇÕES OU O CANCELAMENTO
function confirmaDados(arrayDeDados){
	$('#cancelar').bind('click', function(){
		exibeDivulgador = true; // Devolve esta variavel para o seu padrao, para acertar erros de clique.
		$('[data-dismiss="modal"]').show();$('[data-dismiss="modal"]').trigger('click');
		$('[data-dismiss="modal"]').hide();$('#radio1').show();$('#radio2').hide();
		$('#radio3').hide();$('#radio4').hide();$('#radio5').hide();
		$('#erro').text();$('.modal-body').empty();$('.modal-body').html(perguntas);
		$('.modal-footer p').empty();
		// MOVER O ITEM DE VOLTA PARA O ATENDIMENTO
		$('#naFila').children().each(function(index, value){
			var existe = ultimosEmAtendimento.indexOf($(this).attr('id')); // Recuperando o id do item novo
			if(existe != -1){
				$('#emAtendimento').append($(this));
			}
			

		});
		$('#validaQuestionario').show(); // Exibir o questionario novamente

	});
	$('#radio6').show(); // Ocultar o confirma/cancela

	// Se o Formulario foi confirmado vamos atualizar
	$('#enviar').bind('click', function(ev){
		if(arrayDeDados.indexOf('nao_venda') != -1){
			// DEFINE A OPÇÃO ESCOLHIDA E ATUALIZA E/OU CANCELA DADOS
			arrayDeDados[8] = $('.nome').val(); arrayDeDados[9] = $('.telefone').val();
			arrayDeDados[10] = $('.produto').val();	arrayDeDados[11] = $('.valor').val() != "" ? $('.valor').val().replace(',', '.') : 0.00;
			arrayDeDados[12] = $('#divulga').val();
		} else { // Realizando um loop para criar um array com todos os dados preenchidos, para que a inserção seja completa.
			var tamanho = arrayDeDados.length;
			for(var x = tamanho; x < 13;x++){ // ESTE ARRAY É CRIADO PARA ATENDER TODOS OS CAMPOS E COLOCAR TAMBÉM O DIVULGADOR QUE ATENDE AO ULTIMO CAMPO
				if(x == 11){
					arrayDeDados[x] = 0.00;
				} else if(x == 12){
					arrayDeDados[x] = $('#divulga').val();
				} else {
				arrayDeDados[x] = " ";
				}
			}
		}
		// Caso seja venda, verificar se o valor é diferente de N para usar o ID no array
		if(arrayDeDados.indexOf('venda') != -1){
			var retorno = $('#retornoNaoVenda').val();
			if(retorno != 'N'){ // Se contiver o id do retorno colocar seu valor no array
				arrayDeDados[13] = retorno;
			}
		}
		// Se a resposta for ajuste_conserto_montagem mover para cima
		if(arrayDeDados.indexOf('ajuste_conserto_montagem_pagamento') != -1){
			// MOVER O ITEM DE VOLTA PARA CIMA
			var item = $('#naFila p:last').detach();
			$('#naFila').prepend(item);
		}
		// Recuperando o ID do item e inserindo no array do item
		$('#naFila').children().each(function(index, value){
			var existe = ultimosEmAtendimento.indexOf($(this).attr('id')); // Recuperando o id do item novo
			if(existe != -1){
				arrayDeDados[0] = $(this).attr('id');
				arrayDeDados[1] = $(this).attr('inicioAtendimento');
				var d = new Date();
				arrayDeDados[2] = d.getHours()+':'+d.getMinutes();
				arrayDeDados[3] = d.getUTCFullYear() +'-'+(d.getUTCMonth()+1)+'-'+d.getUTCDate();
				$(this).find('time').empty(); // Retirando o time de inicio de atendimento.
				// Fazer um loop em todos que estao em atendimento e remover o item encontrado
				for(var i = 0;i< estamosEmAtendimento.length;i++){
					if(ultimosEmAtendimento[existe] == estamosEmAtendimento[i][0]){
						estamosEmAtendimento.splice(i,1); // Removendo o item do array estamosEmAtendimento
					}
				}
				ultimosEmAtendimento.splice(existe,1);// Retira o caboclo do array dos atendimentos.
				// Define os usuarios em atendimento, retira o que ja respondeu
				localStorage['emAtendimento'] = JSON.stringify(estamosEmAtendimento);
			}
			

		});
		
				
		// Enviando as respostas para o servidor
		$.ajax({
			method: 'POST', url: '/atendimento', data: {dados:arrayDeDados.toString()}
		}).done(function(data){
			//console.log(JSON.parse(data));
			
		}).fail(function(){

			// Armazenar localmente os dados e deixar um script de loop verificando até que a conexão seja 
			// estabelecida
			var ID_LOCAL = parseInt(localStorage.getItem('numeracaoLocal'))+1; // Obter o ID atual para gerir o armazenamento Local
			localStorage.setItem(ID_LOCAL, arrayDeDados); // Usando o ID atual para salvar os dados no armazenamento local
			localStorage.setItem('numeracaoLocal', parseInt(ID_LOCAL)); // Acumulando o ID para ser o proximo usado
		});
		
		$('.modal-footer p').empty();$('#validaQuestionario').show();

		

	
	// REINICIE O MODAL, FECHE E DEIXE-O PRONTO PARA O PROXIMO
	$('[data-dismiss="modal"]').show();$('[data-dismiss="modal"]').trigger('click');
	$('[data-dismiss="modal"]').hide();$('#radio1').show();$('#radio2').hide();
	$('#radio3').hide();$('#radio4').hide();$('#radio5').hide();
	$('#erro').text();$('.modal-body').empty();$('.modal-body').html(perguntas);
	// Submeter formulario em ajax usando o array de dados enviados
	

	});
}



// APENDA AS PERGUNTAS PARA SEREM RESPONDIDAS
$(document).ready(function(){
	if(navigator.userAgent.toLowerCase().search('android') != -1){
		document.documentElement.webkitRequestFullscreen();
		$('.container-fluid:first').css({'height':'48px'});
		
	}

	$('.modal-body').append(perguntas);

	$('#validaQuestionario').click(function(ev){
		// Evita o comportamento padrão que é fechar o modal
		ev.preventDefault();
		// Recupera o valor do primeiro campo marcado (por default Feminino)
		masculinoFeminino = $('[name=tipoAtendimento]:checked').val();
		// Se tiver sido definido um valor padrao vamos ocultar o primeiro questionario e exibir o proximo		
		if(masculinoFeminino){
			respostas[4] = masculinoFeminino; // Inserindo a resposta no array
			$('#radio2').show();// Exibe o segundo questionario
			$('#radio1').hide(); // Oculta o primeiro
			
			
			// Verifica se o segundo questionario ja foi respondido
			var tipoAtendimento = $('[name=tipoAtendimento2]:checked').val();
			// Se a resposta for venda temos um terceiro questionario
			if(tipoAtendimento == "venda"){
				respostas[5] = tipoAtendimento; // Resposta para o tipo de atendimento
				// Recupera o valor do terceiro questionario
				tipoVenda = $('[name=tipoAtendimento3]:checked').val();
				/*
				// Oculta o segundo e exibe o terceiro questionario
				// Veja uma logica aqui, toda vez que um questionario foi 
				// marcado e tiver outro para exibir, o antigo e oculto e o novo e exibido
				*/
				$('#radio2').hide();$('#radio4').show(); 
				com_sem_rx = $('[name=tipoAtendimento4]:checked').val(); // RECUPERA O VALOR DE RX INICIALMENTE SEM VALOR
				// SE RX TIVER SIDO DEFINIDO VAMOS EXECUTAR O CODIGO ABAIXO
				if(com_sem_rx){

					
					/*
						OCULTA O QUARTO FORMULARIO E EXIBIR O QUINTO FORMULARIO
					*/
					$('#radio4').hide();$('#radio3').show();
					respostas[6] = com_sem_rx; // Resposta para com ou sem RX

					// Tem o tipo de venda selecionado ?
					if(tipoVenda){
						/* EXIBINDO DADOS ESCOLHIDOS PARA CONFIRMACAO */
						respostas[7] = tipoVenda; // Resposta para o tipo de venda
						// Verificando se as repostas estão corretas antes de enviar
						$('#radio3').hide();
						recuperaNaoVenda(loj);
						// RESPOSTAS PARA VERIFICACAO
						$('#radio6').append('<p>SEXO :<span style="padding-left:14em">'+masculinoFeminino+'</span></p>');
						$('#radio6').append('<p>TIPO DE ATENDIMENTO :<span style="padding-left:5em">'+tipoAtendimento.replace(/_/g,' ')+'</span></p>');
						$('#radio6').append('<p>COM OU SEM RX :<span style="padding-left:8em">'+com_sem_rx.replace(/_/g,' ')+'</span></p>');
						$('#radio6').append('<p>TIPO DE VENDA :<span style="padding-left:9em">'+tipoVenda.replace(/_/g,' ')+'</span></p>');
						$('.modal-footer p').html(conferidoVenda);$('#validaQuestionario').hide();
						incluiDivulgador(); // Ativa a rotina de click para a exibição do divulgador
						$('#mais_info2').bind('click', function(e){
						e.preventDefault();
						
						if(!exibeDivulgador){
							$('#mais_divulgador').slideUp();
							exibeDivulgador = true;
						}
						if(exibir){
							$('#formulario').slideDown();
							exibir = false;
						} else {
							$('#formulario').slideUp();
							exibir = true;
						}
					});

						// DEFINE A OPÇÃO ESCOLHIDA E ATUALIZA E/OU CANCELA DADOS
						confirmaDados(respostas);
						respostas = [0]; // Zerando o array // EM TESTE
					}
					$('[value="normal"]').attr('checked', true); // Na primeira vez normal nao vai estar marcado, entao defina como true
				}
				
			// O TIPO DE ATENDIMENTO É NAO VENDA, VAMOS ABRIR OUTRO QUESTIONARIO
			} else if(tipoAtendimento == "nao_venda"){
				respostas[5] = tipoAtendimento; // Resposta para o tipo de atendimento
				// ABRE O QUESTIONARIO 4 E OCULTA OS DEMAIS
				$('#radio4').show();
				$('#radio1').hide();
				$('#radio2').hide();
				com_sem_rx = $('[name=tipoAtendimento4]:checked').val(); // RECUPERA O VALOR DE RX INICIALMENTE SEM VALOR
				// SE RX TIVER SIDO DEFINIDO VAMOS EXECUTAR O CODIGO ABAIXO
				if(com_sem_rx){
					/*
						OCULTA O QUARTO FORMULARIO E EXIBIR O QUINTO FORMULARIO
					*/
					$('#radio4').hide();$('#radio5').show();
					respostas[6] = com_sem_rx; // Resposta para com ou sem RX
					// RECUPERAR O VALOR DO MOTIVO DE NAO-VENDA INICIALMENTE VAZIO
					motivo_nao_venda = $('[name=tipoAtendimento5]:checked').val();
					// SE TIVER DEFINIDO O MOTIVO DE NAO VENDA 
					if(motivo_nao_venda){
						respostas[7] = motivo_nao_venda;// Define o motivo da não venda
						$('#radio5').hide();
						$('#radio6').append('<p>SEXO :<span style="padding-left:14em">'+masculinoFeminino+'</span></p>');
						$('#radio6').append('<p>TIPO DE ATENDIMENTO :<span style="padding-left:5em">'+tipoAtendimento.replace(/_/g,' ')+'</span></p>');
						$('#radio6').append('<p>COM OU SEM RX :<span style="padding-left:8em">'+com_sem_rx.replace(/_/g,' ')+'</span></p>');
						$('#radio6').append('<p>MOTIVO DA NÃO VENDA :<span style="padding-left:4.6em">'+motivo_nao_venda.replace(/_/g,' ')+'</span></p>');

						$('.modal-footer p').html(conferido2);$('#validaQuestionario').hide();
						 $("input.valor").maskMoney({showSymbol:true, symbol:"R$", decimal:",", thousands:"."});
						 $("input.telefone").mask("(99) 99999-9999");
						
						$('#mais_info').bind('click', function(e){
							e.preventDefault();
							if(!exibeDivulgador){
								$('#mais_divulgador').slideUp();
								exibeDivulgador = true;
							}
							if(exibir){
								$('#formulario').slideDown();
								exibir = false;
							} else {
								$('#formulario').slideUp();
								exibir = true;
							}
						});
						incluiDivulgador(); // Ativa a rotina de click para a exibição do divulgador

						confirmaDados(respostas);
						respostas = [0]; // Zerando o array

					}

				}
			// SE O TIPO DE ATENDIMENTO FOR AJUSTE-CONSERTO-MONTAGEM
			} else if(tipoAtendimento == "ajuste_conserto_montagem_pagamento"){
				respostas[5] = tipoAtendimento; // Resposta para o tipo de atendimento
				$('#radio2').hide();
				$('#radio6').append('<p>SEXO :<span style="padding-left:14em">'+masculinoFeminino+'</span></p>');
				$('#radio6').append('<p>TIPO DE ATENDIMENTO :<span style="padding-left:5em">'+tipoAtendimento.replace(/_/g,' ')+'</span></p>');
				$('.modal-footer p').html(conferido);$('#validaQuestionario').hide();
				// DEFINE A OPÇÃO ESCOLHIDA E ATUALIZA E/OU CANCELA DADOS

				incluiDivulgador(); // Ativa a rotina de click para a exibição do divulgador
				confirmaDados(respostas);
				respostas = [0]; // Zerando o array


			// SE O TIPO DE ATENDIMENTO FOR ENTREGA
			} else if(tipoAtendimento == "entrega"){
				respostas[5] = tipoAtendimento; // Resposta para o tipo de atendimento
				
				// Verificando se as repostas estão corretas antes de enviar
				$('#radio2').hide();$('#radio7').show();
				no_prazo = $('[name=tipoAtendimento6]:checked').val();
				if(no_prazo){
					respostas[6] = no_prazo;
					$('#radio7').hide();
					// RESPOSTAS PARA VERIFICACAO
					$('#radio6').append('<p>SEXO :<span style="padding-left:14em">'+masculinoFeminino+'</span></p>');
					$('#radio6').append('<p>TIPO DE ATENDIMENTO :<span style="padding-left:5em">'+tipoAtendimento.replace(/_/g,' ')+'</span></p>');
					$('#radio6').append('<p>ENTREGUE NO PRAZO :<span style="padding-left:5em">'+no_prazo.replace(/_/g,' ')+'</span></p>');
					$('.modal-footer p').html(conferido);$('#validaQuestionario').hide();

					incluiDivulgador(); // Ativa a rotina de click para a exibição do divulgador

					// DEFINE A OPÇÃO ESCOLHIDA E ATUALIZA E/OU CANCELA DADOS
					confirmaDados(respostas);
					respostas = [0]; // Zerando o array
				}

			// SE O TIPO DE ATENDIMENTO FOR TROCA_ASSISTENCIA
			} else if(tipoAtendimento == "troca_assistencia"){
				respostas[5] = tipoAtendimento; // Resposta para o tipo de atendimento
				// Verificando se as repostas estão corretas antes de enviar
				$('#radio2').hide();
	
				$('#radio6').append('<p>SEXO :<span style="padding-left:14em">'+masculinoFeminino+'</span></p>');
				$('#radio6').append('<p>TIPO DE ATENDIMENTO :<span style="padding-left:5em">'+tipoAtendimento.replace(/_/g,' ')+'</span></p>');
				$('.modal-footer p').html(conferido);$('#validaQuestionario').hide();
				
				incluiDivulgador(); // Ativa a rotina de click para a exibição do divulgador

				// DEFINE A OPÇÃO ESCOLHIDA E ATUALIZA E/OU CANCELA DADOS
				confirmaDados(respostas);
				respostas = [0]; // Zerando o array

			// SE O TIPO DE ATENDIMENTO FOR ENCAMINHAMENTO MEDIO
			} else if(tipoAtendimento == "encaminhamento_medico"){
				respostas[5] = tipoAtendimento; // Resposta para o tipo de atendimento
				// Verificando se as repostas estão corretas antes de enviar
				$('#radio2').hide();
	
				$('#radio6').append('<p>SEXO :<span style="padding-left:14em">'+masculinoFeminino+'</span></p>');
				$('#radio6').append('<p>TIPO DE ATENDIMENTO :<span style="padding-left:5em">'+tipoAtendimento.replace(/_/g,' ')+'</span></p>');
				$('.modal-footer p').html(conferido);$('#validaQuestionario').hide();
				
				incluiDivulgador(); // Ativa a rotina de click para a exibição do divulgador

				// DEFINE A OPÇÃO ESCOLHIDA E ATUALIZA E/OU CANCELA DADOS
				confirmaDados(respostas);
				respostas = [0]; // Zerando o array

			}

		}

	});
	// Problema que aparecia com a barra de menu que ficava atras do texto
	// na pagina, em caso de smartphones.
	$('.navbar').css({'z-index':'1'});

});

$('#trocaImagemNome').click(function(e){
	e.preventDefault();
	$('#naFila').children().each(function(index, value){// Para cada item na fila, transforme-o em um nome
		// Recuperando o titulo e o ID do vendedor
		var nomeVendedor = $(this).attr('title');
		var codigoVendedor = $(this).attr('id');
		
		// Verificando se é uma imagem
		if($(this).find('img').attr('src')){
			$('#trocaImagemNome').removeClass('btn-danger').addClass('btn-success').text('EXIBIR IMAGENS');

			var imagem = $(this).find('img').attr('src');
			var tempo = $(this).find('time').text();
			var paragrafo = '<p imagem="'+imagem+'" tempo="'+tempo+'" title="'+nomeVendedor+'" id="'+codigoVendedor+'" class="ui-sortable-handle"><span class="glyphicon glyphicon-user"></span> '+nomeVendedor+' <time style="font-weight:bold" class="text-danger">'+tempo+'</time></p>';
			
			// Transforme em um paragrafo com nomes
			$(this).parent().append(paragrafo);
			
			$(this).remove(); // remove o paragrafo

		} else { // Não é uma imagem transforme ela em uma imagem
			// Recuperando a imagem
			var imagem = $(this).attr('imagem');
			var tempo = $(this).attr('tempo');
			var img = '<p id="'+codigoVendedor+'" title="'+nomeVendedor+'" ><img style="width:48px;height:48px" title="'+nomeVendedor+'" class="img img-circle" src="'+imagem+'" alt="'+nomeVendedor+'">'+nomeVendedor.split(' ')[0]+' <time style="font-weight:bold" class="text-danger">'+tempo+'</time></p>';
			
			$(this).parent().append(img);
			$(this).remove(); // Remove o paragrafo
			// Trocando a cor do botao
			$('#trocaImagemNome').removeClass('btn-success').addClass('btn-danger').text('EXIBIR NOMES');

		}

	});

	$('#emAtendimento').children().each(function(index, value){// Para cada item na fila, transforme-o em um nome
		// Recuperando o titulo e o ID do vendedor
		var nomeVendedor = $(this).attr('title');
		var codigoVendedor = $(this).attr('id');
		
		// Verificando se é uma imagem
		if($(this).find('img').attr('src')){
			//$('#trocaImagemNome').removeClass('btn-danger').addClass('btn-success').text('EXIBIR IMAGENS');

			var imagem = $(this).find('img').attr('src');
			var tempo = $(this).find('time').text();
			var paragrafo = '<p imagem="'+imagem+'" title="'+nomeVendedor+'" id="'+codigoVendedor+'" class="ui-sortable-handle"><span class="glyphicon glyphicon-user"></span> '+nomeVendedor+' <time style="font-weight:bold" class="text-danger">'+tempo+'</time></p>';
			
			// Transforme em um paragrafo com nomes
			$(this).parent().append(paragrafo);
			$(this).remove(); // remove o paragrafo

		} else { // Não é uma imagem transforme ela em uma imagem
			// Recuperando a imagem
			var imagem = $(this).attr('imagem');
			var tempo = $(this).find('time').text();
			var img = '<p id="'+codigoVendedor+'" title="'+nomeVendedor+'" ><img style="width:48px;height:48px" title="'+nomeVendedor+'" class="img img-circle" src="'+imagem+'" alt="'+nomeVendedor+'">'+nomeVendedor.split(' ')[0]+' <time style="font-weight:bold" class="text-danger">'+tempo+'</time></p>';
			
			$(this).parent().append(img);
			$(this).remove(); // Remove o paragrafo
			// Trocando a cor do botao
			//$('#trocaImagemNome').removeClass('btn-success').addClass('btn-danger').text('EXIBIR NOMES');

		}

	});
	
});


$(document).ready(function(){
	$('#naFila').sortable({
		opacity: 0.8,
		connectWith:"#emAtendimento",
		start: function() {
			ultimaOrdem = $("#naFila").sortable("toArray");
		},
		stop : function() {
			novaOrdem = $('#naFila').sortable("toArray");
			
		},
		receive: function(e,ui){ // Evento ativo somente quando o item é recebido
			// Retira fulano da fila e coloca-o em ultimo
			var item = $('#naFila #'+$(ui.item).attr('id')).detach();
			$('#naFila').append($(item));

			$('[data-toggle=modal]').trigger('click');

			}

	});
	$('#emAtendimento').sortable({
		connectWith:'#naFila',
					
		start : function(){
			// Recuperando a ultima atualizacao da fila
			ultimosEmAtendimento = $('#emAtendimento').sortable("toArray");
			
		},
		receive: function(e,ui){ // Evento ativo somente quando o item é recebido
			// Recuperando a ultima atualizacao da fila
			ultimosEmAtendimento = $('#emAtendimento').sortable("toArray");


			// Registra a hora para monitorar o atendimento
			var hora = new Date();
			// Salvando a hora em formato hh:mm
			$('#'+$(ui.item).attr('id')).attr('inicioAtendimento', (hora.getHours()<10?'0':'')+hora.getHours()+':'+(hora.getMinutes()<10?'0':'') + hora.getMinutes());
			// Incluir um campo de tempo acima do vendedor para mostar o inicio do atendimento
			$('#'+$(ui.item).attr('id')).find('time').text((hora.getHours()<10?'0':'')+hora.getHours()+':'+(hora.getMinutes()<10?'0':'') + hora.getMinutes());
			$('#'+$(ui.item).attr('id')).find('time').addClass('text-danger').css({'font-weight':'bold'});
			estamosEmAtendimento.push([$(ui.item).attr('id'), (hora.getHours()<10?'0':'')+hora.getHours()+':'+(hora.getMinutes()<10?'0':'') + hora.getMinutes()]); // Armazenando o objeto que esta em atendimento
			localStorage['emAtendimento'] = JSON.stringify(estamosEmAtendimento); // Gravando localmente o estamos em atendimento
					
			}
		
	});

	/*
	Local onde se verifica os vendedores que estão em atendimento e os movem para o atendimento

	*/
	$('#naFila p').each(function(index, value){
		// Verifica se seu ID é o mesmo de algum dos que esta emAtendimento
		var ID = $(this).attr('id');
		var clonado = $(this).clone();
		for(var i = 0;i<estamosEmAtendimento.length;i++){
			var ID_ATENDIMENTO = estamosEmAtendimento[i][0];
			$(clonado).find('time').text(estamosEmAtendimento[i][1]);
			$(clonado).attr('inicioAtendimento', estamosEmAtendimento[i][1]);
			if(ID == ID_ATENDIMENTO){
				$('#emAtendimento').append(clonado);
				$(this).remove();
				break;
			}
		}
	});

});