from config.database import db

class VentaSnack(db.Model):
    __tablename__ = 'ventas_snacks'
    
    id = db.Column(db.Integer, primary_key=True)
    reserva_id = db.Column(db.Integer, db.ForeignKey('reservas.id'), nullable=False)
    snack_id = db.Column(db.Integer, db.ForeignKey('snacks.id'), nullable=False)
    cantidad = db.Column(db.Integer)
    precio_unitario = db.Column(db.Numeric(10, 2))
    total = db.Column(db.Numeric(10, 2))
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    reserva = db.relationship('Reserva', back_populates='ventas_snacks')
    snack = db.relationship('Snack', back_populates='ventas')