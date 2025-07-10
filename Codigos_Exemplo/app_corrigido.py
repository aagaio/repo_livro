import subprocess
import sys
import shlex # Biblioteca para parsear comandos de shell de forma segura

def get_file_metadata_safe(filename):
    # CORREÇÃO: O comando é dividido em uma lista segura.
    # shell=True foi removido (o padrão é False).
    print(f"Buscando metadados para: {filename}")
    command = f"ls -l {shlex.quote(filename)}" # shlex.quote previne injeção
    subprocess.call(shlex.split(command))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        get_file_metadata_safe(sys.argv[1])
    else:
        print("Uso: python app_corrigido.py <nome_do_arquivo>")
