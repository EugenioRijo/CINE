from routes.usuario.usuario_info import usuario_bp

def register_routes(app):
    """
    Registra todos los blueprints de la aplicación
    """
    app.register_blueprint(usuario_bp, url_prefix='/api/usuarios') 