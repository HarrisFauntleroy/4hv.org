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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import logger from "../../utils/logger";
import { trpc } from "../../utils/trpc";
import { AlertPop } from "../Form/AlertPop";
import { ForumWithSubforums } from "./index";

type FormValues = ForumWithSubforums;

interface FormProps {
  onSubmit: (data: FormValues) => void;
  formData?: Partial<FormValues>;
}

export const Form = ({ onSubmit, formData }: FormProps) => {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: formData,
  });

  const handler = (data: FormValues) => {
    onSubmit(data);
  };

  const { errors } = formState;

  return (
    <form onSubmit={handleSubmit(handler)}>
      {JSON.stringify(formData)}
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

interface ForumFormProps extends Pick<IconButtonProps, "icon"> {
  forum?: ForumWithSubforums;
  mode: "edit" | "add" | "delete" | "archive" | "unarchive";
  label?: string;
}

export const ForumForm = ({ forum, mode, icon, label }: ForumFormProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const addForum = trpc.forum.add.useMutation();
  const editForum = trpc.forum.edit.useMutation();
  const deleteForum = trpc.forum.delete.useMutation();
  const archiveForum = trpc.forum.archive.useMutation();
  const unarchiveForum = trpc.forum.unarchive.useMutation();

  const session = useSession();

  const userId = session.data?.userId;

  const toast = useToast();

  const middlebit = () => {
    switch (mode) {
      case "add":
        return (
          userId && (
            <Form
              onSubmit={async (submitValues) => {
                addForum
                  .mutateAsync({
                    ...submitValues,
                    userId: userId,
                  })
                  .then(() => {
                    onClose();
                    return toast({
                      title: "Forumed!",
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
      case "edit":
        return (
          userId &&
          forum &&
          forum.id && (
            <Form
              formData={forum}
              onSubmit={async (submitValues) => {
                editForum
                  .mutateAsync({
                    userId: userId,
                    id: forum.id,
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
          forum && (
            <Button
              onClick={() =>
                deleteForum.mutateAsync({ id: forum.id }).then(() => {
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
              Delete forum titled: {forum?.title} ?
            </Button>
          )
        );
      case "archive":
        return (
          forum && (
            <Button
              onClick={() =>
                archiveForum
                  .mutateAsync({ id: forum.id })
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
              Archive forum titled: {forum?.title} ?
            </Button>
          )
        );
      case "unarchive":
        return (
          forum && (
            <Button
              onClick={() =>
                unarchiveForum
                  .mutateAsync({ id: forum.id })
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
              Unarchive forum titled: {forum?.title} ?
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
          fontSize="10px"
          variant="ghost"
          size="xs"
          onClick={onOpen}
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
          size="xs"
          variant="ghost"
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
