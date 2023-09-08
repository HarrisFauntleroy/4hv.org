import { Stack, Text } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import Head from "next/head";

const Profile = () => {
  return (
    <Stack gap={2}>
      <Head>
        <title>Profile</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Text fontSize="4xl">Profile</Text>
    </Stack>
  );
};

Profile.auth = true;
Profile.roles = [Role.USER];
export default Profile;
