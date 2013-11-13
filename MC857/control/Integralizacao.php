<?php

// MC857 - Projeto de Sistemas de Software
// Alunos: Jonathan Nunes Boilesen
//         Thiago Pastore
//         João Renato Domingos do Sacramento
// https://github.com/jboilesen/mc857

require_once('../common/constants.php');
require_once('../common/function.php');
require_once('../model/Servidor.php');
require_once('../model/Disciplina.php');
require_once('../model/Aluno.php');

if (isset($_POST["form"]) && isset($_POST["name"]) && $_POST["name"] == "integralizacao") {
    /* Treat Form Values */
    $ra = null;
    foreach ($_POST["form"] as $field) {
        switch ($field["name"]) {
            case "ra":
                $ra = $field["value"];
                break;
        }
    }
    // Busca o historico no servidor e converte a resposta em um array
    $xml_parser = xml_parser_create();
    xml_parse_into_struct($xml_parser, Servidor::getHistorico($ra), $historico_xml, $index);
    if ($historico_xml === false) {
    	exit("<h2>Houston, we have a problem! - Dados do servidor inconsistentes.</h2>");
    	die();
    }
    xml_parser_free($xml_parser);
    $aluno = null;
    $historico = array();
    foreach ($historico_xml as $data) {
        switch ($data["tag"]) {
            // Seleciona no historioco o nome do aluno, curso e modalidade
            case "HISTORICO":
                if ($data["type"] == "open") {
                    if (isset($data["attributes"]["MODALIDADE"])) {
                        $aluno = array("curso" => intval($data["attributes"]["CURSO"]), "nome" => $data["attributes"]["NOME"], "ra" => $data["attributes"]["RA"], "modalidade" => $data["attributes"]["MODALIDADE"]);
                    } else {
                        $aluno = array("curso" => intval($data["attributes"]["CURSO"]), "nome" => $data["attributes"]["NOME"], "ra" => $data["attributes"]["RA"], "modalidade" => null);
                    }
                }
                break;
            // Seleciona as disciplinas cursadas e os creditos das mesmas
            case "DISCIPLINA":
                if ($data["type"] = "complete") {
                    $historico[$data["attributes"]["SIGLA"]] = intval($data["attributes"]["CRED"]);
                }
                break;
        }
    }

    // Busca o catalogo no servidor
    $xml = simplexml_load_file(Servidor::getCurso($aluno["curso"]));
    if ($xml === false) {
        exit("<h2>Houston, we have a problem! - Dados do servidor inconsistentes.</h2>");
        die();
    }

    foreach ($xml->attributes() as $i => $attribute) {
        // Seleciona o nome e o codigo do curso
        switch ($i) {
            case "cod":
                $curso["cod"] = intval($attribute);
                break;
            case "nome":
                $curso["nome"] = (string) $attribute;
                break;
        }
    }
    // Itera sobre o xml de catalogo montando uma estrutura (curso) com as disciplinas organizadas de
    // de maneira a melhorar a eficiencia na integralizacao
    $modalidades_counter = 0;
    $eletivas_counter = 0;
    foreach ($xml->children() as $j => $child) {
        switch ($j) {
            // Seleciona as disciplinas obrigatorias cursadas e seus creditos alem de somar o total de creditos
            case "disciplinas":
                $k = 0;
                foreach ($child as $disciplina) {
                    $obrigatoria = (string) $disciplina["sigla"];
                    $xml_obrigatoria = simplexml_load_file(Servidor::getDisciplina($obrigatoria));
                    if ($xml_obrigatoria === false) {
                    	exit("<h2>Houston, we have a problem! - Dados do servidor inconsistentes.</h2>");
                    	die();
                    }
                    $curso["obrigatorias"][$obrigatoria] = intval($xml_obrigatoria["cred"]);
                    $k++;
                }
                break;
            // Itera a cada modalidade selecionando as disciplinas obrigatorias e eletivas daquela modalidade
            case "modalidades":
                foreach ($child as $modalidade) {
                    $cod = substr((string) $modalidade["nome"], 0, 2);
                    if ($aluno["modalidade"] != null && $aluno["modalidade"] == $cod) {
                        $nome = (string) $modalidade["nome"];
                        $curso["modalidades"][$modalidades_counter]["cod"] = $cod;
                        $curso["modalidades"][$modalidades_counter]["nome"] = $nome;

                        foreach ($modalidade->children() as $k => $dados) {
                            switch ($k) {
                                // Seleciona as eletivas da modalidade cursadas e seus creditos alem de somar o total de creditos
                                case "gruposEletivas":
                                    $m = 0;
                                    foreach ($dados->children() as $grupoEletivas) {
                                        $n = 0;
                                        $curso["modalidades"][$modalidades_counter]["eletivas"][$m]["cred"] = (string) $grupoEletivas["cred"];
                                        foreach ($grupoEletivas->disciplinas->disciplina as $disciplina) {
                                            $curso["modalidades"][$modalidades_counter]["eletivas"][$m]["disciplinas"][$n] = (string) $disciplina["sigla"];
                                            $n++;
                                        }
                                        $m++;
                                    }
                                    break;
                                // Seleciona as disciplinas da modalidade cursadas e seus creditos alem de somar o total de creditos
                                case "disciplinas":
                                    $m = 0;
                                    foreach ($dados->disciplina as $disciplina) {
                                        $curso["modalidades"][$modalidades_counter]["obrigatorias"][$m] = (string) $disciplina["sigla"];
                                        $m++;
                                    }
                                    break;
                            }
                        }
                        $modalidades_counter++;
                    }
                }
                break;
            // Seleciona as disciplinas obrigatorias cursadas e seus creditos alem de somar o total de creditos
            case "gruposEletivas":
                foreach ($child as $grupoEletivas) {
                    $curso["eletivas"][$eletivas_counter]["cred"] = intval($grupoEletivas["cred"]);
                    $k = 0;
                    foreach ($grupoEletivas->disciplinas->disciplina as $disciplina) {
                        $curso["eletivas"][$eletivas_counter]["disciplinas"][$k] = (string) $disciplina["sigla"];
                        $k++;
                    }
                    $eletivas_counter++;
                }
                break;
        }
    }


    $integralizacao = array("aluno" => $aluno, "historico" => $historico, "curso" => $curso);
    print json_encode($integralizacao);
}
?>