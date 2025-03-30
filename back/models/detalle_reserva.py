from config.database import db

class DetalleReserva(db.Model):
    __tablename__ = 'detalles_reserva'
    
    id = db.Column(db.Integer, primary_key=True)
    reserva_id = db.Column(db.Integer, db.ForeignKey('reservas.id'), nullable=False)
    asiento_id = db.Column(db.Integer, db.ForeignKey('asientos.id'), nullable=False)
    precio = db.Column(db.Numeric(10, 2))
    tipo_entrada = db.Column(db.String(20))
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    reserva = db.relationship('Reserva', back_populates='detalles')
    asiento = db.relationship('Asiento', back_populates='detalles_reserva')