import {
  Button,
  Flex,
  HStack,
  Input,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Title } from "@mantine/core";
import Image from "next/image";
import { Card } from "./Card";

export const Information = () => (
  <Card title="Information">
    <TableContainer height="100%" padding="4px">
      <Flex alignItems="center">
        <Title order={6}>Information</Title>
      </Flex>
      <Table>
        <Thead>
          <Tr></Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Hello</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
    <HStack
      height="100%"
      border="1px solid black"
      padding="4px"
      justify="space-around"
    >
      <Flex width="1fr" justify="center" align="center">
        <Flex justify="center" align="center" gap="8px">
          <Image src="/images/new_small.png" alt="" height="16" width="16" />
          <Stack>
            <Text>New</Text>
            <Text>posts</Text>
          </Stack>
        </Flex>
        <Flex justify="center" align="center" gap="8px">
          <Image src="/images/nonew_small.png" alt="" height="16" width="16" />
          <Stack>
            <Text>No</Text>
            <Text>new</Text>
            <Text>posts</Text>
          </Stack>
        </Flex>
        <Flex justify="center" align="center" gap="8px">
          <Image src="/images/closed_small.png" alt="" height="16" width="16" />
          <Stack>
            <Text>Closed</Text>
            <Text>forum</Text>
          </Stack>
        </Flex>
      </Flex>
      <Stack width="1fr" justify="center" align="center">
        <Input placeholder="Search" width="130px" height="16px" />
        <Button width="45.15px" height="15px">
          Search
        </Button>
      </Stack>
      <Stack width="1fr" justify="center" align="center">
        <Text>You cannot start new topics</Text>
        <Text>You cannot post replies</Text>
        <Text>You cannot edit your posts</Text>
      </Stack>
    </HStack>
  </Card>
);
