<?php
	class Disciplina{
		private $sigla;
		private $codigo;
		private $creditos;
		
		public function __construct($codigo, $creditos){
			$this->sigla = substr($codigo, 0, 2);
			$this->codigo = $codigo;
			$this->creditos = $creditos;
		}
		
		public function getSigla(){
			return $this->sigla;
		}
		private function setSigla($sigla){
			$this->sigla = $sigla;
		}		
		
		public function getCodigo(){
			return $this->codigo;
		}
		private function setCodigo($codigo){
			$this->codigo = $codigo;
		}
		
		public function getCreditos(){
			return $this->creditos;
		}
		public function setCreditos($creditos){
			$this->creditos = $creditos;
		}
	}
?>