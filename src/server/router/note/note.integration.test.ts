import { Note } from "@prisma/client";
import { inferProcedureInput } from "@trpc/server";
import { testUserId } from "prisma/seed";
import { CreateContextOptions, createContextInner } from "../../trpc/context";
import { AppRouter, appRouter } from "../_app";

const setup = async (options?: Partial<CreateContextOptions>) => {
  const context = await createContextInner(options);

  const caller = appRouter.createCaller(context);

  return { context, caller };
};

test("add and get note happy path", async () => {
  const context = await createContextInner({
    session: {
      userId: testUserId,
      user: {
        id: testUserId,
        name: "Test User",
      },
    },
  });
  const caller = appRouter.createCaller(context);

  const input: inferProcedureInput<AppRouter["note"]["create"]> = {
    userId: testUserId,
    content: "hello test",
  };

  const note = await caller.note.create(input);
  const byId = await caller.note.byId({ id: note.id });

  expect(byId).toMatchObject(input);
});

test("create note should fail if user is not logged in", async () => {
  const context = await createContextInner({
    session: undefined,
  });
  const caller = appRouter.createCaller(context);

  const input: inferProcedureInput<AppRouter["note"]["create"]> = {
    userId: testUserId,
    content: "hello test",
  };

  await expect(caller.note.create(input)).rejects.toThrow("Not authenticated");
});

// Basic operation: create and retrieve notes
describe("Note CRUD operations", () => {
  test.todo("create note happy path");
  test("create note should fail if user does not exist", async () => {
    const { caller } = await setup();

    const input: inferProcedureInput<AppRouter["note"]["create"]> = {
      userId: "nonexistentUserId",
      content: "hello test",
    };

    await expect(caller.note.create(input)).rejects.toThrow();
  });
  test.todo("get note by id happy path");
  test.todo("update note happy path");
  test.todo("delete note happy path");
  test.todo("list notes happy path");
  test.todo("notes should be re-orderable");
  test.todo("should fail to add note if user does not exist");
  test.todo("should fail to add note if user is not logged in");
});

// Context handling: Online and Offline contexts
describe("Notes Context Handling", () => {
  test.todo("should return notes in online context");
  test.todo("should return notes in offline context");
  test.todo("should sync offline notes when signed in");
});

// Advanced operations: Additional features for notes
describe("Advanced Note Operations", () => {
  test.todo("should be creatable in offline mode");
  test.todo("should be updateable in offline mode");
  test.todo("should be deletable in offline mode");
  test.todo(
    "should update active note when deleting active note in online mode"
  );
  test.todo(
    "should update active note when deleting active note in offline mode"
  );
  test.todo("should be downloadable as a .md file in online mode");
  test.todo("should be downloadable as a .md file in offline mode");
  test.todo("should be copyable to clipboard in online mode");
  test.todo("should be copyable to clipboard in offline mode");
  test.todo("should be taggable in online mode");
  test.todo("should be taggable in offline mode");
  test.todo("tags should be editable in online mode");
  test.todo("tags should be editable in offline mode");
  test.todo("should be searchable in online mode");
  test.todo("should be searchable in offline mode");
  test("notes should be re-orderable", async () => {
    const { caller } = await setup();

    const list: inferProcedureInput<AppRouter["note"]["list"]> = {
      userId: testUserId,
      limit: 5, // fetch first 5 notes
    };

    const notes = await caller.note.list(list);

    // Ensure there are notes to reorder
    if (notes.length < 2) {
      throw new Error("Not enough notes to test reordering.");
    }

    // Swap the position of the first two notes
    const noteId1 = notes[0]?.id ?? "";
    const noteId2 = notes[1]?.id ?? "";

    const updatedNotes = await caller.note.updatePositions([
      noteId2,
      noteId1,
      ...notes.slice(2).map((note: Note) => note.id),
    ]);

    // Verify the notes have been reordered
    expect(updatedNotes[0]?.id).toEqual(noteId2);
    expect(updatedNotes[1]?.id).toEqual(noteId1);
  });
  test.todo("should be reorderable in online mode");
  test.todo("should be reorderable in offline mode");
  test.todo("should be able to sync them when account is created and online");
});

// Error handling: Test exceptions and error cases
describe("Note Error Handling", () => {
  test.todo("handle failure in note creation");
  test.todo("handle failure in note update");
  test.todo("handle failure in note deletion");
  test.todo("handle failure in note reordering");
  test.todo("handle failure in note tagging");
  test.todo("handle failure in note searching");
});
