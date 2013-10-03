<!DOCTYPE html>
<html lang="pt-br">
	<head>
		<link type="text/css" href="css/style.css" rel="stylesheet" />
		<script type="text/javascript" src="js/jquery-1.9.1.js"></script>
		<script type="text/javascript" src="js/jquery-ui-1.10.3.custom.min.js"></script>
		<script type="text/javascript" src="js/script.js"></script>
	</head>
	<body>
		<h1>Seja Bem-Vindo ao Sistema de Integraliza&ccedil;&atilde;o!</h1>
		
		<fieldset>
			<legend>Integraliza&ccedil;&atilde;o Curricular</legend>
			<form name="integralizacao curricular" id="form_integralizacao_curricular" action="Integralizacao.php" method="post" >
				<input type="text" name="ra" id="ra" maxlength="6" />
				<input type="submit" name="submit" value="Gerar Integraliza&ccedil;&atilde;o" />
			</form>
		</fieldset>
	</body>
</html>