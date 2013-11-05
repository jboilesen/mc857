<?php
	class Servidor{
		# trata o servico passado como parametro na forma de um dicionario
		# parâmetros:
		#   'serv' -> indica o tipo do servi�o
		#             valores poss�veis:
		#             'h': consulta hist�rico. O ra e passado como par�metro 'ra'
		#             'c': consulta curso. O c�digo do curso � passado como par�metro 'cod'
		#             'd': consulta disciplinas. A sigla � passada como par�metro 's'
		#             'l': lista dados por categoria. A categoria � passada como par�metro 'cat'
		#                  Valores poss�veis para 'cat':
		#                  'h': hist�ricos (retorna lista com os ra's cadastrados)
		#                  'c': cursos (lista com os c�digos dos cursos cadastrados)
		#                  'd': disciplinas (lista com as siglas dos cursos cadastrados)
		
		public static function getHistorico($ra){
			$request = SERVER_URL."?serv=h&ra=".$ra;
			return file_get_contents($request);
		}
		
		public static function getCurso($cod){
			$request = SERVER_URL."?serv=c&cod=".$cod;
			return $request;
		}
	}
?>