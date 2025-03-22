"""
Script para configurar la base de datos
"""
from flask import Flask
from config.database import db
from models.usuario import Usuario
import pymysql

def create_database():
    try:
        # Conectar a MySQL sin seleccionar una base de datos
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password=''  # Si tienes contraseña, ponla aquí
        )
        
        with connection.cursor() as cursor:
            # Crear la base de datos si no existe
            cursor.execute("CREATE DATABASE IF NOT EXISTS cine_db")
            print("✅ Base de datos 'cine_db' creada o verificada correctamente")
            
            # Usar la base de datos
            cursor.execute("USE cine_db")
            
            # Eliminar la tabla si existe
            cursor.execute("DROP TABLE IF EXISTS usuarios")
            
            # Crear la tabla desde cero
            cursor.execute("""
            CREATE TABLE usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(120) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
            """)
            
            connection.commit()
            print("✅ Tabla 'usuarios' creada correctamente")
            
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Error al configurar la base de datos: {str(e)}")
        return False

def verify_table_structure():
    try:
        # Conectar a la base de datos
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            database='cine_db'
        )
        
        with connection.cursor() as cursor:
            # Verificar la estructura de la tabla
            cursor.execute("DESCRIBE usuarios")
            columns = {row[0] for row in cursor.fetchall()}
            required_columns = {'id', 'nombre', 'email', 'password', 'created_at', 'updated_at'}
            
            if not required_columns.issubset(columns):
                print("❌ Error: Faltan columnas en la tabla 'usuarios'")
                print(f"Columnas faltantes: {required_columns - columns}")
                return False
                
            print("✅ Estructura de la tabla verificada correctamente")
            return True
            
    except Exception as e:
        print(f"❌ Error al verificar la estructura de la tabla: {str(e)}")
        return False
    finally:
        connection.close()

def setup_database():
    # Crear la base de datos y la tabla
    if not create_database():
        return
        
    # Verificar la estructura de la tabla
    if not verify_table_structure():
        return
    
    # Crear la aplicación Flask
    app = Flask(__name__)
    
    # Configuración de la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/cine_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Inicializar la base de datos
    db.init_app(app)
    
    with app.app_context():
        try:
            # Verificar que SQLAlchemy puede interactuar con la tabla
            usuario_prueba = Usuario.query.first()
            print("✅ Conexión con SQLAlchemy verificada correctamente")
                
        except Exception as e:
            print(f"❌ Error al verificar la conexión con SQLAlchemy: {str(e)}")
            
if __name__ == "__main__":
    setup_database() 