from flask import Blueprint, request, jsonify
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
from datetime import datetime

payment_bp = Blueprint('payment_bp', __name__)

def create_invoice_html(payment_data):
    """Crea el HTML de la factura"""
    return f"""
    <html>
        <body>
            <h1>Planet Cinema - Factura Digital</h1>
            <h2>Detalles de la transacción</h2>
            
            <h3>Información del Cliente</h3>
            <p>Nombre: {payment_data['cliente']['nombre']}</p>
            <p>Email: {payment_data['cliente']['email']}</p>
            <p>Cédula: {payment_data['cliente']['cedula']}</p>
            
            <h3>Detalles de la función</h3>
            <p>Película: {payment_data['pelicula']['titulo']}</p>
            <p>Horario: {payment_data['pelicula']['horario']}</p>
            <p>Sala: {payment_data['pelicula']['sala']}</p>
            
            <h3>Asientos seleccionados</h3>
            <ul>
                {''.join([f"<li>{seat['fila']}{seat['numero']}</li>" for seat in payment_data['asientos']])}
            </ul>
            
            <h3>Productos adquiridos</h3>
            <table border="1">
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario (USD)</th>
                    <th>Total (USD)</th>
                </tr>
                {''.join([
                    f"<tr><td>{p['nombre']}</td><td>{p['cantidad']}</td><td>${p['precio_unitario']}</td><td>${p['precio_unitario'] * p['cantidad']}</td></tr>" 
                    for p in payment_data['productos']
                ])}
            </table>
            
            <h3>Resumen Financiero</h3>
            <p>Subtotal Entradas: ${payment_data['financiero']['subtotal_entradas']}</p>
            <p>Subtotal Snacks: ${payment_data['financiero']['subtotal_snacks']}</p>
            <p>Total USD: ${payment_data['financiero']['total']}</p>
            <p>Total Bs: {payment_data['financiero']['totalBs']} Bs</p>
            <p>Tasa BCV: {payment_data['financiero']['tasa_bcv']}</p>
            <p>Método de Pago: {payment_data['financiero']['metodo_pago']}</p>
            
            <p>Fecha de emisión: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </body>
    </html>
    """

def send_email(to_email, payment_data):
    """Envía el correo con la factura"""
    remitente = "planetcinemavzla@gmail.com"
    password = "iavr ughc dtjk lswf"  # Contraseña de aplicación

    # Crear mensaje
    mensaje = MIMEMultipart("alternative")
    mensaje["Subject"] = f"Factura Planet Cinema - {payment_data['pelicula']['titulo']}"
    mensaje["From"] = remitente
    mensaje["To"] = to_email

    # Versión texto plano
    text = f"""Factura Planet Cinema\n\nGracias por su compra {payment_data['cliente']['nombre']}."""

    # Versión HTML
    html = create_invoice_html(payment_data)

    # Adjuntar ambas versiones
    mensaje.attach(MIMEText(text, "plain"))
    mensaje.attach(MIMEText(html, "html"))

    # Enviar correo
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(remitente, password)
        server.sendmail(remitente, to_email, mensaje.as_string())

@payment_bp.route('/process', methods=['POST'])
def process_payment():
    try:
        data = request.get_json()
        
        # Validación básica
        required_fields = ['cliente', 'pelicula', 'asientos', 'productos', 'financiero']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Estructura de datos incompleta"}), 400
        
        # Enviar factura por correo
        send_email(data['cliente']['email'], data)
        
        # Aquí deberías guardar en la base de datos
        # ...
        
        return jsonify({
            "message": "Pago procesado y factura enviada exitosamente",
            "transaction_data": {
                "total_usd": data['financiero']['total'],
                "total_bs": data['financiero']['totalBs'],
                "transaction_date": datetime.now().isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500