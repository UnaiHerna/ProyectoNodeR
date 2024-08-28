import {User} from "@nextui-org/react";

export default function UserCard() {
  return (
    <User   
      name="Jane Doe"
      description="Product Manager"
      avatarProps={{
        src: "https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png"
      }}
    />
  );
}
