<?php
	class Aluno{
		private $curso;
		private $nome;
		private $ra;
		
		public function __construct($curso, $nome, $ra){
			$this->curso = $curso;
			$this->nome = $nome;
			$this->ra = $ra;
		}
		
		public function getCurso(){
			return $this->curso;
		}
		private function setCurso($curso){
			$this->curso = $curso;
		}
		
		public function getNome(){
			return $this->nome;
		}
		private function setNome($nome){
			$this->nome = $nome;
		}
		
		public function getRa(){
			return $this->ra;
		}
		private function setRa($ra){
			$this->ra = $ra;
		}
	
	}
?>