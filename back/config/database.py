"""
Configuración de la base de datos
Este módulo inicializa la conexión con la base de datos utilizando SQLAlchemy.

Áreas de mejora potenciales:
- Implementar pool de conexiones
- Agregar eventos de base de datos (before_commit, after_commit, etc.)
- Implementar sistema de migraciones (Alembic)
- Agregar funciones helper para transacciones
- Implementar cache de consultas frecuentes
"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy() 