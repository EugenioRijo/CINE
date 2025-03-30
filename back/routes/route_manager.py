from routes.auth_routes import auth_bp
from back.routes.cliente.cliente_info import cliente_bp

def register_routes(app):
    # Registrar blueprints con prefijos
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(cliente_bp, url_prefix='/api/clientes')