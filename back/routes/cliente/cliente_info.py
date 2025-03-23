"""
Rutas de Cliente
Define los endpoints relacionados con operaciones de clientes

Áreas de mejora potenciales:
- Agregar endpoints para actualización y eliminación
- Implementar validación de esquemas
- Añadir autenticación JWT
- Implementar paginación en listados
"""

from flask import Blueprint, request, jsonify
from helpers.cliente_helper import ClienteHelper
from repositories.cliente_repository import ClienteRepository

cliente_bp = Blueprint('cliente', __name__)

@cliente_bp.route('/', methods=['POST'])
def crear_cliente():
    """
    Endpoint para crear un nuevo cliente
    
    Request body:
    {
        "nombre": str (requerido),
        "email": str (requerido),
        "password": str (requerido),
        "telefono": str (opcional),
        "es_miembro": bool (opcional)
    }
    
    Returns:
        JSON: Datos del cliente creado
        Status: 201 si es exitoso, 400 si hay error
    """
    try:
        data = request.get_json()
        
        # Validar campos requeridos
        required_fields = ['nombre', 'email', 'password']
        if not all(k in data for k in required_fields):
            return jsonify({
                'error': f'Faltan campos requeridos: {required_fields}'
            }), 400
        
        # Registrar cliente
        cliente, error = ClienteHelper.registrar_cliente(
            nombre=data['nombre'],
            email=data['email'],
            password=data['password'],
            telefono=data.get('telefono'),
            es_miembro=data.get('es_miembro', False)
        )
        
        if error:
            return jsonify({'error': error}), 400
        
        return jsonify({
            'mensaje': 'Cliente registrado exitosamente',
            'cliente': {
                'id': cliente.id,
                'nombre': cliente.nombre,
                'email': cliente.email,
                'telefono': cliente.telefono,
                'es_miembro': cliente.es_miembro
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cliente_bp.route('/<int:cliente_id>', methods=['GET'])
def obtener_cliente(cliente_id):
    """
    Endpoint para obtener los datos de un cliente por su ID
    
    Args:
        cliente_id (int): ID del cliente a consultar
        
    Returns:
        JSON: Datos del cliente
        Status: 200 si existe, 404 si no se encuentra
    """
    try:
        cliente = ClienteRepository.get_by_id(cliente_id)
        
        if not cliente:
            return jsonify({'error': 'Cliente no encontrado'}), 404
        
        return jsonify({
            'id': cliente.id,
            'nombre': cliente.nombre,
            'email': cliente.email,
            'telefono': cliente.telefono,
            'es_miembro': cliente.es_miembro,
            'fecha_registro': cliente.fecha_registro.isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cliente_bp.route('/<int:cliente_id>', methods=['PUT'])
def actualizar_cliente(cliente_id):
    """
    Endpoint para actualizar datos de un cliente
    """
    # Implementación similar usando ClienteHelper y ClienteRepository
    pass

@cliente_bp.route('/<int:cliente_id>', methods=['DELETE'])
def eliminar_cliente(cliente_id):
    """
    Endpoint para eliminar un cliente
    """
    # Implementación similar usando ClienteRepository
    pass
