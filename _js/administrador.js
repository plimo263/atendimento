/* UTILIZADO PARA VALIDAR OS TRES FORMULARIOS DA PAGINA super_admin.php 

    AUTOR:  MARCOS FELIPE DA SILVA JARDIM
    VERSAO: 1.0
    DATA:   23-09-2016

*/

function validarCampos(idCampo){
    // Verificando se os campos não estão em branco
    var nome = $(idCampo).val();
    if ((nome.length > 0) && (nome != "")){
        return true;
    } else {
        return false;
    }
}

function validarFormAddUser(){
    var nome = validarCampos("#nome");
    var senha1 = $("#senha1").val();
    var senha2 = $("#senha2").val();
    if(nome){
        if((senha1 != "") && (senha2 != "")){
            if(senha1 == senha2){
                $("#formAddUser").submit();
            } else {
                $("#erroAddUser").text('Senhas não coincidem, favor verificar.');
            }
        } else {
            $("#erroAddUser").text('Alguma senha esta em branco, favor preencher');
        }
    } else {
        $("#erroAddUser").text('Preencha o nome do usuário');
    }
}

    $("#form1").hide();
