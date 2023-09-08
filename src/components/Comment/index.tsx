import {
  Avatar,
  Card,
  CardBody,
  Grid,
  GridItem,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Comment as PrismaComment, User } from "@prisma/client";
import { PropsWithChildren } from "react";

const CommentLayout = ({ children }: PropsWithChildren) => (
  <Grid
    height="100%"
    padding="8px"
    paddingTop="16px"
    templateAreas={{
      sm: `"user content"
		 			 "user content"`,
      base: `"user"
			 			 "content"`,
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
    {children}
  </Grid>
);

export interface CommentWithComments extends PrismaComment {
  user: User;
  comments: PrismaComment[];
}

export const Comment = (comment: CommentWithComments) => {
  return (
    <CommentLayout>
      <GridItem area={"user"} boxShadow="base">
        <Avatar src={comment.user.image ?? ""} />
        <Link href={`/user/${comment.userId}`}>
          <Text>{comment.user.name}</Text>
        </Link>
      </GridItem>
      <GridItem area={"content"} boxShadow="base">
        <Card>
          <CardBody>{comment.content}</CardBody>
        </Card>
      </GridItem>
    </CommentLayout>
  );
};
