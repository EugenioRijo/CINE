from flask import Blueprint, jsonify
from datetime import datetime

bcv_bp = Blueprint('bcv', __name__)

@bcv_bp.route('/api/bcv/current-rate', methods=['GET'])
def get_current_rate():
    """Endpoint principal para obtener la tasa actual del BCV"""
    return jsonify({
        'rate': 70.00,  # Tasa por defecto
        'lastUpdate': datetime.now().isoformat()
    })

@bcv_bp.route('/api/bcv/rate', methods=['GET'])
def get_backup_rate():
    """Endpoint de respaldo"""
    return jsonify({
        'rate': 70.00,
        'lastUpdate': datetime.now().isoformat()
    }) 