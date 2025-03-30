import os
import shutil

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

# Crear directorios necesarios
dirs = [
    'back/models', 'back/migrations', 'back/helpers', 
    'back/config', 'back/routes', 'back/repositories',
    'front/components', 'front/public', 'front/theme', 
    'front/src', 'assets'
]

for d in dirs:
    ensure_dir(d)

# Mover archivos del backend
backend_dirs = ['models', 'migrations', 'helpers', 'config', 'routes', 'repositories']
for dir_name in backend_dirs:
    if os.path.exists(dir_name):
        for item in os.listdir(dir_name):
            src = os.path.join(dir_name, item)
            dst = os.path.join('back', dir_name, item)
            if os.path.exists(src):
                shutil.move(src, dst)
        shutil.rmtree(dir_name)

# Mover archivos del frontend
frontend_dirs = ['components', 'public', 'theme', 'src']
for dir_name in frontend_dirs:
    if os.path.exists(dir_name):
        for item in os.listdir(dir_name):
            src = os.path.join(dir_name, item)
            dst = os.path.join('front', dir_name, item)
            if os.path.exists(src):
                shutil.move(src, dst)
        shutil.rmtree(dir_name)

# Mover archivos sueltos
files_to_move = {
    'server.py': 'back/',
    'setup_database.py': 'back/',
    'requirements.txt': 'back/',
    'package.json': 'front/',
    'package-lock.json': 'front/',
    'tsconfig.json': 'front/',
    'Planeta Cinema.jpeg': 'assets/',
    'Ilustracion Planeta Cinema.jpeg': 'assets/'
}

for src, dst in files_to_move.items():
    if os.path.exists(src):
        shutil.move(src, os.path.join(dst, src))

# Eliminar carpetas no necesarias
dirs_to_remove = ['node_modules', '.venv', 'venv']
for dir_name in dirs_to_remove:
    if os.path.exists(dir_name):
        shutil.rmtree(dir_name)

print("¡Reorganización completada!") 