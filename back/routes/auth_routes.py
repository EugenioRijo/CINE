"""
Rutas de autenticación mejoradas con campos requeridos y validaciones actualizadas
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from models.cliente import Cliente
from config.database import db
from datetime import timedelta, datetime
from werkzeug.security import generate_password_hash
import re
import os
from functools import wraps
import traceback

auth_bp = Blueprint('auth', __name__)

# Configuración desde variables de entorno
TOKEN_EXPIRATION_HOURS = int(os.getenv('TOKEN_EXPIRATION_HOURS', 2))
REFRESH_TOKEN_EXPIRATION_DAYS = int(os.getenv('REFRESH_TOKEN_EXPIRATION_DAYS', 7))
MAX_LOGIN_ATTEMPTS = int(os.getenv('MAX_LOGIN_ATTEMPTS', 5))

# Helpers de validación
def validate_email_format(email: str) -> bool:
    """Valida el formato del email usando regex"""
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def validate_password_strength(password: str) -> tuple:
    """Valida la fortaleza de la contraseña"""
    if len(password) < 8:
        return False, 'La contraseña debe tener al menos 8 caracteres'
    if not re.search(r'[A-Z]', password):
        return False, 'La contraseña debe contener al menos una mayúscula'
    if not re.search(r'[a-z]', password):
        return False, 'La contraseña debe contener al menos una minúscula'
    if not re.search(r'[0-9]', password):
        return False, 'La contraseña debe contener al menos un número'
    return True, ''

def normalize_email(email: str) -> str:
    """Normaliza el email a minúsculas y sin espacios"""
    return email.strip().lower()

# Decorador para manejo de errores
def handle_errors(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            db.session.rollback()
            traceback.print_exc()  # Log del error completo
            return jsonify({'error': 'Error interno del servidor'}), 500
    return wrapper

@auth_bp.route('/registro', methods=['POST'])
@handle_errors
def registro_cliente():
    data = request.get_json()
    
    # Campos requeridos actualizados
    required_fields = ['nombre', 'email', 'password', 'cedula', 'fecha_nacimiento']
    if not all(k in data for k in required_fields):
        return jsonify({'error': f'Campos requeridos faltantes: {required_fields}'}), 400
    
    # Validación de formato de cédula
    if not re.match(r'^[VE]-\d{6,8}$', data['cedula']):
        return jsonify({'error': 'Formato de cédula inválido. Use V-12345678'}), 400
    
    # Validación de fecha de nacimiento
    try:
        # 1. Obtener y normalizar el valor del request
        fecha_str = data['fecha_nacimiento']  # Recibe formato ISO: "2001-04-18"
        
        # 2. Parsear a objeto date
        fecha_nacimiento = datetime.strptime(fecha_str, '%Y-%m-%d').date()
        
        # 3. Validaciones adicionales
        hoy = datetime.now().date()
        if fecha_nacimiento > hoy:
            return jsonify({'error': 'La fecha no puede ser futura'}), 400
            
        edad = hoy.year - fecha_nacimiento.year - ((hoy.month, hoy.day) < (fecha_nacimiento.month, fecha_nacimiento.day))
        if edad < 18:
            return jsonify({'error': 'Debes tener al menos 18 años'}), 400

    except ValueError as e:
        return jsonify({
            'error': 'Formato de fecha inválido',
            'detalle': str(e),
            'formato_requerido': 'YYYY-MM-DD',
            'ejemplo_valido': '2001-04-18',
            'valor_recibido': data.get('fecha_nacimiento')
        }), 400

    
    email = normalize_email(data['email'])
        
    # Validaciones de email y contraseña
    if not validate_email_format(email):
        return jsonify({'error': 'Formato de email inválido'}), 400
    
    password_valid, password_msg = validate_password_strength(data['password'])
    if not password_valid:
        return jsonify({'error': password_msg}), 400
    
    if Cliente.query.filter_by(email=email).first():
        return jsonify({'error': 'El email ya está registrado'}), 409
    
    if Cliente.query.filter_by(cedula=data['cedula'].upper()).first():
        return jsonify({'error': 'La cédula ya está registrada'}), 409
    
    # Crear usuario con nuevos campos
    hashed_password = generate_password_hash(data['password'])
    nuevo_cliente = Cliente(
        cedula=data['cedula'].upper().strip(),
        nombre=data['nombre'].strip(),
        email=email,
        password=hashed_password,
        telefono=data.get('telefono', '').strip(),
        fecha_nacimiento=fecha_nacimiento,
        es_miembro=data.get('es_miembro', False)
    )
    
    db.session.add(nuevo_cliente)
    db.session.commit()
    
    # Generar tokens con información actualizada
    user_claims = {
        'id': nuevo_cliente.id,
        'email': nuevo_cliente.email,
        'nombre': nuevo_cliente.nombre,
        'es_miembro': nuevo_cliente.es_miembro,
        'cedula': nuevo_cliente.cedula,
        'rol': 'cliente'
    }
    
    access_token = create_access_token(
        identity=user_claims,
        expires_delta=timedelta(hours=TOKEN_EXPIRATION_HOURS)
    )
    refresh_token = create_refresh_token(
        identity=user_claims,
        expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRATION_DAYS)
    )
    
    return jsonify({
        'mensaje': 'Registro exitoso',
        'cliente': user_claims,
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 201

@auth_bp.route('/login', methods=['POST'])
@handle_errors
def login_cliente():
    data = request.get_json()
    
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email y contraseña requeridos'}), 400
    
    email = normalize_email(data['email'])
    password = data['password']
    
    cliente = Cliente.query.filter_by(email=email).first()
    
    if not cliente or not cliente.verificar_password(password):
        return jsonify({'error': 'Credenciales inválidas'}), 401
    
    user_claims = {
        'id': cliente.id,
        'email': cliente.email,
        'nombre': cliente.nombre,
        'es_miembro': cliente.es_miembro,
        'cedula': cliente.cedula,
        'rol': 'cliente'
    }
    
    access_token = create_access_token(
        identity=user_claims,
        expires_delta=timedelta(hours=TOKEN_EXPIRATION_HOURS)
    )

    return jsonify({
        'access_token': access_token,
        'cliente': {
            'id': cliente.id,
            'nombre': cliente.nombre,
            'email': cliente.email,
            'cedula': cliente.cedula,
            'es_miembro': cliente.es_miembro
        }
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    current_user = get_jwt_identity()
    new_token = create_access_token(
        identity=current_user,
        expires_delta=timedelta(hours=TOKEN_EXPIRATION_HOURS))
    return jsonify({'access_token': new_token}), 200

@auth_bp.route('/perfil', methods=['GET'])
@jwt_required()
def obtener_perfil():
    try:
        claims = get_jwt()
        cliente = Cliente.query.get(claims['id'])
        
        if not cliente:
            return jsonify({'error': 'Cliente no encontrado'}), 404
            
        return jsonify({
            'id': cliente.id,
            'nombre': cliente.nombre,
            'email': cliente.email,
            'cedula': cliente.cedula,
            'es_miembro': cliente.es_miembro,
            'telefono': cliente.telefono,
            'fecha_nacimiento': cliente.fecha_nacimiento.isoformat(),
            'fecha_registro': cliente.fecha_registro.isoformat()
        }), 200
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': 'Error al obtener perfil'}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'mensaje': 'Logout exitoso'}), 200

@auth_bp.route('/test', methods=['GET'])
def test():
    return jsonify({
        'mensaje': 'Auth routes funcionando correctamente',
        'config': {
            'token_expiration_hours': TOKEN_EXPIRATION_HOURS,
            'refresh_token_expiration_days': REFRESH_TOKEN_EXPIRATION_DAYS
        }
    })