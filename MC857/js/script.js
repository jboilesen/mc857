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
        montar_integralizacao(integraliz);
    }
    );
    return true;
});

// Monta um objeto json como um array de grupo de eletivas
function montar_grupos_eletiva(catalogo, grupo_eletivas) {
    if (catalogo.hasOwnProperty("eletivas")) {
        var eletivas_comum = catalogo.eletivas;
        for (k = 0; k < eletivas_comum.length; k++) {
            eletivas_comum[k];
            var eletivas = {"cred": 0,
                            "feitos": 0,
                            "disciplinas": [],
                            "alocacao": [],
                            "fim": 0,
                            "alocacao_final": []};
            eletivas.cred = eletivas_comum[k]["cred"];
            eletivas.disciplinas = eletivas_comum[k].disciplinas;
            var tamanho = grupo_eletivas.eletivas.length;
            grupo_eletivas.eletivas[tamanho] = eletivas;
        }
    }
    if (catalogo.hasOwnProperty("modalidades")) {
        if (catalogo.modalidades[0].hasOwnProperty("eletivas")) {
            var eletivas_mod = catalogo.modalidades[0].eletivas;
            for (k = 0; k < eletivas_mod.length; k++) {
                var eletivas = {"cred": 0, "feitos": 0, "disciplinas": [], "alocacao": [], "fim": 0, "alocacao_final": []};
                eletivas.cred = parseInt(eletivas_mod[k]["cred"]);
                eletivas.disciplinas = eletivas_mod[k].disciplinas;
                var tamanho = grupo_eletivas.eletivas.length;
                grupo_eletivas.eletivas[tamanho] = eletivas;
            }
        }
    }
}


//ordena grupo_eletivas pelo numero de disciplinas e segundo pelo numero de creditos faltantes
function sort_numero_elementos(a, b) {
    var a_tamanho = a.disciplinas.length;
    var b_tamanho = b.disciplinas.length;
    var pular = false;
    if (a_tamanho === 1 & a.disciplinas[0] === '-----') {
        a_tamanho = Number.POSITIVE_INFINITY;
        pular = true;
    }
    if (b_tamanho === 1 & b.disciplinas[0] === '-----') {
        b_tamanho = Number.POSITIVE_INFINITY;
        pular = true;
    }
    if (!pular) {
        if (a_tamanho === b_tamanho) {
            a_tamanho = a.cred - a.feitos;
            b_tamanho = b.cred - b.feitos;

        }
    }
    return ((a_tamanho < b_tamanho) ? -1 : ((a_tamanho > b_tamanho) ? 1 : 0));
}


json_grupo_eletivas = {eletivas: []};
historico;
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
    json_grupo_eletivas = {eletivas: []};
    montar_grupos_eletiva(integralizacao.curso, json_grupo_eletivas);

    json_grupo_eletivas.eletivas.sort(sort_numero_elementos);
    historico = integralizacao.historico;
    
    var grupo_eletivas = json_grupo_eletivas.eletivas;
    tamanho_hist = tamanho_historico(historico);

    //contador = 0;
    var t = tenta(0, grupo_eletivas);
    //alert(t + '   ' +contador);
    
    $("#div_aluno").append('<div id="div_eletivas" style="margin-top:10px; margin-left:10px;" ></div>');
    exibir_eletivas_restantes(historico, grupo_eletivas, "#div_eletivas");

    var remover = false;
    if ($('#div_nucleo_comum').children().length === 0) {
        $('#div_nucleo_comum').remove();
    }
    if ($('#div_modalidade').children().length === 0) {
        $('#div_modalidade').remove();
    }
    if ($('#div_eletivas').children().length === 0) {
        $('#div_eletivas').remove();
        remover = true;
    }

    if (document.getElementById("div_nucleo_comum") === null & document.getElementById("div_modalidade") === null &
            remover) {
        $('#id_label_disciplinas_rest').html("Integraliza&ccedil;&atilde;o Completa! Aluno(a) cumpriu todas mat&eacute;rias do curr&iacute;culo.");
    }
    imprime_extra_curriculares(integralizacao.historico, '#div_aluno');
}

// Eliminar do historico as disciplinas obrigatorias jah cursadas
// Se ainda restam disciplinas obrigatorias monta html
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

// Eliminar do historico disciplinas da modalidade, se existir
// Se restarem disciplinas da modalidade monta html
function montar_modalidade(jsCatalogo, jsHistorico, id_div_pai) {
    $("#id_div_pai").html("");
    $('<label></label>').css({"font-size": "17px"}).html("Al&eacute;m do n&uacute;cleo comum, o aluno dever&aacute; cumprir").appendTo(id_div_pai);
    $('<table></table>').attr({id: "id_table_modalidade"}).appendTo(id_div_pai);
    var ii = -1;
    var j = 0;
    var creditos_feitos = 0;
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



// verifica se a solucao de alocacao das disciplinas nos grupos do eletiva
// completa todos os grupos de eletivas 
function contem_solucao(grupo_eletivas) {
    var grupos_finalizados = 0;
    var cred_total = 0;
    var feitos_total = 0;
    for (i = 0; i < grupo_eletivas.length; i++) {
        var cred = grupo_eletivas[i].cred;
        var feitos = grupo_eletivas[i].feitos;
        cred_total += cred;
        feitos_total += feitos;
        if (cred - feitos <= 0) {
            grupos_finalizados++;
        }
    }
    if (grupos_finalizados > 0) {
        if (grupos_finalizados === grupo_eletivas.length) {
            return true;
        }
    }
    return false;
}

// retorna o numero de disciplinas  no historico
function tamanho_historico(historico) {
    var cont = 0;
    $.each(historico, function(d) {
        cont++;
    });
    return cont;
}

// verifica se uma disciplina pertence a algum grupo de eletivas
function pertence_grupo(disciplina, grupo) {
    if ((grupo.cred <= grupo.feitos) | grupo.fim === 1) {
        return false;
    }
    if ($.inArray(disciplina, grupo.disciplinas) >= 0) {
        return true;
    } else {
        for (k = 0; k < grupo.disciplinas.length; k++) {
            var eletiva = grupo.disciplinas[k];
            if (eletiva.indexOf('-') >= 0) {
                var eletiva_ = eletiva.replace(/-/g, "");
                if (disciplina.indexOf(eletiva_) === 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

// dado um indice retorna a disciplina no historico da posicao i
function get_disciplina_hist(hist, i) {
    var cont = 0;
    var disciplina = {"cod": '', "cred": 0};
    
    $.each(hist, function(d) {
        if (cont === i) {
            disciplina.cod = d;
            disciplina.cred = hist[d];
            return false;
        }
        cont++;
    });
    return disciplina;
}

// aloca uma disciplina a um certo grupo
function assoaciar_grupo_disciplina(grupo, disciplina) {
    grupo.alocacao[grupo.alocacao.length] = disciplina.cod;
    grupo.feitos += disciplina.cred;
}
// desaloca uma disciplina de um grupo
function dissociar_grupo_disciplina(grupo, disciplina) {
    grupo.alocacao.splice($.inArray(disciplina.cod, grupo.alocacao), 1);
    grupo.feitos -= disciplina.cred;
}

// copia a solucao otima ou a melhor encontrada para alocacao
// de disciplinas nos grupos de eletivas
function copiar_solucao(c_grupo_eletivas) {
    for (i = 0; i < c_grupo_eletivas.length; i++) {
        c_grupo_eletivas[i].alocacao_final = c_grupo_eletivas[i].alocacao.slice();
    }
}

// Faz busca exaustiva para tentar alocar as disciplinas do historico nos grupos
// de eletivas
function tenta(i, t_grupo_eletivas) {
    //contador++;
    if (contem_solucao(t_grupo_eletivas)) {
        copiar_solucao(t_grupo_eletivas);
        return true;
    }
    if (i >= tamanho_hist) {
        copiar_solucao(t_grupo_eletivas);
        return false;
    }
    var disciplina = get_disciplina_hist(historico, i);
    var achou = false;
    var cont_associada = 0;
    
    for (jj = 0; jj < t_grupo_eletivas.length; jj++) {
            
        var t_g_eletiva = t_grupo_eletivas[jj];
        var pertence = pertence_grupo(disciplina.cod, t_g_eletiva);
        if (pertence) {
            if (!achou) {
                assoaciar_grupo_disciplina(t_g_eletiva, disciplina);
                cont_associada++;
                achou = tenta(i + 1, t_grupo_eletivas);
                dissociar_grupo_disciplina(t_g_eletiva, disciplina);
            }
        }
    }
    if (achou === false & cont_associada === 0) {
        achou = tenta(i + 1, t_grupo_eletivas);
    }
    return achou;
}


// elimina do historico as disciplinas que foram alocadas nos grupos de eletivas
// se existir um grupo nao finalizado exibi as opcoes do grupo e os creditos que

function exibir_eletivas_restantes(historico, grupo_eletivas, id_div_pai) {
    for (k = 0; k < grupo_eletivas.length; k++) {
        var g_eletiva = grupo_eletivas[k];
        var cred_restantes = g_eletiva.cred;
        
        $.each(historico, function(d) {
            if ($.inArray(d, g_eletiva.alocacao_final) >= 0) {
                cred_restantes -= historico[d];
                if ($.inArray(d, g_eletiva.disciplinas) >= 0) {
                    g_eletiva.disciplinas.splice($.inArray(d, g_eletiva.disciplinas), 1);
                }
                delete historico[d];
                if (cred_restantes <= 0) {
                    g_eletiva.fim = 1;
                    return false;
                }
            }
        });
        var ii = -1;
        var j = 0;
        
        if (cred_restantes > 0) {
            
            $(id_div_pai).append('<div id="div_eletiva_' + k + '" style="margin-top:10px;" ></div>');
            $('<label></label>').css({"font-size": "14px"}).html(cred_restantes + " cr&eacute;ditos em:").appendTo("#div_eletiva_" + k);
            $('<table></table>').attr({id: "id_table_eletiva_" + k}).appendTo("#div_eletiva_" + k);
            for (i = 0; i < g_eletiva.disciplinas.length; i++) {
                if (ii < 0) {
                    $('<tr></tr>').attr({id: "id_tr_ele_" + k + '_' + j}).appendTo("#id_table_eletiva_" + k);
                    ii++;
                }
                $('<td></td>').appendTo("#id_tr_ele_" + k + '_' + j).html(g_eletiva.disciplinas[i]);
                ii++;
                if (ii > 4) {
                    ii = -1;
                    j++;
                }
            }
        }
    }
}


//Imprime extra curriculares
function imprime_extra_curriculares(jsHistorico, id_div_pai) {
    $(id_div_pai).append('<div id="div_extra" style="margin-top:10px;"></div>');
    $('<label></label>').css({"font-size": "14px"}).html("===Extra curriculares===").appendTo('#div_extra');
    $('<table></table>').attr({id: "id_table_extra"}).appendTo("#div_extra");
    var ii = -1;
    var j = 0;
    $.each(jsHistorico, function(sigla) {
        if (ii < 0) {
            $('<tr></tr>').attr({id: "id_tr_extra_" + j}).appendTo("#id_table_extra");
            ii++;
        }
        $('<td></td>').appendTo("#id_tr_extra_" + j).html(sigla + ':' + jsHistorico[sigla]);
        ii++;
        if (ii > 4) {
            ii = -1;
            j++;
        }
    });
    if ($('#id_table_extra').children().length === 0) {
        $('#div_extra').remove();
    }
}
