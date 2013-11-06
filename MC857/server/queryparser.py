import urlparse

# Separa os pares (nome,valor) contidos numa url contendo os
# dados de um formulario devolvidos pelo pelo navegador (usando GET).
# Limitacao: esta versao nao trata listas de selecao multipla.

def parse(url):
    query = urlparse.urlparse(url)[4]
    res = {}
    st = 0
    nome = ''
    valor = ''
    query += '&'
    for ch in query:
        if st == 0:
            if(ch != '/')and(ch != '?')and(ch !='&'):
                st = 1
                nome += ch
        elif st == 1:
            if(ch == '='):
                st = 2
            else:
                nome += ch
        elif st == 2:
            st = 3
            if ch != '&':
                valor += ch
            else:
                res[str(nome)] = str(valor)
                nome = ''
                valor = ''
                st = 0
        elif st == 3:
            if(ch == '&'):
                res[str(nome)] = str(valor)
                nome = ''
                valor = ''
                st = 0
            else:
                valor += ch
    return res
                
    

