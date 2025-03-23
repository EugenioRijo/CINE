"""
Archivo principal de la aplicación Flask

Configuración principal y punto de entrada de la aplicación
"""

import os
import sys
from pathlib import Path
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash
from flask_cors import CORS

# Configurar path del proyecto
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Importaciones internas después de configurar el path
from config.database import db
from routes import register_routes
from models.cliente import Cliente  # Cambiado a Cliente

# Cargar variables de entorno
load_dotenv()

def create_app():
    """
    Factory para crear y configurar la aplicación Flask
    
    Returns:
        Flask: Instancia configurada de la aplicación
    """
    app = Flask(__name__)
    
    # Configuración básica
    configure_app(app)
    
    # Configurar extensiones
    configure_extensions(app)
    
    # Registrar rutas
    register_routes(app)
    
    # Registrar blueprints y rutas personalizadas
    register_blueprints(app)
    
    # Configurar manejo de errores
    register_error_handlers(app)
    
    return app

def configure_app(app):
    """Configuración de la aplicación"""
    # Configuración base
    app.config.update({
        'SQLALCHEMY_DATABASE_URI': os.getenv('DATABASE_URI', 'mysql+pymysql://root:@localhost/cine_db'),
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'SECRET_KEY': os.getenv('SECRET_KEY', 'clave-desarrollo-secreta'),
        'DEBUG': os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    })
    
    # Configuración adicional desde archivo .env
    app.config.from_prefixed_env()

def configure_extensions(app):
    """Configuración de extensiones"""
    # Base de datos
    db.init_app(app)
    
    # CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": os.getenv('CORS_ORIGINS', '*'),
            "supports_credentials": True
        }
    })
    
    # Contexto de aplicación para inicializar DB
    with app.app_context():
        db.create_all()
        initialize_data()

def register_blueprints(app):
    """Registrar blueprints y rutas personalizadas"""
    
    @app.route('/api/registro', methods=['POST'])
    def registro():
        """Endpoint para registro de usuarios"""
        data = request.get_json()
        
        # Validación básica
        required_fields = ['email', 'password', 'nombre']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Faltan campos requeridos'}), 400
            
        # Verificar usuario existente
        if Cliente.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'El email ya está registrado'}), 400
            
        try:
            nuevo_cliente = Cliente(
                nombre=data['nombre'],
                email=data['email'],
                password=generate_password_hash(data['password'])
            )
            
            db.session.add(nuevo_cliente)
            db.session.commit()
            return jsonify({'mensaje': 'Registro exitoso'}), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Error en el servidor'}), 500

    @app.route('/health', methods=['GET'])
    def health_check():
        """Endpoint de verificación de estado"""
        return jsonify({
            'status': 'ok',
            'environment': os.getenv('FLASK_ENV', 'development'),
            'debug_mode': app.config['DEBUG']
        })

def register_error_handlers(app):
    """Registrar manejadores de errores"""
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "error": "Recurso no encontrado",
            "mensaje": "La ruta solicitada no existe"
        }), 404
        
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            "error": "Error interno del servidor",
            "mensaje": "Ocurrió un error inesperado"
        }), 500

def initialize_data():
    """Inicializar datos básicos en la base de datos"""
    # Aquí puedes agregar datos iniciales si es necesario
    pass

if __name__ == '__main__':
    app = create_app()
    
    # Configuración del servidor
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', 5000))
    use_debugger = app.config['DEBUG']
    
    app.run(host=host, port=port, debug=use_debugger)