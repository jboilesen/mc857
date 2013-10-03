<?php
	class Curso{
		private $codigo;
		private $nome;
		private $modalidade;
		private $grupos_disciplinas;
		
		public function __construct($codigo, $nome, $modalidade){
			
		}
		
		public function getCodigo(){
			
		}
		private function setCodigo($codigo){
			$this->codigo = $codigo;
		}
		
		public function getNome(){
			return $this->nome;
		}
		public function setNome($nome){
			$this->nome = $nome;
		}
	}
?>