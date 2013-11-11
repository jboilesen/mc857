$(document).on("submit", 'form', function(event) {
    event.preventDefault();
    $.post($(this).attr("action"),
            {name: $(this).attr("name"), form: $(this).serializeArray()},
    function(value) {
        $("#integralizacao").html(value);
        var integraliz = JSON.parse(value);
        //$("#integralizacao").empty();
        $("#id_table_nucleo_comum").empty();
        $('<label></label>').css({"font-weight": "bold", "font-size": "20px"}).html("Disciplinas Restantes:").appendTo("#div_aluno");
        $('<br/><br/>').appendTo("#div_aluno");
        $("#input_ra").val(integraliz.aluno.ra);
        $("#input_nome").val(integraliz.aluno.nome);
        $("#input_curso").val(integraliz.curso.nome);
        //alert(integraliz.historico["BS115"]);
        montar_obrigatoria(integraliz.curso["obrigatorias"], integraliz.historico);
        montar_eletiva(integraliz.curso.eletivas[0], integraliz.historico);
        /*  $('<br/>').appendTo("#div_aluno");
         $('<label></label>').html("Eletivas:").appendTo("#div_aluno");
         
         $('<br/>').appendTo("#div_aluno");*/

    }
    );
    return true;
});


function montar_obrigatoria(jsCatalogo, jsHistorico) {
    $('<label></label>').css({"font-size": "17px"}).html("N&uacute;cleo Comum ao Curso").appendTo("#div_aluno");
    $('<br/>').appendTo("#div_aluno");
    var creditos_feitos = 0;
    $('<table></table>').attr({id: "id_table_nucleo_comum"}).appendTo("#div_aluno");
    var ii = -1;
    var j = 0;
    $.each(jsCatalogo, function(sigla) {
        if (ii < 0) {
            $('<tr></tr>').attr({id: "id_tr" + j}).appendTo("#id_table_nucleo_comum");
            ii++;
        }
        if (jsHistorico.hasOwnProperty(sigla)) {
            //$('<td></td>').appendTo("#id_tr" + j).html(sigla).css('color','red');
            creditos_feitos += jsHistorico[sigla];
            delete jsHistorico[sigla];
        }
        else {
            $('<td></td>').appendTo("#id_tr" + j).html(sigla);
            ii++;
        }
        if (ii > 4) {
            ii = -1;
            j++;
        }
    });

    //alert(creditos_feitos);
}



function montar_eletiva(jsCatalogo, jsHistorico) {
    $('<br/>').appendTo("#div_aluno");
    $('<label></label>').css({"font-size": "17px"}).html("Disciplinas Eletivas").appendTo("#div_aluno");
    var text_creditos_eletiva = jsCatalogo["cred"];
    text_creditos_eletiva = text_creditos_eletiva.toString() + " creditos entre:";
    //$('<label></label>').atrr({id: "id_label_eletiva"}).html(text_creditos_eletiva).appendTo("#div_aluno");
    $('<br/>').appendTo("#div_aluno");

    var creditos_eletiva = jsCatalogo["cred"];
    jsCatalogo = jsCatalogo.disciplinas;

    var ii = -1;
    var j = 0;
    $.each(jsHistorico, function(sigla) {
        if ($.inArray(sigla, jsCatalogo) > 0) {
            creditos_eletiva = creditos_eletiva - jsHistorico[sigla];
            delete jsHistorico[sigla];
            jsCatalogo.splice($.inArray(sigla, jsCatalogo), 1);
            if (creditos_eletiva <= 0) {
                return false;
            }
        }else{
            // verificar substring, por exemplo sigla eh QA321 e no catalogo qualquer QA32-
        }
    });
    if (creditos_eletiva > 0) {
        $('<br/>').appendTo("#div_aluno");
        $('<label></label>').css({"font-size": "14px"}).html(creditos_eletiva + " creditos em:").appendTo("#div_aluno");
        $('<br/>').appendTo("#div_aluno");
        $('<table></table>').attr({id: "id_table_nucleo_eletiva"}).appendTo("#div_aluno");
        for (i = 0; i < jsCatalogo.length; i++) {
            if (ii < 0) {
                $('<tr></tr>').attr({id: "id_tr_ele" + j}).appendTo("#id_table_nucleo_eletiva");
                ii++;
            }
            $('<td></td>').appendTo("#id_tr_ele" + j).html(jsCatalogo[i]);
            ii++;
            if (ii > 4) {
                ii = -1;
                j++;
            }
        }
    }
}

/*
 function montar_tabela(jsHistorico) {
 $('<table></table>').attr({id: "id_table_nucleo_comum"}).appendTo("#div_aluno");
 var i = j = 0;
 $.each(jsHistorico, function(sigla) {
 alert(sigla);
 if (i <= 0) {
 $('<tr></tr>').attr({id: "id_tr" + j}).appendTo("#id_table_nucleo_comum");
 }
 $('<td></td>').appendTo("#id_tr" + j).html(sigla);
 i++;
 if (i > 4) {
 i = 0;
 j++;
 }
 }
 );
 
 }
 
 */