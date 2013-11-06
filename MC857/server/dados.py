# -*- coding: cp1252 -*-
import xml.dom.minidom

# cria um dicionario contendo as tags identificadas por tagname e indexadas
# pelo valor do atributo attr. Dados lidos de arquivo.
def makelist(fname,tagname,attr):
     doc = xml.dom.minidom.parse(fname)
     nodes = doc.getElementsByTagName(tagname)
     lista = {}
     for node in nodes:
                     value = node.getAttribute(attr)
                     lista[value] = node
     return lista

## criacao das listas para cursos, disciplinas e historicos 
cursos = makelist("cursos.xml","curso","cod")
disciplinas = makelist("disciplinas.xml","disciplina","sigla")
historicos = makelist("historicos.xml","historico","ra")

# gera um texto xml a partir das chaves de um dicionario
def keystoxml(list,cat):
     ks = list.keys();
     res = '<list cat="'+cat+'" >\n'
     for item in ks:
          res +='  <item value="'+item+'"/>\n' 
     return res + '</list>'

# trata o servico passado como parametro na forma de um dicionario
# par�metros:
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
def doService(parms):
     if parms.has_key("serv"):
          serv = parms["serv"]
          if serv == "h":
               if parms.has_key("ra") and historicos.has_key(parms["ra"]):     
                    return historicos[parms["ra"]].toxml()
               return None
          elif serv == "c":
               if parms.has_key("cod") and cursos.has_key(parms["cod"]):
                    return cursos[parms["cod"]].toxml()
               return None
          elif serv == "d":
               if parms.has_key("s") and disciplinas.has_key(parms["s"]):
                    return disciplinas[parms["s"]].toxml()
               return None
          elif serv == "l":
               if parms.has_key("cat"):
                    parm = parms["cat"]
                    if   parm == "h": return keystoxml(historicos,"historicos")
                    elif parm == "c": return keystoxml(cursos,"cursos")
                    elif parm == "d": return keystoxml(disciplinas,"disciplinas")
     return None

