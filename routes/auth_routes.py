"""
Rutas de autenticación
Este módulo maneja las rutas relacionadas con la autenticación de usuarios
"""

from flask import Blueprint, request, jsonify
from models.usuario import Usuario
from config.database import db
from werkzeug.security import generate_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/registro', methods=['POST'])
def registro():
    """
    Ruta para registrar un nuevo usuario
    """
    try:
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
        
        db.session.add(nuevo_usuario)
        db.session.commit()
        
        return jsonify({
            'mensaje': 'Usuario registrado exitosamente',
            'usuario': {
                'id': nuevo_usuario.id,
                'email': nuevo_usuario.email,
                'nombre': nuevo_usuario.nombre
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error en registro: {str(e)}")  # Para debugging
        return jsonify({'error': 'Error al registrar usuario'}), 500

# Ruta de prueba
@auth_bp.route('/test', methods=['GET'])
def test():
    """
    Ruta de prueba para verificar que el blueprint está funcionando
    """
    return jsonify({'mensaje': 'Auth routes funcionando correctamente'}) 