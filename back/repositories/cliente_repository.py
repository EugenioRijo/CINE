"""
Repositorio de Cliente
Implementa el patrón repositorio para la tabla Cliente
"""

from models.cliente import Cliente
from config.database import db

class ClienteRepository:
    """
    Repositorio que maneja operaciones CRUD para Clientes
    """
    
    @staticmethod
    def get_all():
        """Obtiene todos los clientes"""
        return Cliente.query.all()
    
    @staticmethod
    def get_by_id(id):
        """Obtiene un cliente por su ID"""
        return Cliente.query.get(id)
    
    @staticmethod
    def get_by_email(email):
        """Obtiene un cliente por su email"""
        return Cliente.query.filter_by(email=email).first()
    
    @staticmethod
    def create(nombre, email, password, telefono=None, es_miembro=False):
        """
        Crea un nuevo cliente
        
        Args:
            nombre (str): Nombre completo
            email (str): Email único
            password (str): Contraseña hasheada
            telefono (str, optional): Número de contacto
            es_miembro (bool, optional): Estado de membresía
        """
        cliente = Cliente(
            nombre=nombre,
            email=email,
            password=password,
            telefono=telefono,
            es_miembro=es_miembro
        )
        db.session.add(cliente)
        db.session.commit()
        return cliente
    
    @staticmethod
    def update(cliente, data):
        """
        Actualiza un cliente existente
        
        Args:
            cliente (Cliente): Instancia a actualizar
            data (dict): Campos a modificar
        """
        for key, value in data.items():
            setattr(cliente, key, value)
        db.session.commit()
        return cliente
    
    @staticmethod
    def delete(cliente):
        """Elimina un cliente"""
        db.session.delete(cliente)
        db.session.commit()