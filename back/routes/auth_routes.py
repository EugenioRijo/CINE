"""
Rutas de autenticación
Este módulo maneja el registro y autenticación de clientes
"""

from flask import Blueprint, request, jsonify
from models.cliente import Cliente
from config.database import db
from werkzeug.security import generate_password_hash

# Crear el blueprint primero
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/registro', methods=['POST'])
def registro_cliente():
    """
    Ruta para registrar un nuevo cliente
    """
    try:
        data = request.get_json()
        
        # Validar campos requeridos
        required_fields = ['nombre', 'email', 'password']
        if not all(k in data for k in required_fields):
            return jsonify({'error': f'Faltan campos requeridos: {required_fields}'}), 400
            
        # Verificar si el cliente ya existe
        if Cliente.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'El email ya está registrado'}), 400
            
        # Crear nuevo cliente
        nuevo_cliente = Cliente(
            nombre=data['nombre'],
            email=data['email'],
            password=generate_password_hash(data['password']),
            telefono=data.get('telefono'),
            es_miembro=data.get('es_miembro', False)
        )
        
        db.session.add(nuevo_cliente)
        db.session.commit()
        
        return jsonify({
            'mensaje': 'Cliente registrado exitosamente',
            'cliente': {
                'id': nuevo_cliente.id,
                'nombre': nuevo_cliente.nombre,
                'email': nuevo_cliente.email
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/test', methods=['GET'])
def test():
    return jsonify({'mensaje': 'Auth routes funcionando correctamente'})