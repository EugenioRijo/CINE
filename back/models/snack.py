from config.database import db

class Snack(db.Model):
    __tablename__ = 'snacks'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    precio = db.Column(db.Numeric(10, 2))
    categoria = db.Column(db.String(50))
    estado = db.Column(db.String(20))
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    ventas = db.relationship('VentaSnack', back_populates='snack', cascade='all, delete-orphan', lazy=True)