from config.database import db

class Promocion(db.Model):
    __tablename__ = 'promociones'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    descuento = db.Column(db.Numeric(5, 2))
    fecha_inicio = db.Column(db.Date)
    fecha_fin = db.Column(db.Date)
    codigo = db.Column(db.String(20), unique=True)
    estado = db.Column(db.String(20))
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())