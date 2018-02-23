<!DOCTYPE html>
<html lang="pt-BR">
<head><title>Area de login</title>
 <meta charset="utf-8" />
 <link rel='shortcut icon' href='/imagens/favicon.ico' type='image/x-icon'/>
<meta name='viewport' content='width=device-width, initial-scale=1'>
<link rel='stylesheet' href='/css/estilo.css' />
<!-- <script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'></script> -->
<script src='/js/jquery-3.1.0.min.js'></script>

<script src='http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'></script>
<link rel='stylesheet' href='http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'>

</head>    
<body>
 <div class='container-fluid'>
 <div class="row">
    <div style='background: firebrick;' class="col-sm-12">
     <img src='/imagens/logo_cabe2.png?v=121233' alt='' style='padding: 10px;' width='345' class='img img-responsive'>
     </div>
 </div>
  <div class="row">
     <div class="col-sm-4 col-sm-offset-4">
<form method=POST action="/admin" id='login' style=" margin-top: 10%;margin-left: 2%;">
        <div class="form-group">
            <span style='font-size: 1.3em; font-weight: bold;' class='glyphicon glyphicon-user text-uppercase text-success'><label for="nome">&nbsp;Usuario:</label></span>
            <input type=text class="form-control" name=nome id=nome placeholder="Digite seu login">
        </div>
        <p style='color: white; font-weight: bolder;' class="
         text-uppercase text-large" id="erro"></p>
        <div class="form-group">
            <span style='font-size: 1.3em; font-weight: bold;' class='glyphicon glyphicon-lock text-uppercase text-success'><label for=senha>&nbsp;Senha:</label></span>
            <input type="password" class="form-control" id="senha" name=senha placeholder="Sua senha">
        </div>
        <button type="button" id="enviar" class="btn btn-success">Acessar</button>
    </form>
   </div>
