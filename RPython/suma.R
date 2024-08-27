sumar_dos_numeros <- function(a, b) {
  resultado <- a + b
  return(resultado)
}
# Obtener los argumentos de línea de comando
args <- commandArgs(trailingOnly = TRUE)

# Verificar que hay al menos dos argumentos
if (length(args) < 2) {
  stop("Se requieren dos argumentos")
}

# Convertir los argumentos a números
num1 <- as.numeric(args[1])
num2 <- as.numeric(args[2])

# Llamar a la función y obtener el resultado
resultado <- sumar_dos_numeros(num1, num2)

# Imprimir el resultado (esto será capturado por Node.js)
cat(resultado)