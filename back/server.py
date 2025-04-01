"""
Archivo principal de la aplicación Flask
"""
import os
import sys
from datetime import timedelta
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

# Añadir el directorio raíz al path de Python
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)
sys.path.insert(0, project_root)

# Importaciones después de ajustar el path
from config.database import db
from routes.route_manager import register_routes

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuración JWT
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "clave-secreta-desarrollo")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)
    
    # Configuración CORS
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": "http://localhost:3000",
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "expose_headers": ["Authorization"]
            }
        },
        supports_credentials=True
    )
    
    # Configuración de la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/cine_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Inicializar extensiones
    db.init_app(app)
    JWTManager(app)  # Inicializar JWT
    
    # Registrar rutas
    register_routes(app)
    
    # Manejo de errores personalizado
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Recurso no encontrado"}), 404
        
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Error interno del servidor"}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()  # Crear tablas si no existen
    app.run(host='0.0.0.0', port=5000, debug=True)