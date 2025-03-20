"""
Inicialización de rutas
Este módulo registra todas las rutas de la aplicación
"""

from flask import Blueprint, jsonify
from routes.auth_routes import auth_bp
from routes.usuario.usuario_info import usuario_bp

def register_routes(app):
    """
    Registra todos los blueprints de rutas en la aplicación
    Args:
        app: Instancia de Flask
    """
    # Registrar blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(usuario_bp, url_prefix='/api/usuario')
    
    # Ruta raíz para verificar que la API está funcionando
    @app.route('/')
    def index():
        return jsonify({
            'mensaje': 'API de Planeta Cinema funcionando correctamente',
            'version': '1.0.0'
        }) 