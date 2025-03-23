# config/database.py
from flask_sqlalchemy import SQLAlchemy

# Crea la instancia de SQLAlchemy
db = SQLAlchemy()

# (Opcional) Configuración básica si no tienes un archivo config aparte
# Aunque recomendable tenerla en config.py o similar
def init_database(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/cine_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)