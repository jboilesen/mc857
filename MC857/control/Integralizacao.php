<?php
	require_once('../common/constants.php');
	require_once('../common/function.php');
	require_once('../model/Servidor.php');
	require_once('../model/Disciplina.php');
	require_once('../model/Aluno.php');

	if (isset($_POST["form"]) && isset($_POST["name"]) && $_POST["name"] == "integralizacao"){
		/* Treat Form Values */
		$ra = null;
		foreach ($_POST["form"] as $field){
			switch ($field["name"]){
				case "ra":
					$ra = $field["value"];
				break;
			}
		}
		
		$xml_parser = xml_parser_create();
		xml_parse_into_struct($xml_parser, Servidor::getHistorico($ra), $historico_xml, $index);
		xml_parser_free($xml_parser);
		
		$aluno = null;
		$historico = array();
		foreach ($historico_xml as $data){
			switch($data["tag"]){
				case "HISTORICO":
					if ($data["type"] == "open"){
						if (isset($data["attributes"]["MODALIDADE"])){
							$aluno = array("curso" => $data["attributes"]["CURSO"], "nome" => $data["attributes"]["NOME"], "ra" => $data["attributes"]["RA"], "modalidade" => $data["attributes"]["MODALIDADE"]);
						}else{
							$aluno = array("curso" => $data["attributes"]["CURSO"], "nome" => $data["attributes"]["NOME"], "ra" => $data["attributes"]["RA"], "modalidade" => null);
						}
					}
				break;
				case "DISCIPLINA":
					if ($data["type"] = "complete"){
						$historico[substr($data["attributes"]["SIGLA"], 0, 2)][substr($data["attributes"]["SIGLA"], 2)] = $data["attributes"]["CRED"];
					}
				break;
			}
		}
		
		$xml_parser = xml_parser_create();
		xml_parse_into_struct($xml_parser, Servidor::getCurso(21 /*$aluno["curso"]*/), $curso_xml, $index);
		xml_parser_free($xml_parser);
		
		
		$curso = array();
		$i = 0;
		foreach ($curso_xml as $data){
			switch ($data["tag"]){
				case "CURSO":
					if ($data["type"]=="open"){
						$curso["cod"] = $data["attributes"]["COD"];
						$curso["nome"] = $data["attributes"]["NOME"];
					}
				break;
				case "DISCIPLINAS":
					if ($data["type"]=="open"){

					}else if ($data["type"]=="close"){

					}
				break;
				case "DISCIPLINA":
				break;
				case "GRUPOELETIVAS":
					if ($data["type"]=="open"){
						
					}else if ($data["type"]=="close"){

					}
				break;
				case "MODALIDADES":
					if ($data["type"]=="open"){
					
					}else if ($data["type"]=="close"){
					
					}
				break;
				case "MODALIDADE":
					
				break;
				default:
					print json_encode($data);
				break;
			}
		}
		
	}
?>