from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from email_service import CineEmailSender  # Asegúrate de que la importación sea correcta
import json
email_bp = Blueprint('email', __name__)

@email_bp.route('/send-invoice', methods=['POST'])
@jwt_required()
def send_invoice():
    try:
        data = request.get_json()
        
        # Validación mejorada
        if not data:
            return jsonify({"error": "Se requiere cuerpo JSON"}), 400
            
        if 'paymentData' not in data:
            return jsonify({"error": "Campo 'paymentData' faltante"}), 422
            
        payment_data = data['paymentData']
        
        # Validar estructura básica
        required_sections = ['cliente', 'pelicula', 'asientos', 'productos', 'financiero']
        for section in required_sections:
            if section not in payment_data:
                return jsonify({
                    "error": f"Sección '{section}' faltante en paymentData",
                    "estructura_requerida": {
                        "cliente": {"nombre", "email"},
                        "pelicula": {"titulo", "sala", "horario", "idioma"},
                        "asientos": [{"fila", "numero", "tipo"}],
                        "productos": [{"nombre", "precio_unitario", "cantidad"}],
                        "financiero": {"total", "totalBs"}
                    }
                }), 422
        
        # Validar tipos de datos
        try:
            total = float(payment_data['financiero']['total'])
            totalBs = float(payment_data['financiero']['totalBs'])
        except (ValueError, KeyError):
            return jsonify({"error": "Valores financieros inválidos"}), 422
            
        # Validar email
        if '@' not in payment_data['cliente']['email']:
            return jsonify({"error": "Formato de email inválido"}), 422
            
        # Enviar correo
        email_sender = CineEmailSender()
        success, message = email_sender.enviar_factura(json.dumps(payment_data))
        
        if success:
            return jsonify({"message": "Factura enviada exitosamente"}), 200
        return jsonify({"error": message}), 500
        
    except Exception as e:
        return jsonify({
            "error": "Error interno del servidor",
            "detalle": str(e)
        }), 500