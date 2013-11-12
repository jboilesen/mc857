$(document).on("submit", 'form', function(event) {
    event.preventDefault();
    $.post($(this).attr("action"),
            {name: $(this).attr("name"), form: $(this).serializeArray()},
    function(value) {
        $("#integralizacao").html(value);
        var integraliz = JSON.parse(value);
        $("#integralizacao").empty();
        $("#div_aluno").remove();
        $("#form_integralizacao").append('<div id="div_aluno" style="margin-top: 10px;"><table><tr><td><label>RA</label></td><td><label >Nome</label></td><td><label>Curso</label></td></tr><tr><td><input id="input_ra" style="width: 100px" disabled="true"/></td><td><input id="input_nome" style="width: 250px" disabled="true"/></td><td><input id="input_curso" style="width: 500px" disabled="true"/></td></tr></table></div>');
        $("#id_table_nucleo_comum").empty();
        $("#div_aluno").append('<label id="id_label_disciplinas_rest" style="font-weight: bold; font-size: 20px;">Disciplinas Restantes:</label>');
        $('<br/><br/>').appendTo("#div_aluno");
        $("#input_ra").val(integraliz.aluno.ra);
        $("#input_nome").val(integraliz.aluno.nome);
        $("#input_curso").val(integraliz.curso.nome);
        creditos_qq_disciplina = 0;
        //soh pd eliminar essas diciplinas depois de ter verificado todas as disciplinas
        id_div_creditos_qq_disciplina = '';
        montar_integralizacao(integraliz);
    }
    );
    return true;
});

function montar_integralizacao(integralizacao) {
    $("#div_aluno").append('<div id="div_nucleo_comum" style="margin-top:10px; margin-left:10px;" ></div>');
    montar_obrigatoria(integralizacao.curso["obrigatorias"], integralizacao.historico, "#div_nucleo_comum");
    if (integralizacao.curso.hasOwnProperty("modalidades")) {
        if (integralizacao.curso.modalidades[0].hasOwnProperty("obrigatorias")) {
            //montar disciplinas modalidades
            $("#div_aluno").append('<div id="div_modalidade" style="margin-top:10px; margin-left:10px;" ></div>');
            montar_modalidade(integralizacao.curso.modalidades[0]["obrigatorias"], integralizacao.historico, "#div_modalidade");
        }
    }
    $("#div_aluno").append('<div id="div_eletivas" style="margin-top:10px; margin-left:10px;" ></div>');
    $('<label></label>').css({"font-size": "17px"}).html("Disciplinas Eletivas").appendTo("#div_eletivas");
    if (integralizacao.curso.hasOwnProperty("eletivas")) {
        // montar disciplinas eletivas nucleo comum
        $("#div_eletivas").append('<div id="div_eletivas_comum" style="margin-top:10px; margin-left:10px;" ></div>');
        montar_eletiva_comum(integralizacao.curso.eletivas, integralizacao.historico, "#div_eletivas_comum");
    }
    if (integralizacao.curso.hasOwnProperty("modalidades")) {
        if (integralizacao.curso.modalidades[0].hasOwnProperty("eletivas")) {
            // montar disciplinas eletivas modalidade
            $("#div_eletivas").append('<div id="div_eletivas_mod" style="margin-top:10px; margin-left:10px;" ></div>');
            montar_eletiva_mod(integralizacao.curso.modalidades[0].eletivas, integralizacao.historico, "#div_eletivas_mod");
        }
    }
    if (integralizacao.curso.hasOwnProperty("eletivas")) {
        elimina_qq_disciplina(integralizacao.historico);
    }
    var remover = 0;
    if ($('#div_nucleo_comum').children().length === 0) {
        $('#div_nucleo_comum').remove();
    }
    if ($('#div_modalidade').children().length === 0) {
        $('#div_modalidade').remove();
    }
    if ($('#div_eletivas_comum').children().length === 0) {
        $('#div_eletivas_comum').remove();
        remover++;
    }
    if ($('#div_eletivas_mod').children().length === 0) {
        $('#div_eletivas_mod').remove();
        remover++;
    }
    if (remover === 2) {
        $('#div_eletivas').remove();
    }
    if (document.getElementById("div_nucleo_comum") === null & document.getElementById("div_modalidade") === null &
            remover === 2) {
        $('#id_label_disciplinas_rest').html("Integraliza&ccedil;&atilde;o Completa! Aluno(a) cumpriu todas mat&eacute;rias do curr&iacute;culo.");
    }
}

function montar_obrigatoria(jsCatalogo, jsHistorico, id_div_pai) {
    var creditos_feitos = 0;
    $("#id_div_pai").html("");
    $('<label></label>').css({"font-size": "17px"}).html("N&uacute;cleo Comum ao Curso").appendTo(id_div_pai);
    $('<br/>').appendTo(id_div_pai);
    $('<table></table>').attr({id: "id_table_nucleo_comum"}).appendTo(id_div_pai);
    var ii = -1;
    var j = 0;
    $.each(jsCatalogo, function(sigla) {
        if (ii < 0) {
            $('<tr></tr>').attr({id: "id_tr" + j}).appendTo("#id_table_nucleo_comum");
            ii++;
        }
        if (jsHistorico.hasOwnProperty(sigla)) {
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
    if (ii === 0) {
        $(id_div_pai).remove();
    }
}

function montar_modalidade(jsCatalogo, jsHistorico, id_div_pai) {
    $("#id_div_pai").html("");
    $('<label></label>').css({"font-size": "17px"}).html("Al&eacute;m do n&uacute;cleo comum, o aluno dever&aacute; cumprir").appendTo(id_div_pai);
    $('<table></table>').attr({id: "id_table_modalidade"}).appendTo(id_div_pai);
    var ii = -1;
    var j = 0;
    var creditos_feitos = 0;
    //alert(jsCatalogo.length);
    for (i = 0; i < jsCatalogo.length; i++) {

        if (ii < 0) {
            $('<tr></tr>').attr({id: "id_tr_mod" + j}).appendTo("#id_table_modalidade");
            ii++;
        }
        if (jsHistorico.hasOwnProperty(jsCatalogo[i])) {
            creditos_feitos += jsHistorico[jsCatalogo[i]];
            delete jsHistorico[jsCatalogo[i]];
        }
        else {
            $('<td></td>').appendTo("#id_tr_mod" + j).html(jsCatalogo[i]);
            ii++;
        }
        if (ii > 4) {
            ii = -1;
            j++;
        }
    }
    if (ii === 0) {
        $(id_div_pai).remove();
    }

}

function montar_eletiva_comum(jsCatalogo, jsHistorico, id_div_pai) {
    for (k = 0; k < jsCatalogo.length; k++) {
        var eletivas = jsCatalogo[k];
        var creditos_eletiva = eletivas["cred"];
        eletivas = eletivas.disciplinas;
        var ii = -1;
        var j = 0;
        $.each(jsHistorico, function(sigla) {
            if ($.inArray(sigla, eletivas) > 0) {
                creditos_eletiva = creditos_eletiva - jsHistorico[sigla];
                delete jsHistorico[sigla];
                eletivas.splice($.inArray(sigla, eletivas), 1);
                if (creditos_eletiva <= 0) {
                    return false;
                }
            }
        });
        if (creditos_eletiva > 0) {
            $(id_div_pai).append('<div id="div_eletiva_' + k + '" style="margin-top:10px;" ></div>');
            $('<label></label>').css({"font-size": "14px"}).html(creditos_eletiva + " cr&eacute;ditos em:").appendTo("#div_eletiva_" + k);
            $('<table></table>').attr({id: "id_table_eletiva_" + k}).appendTo("#div_eletiva_" + k);
            var sigla_;
            for (i = 0; i < eletivas.length; i++) {
                if (eletivas[i].indexOf("-") > 0) {
                    sigla_ = eletivas[i].replace(/-/g, "");
                    $.each(jsHistorico, function(sigla) {
                        if (sigla.indexOf(sigla_) >= 0) {
                            creditos_eletiva = creditos_eletiva - jsHistorico[sigla];
                            delete jsHistorico[sigla];
                            if (creditos_eletiva <= 0) {
                                $("#div_eletiva_" + k).remove();
                                return false;
                            }
                        }
                    });
                } else {
                    if (eletivas[i].indexOf("-----") >= 0) {
                        creditos_qq_disciplina += creditos_eletiva;
                        id_div_creditos_qq_disciplina = '#div_eletiva_' + k;

                        $(id_div_creditos_qq_disciplina).empty();
                        $(id_div_creditos_qq_disciplina).removeAttr('style');
                        break;
                    }
                }
                if (creditos_eletiva <= 0) {
                    $("#div_eletiva_" + k).remove();
                    break;
                }
                if (ii < 0) {
                    $('<tr></tr>').attr({id: "id_tr_ele_" + k + '_' + j}).appendTo("#id_table_eletiva_" + k);
                    ii++;
                }
                $('<td></td>').appendTo("#id_tr_ele_" + k + '_' + j).html(eletivas[i]);
                ii++;
                if (ii > 4) {
                    ii = -1;
                    j++;
                }
            }
        }
    }
}

function montar_eletiva_mod(jsCatalogo, jsHistorico, id_div_pai) {
    for (k = 0; k < jsCatalogo.length; k++) {
        var eletivas = jsCatalogo[k];
        var creditos_eletiva = eletivas["cred"];
        eletivas = eletivas.disciplinas;
        var ii = -1;
        var j = 0;

        $.each(jsHistorico, function(sigla) {
            if ($.inArray(sigla, eletivas) > 0) {
                creditos_eletiva = creditos_eletiva - jsHistorico[sigla];
                delete jsHistorico[sigla];
                eletivas.splice($.inArray(sigla, eletivas), 1);
                if (creditos_eletiva <= 0) {
                    return false;
                }
            }
        });

        if (creditos_eletiva > 0) {
            $("#id_div_pai").html("");
            $(id_div_pai).append('<div id="div_eletiva_mod_' + k + '"></div>');
            $('<label></label>').css({"font-size": "14px"}).html(creditos_eletiva + " cr&eacute;ditos em:").appendTo("#div_eletiva_mod_" + k);
            $('<table></table>').attr({id: "id_table_eletiva_mod_" + k}).appendTo("#div_eletiva_mod_" + k);
            var sigla_;
            for (i = 0; i < eletivas.length; i++) {
                if (eletivas[i].indexOf("-") > 0) {
                    sigla_ = eletivas[i].replace(/-/g, "");
                    $.each(jsHistorico, function(sigla) {
                        if (sigla.indexOf(sigla_) >= 0) {
                            creditos_eletiva = creditos_eletiva - jsHistorico[sigla];
                            delete jsHistorico[sigla];
                            if (creditos_eletiva <= 0) {
                                $("#div_eletiva_mod_" + k).empty();
                                return false;
                            }
                        }
                    });
                }
                if (creditos_eletiva <= 0) {
                    break;
                }
                if (ii < 0) {
                    $('<tr></tr>').attr({id: "id_tr_ele_mod_" + k + '_' + j}).appendTo("#id_table_eletiva_mod_" + k);
                    ii++;
                }
                $('<td></td>').appendTo("#id_tr_ele_mod_" + k + '_' + j).html(eletivas[i]);
                ii++;
                if (ii > 4) {
                    ii = -1;
                    j++;
                }
            }
        }
    }

}

//Depois de percorrer todo o historico, verifica opcao -----(tantos creditos qualquer disciplina Unicamp)
function elimina_qq_disciplina(jsHistorico) {
    var creditos_eletiva = creditos_qq_disciplina;
    $.each(jsHistorico, function(sigla) {
        creditos_eletiva = creditos_eletiva - jsHistorico[sigla];
        delete jsHistorico[sigla];
        if (creditos_eletiva <= 0) {
            return false;
        }
    });
    if (creditos_eletiva > 0) {
        $('<label></label>').css({"font-size": "14px"}).html(creditos_eletiva + " cr&eacute;ditos em:").appendTo(id_div_creditos_qq_disciplina);
        $(id_div_creditos_qq_disciplina).append('<div style="margin-left: 5px; font-size: 20px;">------ (Qualquer disciplina da Unicamp)</div>');
    }
    else {
        $(id_div_creditos_qq_disciplina).remove();
    }
}


