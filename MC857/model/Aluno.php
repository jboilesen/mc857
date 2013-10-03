<?php
	class Aluno{
		private $ra;
		private $nome;
		
		public function __construct($ra, $nome){
			$this->ra = $ra;
			$this->nome = $nome;
		}
		
		public function getRa(){
			return $this->ra;
		}
		private function setRa($ra){
			$this->ra = $ra;
		}
		
		public function getNome(){
			return $this->nome;
		}
		private function setNome($nome){
			$this->nome = $nome;
		}
	
	}
?>