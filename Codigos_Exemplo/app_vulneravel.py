import subprocess
import sys

def get_file_metadata(filename):
    # ANTIPADRÃO: O input do usuário é passado diretamente para um comando do shell.
    # Um atacante pode injetar comandos, como "arquivo.txt; rm -rf /"
    print(f"Buscando metadados para: {filename}")
    subprocess.call(f"ls -l {filename}", shell=True)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        get_file_metadata(sys.argv[1])
    else:
        print("Uso: python app_vulneravel.py <nome_do_arquivo>")
