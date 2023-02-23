var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import "@testing-library/dom";
import "@testing-library/jest-dom";
import * as main from "./main";
import * as mocked from "./mockedJson";
// Lets us use DTL's query library
import { screen } from "@testing-library/dom";
// Lets us send user events (like typing and clicking)
import userEvent from "@testing-library/user-event";
// global variables/constants
var input;
var startHTML = "\n    <div class=\"repl\">\n        <div id=\"repl-history\" data-testid=\"repl-history\">            \n        </div>\n        <div class=\"repl-input\">\n            <input type=\"text\" placeholder=\"Enter command here!\" id=\"repl-command-box\">\n        </div>\n    </div>\n    ";
/**
 * Resets the DOM before every test
 */
beforeEach(function () {
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
test("repl-input exists", function () {
    var repl_input = document.getElementsByClassName("repl-input");
    expect(repl_input.length).toBe(1);
});
/**
 * Checks that the mode command invokes the expected DOM model changes from switching between "brief" and "verbose".
 */
test("mode", function () { return __awaiter(void 0, void 0, void 0, function () {
    var res1, res2_1, res2_2, res3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect(main.getMode()).toBe(false);
                // (1) check switch from brief to verbose
                return [4 /*yield*/, userEvent.type(input, "mode{enter}", {
                        delay: 0.1,
                    })];
            case 1:
                // (1) check switch from brief to verbose
                _a.sent();
                res1 = screen.getAllByText(main.verboseActivStr);
                expect(res1.length).toBe(1);
                expect(main.getMode()).toBe(true);
                // (2) switch to brief while verbose => output is "> Command: mode > Output: Brief mode activated"
                return [4 /*yield*/, userEvent.type(input, "mode{enter}", {
                        delay: 0.1,
                    })];
            case 2:
                // (2) switch to brief while verbose => output is "> Command: mode > Output: Brief mode activated"
                _a.sent();
                res2_1 = screen.getAllByText(main.cmdExtraStr + "mode");
                res2_2 = screen.getAllByText(main.outputExtraStr + main.briefActivStr);
                expect(res2_1.length).toBe(1);
                expect(res2_2.length).toBe(1);
                expect(main.getMode()).toBe(false);
                // (3) check successful switch back from verbose to brief => output is "Brief mode activated"
                return [4 /*yield*/, userEvent.type(input, "mode{enter}", {
                        delay: 0.1,
                    })];
            case 3:
                // (3) check successful switch back from verbose to brief => output is "Brief mode activated"
                _a.sent();
                res3 = screen.getAllByText(main.verboseActivStr);
                expect(res3.length).toBe(2);
                expect(main.getMode()).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Checks that the load_file command invokes the expected DOM model changes with a variety of parameters.
 */
test("load_file", function () { return __awaiter(void 0, void 0, void 0, function () {
    var res1, res2, res3, csv1, res4, res5, res6, csv2, res7, csv3, res8, csv4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect(main.fileName).toBe("");
                return [4 /*yield*/, userEvent.type(input, "load_file{enter}", {
                        // (1) incomplete command line input => output "Usage: load_file <filename>"
                        delay: 0.1,
                    })];
            case 1:
                _a.sent();
                res1 = screen.getAllByText(main.loadUsageStr);
                expect(res1.length).toBe(1);
                expect(main.getLoadedCSV()).toStrictEqual([[]]);
                // (2) if file doesnt exist => output: "File not found"
                return [4 /*yield*/, userEvent.type(input, "load_file star.csv{enter}", {
                        delay: 0.1,
                    })];
            case 2:
                // (2) if file doesnt exist => output: "File not found"
                _a.sent();
                expect(main.fileName).toBe("star.csv");
                res2 = screen.getAllByText(main.fileNotFoundStr);
                expect(res2.length).toBe(1);
                expect(main.getLoadedCSV()).toStrictEqual([[]]);
                // (3) if file exists => output: "File loaded"
                return [4 /*yield*/, userEvent.type(input, "load_file stars.csv{enter}", {
                        delay: 0.1,
                    })];
            case 3:
                // (3) if file exists => output: "File loaded"
                _a.sent();
                expect(main.fileName).toBe("stars.csv");
                res3 = screen.getAllByText(main.fileLoadedStr);
                expect(res3.length).toBe(1);
                csv1 = main.getLoadedCSV();
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
                return [4 /*yield*/, userEvent.type(input, "load_file stars.csv{enter}", {
                        delay: 0.1,
                    })];
            case 4:
                // (4) loading file that's already loaded => output "File already loaded"
                _a.sent();
                expect(main.fileName).toBe("stars.csv");
                res4 = screen.getAllByText(main.fileAlreadyLoadedStr);
                expect(res4.length).toBe(1);
                expect(main.getLoadedCSV()).toStrictEqual(csv1);
                // (5) variations of files
                return [4 /*yield*/, userEvent.type(input, "load_file empty.csv{enter}", {
                        delay: 0.1,
                    })];
            case 5:
                // (5) variations of files
                _a.sent();
                expect(main.fileName).toBe("empty.csv");
                res5 = screen.getAllByText(main.fileLoadedStr);
                expect(main.getLoadedCSV()).toStrictEqual([[]]);
                expect(res5.length).toBe(2);
                return [4 /*yield*/, userEvent.type(input, "load_file people.csv{enter}", {
                        delay: 0.1,
                    })];
            case 6:
                _a.sent();
                expect(main.fileName).toBe("people.csv");
                res6 = screen.getAllByText(main.fileLoadedStr);
                expect(res6.length).toBe(3);
                csv2 = main.getLoadedCSV();
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
                return [4 /*yield*/, userEvent.type(input, "load_file singleHeader.csv{enter}", {
                        delay: 0.1,
                    })];
            case 7:
                _a.sent();
                expect(main.fileName).toBe("singleHeader.csv");
                res7 = screen.getAllByText(main.fileLoadedStr);
                expect(res7.length).toBe(4);
                csv3 = main.getLoadedCSV();
                expect(csv3).toBe(mocked.mockedJson.get("singleHeader.csv"));
                expect(csv3).toStrictEqual([["Name", "Age", "Hobby", "EyeColor"]]);
                return [4 /*yield*/, userEvent.type(input, "load_file singleHeaderRow.csv{enter}", {
                        delay: 0.1,
                    })];
            case 8:
                _a.sent();
                expect(main.fileName).toBe("singleHeaderRow.csv");
                res8 = screen.getAllByText(main.fileLoadedStr);
                expect(res8.length).toBe(5);
                csv4 = main.getLoadedCSV();
                expect(csv4).toBe(mocked.mockedJson.get("singleHeaderRow.csv"));
                expect(csv4).toStrictEqual([
                    ["Name", "Age", "Hobby", "EyeColor"],
                    ["Owen", "19", "Guitar", "Brown"],
                ]);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Checks that the view command invokes the expected DOM model changes with a variety of contexts
 */
test("view", function () { return __awaiter(void 0, void 0, void 0, function () {
    var res1, res3, i, row, j, col, arrayCompare1, res4, res5, i, row, j, col, arrayCompare2, res6, i, row, j, col, arrayCompare3, res7, i, row, j, col, arrayCompare4, res8, i, row, j, col, arrayCompare5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect(main.fileName).toBe("");
                // (1) try to invoke view before file loaded => output "A file must be loaded to use the view command"
                return [4 /*yield*/, userEvent.type(input, "view{enter}", {
                        delay: 0.1,
                    })];
            case 1:
                // (1) try to invoke view before file loaded => output "A file must be loaded to use the view command"
                _a.sent();
                res1 = screen.getAllByText(main.fileNotLoadedViewStr);
                expect(res1.length).toBe(1);
                // (2) invoke view after file loaded => ...
                return [4 /*yield*/, userEvent.type(input, "load_file people.csv{enter}", {
                        delay: 0.1,
                    })];
            case 2:
                // (2) invoke view after file loaded => ...
                _a.sent();
                expect(main.fileName).toBe("people.csv");
                // (2.1) view no args => output HTML table, check number of rows and cells and compare to mockedJson elements
                return [4 /*yield*/, userEvent.type(input, "view{enter}", {
                        delay: 0.1,
                    })];
            case 3:
                // (2.1) view no args => output HTML table, check number of rows and cells and compare to mockedJson elements
                _a.sent();
                res3 = screen.getAllByRole("table")[0];
                if (res3 instanceof HTMLTableElement) {
                    expect(res3.rows.length).toBe(10);
                    for (i = 0; (row = res3.rows[i]); i++) {
                        for (j = 0; (col = row.cells[j]); j++) {
                            arrayCompare1 = mocked.mockedJson.get("people.csv");
                            if (arrayCompare1 != undefined) {
                                expect(col.textContent).toBe(arrayCompare1[i][j]);
                            }
                        }
                    }
                }
                // (2.2) view 2x => compare the two HTML tables and make sure they're same
                return [4 /*yield*/, userEvent.type(input, "view{enter}", {
                        delay: 0.1,
                    })];
            case 4:
                // (2.2) view 2x => compare the two HTML tables and make sure they're same
                _a.sent();
                res4 = screen.getAllByRole("table")[1];
                if (res4 instanceof HTMLTableElement && res3 instanceof HTMLTableElement) {
                    expect(res4.rows).toStrictEqual(res3.rows);
                }
                // (2.3) view after switching to new file with load_file => compare the two HTML tables and make sure they're different
                return [4 /*yield*/, userEvent.type(input, "load_file stars.csv{enter}", {
                        delay: 0.1,
                    })];
            case 5:
                // (2.3) view after switching to new file with load_file => compare the two HTML tables and make sure they're different
                _a.sent();
                return [4 /*yield*/, userEvent.type(input, "view{enter}", {
                        delay: 0.1,
                    })];
            case 6:
                _a.sent();
                res5 = screen.getAllByRole("table")[2];
                if (res5 instanceof HTMLTableElement && res4 instanceof HTMLTableElement) {
                    expect(res5.rows).not.toBe(res4.rows);
                    expect(res5.rows.length).toBeGreaterThan(res4.rows.length);
                    for (i = 0; (row = res5.rows[i]); i++) {
                        for (j = 0; (col = row.cells[j]); j++) {
                            arrayCompare2 = mocked.mockedJson.get("stars.csv");
                            if (arrayCompare2 != undefined) {
                                expect(col.textContent).toBe(arrayCompare2[i][j]);
                            }
                        }
                    }
                }
                // (2.4) more examples with other data (empty file, only header, only header and 1 row)
                return [4 /*yield*/, userEvent.type(input, "load_file empty.csv{enter}", {
                        delay: 0.1,
                    })];
            case 7:
                // (2.4) more examples with other data (empty file, only header, only header and 1 row)
                _a.sent();
                return [4 /*yield*/, userEvent.type(input, "view{enter}", {
                        delay: 0.1,
                    })];
            case 8:
                _a.sent();
                res6 = screen.getAllByRole("table")[3];
                if (res6 instanceof HTMLTableElement) {
                    expect(res6.rows.length).toBe(1);
                    for (i = 0; (row = res6.rows[i]); i++) {
                        for (j = 0; (col = row.cells[j]); j++) {
                            arrayCompare3 = mocked.mockedJson.get("empty.csv");
                            if (arrayCompare3 != undefined) {
                                expect(col.textContent).toBe(arrayCompare3[i][j]);
                            }
                        }
                    }
                }
                return [4 /*yield*/, userEvent.type(input, "load_file singleHeader.csv{enter}", {
                        delay: 0.1,
                    })];
            case 9:
                _a.sent();
                return [4 /*yield*/, userEvent.type(input, "view{enter}", {
                        delay: 0.1,
                    })];
            case 10:
                _a.sent();
                res7 = screen.getAllByRole("table")[4];
                if (res7 instanceof HTMLTableElement) {
                    expect(res7.rows.length).toBe(1);
                    for (i = 0; (row = res7.rows[i]); i++) {
                        for (j = 0; (col = row.cells[j]); j++) {
                            arrayCompare4 = mocked.mockedJson.get("singleHeader.csv");
                            if (arrayCompare4 != undefined) {
                                expect(col.textContent).toBe(arrayCompare4[i][j]);
                            }
                        }
                    }
                }
                return [4 /*yield*/, userEvent.type(input, "load_file singleHeaderRow.csv{enter}", {
                        delay: 0.1,
                    })];
            case 11:
                _a.sent();
                return [4 /*yield*/, userEvent.type(input, "view{enter}", {
                        delay: 0.1,
                    })];
            case 12:
                _a.sent();
                res8 = screen.getAllByRole("table")[5];
                if (res8 instanceof HTMLTableElement) {
                    expect(res8.rows.length).toBe(2);
                    for (i = 0; (row = res8.rows[i]); i++) {
                        for (j = 0; (col = row.cells[j]); j++) {
                            arrayCompare5 = mocked.mockedJson.get("singleHeaderRow.csv");
                            if (arrayCompare5 != undefined) {
                                expect(col.textContent).toBe(arrayCompare5[i][j]);
                            }
                        }
                    }
                }
                return [2 /*return*/];
        }
    });
}); });
/**
 * Checks that the search command invokes the expected DOM model changes with a variety of contexts and parameters.
 */
test("search", function () { return __awaiter(void 0, void 0, void 0, function () {
    var res1, res2, res3, res4, res5, res6, res7, res8, res9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect(main.fileName).toBe("");
                // (1) try to invoke search before file loaded => output "A file must be loaded to use the search command"
                return [4 /*yield*/, userEvent.type(input, "search{enter}", {
                        delay: 0.1,
                    })];
            case 1:
                // (1) try to invoke search before file loaded => output "A file must be loaded to use the search command"
                _a.sent();
                res1 = screen.getAllByText(main.fileNotLoadedSearchStr);
                expect(res1.length).toBe(1);
                // (2) invoke search after file loaded => ...
                return [4 /*yield*/, userEvent.type(input, "load_file exampleIndex.csv{enter}", {
                        delay: 0.1,
                    })];
            case 2:
                // (2) invoke search after file loaded => ...
                _a.sent();
                res2 = screen.getAllByText(main.fileLoadedStr);
                expect(res2.length).toBe(1);
                // (2.1) search no args => output "Usage: search <column identifier> <value>"
                return [4 /*yield*/, userEvent.type(input, "search{enter}", {
                        delay: 0.1,
                    })];
            case 3:
                // (2.1) search no args => output "Usage: search <column identifier> <value>"
                _a.sent();
                res3 = screen.getAllByText(main.searchUsageStr);
                expect(res3.length).toBe(1);
                // (2.2) search 1 arg => output "Usage: search <column identifier> <value>"
                return [4 /*yield*/, userEvent.type(input, "search 4{enter}", {
                        delay: 0.1,
                    })];
            case 4:
                // (2.2) search 1 arg => output "Usage: search <column identifier> <value>"
                _a.sent();
                res4 = screen.getAllByText(main.searchUsageStr);
                expect(res4.length).toBe(2);
                // (2.3) valid search command (column index) and found => output HTML table, check number of rows and cells and compare to mockedRes elements
                return [4 /*yield*/, userEvent.type(input, "search 2 song{enter}", {
                        delay: 0.1,
                    })];
            case 5:
                // (2.3) valid search command (column index) and found => output HTML table, check number of rows and cells and compare to mockedRes elements
                _a.sent();
                res5 = screen.getAllByRole("table")[0];
                if (res5 instanceof HTMLTableElement) {
                    expect(res5.rows.length).toBe(4);
                }
                // (2.4) valid search command (column index) and not found => output "Value not contained in column"
                return [4 /*yield*/, userEvent.type(input, "search 1 song{enter}", {
                        delay: 0.1,
                    })];
            case 6:
                // (2.4) valid search command (column index) and not found => output "Value not contained in column"
                _a.sent();
                res6 = screen.getAllByText(main.searchFailedStr);
                expect(res6.length).toBe(1);
                // (2.5) valid search command (column name) and found => output HTML table, check number of rows and cells and compare to mockedRes elements
                return [4 /*yield*/, userEvent.type(input, "load_file exampleName.csv{enter}", {
                        delay: 0.1,
                    })];
            case 7:
                // (2.5) valid search command (column name) and found => output HTML table, check number of rows and cells and compare to mockedRes elements
                _a.sent();
                return [4 /*yield*/, userEvent.type(input, "search Second song{enter}", {
                        delay: 0.1,
                    })];
            case 8:
                _a.sent();
                res7 = screen.getAllByRole("table")[1];
                if (res7 instanceof HTMLTableElement && res5 instanceof HTMLTableElement) {
                    expect(res5.rows).toStrictEqual(res7.rows);
                }
                // (2.6) valid search command (column name) and not found => output "Value not contained in column"
                return [4 /*yield*/, userEvent.type(input, "search First song{enter}", {
                        delay: 0.1,
                    })];
            case 9:
                // (2.6) valid search command (column name) and not found => output "Value not contained in column"
                _a.sent();
                res8 = screen.getAllByText(main.searchFailedStr);
                expect(res8.length).toBe(2);
                // (2.7) calling view or not before calling search => output: same HTML table
                return [4 /*yield*/, userEvent.type(input, "view{enter}", {
                        delay: 0.1,
                    })];
            case 10:
                // (2.7) calling view or not before calling search => output: same HTML table
                _a.sent();
                res9 = screen.getAllByRole("table")[1];
                if (res9 instanceof HTMLTableElement && res7 instanceof HTMLTableElement) {
                    expect(res9.rows).toStrictEqual(res7.rows);
                }
                return [2 /*return*/];
        }
    });
}); });
/**
 * Checks that any command not specified in the sprint handout invokes the expected DOM model changes.
 */
test("invalid command", function () { return __awaiter(void 0, void 0, void 0, function () {
    var res1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // input anything besides mode, load_file, view, or search => output "Command undefined";
            return [4 /*yield*/, userEvent.type(input, "hi{enter}", {
                    delay: 0.1,
                })];
            case 1:
                // input anything besides mode, load_file, view, or search => output "Command undefined";
                _a.sent();
                res1 = screen.getAllByText(main.cmdUndefStr);
                expect(res1.length).toBe(1);
                expect(main.getLoadedCSV()).toStrictEqual([[]]);
                expect(main.getMode()).toBe(false);
                expect(main.getLoadedCSVName()).toStrictEqual("");
                return [2 /*return*/];
        }
    });
}); });
