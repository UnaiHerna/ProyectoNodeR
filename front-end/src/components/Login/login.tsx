import { useState, FormEvent } from "react";
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { login } from "../../helpers/apiHelper"; // Make sure this path is correct

export default function Login() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false); // For toggling password visibility

  const validateUsername = (value: string) => {
    return value.length > 0; // Simple validation: username must not be empty
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

    const isPasswordValid = password.length > 0; // Simple password validation
    if (!isPasswordValid) {
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    // Use helper function for login
    try {
      const data = await login(username, password);
      console.log(data);
      onOpen(); // Open modal upon successful login

      setTimeout(() => {
        navigate("/Home", { state: { username, token: data.access_token } }); // Navigate after showing the modal
      }, 2000); // Navigate after 2 seconds
    } catch (error) {
      setApiError("Error during login"); // Simple error handling
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
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            isInvalid={usernameError}
            color={usernameError ? "danger" : "default"} // Changed to "danger"
            errorMessage={usernameError ? "Please enter a valid username" : ""}
            className="w-full"
          />
          <Input
            label="Password"
            variant="bordered"
            placeholder="Enter your password"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
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
            color={passwordError ? "danger" : "default"} // Changed to "danger"
            className="w-full"
          />
          <Button type="submit" className="w-full bg-botonColor text-white">
            Log In
          </Button>
        </form>

        {/* Success Modal */}
        <Modal isOpen={isOpen} onOpenChange={onClose}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Login Successful!</ModalHeader>
            <ModalBody>
              <p>You have successfully logged in. Redirecting to the homepage...</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
