"""
Script para configurar la base de datos completa del cine
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
            
            # Eliminar tablas existentes en orden correcto (por dependencias de FK)
            tables = [
                'ventas_snacks', 'detalles_reserva', 'reservas',
                'funciones', 'asientos', 'salas', 'peliculas',
                'promociones', 'snacks', 'clientes', 'membresias'
            ]
            
            for table in tables:
                cursor.execute(f"DROP TABLE IF EXISTS {table}")
                print(f"🗑️  Tabla {table} eliminada (si existía)")
            
            # Crear todas las tablas
            create_tables_queries = [
                """
            CREATE TABLE clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(120) UNIQUE NOT NULL,  -- ✅ NOT NULL añadido
                password VARCHAR(200) NOT NULL,      -- ✅ Longitud corregida
                telefono VARCHAR(20),
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- ✅ Tipo cambiado
                es_miembro TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;  -- ✅ Collation
                """,
                
                """
                CREATE TABLE salas (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    numero VARCHAR(10) NOT NULL,
                    capacidad INT NOT NULL,
                    tipo VARCHAR(20),
                    estado VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """,
                
                """
                CREATE TABLE peliculas (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    titulo VARCHAR(200) NOT NULL,
                    sinopsis TEXT,
                    duracion INT,
                    clasificacion VARCHAR(10),
                    genero VARCHAR(50),
                    director VARCHAR(100),
                    fecha_estreno DATE,
                    poster_url VARCHAR(255),
                    estado VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """,
                
                """
                CREATE TABLE funciones (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    pelicula_id INT,
                    sala_id INT,
                    fecha DATE NOT NULL,
                    hora_inicio TIME NOT NULL,
                    precio_general DECIMAL(10,2),
                    precio_reducido DECIMAL(10,2),
                    estado VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (pelicula_id) REFERENCES peliculas(id),
                    FOREIGN KEY (sala_id) REFERENCES salas(id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """,
                
                """
                CREATE TABLE asientos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    sala_id INT,
                    fila VARCHAR(2),
                    numero INT,
                    tipo VARCHAR(20),
                    estado VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (sala_id) REFERENCES salas(id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """,
                
                """
                CREATE TABLE reservas (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    cliente_id INT,
                    funcion_id INT,
                    fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
                    estado VARCHAR(20),
                    codigo_reserva VARCHAR(20) UNIQUE,
                    total DECIMAL(10,2),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
                    FOREIGN KEY (funcion_id) REFERENCES funciones(id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """,
                
                """
                CREATE TABLE detalles_reserva (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    reserva_id INT,
                    asiento_id INT,
                    precio DECIMAL(10,2),
                    tipo_entrada VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (reserva_id) REFERENCES reservas(id),
                    FOREIGN KEY (asiento_id) REFERENCES asientos(id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """,
                
                """
                CREATE TABLE snacks (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    descripcion TEXT,
                    precio DECIMAL(10,2),
                    categoria VARCHAR(50),
                    estado VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """,
                
                """
                CREATE TABLE ventas_snacks (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    reserva_id INT,
                    snack_id INT,
                    cantidad INT,
                    precio_unitario DECIMAL(10,2),
                    total DECIMAL(10,2),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (reserva_id) REFERENCES reservas(id),
                    FOREIGN KEY (snack_id) REFERENCES snacks(id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """,
                
                """
                CREATE TABLE promociones (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    descripcion TEXT,
                    descuento DECIMAL(5,2),
                    fecha_inicio DATE,
                    fecha_fin DATE,
                    codigo VARCHAR(20) UNIQUE,
                    estado VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """,
                
                """
                CREATE TABLE membresias (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    cliente_id INT NOT NULL,
                    tipo VARCHAR(20) NOT NULL,  -- 'monthly' o 'annual'
                    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    fecha_expiracion TIMESTAMP NOT NULL,
                    esta_activa TINYINT(1) DEFAULT 1,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """
            ]
            
            for query in create_tables_queries:
                cursor.execute(query)
                print("✅ Tabla creada exitosamente")
            
            # Crear índices
            index_queries = [
                "CREATE INDEX idx_email ON clientes(email)",
                "CREATE INDEX idx_fecha ON funciones(fecha)",
                "CREATE INDEX idx_fecha_reserva ON reservas(fecha_reserva)",
                "CREATE INDEX idx_sala_fila_numero ON asientos(sala_id, fila, numero)"
            ]
            
            for query in index_queries:
                cursor.execute(query)
                print("🔑 Índice creado exitosamente")
            

             # Insertar cliente Admin si no existe
            insert_admin_query = """
            INSERT IGNORE INTO clientes (
                nombre, 
                email, 
                password, 
                telefono, 
                fecha_registro, 
                es_miembro, 
                created_at
            ) VALUES (
                'Admin',
                'planetcinemavzla@gmail.com',
                'scrypt:32768:8:1$UhVt5z4HM6w1gc9F$15a6d74fbc9838e76836f7e7f99d6a575ee0cb59db75452ce5c5b3cce294c1d3afeb70a2a74cfee37576a3eec21bf9863b8eba153e43062b0d5ed95080345bfb',
                '',
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
                'id', 'nombre', 'email','password', 'telefono',
                'fecha_registro', 'es_miembro', 'created_at'
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
            # Importar después de crear la app y db
            from models import Cliente, Reserva, Sala, Pelicula, Funcion, Asiento, DetalleReserva, Snack, VentaSnack, Promocion
            
            # Verificar conexión con una consulta simple
            total_clientes = db.session.query(Cliente).count()
            print(f"✅ Conexión verificada. Clientes en DB: {total_clientes}")
            
        except Exception as e:
            print(f"❌ Error de conexión ORM: {str(e)}")
            raise e  # Mostrar detalles completos del error
            
if __name__ == "__main__":
    setup_database()