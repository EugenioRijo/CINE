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

from flask import Flask, request, jsonify
from dotenv import load_dotenv
from config.database import db
from routes import register_routes
from models.usuario import Usuario
from werkzeug.security import generate_password_hash
from flask_cors import CORS

load_dotenv()

def create_app():
    """
    Crea y configura la aplicación Flask
    Returns:
        Flask: Instancia configurada de la aplicación Flask
    """
    app = Flask(__name__)
    
    # Configuración de la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/cine_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'tu_clave_secreta_aqui'  # Cambia esto en producción
    
    # Habilitar CORS para todas las rutas
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Inicializar la base de datos
    db.init_app(app)
    
    # Registrar todas las rutas
    register_routes(app)
    
    # Ruta para registro de usuarios
    @app.route('/api/registro', methods=['POST'])
    def registro():
        data = request.get_json()
        
        # Validar que se recibieron todos los campos necesarios
        if not all(k in data for k in ['email', 'password', 'nombre']):
            return jsonify({'error': 'Faltan datos requeridos'}), 400
            
        # Verificar si el usuario ya existe
        if Usuario.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'El email ya está registrado'}), 400
            
        # Crear nuevo usuario
        nuevo_usuario = Usuario(
            email=data['email'],
            nombre=data['nombre'],
            password=generate_password_hash(data['password'])
        )
        
        try:
            db.session.add(nuevo_usuario)
            db.session.commit()
            return jsonify({'mensaje': 'Usuario registrado exitosamente'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Error al registrar usuario'}), 500
    
    # Ruta de prueba para verificar que el servidor está funcionando
    @app.route('/test', methods=['GET'])
    def test():
        return jsonify({"mensaje": "El servidor está funcionando correctamente"})
    
    # Manejador de errores 404
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Ruta no encontrada"}), 404
    
    # Crear todas las tablas
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    # Ejecutar en modo debug y permitir acceso desde cualquier IP
    app.run(debug=True, host='0.0.0.0', port=5000) 