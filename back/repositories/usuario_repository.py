"""
Repositorio de Usuario
Implementa el patrón repositorio para encapsular la lógica de acceso a datos del Usuario.

Áreas de mejora potenciales:
- Implementar paginación
- Agregar búsqueda avanzada y filtros
- Implementar cache de consultas
- Agregar ordenamiento dinámico
- Implementar batch operations
- Agregar logging de operaciones
- Implementar manejo de transacciones más robusto
"""

from models.usuario import Usuario
from config.database import db

class UsuarioRepository:
    """
    Repositorio que maneja todas las operaciones de base de datos relacionadas con Usuario.
    Implementa el patrón Repository para abstraer la capa de persistencia.
    """
    
    @staticmethod
    def get_all():
        """Obtiene todos los usuarios"""
        return Usuario.query.all()
    
    @staticmethod
    def get_by_id(id):
        """Obtiene un usuario por su ID"""
        return Usuario.query.get(id)
    
    @staticmethod
    def get_by_email(email):
        """Obtiene un usuario por su email"""
        return Usuario.query.filter_by(email=email).first()
    
    @staticmethod
    def create(nombre, email, password):
        """
        Crea un nuevo usuario
        
        Args:
            nombre (str): Nombre del usuario
            email (str): Email del usuario
            password (str): Contraseña hasheada
        """
        usuario = Usuario(nombre=nombre, email=email, password=password)
        db.session.add(usuario)
        db.session.commit()
        return usuario
    
    @staticmethod
    def update(usuario, data):
        """
        Actualiza un usuario existente
        
        Args:
            usuario (Usuario): Instancia del usuario a actualizar
            data (dict): Diccionario con los campos a actualizar
        """
        for key, value in data.items():
            setattr(usuario, key, value)
        db.session.commit()
        return usuario
    
    @staticmethod
    def delete(usuario):
        """Elimina un usuario"""
        db.session.delete(usuario)
        db.session.commit() 