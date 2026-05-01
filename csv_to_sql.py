import csv
import os

csv_filename = 'tenso3105817_app_table_subcategories.csv' 
table_name = 'subcategories' 

sql_filename = f'inserts_{table_name}.sql'

print(f"🔄 Lendo '{csv_filename}' para gerar INSERTS para a tabela '{table_name}'...")

try:
    with open(csv_filename, mode='r', encoding='utf-8') as f_in, \
         open(sql_filename, mode='w', encoding='utf-8') as f_out:
        
        reader = csv.reader(f_in, delimiter=',', quotechar='"')
        
        headers = next(reader)
        
        columns_formatted = ', '.join([f'"{col}"' for col in headers])
        
        count = 0
        for row in reader:
            values = []
            for val in row:
                if val == 'NULL' or val.strip() == '':
                    values.append('NULL')
                else:
                    val_escaped = val.replace("'", "''")
                    values.append(f"'{val_escaped}'")
            
            values_formatted = ', '.join(values)
            
            insert_query = f"INSERT INTO public.{table_name} ({columns_formatted}) VALUES ({values_formatted});\n"
            f_out.write(insert_query)
            count += 1

    print(f"✅ Sucesso! O arquivo '{sql_filename}' foi criado com {count} linhas de INSERT.")

except FileNotFoundError:
    print(f"❌ Erro: O arquivo '{csv_filename}' não foi encontrado nesta pasta.")
except Exception as e:
    print(f"❌ Ocorreu um erro inesperado: {e}")