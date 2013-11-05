<?php
	/* Common Functions */

	function json_response(){
		
	}
	
	function xml2array($xml){
		$opened = array();
		$opened[1] = 0;
		$xml_parser = xml_parser_create();
		xml_parse_into_struct($xml_parser, $xml, $xmlarray);
		$array = array_shift($xmlarray);
		unset($array["level"]);
		unset($array["type"]);
		$arrsize = sizeof($xmlarray);
		for($j=0;$j<$arrsize;$j++){
			$val = $xmlarray[$j];
			switch($val["type"]){
				case "open":
					$opened[$val["level"]]=0;
				case "complete":
					$index = "";
					for($i = 1; $i < ($val["level"]); $i++)
						$index .= "[" . $opened[$i] . "]";
					$path = explode('][', substr($index, 1, -1));
					$value = &$array;
					foreach($path as $segment)
						$value = &$value[$segment];
					$value = $val;
					unset($value["level"]);
					unset($value["type"]);
					if($val["type"] == "complete")
						$opened[$val["level"]-1]++;
				break;
				case "close":
					$opened[$val["level"]-1]++;
					unset($opened[$val["level"]]);
				break;
			}
		}
		return $array;
	}

?>