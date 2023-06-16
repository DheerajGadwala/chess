import requests
import zipfile

url = 'https://stockfishchess.org/files/stockfish_15.1_linux_x64.zip'
filename = 'stockfish_15.1_linux_x64.zip'
response = requests.get(url)
with open(filename, 'wb') as file:
    file.write(response.content)

target_folder_path = ''
with zipfile.ZipFile(filename, 'r') as zip_ref:
    zip_ref.extractall(target_folder_path)
