
import { User } from "@nextui-org/react";
interface UserCardProps {
  email?: string| undefined; 
}

export default function UserCard({ email }: UserCardProps) {
  return (
    <User
      name="Jdoe"
      description={email || "Jdoe"} // Muestra el email o un mensaje alternativo
      avatarProps={{
        src: "https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png"
      }}
    />
  );
}
