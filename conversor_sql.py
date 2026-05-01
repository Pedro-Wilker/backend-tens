import tkinter as tk
from tkinter import filedialog, messagebox
import csv
import os

def selecionar_arquivo():
    caminho_arquivo = filedialog.askopenfilename(
        title="Selecione o arquivo CSV",
        filetypes=[("Arquivos CSV", "*.csv"), ("Todos os arquivos", "*.*")]
    )
    if caminho_arquivo:
        var_caminho.set(caminho_arquivo)

def gerar_sql():
    caminho_csv = var_caminho.get()
    nome_tabela = var_tabela.get().strip()

    if not caminho_csv:
        messagebox.showerror("Erro", "Por favor, selecione um arquivo CSV primeiro.")
        return
    if not nome_tabela:
        messagebox.showerror("Erro", "Por favor, digite o nome da tabela no PostgreSQL (ex: users, categories).")
        return

    diretorio = os.path.dirname(caminho_csv)
    caminho_sql = os.path.join(diretorio, f"inserts_{nome_tabela}.sql")

    try:
        with open(caminho_csv, mode='r', encoding='utf-8') as f_in, \
             open(caminho_sql, mode='w', encoding='utf-8') as f_out:
            
            reader = csv.reader(f_in, delimiter=',', quotechar='"')
            headers = next(reader)
            
            colunas_formatadas = ', '.join([f'"{col}"' for col in headers])
            
            count = 0
            for row in reader:
                values = []
                for val in row:
                    if val == 'NULL' or val.strip() == '':
                        values.append('NULL')
                    else:
                        val_escaped = val.replace("'", "''")
                        values.append(f"'{val_escaped}'")
                
                valores_formatados = ', '.join(values)
                insert_query = f"INSERT INTO public.{nome_tabela} ({colunas_formatadas}) VALUES ({valores_formatados});\n"
                f_out.write(insert_query)
                count += 1

        messagebox.showinfo("Sucesso!", f"Conversão concluída!\n\n{count} linhas foram convertidas.\n\nArquivo salvo em:\n{caminho_sql}")
        
    except Exception as e:
        messagebox.showerror("Erro Fatal", f"Ocorreu um erro ao processar o arquivo:\n{str(e)}")

app = tk.Tk()
app.title("Conversor de CSV para PostgreSQL")
app.geometry("500x250")
app.resizable(False, False)
app.configure(padx=20, pady=20)

var_caminho = tk.StringVar()
var_tabela = tk.StringVar()

tk.Label(app, text="1. Selecione o arquivo CSV:").pack(anchor="w", pady=(0, 5))

frame_arquivo = tk.Frame(app)
frame_arquivo.pack(fill="x", pady=(0, 15))

entry_caminho = tk.Entry(frame_arquivo, textvariable=var_caminho, state="readonly", width=45)
entry_caminho.pack(side="left", padx=(0, 10))

btn_procurar = tk.Button(frame_arquivo, text="Procurar...", command=selecionar_arquivo, cursor="hand2")
btn_procurar.pack(side="left")

tk.Label(app, text="2. Nome da Tabela no Postgres (ex: subcategories):").pack(anchor="w", pady=(0, 5))
entry_tabela = tk.Entry(app, textvariable=var_tabela, width=55)
entry_tabela.pack(anchor="w", pady=(0, 20))

btn_gerar = tk.Button(app, text="Gerar Arquivo SQL", command=gerar_sql, bg="#4CAF50", fg="white", font=("Arial", 10, "bold"), cursor="hand2", pady=5)
btn_gerar.pack(fill="x")

app.mainloop()