from routes.auth_routes import auth_bp
from routes.cliente.cliente_info import cliente_bp
from routes.email_routes import email_bp
from routes.payment_routes import payment_bp  # Nueva importación

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(cliente_bp, url_prefix='/api/clientes')
    app.register_blueprint(email_bp, url_prefix='/api/email')
    app.register_blueprint(payment_bp, url_prefix='/api/payments')  # Nueva ruta