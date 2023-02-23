import "@testing-library/dom";
import "@testing-library/jest-dom";
import * as main from "./main";
// have some arbitrary HTML element to append results to
var output;
// have a function that clears out all global variables used in main
beforeEach(function () {
    main.clear();
});
/**
 * Tests that correct output is produced from parsing and that mode gets
 * toggled.
 */
test("parseLineWithOutput: mode", function () {
    expect(main.getMode()).toBe(false);
    expect(main.parseLineWithOutput("mode", output)).toBe(main.verboseActivStr);
    expect(main.getMode()).toBe(true);
    expect(main.parseLineWithOutput("mode", output)).toBe(main.outputExtraStr + main.briefActivStr);
    expect(main.getMode()).toBe(false);
});
/**
 * Tests that load_file produces correct output and actually loads the stars
 * csv.
 */
test("parseLineWithOutput: load_file", function () {
    // (1) check that loadedCSV defaults to empty 2D array and current loaded fileName is empty string
    expect(main.getLoadedCSV()).toStrictEqual([[]]);
    expect(main.getLoadedCSVName()).toStrictEqual("");
    // (2) check that loading a file with no args will output a string outlining the usage ofthe command,
    // and that the loadedCSV and loaded fileName remains in default state
    expect(main.parseLineWithOutput("load_file", output)).toBe(main.loadUsageStr);
    expect(main.getLoadedCSV()).toStrictEqual([[]]);
    expect(main.getLoadedCSVName()).toStrictEqual("");
    // (3) check that if file exists, the laodedCSV and loaded fileName get updated appropriately
    expect(main.parseLineWithOutput("load_file stars.csv", output)).toBe(main.fileLoadedStr);
    expect(main.getLoadedCSV()).toStrictEqual([
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
    expect(main.getLoadedCSVName()).toStrictEqual("stars.csv");
    // (4) loading file that's already loaded => check loadedCSV has not changed in value
    expect(main.parseLineWithOutput("load_file stars.csv", output)).toBe(main.fileAlreadyLoadedStr);
    expect(main.getLoadedCSV()).toStrictEqual([
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
    expect(main.getLoadedCSVName()).toStrictEqual("stars.csv");
});
/**
 * Tests parsing output of various search queries.
 */
test("parseModeWithOutput: search", function () {
    expect(main.parseLineWithOutput("search", output)).toBe(main.fileNotLoadedSearchStr);
    expect(main.parseLineWithOutput("search 0192i30219 aknfouhn3ujbs", output)).toBe(main.fileNotLoadedSearchStr);
    expect(main.parseLineWithOutput("load_file stars.csv", output)).toBe(main.fileLoadedStr);
    expect(main.parseLineWithOutput("search", output)).toBe(main.searchUsageStr);
    expect(main.parseLineWithOutput("search 01293oi3ji021 foiu3j", output)).toBe(main.searchFailedStr);
});
/**
 * Tests that the mockBackendSearch function we wrote to mimic the results
 * the backend portion would feed the front end works as expected
 * (returns an array of row indices)
 */
test("mockBackendSearch", function () {
    expect(main.mockBackendSearch("2", "song")).toStrictEqual([1, 2, 3, 5]);
    expect(main.mockBackendSearch("Second", "song")).toStrictEqual([1, 2, 3, 5]);
    expect(main.mockBackendSearch("Age", "20")).toStrictEqual([1, 3]);
    expect(main.mockBackendSearch("EyeColor", "Brown")).toStrictEqual([
        1, 2, 3, 4, 5, 6,
    ]);
    expect(main.mockBackendSearch("ProperName", "Mortimer")).toStrictEqual([4]);
});
/**
 * Tests that the loadedCSV and fileName variables are not changed upon inputting an invalid command.
 */
test("invalid command", function () {
    // input anything besides mode, load_file, view, or search => check loadedCSV and all other global variables haven't changed
    expect(main.loadedCSV).toStrictEqual([[]]);
    expect(main.fileName).toBe("");
    expect(main.parseLineWithOutput("hello", output)).toBe(main.cmdUndefStr);
    expect(main.loadedCSV).toStrictEqual([[]]);
    expect(main.fileName).toBe("");
});
