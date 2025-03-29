"""
Rutas de autenticación
Maneja registro, login y operaciones de autenticación
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.cliente import Cliente
from config.database import db
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/registro', methods=['POST'])
def registro_cliente():
    try:
        data = request.get_json()
        email = data['email'].strip().lower()  # <<< Añade esto

        # Validación básica
        required_fields = ['nombre', 'email', 'password']
        if not all(k in data for k in required_fields):
            return jsonify({'error': f'Campos requeridos faltantes: {required_fields}'}), 400
            
        # Verificar email único
        if Cliente.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'El email ya está registrado'}), 409
            
        # === CORRECCIÓN: Hashear la contraseña ===
        from werkzeug.security import generate_password_hash
        hashed_password = generate_password_hash(data['password'])
        
        # Crear cliente con el hash
        nuevo_cliente = Cliente(
            nombre=data['nombre'],
            email=email,  # <<< Usar la versión normalizada
            password=hashed_password,  # ✨ Usar contraseña hasheada
            telefono=data.get('telefono'),
            es_miembro=data.get('es_miembro', False)
        )
        
        db.session.add(nuevo_cliente)
        db.session.commit()
        
        # Generar token JWT
        access_token = create_access_token(
            identity=nuevo_cliente.id,
            expires_delta=timedelta(hours=2)
        )
        
        return jsonify({
            'mensaje': 'Registro exitoso',
            'cliente': {
                'id': nuevo_cliente.id,
                'nombre': nuevo_cliente.nombre,
                'email': nuevo_cliente.email
            },
            'access_token': access_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login_cliente():
    """
    Autentica al cliente usando el método del modelo
    """
    try:
        data = request.get_json()
        email = data['email'].strip().lower()  # <<< Añade esto

        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email y contraseña requeridos'}), 400
            
        cliente = Cliente.query.filter_by(email=email).first()  # <<< Usar email normalizado
        
        # Verificar credenciales usando el modelo
        if not cliente or not cliente.verificar_password(data['password']):
            return jsonify({'error': 'Credenciales inválidas'}), 401
            
        # Generar token (CORREGIDO)
        access_token = create_access_token(
            identity=cliente.id,
            expires_delta=timedelta(hours=2)
        )  # <--- Aquí faltaba el paréntesis de cierre
        
        return jsonify({
            'access_token': access_token,
            'cliente': {
                'id': cliente.id,
                'nombre': cliente.nombre,
                'email': cliente.email
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/perfil', methods=['GET'])
@jwt_required()
def obtener_perfil():
    """
    Obtiene el perfil del cliente autenticado
    """
    try:
        cliente_id = get_jwt_identity()
        cliente = Cliente.query.get(cliente_id)
        
        if not cliente:
            return jsonify({'error': 'Cliente no encontrado'}), 404
            
        return jsonify({
            'id': cliente.id,
            'nombre': cliente.nombre,
            'email': cliente.email,
            'es_miembro': cliente.es_miembro
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/test', methods=['GET'])
def test():
    return jsonify({'mensaje': 'Auth routes funcionando correctamente'})