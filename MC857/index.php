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

        
            <form name="integralizacao" id="form_integralizacao" action="control/Integralizacao.php" method="post" >
                <fieldset>
            <legend>Integraliza&ccedil;&atilde;o Curricular</legend>
                <input type="text" name="ra" id="ra" maxlength="6" />
                 
                <input id="id_botao"  type="submit" name="submit"  value="Gerar Integraliza&ccedil;&atilde;o" />
                </fieldset>
                
            </form>
        
        <div id="integralizacao">
        </div>
        
        <div id="id_teste"></div>

    </body>
</html>