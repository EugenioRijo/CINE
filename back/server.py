"""
Archivo principal de la aplicación Flask
"""
import os
import sys
from flask import Flask
from flask_cors import CORS  # Importación añadida
from dotenv import load_dotenv

# Añadir el directorio raíz al path de Python
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.insert(0, project_root)

# Ahora importamos las dependencias
from config.database import db
from routes.route_manager import register_routes

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuración CORS para permitir solo localhost:3000
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": "http://localhost:3000",
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"]
            }
        },
        supports_credentials=True
    )
    
    # Configuración de la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/cine_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    register_routes(app)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)