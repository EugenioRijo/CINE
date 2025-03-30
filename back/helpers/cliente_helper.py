"""
Helper de Cliente
Contiene la lógica de negocio para clientes
"""

from repositories.cliente_repository import ClienteRepository
from werkzeug.security import generate_password_hash

class ClienteHelper:
    """
    Capa de lógica de negocio para operaciones con clientes
    """
    
    @staticmethod
    def registrar_cliente(nombre, email, password, telefono=None, es_miembro=False):
        """
        Registra un nuevo cliente
        
        Args:
            nombre (str): Nombre completo
            email (str): Email válido
            password (str): Contraseña en texto plano
            telefono (str, optional): Teléfono de contacto
            es_miembro (bool): Estado de membresía
        
        Returns:
            tuple: (Cliente, error)
        """
        if ClienteRepository.get_by_email(email):
            return None, "El email ya está registrado"
        
        try:
            hashed_password = generate_password_hash(password)
            cliente = ClienteRepository.create(
                nombre=nombre,
                email=email,
                password=hashed_password,
                telefono=telefono,
                es_miembro=es_miembro
            )
            return cliente, None
        except Exception as e:
            return None, f"Error al crear cliente: {str(e)}"
    
    @staticmethod
    def actualizar_cliente(cliente_id, data):
        """
        Actualiza los datos de un cliente
        
        Args:
            cliente_id (int): ID del cliente
            data (dict): Campos a actualizar
            
        Returns:
            tuple: (Cliente actualizado, error)
        """
        cliente = ClienteRepository.get_by_id(cliente_id)
        if not cliente:
            return None, "Cliente no encontrado"
        
        try:
            if 'password' in data:
                data['password'] = generate_password_hash(data['password'])
            
            return ClienteRepository.update(cliente, data), None
        except Exception as e:
            return None, f"Error al actualizar cliente: {str(e)}"