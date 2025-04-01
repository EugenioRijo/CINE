# email_service.py
import smtplib
import json
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from typing import Tuple

class CineEmailSender:
    def __init__(self):
        # Configuración desde variables de entorno
        self.SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
        self.EMAIL_USER = os.getenv('EMAIL_USER', 'planetcinemavzla@gmail.com')
        self.EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', 'iavr ughc dtjk lswf')
        
        # Template HTML mejorado
        self.HTML_TEMPLATE = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                :root {{ --color-primario: #2c3e50; --color-secundario: #3498db; }}
                .invoice-box {{ 
                    max-width: 800px; 
                    margin: 2rem auto; 
                    padding: 2rem; 
                    border: 1px solid #eee;
                    font-family: 'Arial', sans-serif;
                }}
                .header {{ 
                    text-align: center; 
                    border-bottom: 2px solid var(--color-primario);
                    margin-bottom: 2rem;
                }}
                table {{ 
                    width: 100%; 
                    border-collapse: collapse;
                    margin: 1rem 0;
                }}
                th, td {{ 
                    padding: 12px; 
                    text-align: left; 
                    border-bottom: 1px solid #ddd;
                }}
                .total {{ 
                    font-size: 1.2em; 
                    color: var(--color-secundario);
                    margin-top: 1.5rem;
                    text-align: right;
                }}
                .footer {{ 
                    margin-top: 2rem;
                    text-align: center;
                    color: #666;
                }}
            </style>
        </head>
        <body>
            <div class="invoice-box">
                <div class="header">
                    <h1>🎬 Planet Cinema Vzla</h1>
                    <h2>Factura {fecha}</h2>
                </div>
                
                <div class="cliente-info">
                    <h3>👤 {nombre}</h3>
                    <p>📧 {email}</p>
                </div>
                
                <div class="pelicula-info">
                    <h4>🎥 {pelicula}</h4>
                    <p>📍 {sala} - 🕒 {horario} - 🗣️ {idioma}</p>
                </div>
                
                <div class="asientos-section">
                    <h4>💺 Asientos:</h4>
                    <ul>{asientos}</ul>
                </div>
                
                <div class="productos-section">
                    <h4>🍿 Productos:</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>P. Unitario</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos}
                        </tbody>
                    </table>
                </div>
                
                <div class="total">
                    <p>💰 Total USD: ${total_usd}</p>
                    <p>💰 Total Bs: {total_bs} Bs</p>
                </div>
                
                <div class="footer">
                    <p>Gracias por su compra 🎉</p>
                    <p>Presente este correo en taquilla para canjear sus entradas</p>
                </div>
            </div>
        </body>
        </html>
        """

    def _validar_datos(self, data: dict) -> None:
        """Valida la estructura de los datos requeridos"""
        required_fields = {
            'cliente': ['nombre', 'email'],
            'pelicula': ['titulo', 'sala', 'horario', 'idioma'],
            'asientos': [],
            'productos': [],
            'financiero': ['total', 'totalBs']
        }
        
        for section, fields in required_fields.items():
            if section not in data:
                raise ValueError(f"Sección faltante: {section}")
            for field in fields:
                if field not in data[section]:
                    raise ValueError(f"Campo faltante: {section}.{field}")

    def _generar_html(self, data: dict) -> str:
        """Genera el contenido HTML desde el JSON"""
        self._validar_datos(data)
        
        fecha = datetime.now().strftime('%d/%m/%Y %H:%M')
        
        # Procesar asientos
        asientos = "".join(
            f"<li>Fila {a['fila']} - Asiento {a['numero']} ({', '.join(a['tipo'])})</li>"
            for a in data['asientos']
        )
        
        # Procesar productos
        productos = "".join(
            f"<tr><td>{p['nombre']}</td>"
            f"<td>{p['cantidad']}</td>"
            f"<td>${p['precio_unitario']:.2f}</td>"
            f"<td>${p['precio_unitario'] * p['cantidad']:.2f}</td></tr>"
            for p in data['productos']
        )
        
        return self.HTML_TEMPLATE.format(
            fecha=fecha,
            nombre=data['cliente']['nombre'],
            email=data['cliente']['email'],
            pelicula=data['pelicula']['titulo'],
            sala=data['pelicula']['sala'],
            horario=data['pelicula']['horario'],
            idioma=data['pelicula']['idioma'],
            asientos=asientos,
            productos=productos,
            total_usd=f"{data['financiero']['total']:.2f}",
            total_bs=f"{data['financiero']['totalBs']:.2f}"
        )

    def enviar_factura(self, json_data: str) -> Tuple[bool, str]:
        """Envía la factura por correo electrónico"""
        try:
            data = json.loads(json_data)
            
            # Validar y obtener email
            if 'cliente' not in data or 'email' not in data['cliente']:
                return False, "Email del cliente no encontrado"
                
            destinatario = data['cliente']['email']
            
            # Configurar mensaje
            mensaje = MIMEMultipart()
            mensaje['From'] = self.EMAIL_USER
            mensaje['To'] = destinatario
            mensaje['Subject'] = f"🎟️ Factura Cine - {data['pelicula']['titulo']}"
            
            # Generar y adjuntar HTML
            html_content = self._generar_html(data)
            mensaje.attach(MIMEText(html_content, 'html'))
            
            # Enviar correo con manejo de errores SMTP
            with smtplib.SMTP(self.SMTP_SERVER, self.SMTP_PORT, timeout=10) as server:
                server.starttls()
                
                try:
                    server.login(self.EMAIL_USER, self.EMAIL_PASSWORD)
                except smtplib.SMTPAuthenticationError:
                    return False, "Error de autenticación en el servidor SMTP"
                
                server.sendmail(self.EMAIL_USER, destinatario, mensaje.as_string())
            
            return True, "Correo enviado exitosamente"
            
        except json.JSONDecodeError:
            return False, "Formato JSON inválido"
        except ValueError as ve:
            return False, f"Datos incompletos: {str(ve)}"
        except smtplib.SMTPException as se:
            return False, f"Error SMTP: {str(se)}"
        except Exception as e:
            return False, f"Error inesperado: {str(e)}"

if __name__ == "__main__":
    # Ejemplo de uso con datos de prueba
    ejemplo_data = {
        "cliente": {
            "nombre": "María González",
            "email": "correo_destino@example.com"
        },
        "pelicula": {
            "titulo": "Avengers: Endgame",
            "sala": "Sala IMAX",
            "horario": "18:00",
            "idioma": "Español Latino"
        },
        "asientos": [
            {"fila": "A", "numero": 5, "tipo": ["Reclinable", "VIP"]}
        ],
        "productos": [
            {"nombre": "Combo Mega", "precio_unitario": 10.00, "cantidad": 2},
            {"nombre": "Agua Mineral", "precio_unitario": 1.50, "cantidad": 3}
        ],
        "financiero": {
            "total": 45.50,
            "totalBs": 387.25
        }
    }
    
    sender = CineEmailSender()
    resultado, mensaje = sender.enviar_factura(json.dumps(ejemplo_data))
    print(f"Resultado: {resultado} - Mensaje: {mensaje}")