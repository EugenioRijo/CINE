from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.factura import Factura
from models.cliente import Cliente
from config.database import db
import secrets
import string

# Configurar Blueprint
facturas_bp = Blueprint('facturas', __name__, url_prefix='/api/facturas')

def generar_codigo_unico():
    """Genera un código de reserva único de 8 caracteres"""
    caracteres = string.ascii_uppercase + string.digits
    # Eliminar caracteres ambiguos
    caracteres = caracteres.translate({ord(c): None for c in '0O1I'})
    
    while True:
        codigo = ''.join(secrets.choice(caracteres) for _ in range(8))
        if not Factura.query.filter_by(codigo_reserva=codigo).first():
            return codigo

@facturas_bp.route('', methods=['POST'])
@jwt_required()
def crear_factura():
    try:
        # Obtener cliente desde JWT
        cliente_cedula = get_jwt_identity()
        cliente = Cliente.query.get(cliente_cedula)
        
        if not cliente:
            return jsonify({'error': 'Usuario no registrado'}), 404

        # Validar datos recibidos
        data = request.get_json()
        if not data or 'payment_data' not in data:
            return jsonify({'error': 'Datos de compra requeridos'}), 400
            
        payment_data = data['payment_data']
        
        # Campos obligatorios
        campos_requeridos = [
            'movieTitle', 'selectedRoom', 'selectedLanguage',
            'selectedSeats', 'ticketPrice', 'totalPrice', 'bcvRate'
        ]
        
        if not all(key in payment_data for key in campos_requeridos):
            return jsonify({
                'error': 'Datos incompletos',
                'campos_faltantes': [key for key in campos_requeridos if key not in payment_data]
            }), 400

        # Crear nueva factura
        nueva_factura = Factura(
            cliente_cedula=cliente_cedula,
            cliente_nombre=cliente.nombre,
            cliente_email=cliente.email,
            titulo_pelicula=payment_data['movieTitle'],
            sala=payment_data['selectedRoom'],
            idioma=payment_data['selectedLanguage'],
            asientos=payment_data['selectedSeats'],
            metodo_pago=payment_data.get('selectedPayment', 'efectivo'),
            subtotal_entradas=payment_data['ticketPrice']['total'],
            subtotal_snacks=payment_data['totalPrice']['productsTotal'],
            total_usd=payment_data['totalPrice']['total'],
            total_bs=payment_data['totalPrice']['totalBs'],
            tasa_bcv=payment_data['bcvRate'],
            snacks=payment_data.get('selectedProducts', []),
            combos=payment_data.get('selectedCombos', []),
            codigo_reserva=generar_codigo_unico()
        )

        db.session.add(nueva_factura)
        db.session.commit()

        return jsonify({
            'success': True,
            'codigo_reserva': nueva_factura.codigo_reserva,
            'detalles': {
                'pelicula': nueva_factura.titulo_pelicula,
                'sala': nueva_factura.sala,
                'total': nueva_factura.total_usd,
                'fecha': nueva_factura.created_at.isoformat()
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error al procesar factura: {str(e)}")
        return jsonify({'error': 'Error interno al procesar la compra'}), 500

@facturas_bp.route('/<codigo>', methods=['GET'])
@jwt_required()
def obtener_factura(codigo):
    try:
        cliente_cedula = get_jwt_identity()
        
        factura = Factura.query.filter_by(
            codigo_reserva=codigo,
            cliente_cedula=cliente_cedula
        ).first()

        if not factura:
            return jsonify({'error': 'Factura no encontrada'}), 404

        return jsonify({
            'codigo': factura.codigo_reserva,
            'pelicula': factura.titulo_pelicula,
            'sala': factura.sala,
            'asientos': factura.asientos,
            'total_usd': factura.total_usd,
            'metodo_pago': factura.metodo_pago,
            'fecha': factura.created_at.isoformat()
        }), 200

    except Exception as e:
        print(f"Error al obtener factura: {str(e)}")
        return jsonify({'error': 'Error al recuperar factura'}), 500