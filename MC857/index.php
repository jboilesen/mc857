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
                <input type="submit" name="submit" value="Gerar Integraliza&ccedil;&atilde;o" />
                </fieldset>
                <div id="div_aluno" style="margin-top: 10px;">
                    <table>
                        <tr>
                            <td>
                                <label>RA</label>
                            </td>
                            <td>
                                <label >Nome</label>
                            </td>
                            <td>
                                <label>Curso</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input id="input_ra" style="width: 80px" disabled="true"/>
                            </td>
                            <td>
                                <input id="input_nome" style="width: 250px" disabled="true"/>
                            </td>
                            <td>
                                <input id="input_curso" style="width: 300px" disabled="true"/>
                            </td>
                        </tr>
                    </table>
                    <br/>
                    <label>N&uacute;cleo Comum ao Curso:</label>
                    <br/>
                    <!-- text-decoration: line-through-->
                </div>
            </form>
        
        <div id="integralizacao">
        </div>

    </body>
</html>