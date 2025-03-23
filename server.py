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

from flask import Flask
from dotenv import load_dotenv
from config.database import db
from routes import register_routes

load_dotenv()

def create_app():
    """
    Crea y configura la aplicación Flask
    Returns:
        Flask: Instancia configurada de la aplicación Flask
    """
    app = Flask(__name__)
    
    # Configuración de la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/nombre_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Inicializar la base de datos
    db.init_app(app)
    
    # Registrar todas las rutas
    register_routes(app)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True) 