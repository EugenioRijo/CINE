from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models.user import User
from models.membership import Membership
from database import db

membership_bp = Blueprint('membership', __name__)

@membership_bp.route('/api/membership/status', methods=['GET'])
def get_membership_status():
    # Obtener el ID del usuario del token (asumiendo que tienes middleware de autenticación)
    current_user_id = request.headers.get('user-id')  # O como obtengas el ID del usuario
    
    if not current_user_id:
        return jsonify({
            'success': False,
            'message': 'Usuario no autenticado'
        }), 401

    # Buscar la membresía activa del usuario
    now = datetime.utcnow()
    membership = Membership.query.filter_by(cliente_id=current_user_id).first()

    if not membership:
        return jsonify({
            'success': True,
            'isActive': False,
            'type': None,
            'expirationDate': None
        })

    # Verificar si la membresía ha expirado
    if membership.fecha_expiracion and membership.fecha_expiracion < now:
        membership.esta_activa = False
        db.session.commit()
        return jsonify({
            'success': True,
            'isActive': False,
            'type': None,
            'expirationDate': None
        })

    return jsonify({
        'success': True,
        'isActive': membership.esta_activa,
        'type': membership.tipo,
        'expirationDate': membership.fecha_expiracion.isoformat() if membership.fecha_expiracion else None
    })

@membership_bp.route('/api/membership/status', methods=['GET'])
@jwt_required()
def get_membership_status_jwt():
    current_user_id = get_jwt_identity()
    
    try:
        membership = Membership.query.filter_by(cliente_id=current_user_id).first()
        
        if not membership:
            return jsonify({
                'isMember': False,
                'membershipType': 'none',
                'expiryDate': None
            })
        
        # Verificar si la membresía ha expirado
        now = datetime.utcnow()
        if membership.fecha_expiracion and membership.fecha_expiracion < now:
            return jsonify({
                'isMember': False,
                'membershipType': 'none',
                'expiryDate': None
            })
        
        return jsonify({
            'isMember': True,
            'membershipType': membership.tipo,
            'expiryDate': membership.fecha_expiracion.isoformat() if membership.fecha_expiracion else None
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Error al obtener el estado de la membresía',
            'details': str(e)
        }), 500 