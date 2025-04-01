from flask import Flask
from config.database import db
import pymysql
import json

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
                'facturas', 'clientes'
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
                CREATE TABLE facturas (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    codigo_reserva VARCHAR(8) UNIQUE NOT NULL,
                    cliente_cedula VARCHAR(15) NOT NULL,
                    titulo_pelicula VARCHAR(200) NOT NULL,
                    horario_funcion VARCHAR(50) NOT NULL,
                    sala VARCHAR(50) NOT NULL,
                    idioma VARCHAR(50) NOT NULL,
                    asientos JSON NOT NULL,
                    productos JSON NOT NULL,
                    subtotal_entradas DECIMAL(10,2) NOT NULL,
                    subtotal_productos DECIMAL(10,2) NOT NULL,
                    total_usd DECIMAL(10,2) NOT NULL,
                    total_bs DECIMAL(10,2) NOT NULL,
                    tasa_bcv DECIMAL(10,2) NOT NULL,
                    metodo_pago VARCHAR(50) NOT NULL,
                    version VARCHAR(10) DEFAULT '1.0',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (cliente_cedula) REFERENCES clientes(cedula)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                """
            ]
            
            for query in create_tables_queries:
                cursor.execute(query)
                print("✅ Tabla creada exitosamente")
            
            # Crear índices esenciales
            index_queries = [
                "CREATE INDEX idx_email ON clientes(email)",
                "CREATE INDEX idx_facturas_cliente ON facturas(cliente_cedula)",
                "CREATE INDEX idx_facturas_pelicula ON facturas(titulo_pelicula)"
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
            client_columns = {row[0] for row in cursor.fetchall()}
            required_client_columns = {
                'id', 'cedula', 'nombre', 'email', 'password',
                'telefono', 'fecha_nacimiento', 'fecha_registro',
                'es_miembro', 'created_at'
            }
            
            if not required_client_columns.issubset(client_columns):
                print("❌ Error en estructura de clientes")
                print(f"Columnas faltantes: {required_client_columns - client_columns}")
                return False
            
            # Verificar estructura de facturas
            cursor.execute("DESCRIBE facturas")
            invoice_columns = {row[0] for row in cursor.fetchall()}
            required_invoice_columns = {
                'id', 'codigo_reserva', 'cliente_cedula', 
                'titulo_pelicula', 'horario_funcion', 'sala', 
                'idioma', 'asientos', 'productos', 'subtotal_entradas',
                'subtotal_productos', 'total_usd', 'total_bs', 
                'tasa_bcv', 'metodo_pago', 'version', 'created_at'
            }
            
            if not required_invoice_columns.issubset(invoice_columns):
                print("❌ Error en estructura de facturas")
                print(f"Columnas faltantes: {required_invoice_columns - invoice_columns}")
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
            from models import Cliente, Factura

            # Insertar datos de prueba actualizados
            prueba_factura = Factura(
                codigo_reserva="TEST1234",
                cliente_cedula="V-00000000",
                titulo_pelicula="Película de Prueba",
                horario_funcion="6:00 PM",
                sala="Sala VIP",
                idioma="Español Latino",
                asientos=[{"fila": "A", "numero": 1, "tipo": []}],
                productos=[
                    {"nombre": "Cotufas", "precio": 3.00, "cantidad": 1}
                ],
                subtotal_entradas=10.00,
                subtotal_productos=3.00,
                total_usd=13.00,
                total_bs=455.00,
                tasa_bcv=35.00,
                metodo_pago="Tarjeta"
            )
            db.session.add(prueba_factura)
            db.session.commit()
            print("✅ Factura de prueba insertada correctamente")
            
        except Exception as e:
            print(f"❌ Error de conexión ORM: {str(e)}")
            raise e

if __name__ == "__main__":
    setup_database()