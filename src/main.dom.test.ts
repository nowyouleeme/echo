import "@testing-library/dom";
import "@testing-library/jest-dom";
import * as main from "./main";
import * as mocked from "./mockedJson";
// Lets us use DTL's query library
import { screen } from "@testing-library/dom";
import { within } from "@testing-library/dom";
// Lets us send user events (like typing and clicking)
import userEvent from "@testing-library/user-event";
import fireEvent from "@testing-library/dom";

// global variables/constants
let input: HTMLElement;
const startHTML = `
    <div class="repl">
        <div id="repl-history" data-testid="repl-history">            
        </div>
        <div class="repl-input">
            <input type="text" placeholder="Enter command here!" id="repl-command-box">
        </div>
    </div>
    `;

/**
 * Resets the DOM before every test
 */
beforeEach(() => {
  // (1) Set up a mock document containing the skeleton that index.html starts with. This is refreshed for every test.
  document.body.innerHTML = startHTML;

  // (2) clear repl history/contents
  main.clear();

  // (3) Find the elements that should be present at the beginning
  // Using "getBy..." will throw an error if this element doesn't exist.
  input = screen.getByPlaceholderText("Enter command here!");

  // (4) attach eventListener everytime page is refreshed
  input.addEventListener("keypress", main.handleKeypress);
});

/**
 * Checks that the command line input box actually exists.
 */
test("repl-input exists", () => {
  let repl_input: HTMLCollectionOf<Element> =
    document.getElementsByClassName("repl-input");
  expect(repl_input.length).toBe(1);
});

/**
 * Checks that the mode command invokes the expected DOM model changes from switching between "brief" and "verbose".
 */
test("mode", async () => {
  expect(main.getMode()).toBe(false);
  // (1) check switch from brief to verbose
  await userEvent.type(input, "mode{enter}", {
    delay: 0.1,
  });
  const res1 = screen.getAllByText(main.verboseActivStr);
  expect(res1.length).toBe(1);
  expect(main.getMode()).toBe(true);

  // (2) switch to brief while verbose => output is "> Command: mode > Output: Brief mode activated"
  await userEvent.type(input, "mode{enter}", {
    delay: 0.1,
  });
  const res2_1 = screen.getAllByText(main.cmdExtraStr + "mode");
  const res2_2 = screen.getAllByText(main.outputExtraStr + main.briefActivStr);
  expect(res2_1.length).toBe(1);
  expect(res2_2.length).toBe(1);
  expect(main.getMode()).toBe(false);

  // (3) check successful switch back from verbose to brief => output is "Brief mode activated"
  await userEvent.type(input, "mode{enter}", {
    delay: 0.1,
  });
  const res3 = screen.getAllByText(main.verboseActivStr);
  expect(res3.length).toBe(2);
  expect(main.getMode()).toBe(true);
});

/**
 * Checks that the load_file command invokes the expected DOM model changes with a variety of parameters.
 */
test("load_file", async () => {
  expect(main.fileName).toBe("");
  await userEvent.type(input, "load_file{enter}", {
    // (1) incomplete command line input => output "Usage: load_file <filename>"
    delay: 0.1,
  });
  const res1 = screen.getAllByText(main.loadUsageStr);
  expect(res1.length).toBe(1);
  expect(main.getLoadedCSV()).toStrictEqual([[]]);

  // (2) if file doesnt exist => output: "File not found"
  await userEvent.type(input, "load_file star.csv{enter}", {
    delay: 0.1,
  });
  expect(main.fileName).toBe("star.csv");
  const res2 = screen.getAllByText(main.fileNotFoundStr);
  expect(res2.length).toBe(1);
  expect(main.getLoadedCSV()).toStrictEqual([[]]);

  // (3) if file exists => output: "File loaded"
  await userEvent.type(input, "load_file stars.csv{enter}", {
    delay: 0.1,
  });
  expect(main.fileName).toBe("stars.csv");
  const res3 = screen.getAllByText(main.fileLoadedStr);
  expect(res3.length).toBe(1);
  const csv1 = main.getLoadedCSV();
  expect(csv1).toBe(mocked.mockedJson.get("stars.csv"));
  expect(csv1).toStrictEqual([
    ["StarID", "ProperName", "X", "Y", "Z"],
    ["0", "Sol", "0", "0", "0"],
    ["1", "Andreas", "282.43485", "0.06449", "5.36884"],
    ["2", "Rory", "282.43485", "0.00234", "5.36884"],
    ["3", "Mortimer", "382.43485", "0.0236", "469.31384"],
    ["4", "Bailee", "182.43485", "0.00567", "234.36884"],
    ["5", "Zita", "232.43485", "0.027245", "4.36884"],
    ["6", "Araceli", "284.43485", "0.0745", "23.36884"],
    ["7", "Casey", "273.43485", "0.0234", "8.36884"],
    ["8", "Eura", "12.43485", "0.00445", "9.36884"],
    ["9", "Aracely", "349.43485", "0.004", "5.36884"],
    ["10", "Destany", "2341.43485", "0.0059", "5.5884"],
    ["11", "Cael", "1.43485", "0.00745", "5.36884"],
    ["12", "Kaleigh", "22.43485", "0.00345", "23.36884"],
    ["13", "Nikhil", "69.43485", "0.00470", "5.36884"],
    ["14", "Elex", "19.43485", "0.00349", "5.36884"],
    ["15", "Nataly", "2149.43485", "0.00342i", "7.36884"],
  ]);

  // (4) loading file that's already loaded => output "File already loaded"
  await userEvent.type(input, "load_file stars.csv{enter}", {
    delay: 0.1,
  });
  expect(main.fileName).toBe("stars.csv");
  const res4 = screen.getAllByText(main.fileAlreadyLoadedStr);
  expect(res4.length).toBe(1);
  expect(main.getLoadedCSV()).toStrictEqual(csv1);

  // (5) variations of files
  await userEvent.type(input, "load_file empty.csv{enter}", {
    delay: 0.1,
  });
  expect(main.fileName).toBe("empty.csv");
  const res5 = screen.getAllByText(main.fileLoadedStr);
  expect(main.getLoadedCSV()).toStrictEqual([[]]);
  expect(res5.length).toBe(2);

  await userEvent.type(input, "load_file people.csv{enter}", {
    delay: 0.1,
  });
  expect(main.fileName).toBe("people.csv");
  const res6 = screen.getAllByText(main.fileLoadedStr);
  expect(res6.length).toBe(3);
  const csv2 = main.getLoadedCSV();
  expect(csv2).toBe(mocked.mockedJson.get("people.csv"));
  expect(csv2).toStrictEqual([
    ["Name", "Age", "Hobby", "EyeColor"],
    ["Kathryn", "20", "Dance", "Brown"],
    ["Alexis", "22", "Origami", "Brown"],
    ["Karen", "20", "Art", "Brown"],
    ["Owen", "19", "Guitar", "Brown"],
    ["Alec", "40", "Hiking", "Brown"],
    ["Mona", "22", "Cooking", "Brown"],
    ["Amanda", "19", "Art", "Blue"],
    ["Paige", "23", "Art", "Green"],
    ["Tony", "84", "Art", "Green"],
  ]);

  await userEvent.type(input, "load_file singleHeader.csv{enter}", {
    delay: 0.1,
  });
  expect(main.fileName).toBe("singleHeader.csv");
  const res7 = screen.getAllByText(main.fileLoadedStr);
  expect(res7.length).toBe(4);
  const csv3 = main.getLoadedCSV();
  expect(csv3).toBe(mocked.mockedJson.get("singleHeader.csv"));
  expect(csv3).toStrictEqual([["Name", "Age", "Hobby", "EyeColor"]]);

  await userEvent.type(input, "load_file singleHeaderRow.csv{enter}", {
    delay: 0.1,
  });
  expect(main.fileName).toBe("singleHeaderRow.csv");
  const res8 = screen.getAllByText(main.fileLoadedStr);
  expect(res8.length).toBe(5);
  const csv4 = main.getLoadedCSV();
  expect(csv4).toBe(mocked.mockedJson.get("singleHeaderRow.csv"));
  expect(csv4).toStrictEqual([
    ["Name", "Age", "Hobby", "EyeColor"],
    ["Owen", "19", "Guitar", "Brown"],
  ]);
});

/**
 * Checks that the view command invokes the expected DOM model changes with a variety of contexts
 */
test("view", async () => {
  expect(main.fileName).toBe("");
  // (1) try to invoke view before file loaded => output "A file must be loaded to use the view command"
  await userEvent.type(input, "view{enter}", {
    delay: 0.1,
  });
  const res1 = screen.getAllByText(main.fileNotLoadedViewStr);
  expect(res1.length).toBe(1);

  // (2) invoke view after file loaded => ...
  await userEvent.type(input, "load_file people.csv{enter}", {
    delay: 0.1,
  });
  expect(main.fileName).toBe("people.csv");

  // (2.1) view no args => output HTML table, check number of rows and cells and compare to mockedJson elements
  await userEvent.type(input, "view{enter}", {
    delay: 0.1,
  });

  const res3 = screen.getAllByRole("table")[0];
  if (res3 instanceof HTMLTableElement) {
    expect(res3.rows.length).toBe(10);
    for (var i = 0, row; (row = res3.rows[i]); i++) {
      for (var j = 0, col; (col = row.cells[j]); j++) {
        let arrayCompare1 = mocked.mockedJson.get("people.csv");
        if (arrayCompare1 != undefined) {
          expect(col.textContent).toBe(arrayCompare1[i][j]);
        }
      }
    }
  }
  // (2.2) view 2x => compare the two HTML tables and make sure they're same
  await userEvent.type(input, "view{enter}", {
    delay: 0.1,
  });

  const res4 = screen.getAllByRole("table")[1];
  if (res4 instanceof HTMLTableElement && res3 instanceof HTMLTableElement) {
    expect(res4.rows).toStrictEqual(res3.rows);
  }

  // (2.3) view after switching to new file with load_file => compare the two HTML tables and make sure they're different
  await userEvent.type(input, "load_file stars.csv{enter}", {
    delay: 0.1,
  });
  await userEvent.type(input, "view{enter}", {
    delay: 0.1,
  });
  const res5 = screen.getAllByRole("table")[2];
  if (res5 instanceof HTMLTableElement && res4 instanceof HTMLTableElement) {
    expect(res5.rows).not.toBe(res4.rows);
    expect(res5.rows.length).toBeGreaterThan(res4.rows.length);
    for (var i = 0, row; (row = res5.rows[i]); i++) {
      for (var j = 0, col; (col = row.cells[j]); j++) {
        let arrayCompare2 = mocked.mockedJson.get("stars.csv");
        if (arrayCompare2 != undefined) {
          expect(col.textContent).toBe(arrayCompare2[i][j]);
        }
      }
    }
  }

  // (2.4) more examples with other data (empty file, only header, only header and 1 row)
  await userEvent.type(input, "load_file empty.csv{enter}", {
    delay: 0.1,
  });
  await userEvent.type(input, "view{enter}", {
    delay: 0.1,
  });
  const res6 = screen.getAllByRole("table")[3];
  if (res6 instanceof HTMLTableElement) {
    expect(res6.rows.length).toBe(1);
    for (var i = 0, row; (row = res6.rows[i]); i++) {
      for (var j = 0, col; (col = row.cells[j]); j++) {
        let arrayCompare3 = mocked.mockedJson.get("empty.csv");
        if (arrayCompare3 != undefined) {
          expect(col.textContent).toBe(arrayCompare3[i][j]);
        }
      }
    }
  }

  await userEvent.type(input, "load_file singleHeader.csv{enter}", {
    delay: 0.1,
  });
  await userEvent.type(input, "view{enter}", {
    delay: 0.1,
  });
  const res7 = screen.getAllByRole("table")[4];
  if (res7 instanceof HTMLTableElement) {
    expect(res7.rows.length).toBe(1);
    for (var i = 0, row; (row = res7.rows[i]); i++) {
      for (var j = 0, col; (col = row.cells[j]); j++) {
        let arrayCompare4 = mocked.mockedJson.get("singleHeader.csv");
        if (arrayCompare4 != undefined) {
          expect(col.textContent).toBe(arrayCompare4[i][j]);
        }
      }
    }
  }

  await userEvent.type(input, "load_file singleHeaderRow.csv{enter}", {
    delay: 0.1,
  });
  await userEvent.type(input, "view{enter}", {
    delay: 0.1,
  });
  const res8 = screen.getAllByRole("table")[5];
  if (res8 instanceof HTMLTableElement) {
    expect(res8.rows.length).toBe(2);
    for (var i = 0, row; (row = res8.rows[i]); i++) {
      for (var j = 0, col; (col = row.cells[j]); j++) {
        let arrayCompare5 = mocked.mockedJson.get("singleHeaderRow.csv");
        if (arrayCompare5 != undefined) {
          expect(col.textContent).toBe(arrayCompare5[i][j]);
        }
      }
    }
  }
});

/**
 * Checks that the search command invokes the expected DOM model changes with a variety of contexts and parameters.
 */
test("search", async () => {
  expect(main.fileName).toBe("");
  // (1) try to invoke search before file loaded => output "A file must be loaded to use the search command"
  await userEvent.type(input, "search{enter}", {
    delay: 0.1,
  });
  const res1 = screen.getAllByText(main.fileNotLoadedSearchStr);
  expect(res1.length).toBe(1);

  // (2) invoke search after file loaded => ...
  await userEvent.type(input, "load_file exampleIndex.csv{enter}", {
    delay: 0.1,
  });
  const res2 = screen.getAllByText(main.fileLoadedStr);
  expect(res2.length).toBe(1);

  // (2.1) search no args => output "Usage: search <column identifier> <value>"
  await userEvent.type(input, "search{enter}", {
    delay: 0.1,
  });
  const res3 = screen.getAllByText(main.searchUsageStr);
  expect(res3.length).toBe(1);

  // (2.2) search 1 arg => output "Usage: search <column identifier> <value>"
  await userEvent.type(input, "search 4{enter}", {
    delay: 0.1,
  });
  const res4 = screen.getAllByText(main.searchUsageStr);
  expect(res4.length).toBe(2);

  // (2.3) valid search command (column index) and found => output HTML table, check number of rows and cells and compare to mockedRes elements
  await userEvent.type(input, "search 2 song{enter}", {
    delay: 0.1,
  });
  const res5 = screen.getAllByRole("table")[0];
  if (res5 instanceof HTMLTableElement) {
    expect(res5.rows.length).toBe(4);
  }

  // (2.4) valid search command (column index) and not found => output "Value not contained in column"
  await userEvent.type(input, "search 1 song{enter}", {
    delay: 0.1,
  });
  const res6 = screen.getAllByText(main.searchFailedStr);
  expect(res6.length).toBe(1);

  // (2.5) valid search command (column name) and found => output HTML table, check number of rows and cells and compare to mockedRes elements
  await userEvent.type(input, "load_file exampleName.csv{enter}", {
    delay: 0.1,
  });
  await userEvent.type(input, "search Second song{enter}", {
    delay: 0.1,
  });
  const res7 = screen.getAllByRole("table")[1];
  if (res7 instanceof HTMLTableElement && res5 instanceof HTMLTableElement) {
    expect(res5.rows).toStrictEqual(res7.rows);
  }

  // (2.6) valid search command (column name) and not found => output "Value not contained in column"
  await userEvent.type(input, "search First song{enter}", {
    delay: 0.1,
  });
  const res8 = screen.getAllByText(main.searchFailedStr);
  expect(res8.length).toBe(2);

  // (2.7) calling view or not before calling search => output: same HTML table
  await userEvent.type(input, "view{enter}", {
    delay: 0.1,
  });
  const res9 = screen.getAllByRole("table")[1];
  if (res9 instanceof HTMLTableElement && res7 instanceof HTMLTableElement) {
    expect(res9.rows).toStrictEqual(res7.rows);
  }
});

/**
 * Checks that any command not specified in the sprint handout invokes the expected DOM model changes.
 */
test("invalid command", async () => {
  // input anything besides mode, load_file, view, or search => output "Command undefined";
  await userEvent.type(input, "hi{enter}", {
    delay: 0.1,
  });
  const res1 = screen.getAllByText(main.cmdUndefStr);
  expect(res1.length).toBe(1);

  expect(main.getLoadedCSV()).toStrictEqual([[]]);
  expect(main.getMode()).toBe(false);
  expect(main.getLoadedCSVName()).toStrictEqual("");
});