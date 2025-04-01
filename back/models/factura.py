from config.database import db
from datetime import datetime
import json
import secrets

class Factura(db.Model):
    __tablename__ = 'facturas'
    
    id = db.Column(db.Integer, primary_key=True)
    codigo_reserva = db.Column(db.String(8), unique=True, nullable=False)
    cliente_cedula = db.Column(db.String(15), db.ForeignKey('clientes.cedula'), nullable=False)
    
    # Sección Película
    titulo_pelicula = db.Column(db.String(200), nullable=False)
    horario_funcion = db.Column(db.String(50), nullable=False)  # Nuevo campo
    sala = db.Column(db.String(50), nullable=False)
    idioma = db.Column(db.String(50), nullable=False)
    
    # Sección Asientos
    asientos = db.Column(db.JSON, nullable=False)
    
    # Sección Productos
    productos = db.Column(db.JSON, nullable=False)  # Unifica snacks y combos
    
    # Datos Financieros
    subtotal_entradas = db.Column(db.Numeric(10, 2), nullable=False)
    subtotal_productos = db.Column(db.Numeric(10, 2), nullable=False)
    total_usd = db.Column(db.Numeric(10, 2), nullable=False)
    total_bs = db.Column(db.Numeric(10, 2), nullable=False)
    tasa_bcv = db.Column(db.Numeric(10, 2), nullable=False)
    metodo_pago = db.Column(db.String(50), nullable=False)
    
    # Auditoría
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    version = db.Column(db.String(10), default='1.0')
    
    # Relación
    cliente = db.relationship('Cliente', back_populates='facturas')

    def __repr__(self):
        return f'<Factura {self.codigo_reserva} - {self.cliente_cedula}>'

    @classmethod
    def from_json_data(cls, json_data: dict, cliente: 'Cliente'):
        # Mapeo de valores
        room_mapping = {
            'sala-standard-1': 'Sala Standard',
            'sala-3d': 'Sala 3D',
            'sala-4dx': 'Sala 4DX',
            'sala-screenx': 'Sala ScreenX',
            'sala-vip': 'Sala VIP',
            'sala-imax': 'Sala IMAX'
        }
        
        # Generar código de reserva único
        codigo = secrets.token_urlsafe(6)[:8].upper()
        
        return cls(
            codigo_reserva=codigo,
            cliente_cedula=cliente.cedula,
            titulo_pelicula=json_data['pelicula']['titulo'],
            horario_funcion=json_data['pelicula']['horario'],
            sala=room_mapping.get(json_data['pelicula']['sala'], json_data['pelicula']['sala']),
            idioma='Español Latino' if json_data['pelicula']['idioma'] == 'esp' else 'Subtitulada',
            asientos=json_data['asientos'],
            productos=json_data['productos'],
            subtotal_entradas=json_data['financiero']['subtotal_entradas'],
            subtotal_productos=json_data['financiero']['subtotal_snacks'],
            total_usd=json_data['financiero']['total'],
            total_bs=json_data['financiero']['totalBs'],
            tasa_bcv=json_data['financiero']['tasa_bcv'],
            metodo_pago=json_data['financiero']['metodo_pago'].capitalize(),
            version='1.0'
        )
    
    def to_dict(self):
        return {
            'metadata': {
                'codigo_reserva': self.codigo_reserva,
                'version': self.version,
                'fecha': self.created_at.isoformat()
            },
            'cliente': {
                'cedula': self.cliente_cedula,
                'nombre': self.cliente.nombre,
                'email': self.cliente.email
            },
            'pelicula': {
                'titulo': self.titulo_pelicula,
                'horario': self.horario_funcion,
                'sala': self.sala,
                'idioma': self.idioma
            },
            'asientos': self.asientos,
            'productos': self.productos,
            'financiero': {
                'subtotal_entradas': float(self.subtotal_entradas),
                'subtotal_productos': float(self.subtotal_productos),
                'total_usd': float(self.total_usd),
                'total_bs': float(self.total_bs),
                'tasa_bcv': float(self.tasa_bcv),
                'metodo_pago': self.metodo_pago
            }
        }