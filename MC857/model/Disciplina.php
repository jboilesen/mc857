<?php
	class Disciplina{
		private $codigo;
		private $nome;
		private $creditos;
		
		public function __construct($codigo){
			
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
		
		public function getCreditos(){
			return $this->creditos;
		}
		public function setCreditos($creditos){
			$this->creditos = $creditos;
		}
		
		public function getTipo(){
			return $this->tipo;
		}
		public function setTipo($tipo){
			$this->tipo = $tipo;
		}
	}
?>