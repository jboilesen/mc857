$(document).on("submit", 'form', function(event) {
    event.preventDefault();
    $.post($(this).attr("action"),
            {name: $(this).attr("name"), form: $(this).serializeArray()},
    function(value) {
        $("#integralizacao").html(value);
        var integraliz = JSON.parse(value);
        //$("#integralizacao").empty();
        $("#id_table_nucleo_comum").empty();
        //$("#div_aluno").css('display', 'anything');
        $("#input_ra").val(integraliz.aluno.ra);
        $("#input_nome").val(integraliz.aluno.nome);
        $("#input_curso").val(integraliz.curso.nome);
        //alert(integraliz.curso["obrigatorias"][0]);
        montar_obrigatoria(integraliz.curso["obrigatorias"], integraliz.historico);
        //montar_eletiva(integraliz.curso["modalidades"]["obrigatorias"], integraliz.historico);
        $('<label></label>').html("Modalidade").appendTo("div_aluno");
        $('<br/>');
    }
    );
    return true;
});


function montar_obrigatoria(jsCatalogo, jsHistorico) {
    $('<table></table>').attr({id: "id_table_nucleo_comum"}).appendTo("#div_aluno");
    var ii = j = 0;
    for (i = 0; i < jsCatalogo.length; i++) {
        if (ii <= 0) {
            $('<tr></tr>').attr({id: "id_tr" + j}).appendTo("#id_table_nucleo_comum");
        }
        if (jsHistorico.hasOwnProperty(jsCatalogo[i])) {
            $('<td></td>').appendTo("#id_tr" + j).html(jsCatalogo[i]).css('color','red');
        }
        else {
            $('<td></td>').appendTo("#id_tr" + j).html(jsCatalogo[i]);
        }

        ii++;
        if (ii > 4) {
            ii = 0;
            j++;
        }
    }
}


function montar_eletiva(jsCatalogo, jsHistoricoMod) {
    $('<table></table>').attr({id: "id_table_nucleo_modalidade"}).appendTo("#div_aluno");
    var ii = j = 0;
    for (i = 0; i < jsCatalogo.length; i++) {
        if (ii <= 0) {
            $('<tr></tr>').attr({id: "id_tr_mod" + j}).appendTo("#id_table_nucleo_modalidade");
        }
        if (jsHistoricoMod.hasOwnProperty(jsCatalogo[i])) {
            $('<td></td>').appendTo("#id_tr_mod" + j).html(jsCatalogo[i]).css('color','red');
        }
        else {
            $('<td></td>').appendTo("#id_tr_mod" + j).html(jsCatalogo[i]);
        }
        ii++;
        if (ii > 4) {
            ii = 0;
            j++;
        }
    }
}

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