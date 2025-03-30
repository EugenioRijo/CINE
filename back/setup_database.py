"""
Script para configurar la base de datos completa del cine (versión simplificada)
"""
from flask import Flask
from config.database import db
import pymysql

def create_database():
    try:
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password=''
        )
        
        with connection.cursor() as cursor:
            # Crear la base de datos si no existe
            cursor.execute("CREATE DATABASE IF NOT EXISTS cine_db")
            print("✅ Base de datos 'cine_db' creada/verificada")
            
            cursor.execute("USE cine_db")
            
            # Eliminar tablas existentes en orden correcto
            tables = [
                'detalles_reserva', 'reservas', 
                'snacks', 'clientes'
            ]
            
            for table in tables:
                cursor.execute(f"DROP TABLE IF EXISTS {table}")
                print(f"🗑️  Tabla {table} eliminada (si existía)")
            
            # Crear tablas principales
            create_tables_queries = [
                """
                CREATE TABLE clientes (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    cedula VARCHAR(15) UNIQUE NOT NULL,
                    nombre VARCHAR(100) NOT NULL,
                    email VARCHAR(120) UNIQUE NOT NULL,
                    password VARCHAR(200) NOT NULL,
                    telefono VARCHAR(20),
                    fecha_nacimiento DATE NOT NULL,
                    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    es_miembro TINYINT(1) DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                """,
                
                """
                CREATE TABLE reservas (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    cliente_id INT NOT NULL,
                    pelicula_titulo VARCHAR(200) NOT NULL,
                    sala_numero VARCHAR(10) NOT NULL,
                    asiento_ubicacion VARCHAR(5) NOT NULL,
                    fecha_funcion DATETIME NOT NULL,
                    precio_total DECIMAL(10,2) NOT NULL,
                    codigo_reserva VARCHAR(20) UNIQUE,
                    estado VARCHAR(20) DEFAULT 'Confirmada',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                """,
                
                """
                CREATE TABLE snacks (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL UNIQUE,
                    descripcion TEXT,
                    precio DECIMAL(10,2) NOT NULL,
                    categoria VARCHAR(50),
                    stock INT DEFAULT 0,
                    imagen_url VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                """,
                
                """
                CREATE TABLE detalles_reserva (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    reserva_id INT NOT NULL,
                    snack_id INT,
                    cantidad INT DEFAULT 1,
                    precio_unitario DECIMAL(10,2) NOT NULL,
                    tipo_entrada VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (reserva_id) REFERENCES reservas(id),
                    FOREIGN KEY (snack_id) REFERENCES snacks(id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                """
            ]
            
            for query in create_tables_queries:
                cursor.execute(query)
                print("✅ Tabla creada exitosamente")
            
            # Crear índices esenciales
            index_queries = [
                "CREATE INDEX idx_email ON clientes(email)",
                "CREATE INDEX idx_codigo_reserva ON reservas(codigo_reserva)",
                "CREATE INDEX idx_fecha_funcion ON reservas(fecha_funcion)",
                "CREATE INDEX idx_reserva_detalles ON detalles_reserva(reserva_id)"
            ]
            
            for query in index_queries:
                cursor.execute(query)
                print("🔑 Índice creado exitosamente")
            
            # Insertar cliente Admin
            insert_admin_query = """
            INSERT IGNORE INTO clientes (
                cedula,
                nombre, 
                email, 
                password, 
                telefono,
                fecha_nacimiento,
                fecha_registro, 
                es_miembro, 
                created_at
            ) VALUES (
                'V-00000000',
                'Admin',
                'planetcinemavzla@gmail.com',
                'scrypt:32768:8:1$UhVt5z4HM6w1gc9F$15a6d74fbc9838e76836f7e7f99d6a575ee0cb59db75452ce5c5b3cce294c1d3afeb70a2a74cfee37576a3eec21bf9863b8eba153e43062b0d5ed95080345bfb',
                '',
                '1990-01-01',
                '2025-03-29 20:06:42',
                1,
                '2025-03-29 20:06:42'
            )
            """
            cursor.execute(insert_admin_query)
            print("👤 Cliente Admin insertado o ya existente (IGNORE)")
            
            connection.commit()
            
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Error al configurar la base de datos: {str(e)}")
        return False

def verify_table_structure():
    try:
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            database='cine_db'
        )
        
        with connection.cursor() as cursor:
            # Verificar estructura de clientes
            cursor.execute("DESCRIBE clientes")
            columns = {row[0] for row in cursor.fetchall()}
            required_columns = {
                'id', 'cedula', 'nombre', 'email', 'password',
                'telefono', 'fecha_nacimiento', 'fecha_registro',
                'es_miembro', 'created_at'
            }
            
            if not required_columns.issubset(columns):
                print("❌ Error en estructura de clientes")
                print(f"Columnas faltantes: {required_columns - columns}")
                return False
                
            print("✅ Estructura de tablas verificada correctamente")
            return True
            
    except Exception as e:
        print(f"❌ Error al verificar estructura: {str(e)}")
        return False
    finally:
        connection.close()

def setup_database():
    if not create_database():
        return
        
    if not verify_table_structure():
        return
    
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/cine_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    with app.app_context():
        try:
            # Importar modelos actualizados
            from models import Cliente, Reserva, Snack, DetalleReserva
            
            # Verificar conexión
            total_clientes = db.session.query(Cliente).count()
            print(f"✅ Conexión verificada. Clientes en DB: {total_clientes}")
            
        except Exception as e:
            print(f"❌ Error de conexión ORM: {str(e)}")
            raise e

if __name__ == "__main__":
    setup_database()