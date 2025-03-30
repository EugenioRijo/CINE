from config.database import db
from datetime import datetime

class DetalleReserva(db.Model):
    __tablename__ = 'detalles_reserva'
    
    id = db.Column(db.Integer, primary_key=True)
    reserva_id = db.Column(db.Integer, db.ForeignKey('reservas.id'), nullable=False)
    snack_id = db.Column(db.Integer, db.ForeignKey('snacks.id'))
    cantidad = db.Column(db.Integer, default=1)
    precio_unitario = db.Column(db.Numeric(10,2))
    tipo_entrada = db.Column(db.String(20))  # General/VIP/3D
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())
    
    # Relaciones
    reserva = db.relationship('Reserva', back_populates='detalles')
    snack = db.relationship('Snack')

    def __repr__(self):
        return f'<Detalle {self.id} - Reserva {self.reserva_id}>'
