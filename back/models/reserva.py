from config.database import db
from datetime import datetime

class Reserva(db.Model):
    __tablename__ = 'reservas'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    pelicula_titulo = db.Column(db.String(200), nullable=False)
    sala_numero = db.Column(db.String(10), nullable=False)
    asiento_ubicacion = db.Column(db.String(5), nullable=False)  # Ej: "A-15"
    fecha_funcion = db.Column(db.DateTime, nullable=False)
    precio_total = db.Column(db.Numeric(10,2), nullable=False)
    codigo_reserva = db.Column(db.String(20), unique=True)
    estado = db.Column(db.String(20), default='Confirmada')
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())
    
    # Relaciones
    cliente = db.relationship('Cliente', back_populates='reservas')
    detalles = db.relationship('DetalleReserva', back_populates='reserva', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Reserva {self.codigo_reserva}>'