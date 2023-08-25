import {
  Flex,
  Grid,
  GridItem,
  List,
  ListIcon,
  ListItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { ReactNode } from "react";
import { MdLogin, MdLogout } from "react-icons/md";
import { Card } from "../Card";
import { Online } from "../Online";
import { Navigation } from "./Navigation";

type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const session = useSession();

  return (
    <Flex direction="column" bg="#E4E0E0">
      <Flex
        height="86px"
        justify="center"
        align="center"
        borderBottom="1px solid black"
        padding="8px"
        background="#8fa1c4"
      >
        <Flex maxHeight="77px">
          <Image src="/images/logo.png" alt="" height="77" width="455" />
        </Flex>
      </Flex>
      <Flex
        minHeight="28px"
        maxHeight="28px"
        justify="right"
        align="center"
        gap="4px"
        borderBottom="#000 1px solid"
      >
        <input
          style={{
            width: "130px",
            height: "16px",
            marginLeft: "auto",
            backgroundColor: "#eaeef2",
            border: "#5e5d63 1px solid",
            color: "#000000",
          }}
        />
        <Flex padding="2px 3px 0 0px">
          <Image alt="search" src="/images/search.png" width="18" height="19" />
        </Flex>
      </Flex>
      <Grid
        height="100%"
        padding="8px"
        paddingTop="16px"
        templateAreas={{
          sm: `"mainMenu content"
						 "welcome content"
						 "online content"
						 "birthdays content"
						 "contact content"
						 "support content"
						 ". content"
						 ". legal"`,
          base: `"mainMenu"
							 "welcome"
							 "content"
							 "online"
							 "birthdays"
							 "contact"
							 "support"
							 "legal"`,
        }}
        gridTemplateRows={{
          sm: "repeat(6, minmax(max-content))",
          base: "repeat(8, max-content)",
        }}
        gridTemplateColumns={{ sm: "160px 1fr", base: "100vw" }}
        gridAutoFlow="dense"
        gridGap="8px"
        // Nicer to read
        color={useColorModeValue("blackAlpha.700", "whiteAlpha.700")}
      >
        <GridItem area={"mainMenu"}>
          <Card title="Main Menu">
            <Navigation />
          </Card>
        </GridItem>

        <GridItem area={"welcome"}>
          <Card title="Welcome">
            <List>
              {session ? (
                <ListItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <ListIcon>
                    <MdLogout size="lg" />
                  </ListIcon>
                  Log out
                </ListItem>
              ) : (
                <ListItem onClick={async () => signIn()}>
                  <ListIcon>
                    <MdLogin size="lg" />
                  </ListIcon>
                  Log in
                </ListItem>
              )}
            </List>
          </Card>
        </GridItem>
        <GridItem area={"online"}>
          <Card title="Online">
            <Online />
          </Card>
        </GridItem>
        <GridItem area={"birthdays"}>
          <Card title="Members Birthdays:">birthdays</Card>
        </GridItem>
        <GridItem area={"contact"}>
          <Card title="Contact">
            <Text>
              If you need assistance, please send an email to forum at 4hv dot
              org. To ensure your email is not marked as spam, please include
              the phrase &quot;4hv help&quot; in the subject line. You can also
              find assistance via IRC, at irc.shadowworld.net, room #hvcomm.
            </Text>
          </Card>
        </GridItem>
        <GridItem area={"support"}>
          <Card title="Support 4hv.org!">
            <Text>
              Donate: 4hv.org is hosted on a dedicated server. Unfortunately,
              this server costs and we rely on the help of site members to keep
              4hv.org running. Please consider donating. We will place your name
              on the thanks list and you&apos;ll be helping to keep 4hv.org
              alive and free for everyone. Members whose names appear in red
              bold have donated recently. Green bold denotes those who have
              recently donated to keep the server carbon neutral.
            </Text>
            <Image src="/images/paypal.gif" alt="" height="44" width="77" />
            <Text>Special Thanks To:</Text>
            <ul>
              <li>Hazzwold</li>
              <li>TheQuantumGeneral</li>
            </ul>
            <Text>
              The aforementioned have contributed financially to the continuing
              triumph of 4hv.org. They are deserving of my most heartfelt
              thanks.
            </Text>
          </Card>
        </GridItem>
        <GridItem area={"content"}>{children}</GridItem>

        <GridItem area={"legal"}>
          <Card title="Legal Information">
            <Text>
              This site is powered by e107, which is released under the GNU GPL
              License. All work on this site, except where otherwise noted, is
              licensed under a Creative Commons Attribution-ShareAlike 2.5
              License. By submitting any information to this site, you agree
              that anything submitted will be so licensed. Please read our
              Disclaimer and Policies page for information on your rights and
              responsibilities regarding this site.
            </Text>
          </Card>
        </GridItem>
      </Grid>
    </Flex>
  );
};
