"""
Archivo principal de la aplicación Flask
Este archivo contiene la configuración principal y el punto de entrada de la aplicación.

Áreas de mejora potenciales:
- Implementar configuración por ambiente (desarrollo, producción, pruebas)
- Agregar manejo de errores global
- Implementar sistema de logging
- Agregar middleware de autenticación
- Configurar CORS
- Implementar rate limiting
- Agregar documentación Swagger/OpenAPI
"""

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import logging
from logging.handlers import RotatingFileHandler
import os
from config.database import db
from routes import register_routes

load_dotenv()

def configure_logging(app):
    """Configura el sistema de logging"""
    if not os.path.exists('logs'):
        os.mkdir('logs')
    
    file_handler = RotatingFileHandler('logs/cine.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Iniciando servidor de Planeta Cinema')

def create_app():
    """
    Crea y configura la aplicación Flask
    Returns:
        Flask: Instancia configurada de la aplicación Flask
    """
    app = Flask(__name__)
    
    # Configurar CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Configuración de la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+pymysql://root:@localhost/nombre_db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Configurar logging
    configure_logging(app)
    
    # Inicializar la base de datos
    db.init_app(app)
    
    # Registrar todas las rutas
    register_routes(app)
    
    # Manejador de errores 404
    @app.errorhandler(404)
    def not_found_error(error):
        app.logger.error(f'Ruta no encontrada: {error}')
        return jsonify({
            'error': 'Ruta no encontrada',
            'status': 404
        }), 404

    # Manejador de errores 500
    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f'Error del servidor: {error}')
        return jsonify({
            'error': 'Error interno del servidor',
            'status': 500
        }), 500

    # Ruta de health check
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'ok',
            'message': 'El servidor está funcionando correctamente'
        })
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000, host='0.0.0.0') 