import { useState, FormEvent } from "react";
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { login } from "../../helpers/apiHelper"; // Asegúrate de que esta ruta sea correcta

export default function Login() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false); // Para el toggle de contraseña

  const validateUsername = (value: string) => {
    return value.length > 0; // Comprobación simple: el nombre de usuario no debe estar vacío
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const isUsernameValid = validateUsername(username);
    if (!isUsernameValid) {
      setUsernameError(true);
      return;
    } else {
      setUsernameError(false);
    }

    const isPasswordValid = password.length > 0; // Validación simple para la contraseña
    if (!isPasswordValid) {
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    // Usa la función helper para el login
    try {
      const data = await login(username, password);
      console.log(data);
      onOpen(); // Abre el modal al iniciar sesión con éxito

      setTimeout(() => {
        navigate("/Home", { state: { username, token: data.access_token } }); // Navega después de que se muestre el modal
      }, 2000); // Navega después de 2 segundos
    } catch (error) {
      setApiError("Error durante el inicio de sesión"); // Manejo simple del error
    }
  };

  const toggleVisibility = (): void => setIsVisible(!isVisible);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cimico">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src="/cimico-logotipo-azul.png" className="h-9" alt="Logo" />
        </div>
        {apiError && <div className="text-red-500 mb-4">{apiError}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Nombre de Usuario"
            type="text"
            placeholder="Introduce tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            isInvalid={usernameError}
            color={usernameError ? "danger" : "default"} // Cambiado a "danger"
            errorMessage={usernameError ? "Por favor, introduce un nombre de usuario válido" : ""}
            className="w-full"
          />
          <Input
            label="Contraseña"
            variant="bordered"
            placeholder="Introduce tu contraseña"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="alternar visibilidad de la contraseña"
              >
                {isVisible ? (
                  <EyeSlashIcon className="w-6 h-6 text-default-400" />
                ) : (
                  <EyeIcon className="w-6 h-6 text-default-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            isInvalid={passwordError}
            color={passwordError ? "danger" : "default"} // Cambiado a "danger"
            className="w-full"
          />
          <Button type="submit" className="w-full bg-botonColor text-white">
            Iniciar Sesión
          </Button>
        </form>

        {/* Modal de éxito */}
        <Modal isOpen={isOpen} onOpenChange={onClose}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">¡Inicio de Sesión Exitoso!</ModalHeader>
            <ModalBody>
              <p>Has iniciado sesión correctamente. Redirigiendo a la página de inicio...</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
