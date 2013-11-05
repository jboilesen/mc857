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
							$aluno = array("curso" => intval($data["attributes"]["CURSO"]), "nome" => $data["attributes"]["NOME"], "ra" => $data["attributes"]["RA"], "modalidade" => $data["attributes"]["MODALIDADE"]);
						}else{
							$aluno = array("curso" => intval($data["attributes"]["CURSO"]), "nome" => $data["attributes"]["NOME"], "ra" => $data["attributes"]["RA"], "modalidade" => null);
						}
					}
				break;
				case "DISCIPLINA":
					if ($data["type"] = "complete"){
						$historico[$data["attributes"]["SIGLA"]] = intval($data["attributes"]["CRED"]);
					}
				break;
			}
		}
		
		$xml = simplexml_load_file(Servidor::getCurso($aluno["curso"]));
		foreach ($xml->attributes() as $i => $attribute){
			switch($i){
				case "cod":
					$curso["cod"] = intval($attribute);
				break;
				case "nome":
					$curso["nome"] = (string)$attribute;
				break;
			}
			
		}
		
		
		$modalidades_counter = 0;
		$eletivas_counter = 0;
		foreach ($xml->children() as $j => $child){
			switch($j){
				case "disciplinas":
					$k = 0;
					foreach ($child as $disciplina){
						$curso["obrigatorias"][$k] = (string)$disciplina["sigla"];
						$k++;
					}
				break;
				case "modalidades":
					foreach ($child as $modalidade){
						$curso["modalidades"][$modalidades_counter]["nome"] = (string)$modalidade["nome"];
						
						foreach ($modalidade->children() as $k => $dados){
							switch ($k){
								case "gruposEletivas":
									$m = 0;
									foreach ($dados->children() as $grupoEletivas){
										$n = 0;
										$curso["modalidades"][$modalidades_counter]["eletivas"][$m]["cred"] = (string)$grupoEletivas["cred"];
										foreach ($grupoEletivas->disciplinas->disciplina as $disciplina){
											$curso["modalidades"][$modalidades_counter]["eletivas"][$m]["disciplinas"][$n] = (string)$disciplina["sigla"];
											$n++;
										}
										$m++;
									}
								break;
								case "disciplinas":
									$m = 0;
									foreach ($dados->disciplina as $disciplina){
										$curso["modalidades"][$modalidades_counter]["obrigatorias"][$m] = (string)$disciplina["sigla"];
										$m++;
									}
								break;
							}
						}
						$modalidades_counter++;
					}
				break;
				case "gruposEletivas":
					foreach ($child as $grupoEletivas){
						$curso["eletivas"][$eletivas_counter]["cred"] = intval($grupoEletivas["cred"]);
						$k = 0;
						foreach ($grupoEletivas->disciplinas->disciplina as $disciplina){
							$curso["eletivas"][$eletivas_counter]["disciplinas"][$k] = (string)$disciplina["sigla"];
							$k++;
						}
						$eletivas_counter++;
					}
				break;
			}
		}
		//var_dump($curso);
		
		
		//die();
		
		
		

		$integralizacao = array("aluno" => $aluno,"historico" => $historico, "curso" => $curso);
		print json_encode($integralizacao);
		
	}
?>