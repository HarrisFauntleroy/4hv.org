import {
  Button,
  Modal as ChakraModal,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  type IconButtonProps,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { CommentWithComments } from ".";
import logger from "../../utils/logger";
import { trpc } from "../../utils/trpc";
import { AlertPop } from "../Form/AlertPop";

type FormValues = CommentWithComments;

interface FormProps {
  onSubmit: () => void;
  defaultValues?: Partial<FormValues>;
}

export const Form = ({ onSubmit, defaultValues }: FormProps) => {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues,
  });

  const handler = (data: FormValues) => {
    onSubmit(data);
  };

  const { errors } = formState;

  return (
    <form onSubmit={handleSubmit(handler)}>
      <ModalBody>
        <Textarea
          variant="flushed"
          placeholder="Content"
          {...register("content", {
            required: { value: true, message: "Must not be empty" },
            minLength: { value: 3, message: "Too short" },
            maxLength: { value: 1024, message: "Too long" },
          })}
        />
        {errors.content && <AlertPop message={errors.content.message || ""} />}
      </ModalBody>
      <ModalFooter>
        <Button
          disabled={formState.isSubmitting}
          borderRadius="md"
          bg="green.300"
          _hover={{ bg: "green.400" }}
          type="submit"
        >
          Submit
        </Button>
      </ModalFooter>
    </form>
  );
};

const allComments = "comment.all";

interface CommentFormProps extends Pick<IconButtonProps, "icon"> {
  comment?: CommentWithComments;
  threadId?: string;
  parentId?: string;
  mode: "update" | "create" | "delete" | "archive" | "unarchive";
  label?: string;
}

export const CommentForm = ({
  comment,
  threadId,
  mode,
  icon,
  label,
}: CommentFormProps) => {
  const utils = trpc.useContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const createComment = trpc.useMutation("comment.create", {
    async onSuccess() {
      await utils.invalidateQueries([allComments]);
    },
  });

  const updateComment = trpc.useMutation("comment.update", {
    async onSuccess() {
      await utils.invalidateQueries([allComments]);
    },
  });

  const deleteComment = trpc.useMutation("comment.delete", {
    async onSuccess() {
      await utils.invalidateQueries([allComments]);
    },
  });

  const archiveComment = trpc.useMutation("comment.archive", {
    async onSuccess() {
      await utils.invalidateQueries([allComments]);
    },
  });

  const unarchiveComment = trpc.useMutation("comment.unarchive", {
    async onSuccess() {
      await utils.invalidateQueries([allComments]);
    },
  });

  const session = useSession();

  const userId = session.data?.userId;

  const toast = useToast();

  const middlebit = () => {
    switch (mode) {
      case "create":
        return (
          userId &&
          threadId && (
            <Form
              defaultValues={{ threadId }}
              onSubmit={async (submitValues) => {
                createComment
                  .mutateAsync({
                    ...submitValues,
                    userId: userId,
                  })
                  .then(() => {
                    onClose();
                    return toast({
                      title: "Commented!",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
                  })
                  .catch(logger.error);
              }}
            />
          )
        );
      case "update":
        return (
          userId &&
          comment &&
          comment.id && (
            <Form
              defaultValues={comment}
              onSubmit={async (submitValues) => {
                updateComment
                  .mutateAsync({
                    userId: userId,
                    id: comment.id,
                    data: submitValues,
                  })
                  .then(() => {
                    onClose();
                    return toast({
                      title: "Updated!",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
                  })
                  .catch(logger.error);
              }}
            />
          )
        );
      case "delete":
        return (
          comment && (
            <Button
              onClick={() =>
                deleteComment.mutateAsync({ id: comment.id }).then(() => {
                  onClose();
                  return toast({
                    title: "Deleted!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                })
              }
            >
              Delete comment titled: {comment?.id} ?
            </Button>
          )
        );
      case "archive":
        return (
          comment && (
            <Button
              onClick={() =>
                archiveComment
                  .mutateAsync({ id: comment.id })
                  .then(() => {
                    onClose();
                    return toast({
                      title: "Archived!",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
                  })
                  .catch(logger.error)
              }
            >
              Archive comment titled: {comment?.id} ?
            </Button>
          )
        );
      case "unarchive":
        return (
          comment && (
            <Button
              onClick={() =>
                unarchiveComment
                  .mutateAsync({ id: comment.id })
                  .then(() => {
                    onClose();
                    return toast({
                      title: "Unarchived!",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
                  })
                  .catch(logger.error)
              }
            >
              Unarchive comment titled: {comment?.id} ?
            </Button>
          )
        );
      default:
        return <Text>Something went wrong...</Text>;
    }
  };

  return (
    <>
      {label && (
        <Button
          maxWidth="max-content"
          onClick={onOpen}
          fontSize="10px"
          variant="ghost"
          size="xs"
        >
          {label}
        </Button>
      )}
      {icon && (
        <IconButton
          aria-label=""
          maxWidth="max-content"
          icon={icon}
          onClick={onOpen}
          size="sm"
        />
      )}
      <ChakraModal isOpen={isOpen} onClose={onClose} isCentered variant="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {label}
            {icon}
          </ModalHeader>
          <ModalCloseButton mt="8px" />
          {middlebit()}
        </ModalContent>
      </ChakraModal>
    </>
  );
};
