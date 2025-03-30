"""
Inicialización de rutas
Este módulo registra todas las rutas de la aplicación
"""

from flask import Blueprint, jsonify
from routes.auth_routes import auth_bp
from routes.cliente.cliente_info import cliente_bp
from routes.estadisticas_routes import estadisticas_bp

def register_routes(app):
    """
    Registra todos los blueprints de rutas en la aplicación
    Args:
        app: Instancia de Flask
    """
    # Registrar blueprints con prefijos actualizados
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(cliente_bp, url_prefix='/api/clientes')
    app.register_blueprint(estadisticas_bp)
    
    # Ruta raíz para verificar que la API está funcionando
    @app.route('/api')
    def index():
        return jsonify({
            'mensaje': 'API de Planeta Cinema funcionando correctamente',
            'version': '1.0.0',
            'endpoints': {
                'documentacion': '/api/docs',
                'registro': '/api/auth/registro',
                'clientes': '/api/clientes',
                'estadisticas': '/api/estadisticas'
            }
        })