"""
Rutas de Usuario
Define los endpoints relacionados con las operaciones de usuarios.

Áreas de mejora potenciales:
- Implementar más endpoints (actualización, eliminación, etc.)
- Agregar validación de esquemas (marshmallow, pydantic)
- Implementar rate limiting por endpoint
- Agregar documentación OpenAPI/Swagger
- Implementar versionado de API
- Agregar endpoints para gestión de sesiones
- Implementar endpoints para gestión de perfiles
"""

from flask import Blueprint, request, jsonify
from helpers.usuario_helper import UsuarioHelper
from repositories.usuario_repository import UsuarioRepository

usuario_bp = Blueprint('usuario', __name__)

@usuario_bp.route('/', methods=['POST'])
def crear_usuario():
    """
    Endpoint para crear un nuevo usuario
    
    Request body:
    {
        "nombre": str,
        "email": str,
        "password": str
    }
    
    Returns:
        JSON: Datos del usuario creado
        Status: 201 si es exitoso, 400 si hay error
    """
    data = request.get_json()
    
    if not all(k in data for k in ['nombre', 'email', 'password']):
        return jsonify({'error': 'Faltan datos requeridos'}), 400
    
    usuario, error = UsuarioHelper.registrar_usuario(
        nombre=data['nombre'],
        email=data['email'],
        password=data['password']
    )
    
    if error:
        return jsonify({'error': error}), 400
    
    return jsonify({
        'id': usuario.id,
        'nombre': usuario.nombre,
        'email': usuario.email
    }), 201

@usuario_bp.route('/<int:usuario_id>', methods=['GET'])
def obtener_usuario(usuario_id):
    """
    Endpoint para obtener los datos de un usuario por su ID
    
    Args:
        usuario_id (int): ID del usuario a consultar
        
    Returns:
        JSON: Datos del usuario
        Status: 200 si existe, 404 si no se encuentra
    """
    usuario = UsuarioRepository.get_by_id(usuario_id)
    
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    return jsonify({
        'id': usuario.id,
        'nombre': usuario.nombre,
        'email': usuario.email
    }) 