import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime

class Cine:
    def __init__(self):
        self.cartelera = [
            {"id": 1, "pelicula": "Avengers", "horario": "10:00", "precio": 5.50},
            {"id": 2, "pelicula": "Jurassic World", "horario": "13:00", "precio": 6.00},
            {"id": 3, "pelicula": "Spiderman", "horario": "16:00", "precio": 7.50}
        ]
        
        self.carameleria = [
            {"id": 1, "producto": "Palomitas Grandes", "precio": 4.50},
            {"id": 2, "producto": "Refresco 1L", "precio": 3.00},
            {"id": 3, "producto": "Chocolates", "precio": 2.50}
        ]
        
        self.carrito = []
        self.total = 0.0

    def mostrar_cartelera(self):
        print("\n--- Cartelera del Cine ---")
        for pelicula in self.cartelera:
            print(f"{pelicula['id']}. {pelicula['pelicula']} - {pelicula['horario']} - ${pelicula['precio']}")

    def mostrar_carameleria(self):
        print("\n--- Carameleria ---")
        for producto in self.carameleria:
            print(f"{producto['id']}. {producto['producto']} - ${producto['precio']}")

    def agregar_boletos(self):
        self.mostrar_cartelera()
        try:
            opcion = int(input("\nSeleccione una película (número): "))
            cantidad = int(input("Cantidad de boletos: "))
            
            pelicula = next((p for p in self.cartelera if p['id'] == opcion), None)
            if pelicula:
                self.carrito.append({
                    "tipo": "Boleto",
                    "descripcion": f"{pelicula['pelicula']} - {pelicula['horario']}",
                    "cantidad": cantidad,
                    "precio": pelicula['precio']
                })
                self.total += pelicula['precio'] * cantidad
                print("¡Boletos agregados!")
            else:
                print("Opción inválida")
        except ValueError:
            print("Entrada inválida")

    def agregar_snacks(self):
        self.mostrar_carameleria()
        try:
            opcion = int(input("\nSeleccione un producto (número): "))
            cantidad = int(input("Cantidad: "))
            
            producto = next((p for p in self.carameleria if p['id'] == opcion), None)
            if producto:
                self.carrito.append({
                    "tipo": "Snack",
                    "descripcion": producto['producto'],
                    "cantidad": cantidad,
                    "precio": producto['precio']
                })
                self.total += producto['precio'] * cantidad
                print("¡Producto agregado!")
            else:
                print("Opción inválida")
        except ValueError:
            print("Entrada inválida")

    def generar_ticket(self):
        ticket = []
        ticket.append("\n--- Ticket de Compra ---")
        ticket.append(f"Fecha: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        for item in self.carrito:
            ticket.append(f"{item['tipo']}: {item['descripcion']}")
            ticket.append(f"Cantidad: {item['cantidad']} - Precio unitario: ${item['precio']:.2f}")
            ticket.append(f"Subtotal: ${item['cantidad'] * item['precio']:.2f}\n")
        
        ticket.append(f"TOTAL A PAGAR: ${self.total:.2f}")
        return "\n".join(ticket)

    def enviar_correo(self, destinatario):
        # Configuración con tus credenciales
        remitente = "planetcinemavzla@gmail.com"
        password = "iavr ughc dtjk lswf"  # Contraseña de aplicación
        
        mensaje = MIMEMultipart()
        mensaje['From'] = remitente
        mensaje['To'] = destinatario
        mensaje['Subject'] = "Tu ticket de compra - Planet Cinema Vzla"
        
        cuerpo = self.generar_ticket()
        mensaje.attach(MIMEText(cuerpo, 'plain'))
        
        try:
            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()
                server.login(remitente, password)
                server.sendmail(remitente, destinatario, mensaje.as_string())
            print("\n¡Ticket enviado a tu correo electrónico!")
        except Exception as e:
            print(f"Error al enviar el correo: {str(e)}")
            
def main():
    cine = Cine()
    
    while True:
        print("\n1. Comprar boletos")
        print("2. Ir a la carameleria")
        print("3. Finalizar compra")
        print("4. Salir")
        
        opcion = input("Seleccione una opción: ")
        
        if opcion == "1":
            cine.agregar_boletos()
        elif opcion == "2":
            cine.agregar_snacks()
        elif opcion == "3":
            if not cine.carrito:
                print("El carrito está vacío")
                continue
            
            print(cine.generar_ticket())
            confirmacion = input("\n¿Confirmar compra? (S/N): ").lower()
            
            if confirmacion == "s":
                email = input("Ingrese su correo electrónico: ")
                cine.enviar_correo(email)
                cine.carrito = []
                cine.total = 0.0
        elif opcion == "4":
            break
        else:
            print("Opción inválida")

if __name__ == "__main__":
    main()