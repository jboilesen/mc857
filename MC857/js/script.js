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
      /*  $('<br/>').appendTo("#div_aluno");
        $('<label></label>').html("Eletivas:").appendTo("#div_aluno");
        montar_eletiva(integraliz.curso.eletivas[0], integraliz.historico);
        $('<br/>').appendTo("#div_aluno");*/
        
    }
    );
    return true;
});


function montar_obrigatoria(jsCatalogo, jsHistorico) {
    var creditos_feitos = 0;
    $('<table></table>').attr({id: "id_table_nucleo_comum"}).appendTo("#div_aluno");
    var ii = j = 0;
    for (i = 0; i < jsCatalogo.length; i++) {
        if (ii <= 0) {
            $('<tr></tr>').attr({id: "id_tr" + j}).appendTo("#id_table_nucleo_comum");
        }
        
        if (jsHistorico.hasOwnProperty(jsCatalogo[i])) {
            $('<td></td>').appendTo("#id_tr" + j).html(jsCatalogo[i]).css('color','red');
            creditos_feitos += jsHistorico[jsCatalogo[i]];
            delete jsHistorico[jsCatalogo[i]];
        }
        else {
            $('<td></td>').appendTo("#id_tr" + j).html(jsCatalogo[i]);
        }

        ii++;
        if (ii > 4) {
            ii = 0;
            j++;
        }
    }/*
    $('<label></label>').html("Total Creditos Obrigatorias").appendTo("#div_aluno");
    $('<input></input>').val(creditos_feitos).appendTo("#div_aluno");
    */
   
}


function montar_eletiva(jsCatalogo, jsHistorico) {
    //var creditos_eletiva = jsCatalogo.cred;
    var total_creditos = 0;
    jsCatalogo = jsCatalogo.disciplinas;
    $('<table></table>').attr({id: "id_table_nucleo_eletiva"}).appendTo("#div_aluno");
    var ii = j = 0;
    for (i = 0; i < jsCatalogo.length; i++) {
        if (ii <= 0) {
            $('<tr></tr>').attr({id: "id_tr_ele" + j}).appendTo("#id_table_nucleo_eletiva");
        }
        if (jsHistorico.hasOwnProperty(jsCatalogo[i])) {
            $('<td></td>').appendTo("#id_tr_ele" + j).html(jsCatalogo[i]).css('color','red');
            total_creditos += jsHistorico[jsCatalogo[i]];
            delete jsHistorico[jsCatalogo[i]];
        }
        else {
            if(jsCatalogo[i].indexOf("-") > 0){
               var sigla_aux = jsCatalogo[i].replace(/-/g, '');
               $.each(jsHistorico, function(sigla) {
                    if(sigla.indexOf(sigla_aux) >= 0){
                        total_creditos += jsHistorico[jsCatalogo[i]];
                        delete jsHistorico[jsCatalogo[i]];
                    }
             });
                
            }
            $('<td></td>').appendTo("#id_tr_ele" + j).html(jsCatalogo[i]);
        }
        ii++;
        if (ii > 4) {
            ii = 0;
            j++;
        }
    }
    /*if (total_creditos > creditos_eletiva){
       total_creditos = creditos_eletiva;
    }*/
    /*$('<label></label>').html("Total Creditos Eletivas").appendTo("#div_aluno");
    $('<input></input>').val(total_creditos).appendTo("#div_aluno");*/
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