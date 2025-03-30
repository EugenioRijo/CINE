from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from models.cliente import Cliente
from config.database import db
import re
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps

# Configurar Blueprint con prefijo y nombre correcto
clientes_blueprint = Blueprint('clientes', __name__, url_prefix='/api/clientes')
compras_blueprint = Blueprint('compras', __name__)

def validar_email(email):
    """Valida el formato del email usando regex"""
    patron = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(patron, email) is not None

# Decorador personalizado para verificar autenticación
def requiere_autenticacion(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Se requiere autenticación para realizar esta operación'}), 401
        try:
            # Verificar el token y obtener la identidad del usuario
            current_user = get_jwt_identity()
            if not current_user:
                return jsonify({'error': 'Token inválido'}), 401
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Error de autenticación'}), 401
    return decorated_function

@clientes_blueprint.route('', methods=['POST'])
def crear_cliente():
    try:
        data = request.get_json()
        
        # Validación de campos requeridos
        campos_requeridos = ['nombre', 'email', 'password']
        if not all(campo in data for campo in campos_requeridos):
            return jsonify({'error': 'Faltan campos requeridos: nombre, email, password'}), 400

        # Validación de formato de email
        if not validar_email(data['email']):
            return jsonify({'error': 'Formato de email inválido'}), 400

        # Validación de contraseña
        if len(data['password']) < 8:
            return jsonify({'error': 'La contraseña debe tener al menos 8 caracteres'}), 400

        # Verificar email único
        if Cliente.query.filter_by(email=data['email'].lower().strip()).first():
            return jsonify({'error': 'El email ya está registrado'}), 409  # 409 Conflict

        # Crear nuevo cliente
        nuevo_cliente = Cliente(
            nombre=data['nombre'].strip(),
            email=data['email'].lower().strip(),
            password=generate_password_hash(data['password'], method='scrypt'),  # Método moderno de hashing
            telefono=data.get('telefono', '').strip(),  # Campo opcional
            es_miembro=data.get('es_miembro', False)    # Valor por defecto
        )

        db.session.add(nuevo_cliente)
        db.session.commit()

        # Respuesta exitosa con datos del cliente (sin password)
        return jsonify({
            'mensaje': 'Registro exitoso',
            'cliente': {
                'id': nuevo_cliente.id,
                'nombre': nuevo_cliente.nombre,
                'email': nuevo_cliente.email,
                'telefono': nuevo_cliente.telefono,
                'es_miembro': nuevo_cliente.es_miembro,
                'fecha_registro': nuevo_cliente.fecha_registro.isoformat()
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        # En producción deberías usar un logger aquí
        print(f"Error al crear cliente: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@compras_blueprint.route('/iniciar-compra', methods=['POST'])
@jwt_required()
def iniciar_compra():
    try:
        # Obtener datos del usuario autenticado
        current_user = get_jwt_identity()
        
        # Validar datos de la compra
        data = request.get_json()
        if not data or not all(k in data for k in ['pelicula_id', 'horario_id', 'asientos']):
            return jsonify({'error': 'Datos de compra incompletos'}), 400
            
        # Aquí iría la lógica de validación de asientos y creación de la compra
        
        return jsonify({
            'mensaje': 'Compra iniciada exitosamente',
            'compra_id': 'nuevo_id_compra'  # Aquí iría el ID real de la compra
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@compras_blueprint.route('/confirmar-compra/<compra_id>', methods=['POST'])
@jwt_required()
def confirmar_compra(compra_id):
    try:
        # Obtener datos del usuario autenticado
        current_user = get_jwt_identity()
        
        # Aquí iría la lógica de confirmación de la compra
        
        return jsonify({
            'mensaje': 'Compra confirmada exitosamente',
            'compra_id': compra_id
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500