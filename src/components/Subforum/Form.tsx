import {
  Button,
  Modal as ChakraModal,
  IconButton,
  IconButtonProps,
  Input,
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
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { SubforumWithThreads } from ".";
import logger from "../../utils/logger";
import { trpc } from "../../utils/trpc";
import { AlertPop } from "../Form/AlertPop";

type FormValues = SubforumWithThreads;

interface FormProps {
  onSubmit: (data: FormValues) => void;
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
        <Input
          variant="flushed"
          type="text"
          placeholder="Title"
          {...register("title", {
            required: { value: true, message: "Must not be empty" },
            minLength: { value: 3, message: "Too short" },
            maxLength: { value: 1024, message: "Too long" },
          })}
        />
        {errors.title && <AlertPop message={errors.title.message || ""} />}
        <Textarea
          variant="flushed"
          placeholder="Description"
          {...register("description", {
            required: { value: true, message: "Must not be empty" },
            minLength: { value: 3, message: "Too short" },
            maxLength: { value: 1024, message: "Too long" },
          })}
        />
        {errors.description && (
          <AlertPop message={errors.description.message || ""} />
        )}
      </ModalBody>
      <ModalFooter>
        <Button
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

const allSubforums = "subforum.all";

interface SubforumFormProps extends Pick<IconButtonProps, "icon"> {
  subforum?: SubforumWithThreads;
  forumId?: string;
  mode: "update" | "create" | "delete" | "archive" | "unarchive";
  label?: string;
}

export const SubforumForm = ({
  subforum,
  forumId,
  mode,
  icon,
  label,
}: SubforumFormProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const createSubforum = trpc.subforum.create.useMutation();
  const updateSubforum = trpc.subforum.update.useMutation();
  const deleteSubforum = trpc.subforum.delete.useMutation();
  const archiveSubforum = trpc.subforum.archive.useMutation();
  const unarchiveSubforum = trpc.subforum.unarchive.useMutation();

  const session = useSession();

  const userId = session.data?.userId;

  const toast = useToast();

  const middlebit = () => {
    switch (mode) {
      case "create":
        return (
          userId &&
          forumId && (
            <Form
              defaultValues={{ forumId }}
              onSubmit={async (submitValues) => {
                createSubforum
                  .mutateAsync({
                    ...submitValues,
                    userId: userId,
                  })
                  .then(() => {
                    onClose();
                    return toast({
                      title: "Subforumed!",
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
          subforum &&
          subforum.id && (
            <Form
              defaultValues={subforum}
              onSubmit={async (submitValues) => {
                updateSubforum
                  .mutateAsync({
                    userId: userId,
                    id: subforum.id,
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
          subforum && (
            <Button
              onClick={() =>
                deleteSubforum.mutateAsync({ id: subforum.id }).then(() => {
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
              Delete subforum titled: {subforum?.title} ?
            </Button>
          )
        );
      case "archive":
        return (
          subforum && (
            <Button
              onClick={() =>
                archiveSubforum
                  .mutateAsync({ id: subforum.id })
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
              Archive subforum titled: {subforum?.title} ?
            </Button>
          )
        );
      case "unarchive":
        return (
          subforum && (
            <Button
              onClick={() =>
                unarchiveSubforum
                  .mutateAsync({ id: subforum.id })
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
              Unarchive subforum titled: {subforum?.title} ?
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
          maxWidth="max-description"
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
          maxWidth="max-description"
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
