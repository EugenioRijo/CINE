from config.database import db

class Reserva(db.Model):
    __tablename__ = 'reservas'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    funcion_id = db.Column(db.Integer, db.ForeignKey('funciones.id'), nullable=False)
    fecha_reserva = db.Column(db.DateTime, server_default=db.func.now())
    estado = db.Column(db.String(20))
    codigo_reserva = db.Column(db.String(20), unique=True)
    total = db.Column(db.Numeric(10, 2))
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    cliente = db.relationship('Cliente', back_populates='reservas')
    funcion = db.relationship('Funcion', back_populates='reservas')
    detalles = db.relationship('DetalleReserva', back_populates='reserva', cascade='all, delete-orphan', lazy=True)
    ventas_snacks = db.relationship('VentaSnack', back_populates='reserva', cascade='all, delete-orphan', lazy=True)