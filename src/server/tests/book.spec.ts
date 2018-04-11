import { BookAction as Action } from "../action/book.action";
import { Query } from "../util";

const action = new Action();

const data = {
  dbname: "book_papyrus01",
  content: "const _8 = require('eight')"
}

export const bookSpec = describe("Book inspections", () => {

  test("(add) Add papyrus puzzle 1", async () => {
    let newBook = await action.add(data);
    expect(newBook).toBeTruthy();
  });

  test("(getSingle) Retireve papyrus puzzle 1", async () => {
    let papyrus = await action.getSingle("book_papyrus01");
    expect(papyrus).toBeTruthy();
  });

  test("(updateSingle) hack papyrus puzzle 1", async () => {
    let updatedBook = await action.updateSingle("book_papyrus01", {content: "Game.player.additem('0x00000f', 1000)"});
    let pypz1 = await action.getSingle("book_papyrus01");
    if (pypz1 && updatedBook) {
      expect(pypz1[0].content === updatedBook[0].content);
    } else {
      throw new Error("Failed to hack papurus puzzle 1");
    }
  });

  test("(delete) delete papyrus puzzle 1", async () => {
    let token = {dbname: 'book_papyrus01'};
    let delResult = await action.delete(token);
    if (delResult) {
      expect(delResult.n).toBeGreaterThan(0);
    } else {
      throw new Error("Failed to delete papyrus puzzle 1");
    }

    let result = await action.getSingle(token.dbname);
    if (result) {
      expect(result.length).toBe(0);
    } else {
      throw new Error("Failed to get detail");
    }
    
  });


});
