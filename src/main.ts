import { mockedJson, mockedResults } from "./mockedJson.js";

// CONSTANT STRINGS (stored for testing)
let outputExtraStr = "> Output: ";
let cmdExtraStr = "> Command: ";
let briefActivStr = "Brief mode activated";
let verboseActivStr = "Verbose mode activated";
let loadUsageStr = "Usage: load_file <filename>";
let fileNotLoadedViewStr = "A file must be loaded to use the view command";
let fileNotLoadedSearchStr = "A file must be loaded to use the search command";
let searchUsageStr = "Usage: search <column identifier> <value>";
let searchFailedStr = "Value not contained in column";
let cmdUndefStr = "Command undefined";
let fileLoadedStr = "File loaded";
let fileNotFoundStr = "File not found";
let fileAlreadyLoadedStr = "File already loaded";

// global variables
let verbose: boolean = false; // CMD LINE OUTPUT IS BRIEF ON INITIALIZATION
let loadedCSV: Array<Array<any>> = [[]];
let fileName: string = "";

// The window.onload callback is invoked when the window is first loaded by the browser
window.onload = () => {
  prepareKeypress();
};

/**
 * Adds an EventListener for user keyboard input to the input HTMLElement.
 */
function prepareKeypress() {
  // As far as TypeScript knows, there may be *many* elements with this class.
  const maybeInput: HTMLElement | null =
    document.getElementById("repl-command-box");
  // Assumption: there's only one thing
  if (maybeInput == null) {
    console.log("Couldn't find input element");
  } else if (!(maybeInput instanceof HTMLInputElement)) {
    console.log(`Found element ${maybeInput}, but it wasn't an input`);
  } else {
    maybeInput.addEventListener("keypress", handleKeypress);
  }
}

/**
 * Upon receiving a keypress, if that keypress is Enter, then the current
 * line of user input in the input HTMLElement is parsed and resulting output
 * is displayed.
 * @param event the event containing user keypress information
 */
function handleKeypress(event: KeyboardEvent) {
  // The event has more fields than just the key pressed (e.g., Alt, Ctrl, etc.)
  // Upon receiving Enter, we grab and parse the input, returning new output
  if (event.code == "Enter") {
    //// NARROW INPUT ELEMENT
    var maybeInput: HTMLElement | null =
      document.getElementById("repl-command-box");
    if (maybeInput == null) {
      console.log("Couldn't find input element");
    } else if (!(maybeInput instanceof HTMLInputElement)) {
      console.log(`Found element ${maybeInput}, but it wasn't an input`);
    } else {
      // STORE CURRENT INPUT; CLEAR IT
      let line = maybeInput.value;
      maybeInput.value = "";
      // NARROW CMD LINE OUTPUT HISTORY STORAGE ELEMENT
      var maybeOutput: HTMLElement | null =
        document.getElementById("repl-history");
      if (maybeOutput == null) {
        console.log("Couldn't find output element");
      } else if (!(maybeOutput instanceof HTMLElement)) {
        console.log(`Found element ${maybeOutput}, but it wasn't an input`);
      } else {
        // PARSE THE COMMAND; OUTPUT ANY RESULTS
        parseLineWithOutput(line, maybeOutput);
      }
    }
  }
}

/**
 * Given a line of user input, executes any valid instructions in the input
 * (mode, load_file, view, search). Adds a new paragraph containing command
 * results to the output history HTMLElement.
 *
 * @param line a string of command line input
 * @param output the HTMLElement displaying command output
 */
function parseLineWithOutput(line: string, output: HTMLElement) {
  let outputUndef : boolean = false;
  if(output === undefined) {
    outputUndef = true;
  }
  if (line !== "") {
    let args = line.split(" ", 3); // ignores all args past 3rd
    let finalStr = "";
    let prePrinted: boolean = false;
    if (verbose) {
      finalStr = outputExtraStr;
      if(!outputUndef) { // FOR TESTING WITH AN UNDEFINED OUTPUT (cannot happen normally)
        const echoedInput = document.createElement("p");
        echoedInput.textContent = cmdExtraStr + line;
        output.appendChild(echoedInput);
      }
    }
    // Execute any valid commands contained in user input:
    if (args[0] === "mode") {
      ///////////////////////          MODE            ///////////////////////
      if (args.length === 1) {
        if (verbose) {
          finalStr += briefActivStr;
        } else {
          finalStr += verboseActivStr;
        }
        verbose = !verbose;
      }
    } else if (args[0] === "load_file") {
      /////////////////////         LOAD_FILE          /////////////////////
      if (args.length === 1) {
        finalStr += loadUsageStr;
      } else {
        fileName = args[1];
        finalStr += load_file(args[1]);
      }
    } else if (args[0] === "view") {
      /////////////////////           VIEW             /////////////////////
      if (loadedCSV[0].length == 0 && fileName == "") {
        finalStr += fileNotLoadedViewStr;
      } else if (!outputUndef){
        const cmdOutput = document.createElement("p");
        cmdOutput.textContent = finalStr;
        output.appendChild(cmdOutput);
        output.appendChild(view(loadedCSV));
        prePrinted = true;
      }
    } else if (args[0] === "search") {
      /////////////////////          SEARCH             ////////////////////
      if (loadedCSV[0].length == 0) {
        finalStr += fileNotLoadedSearchStr;
      } else if (args.length < 3) {
        finalStr += searchUsageStr;
      } else if (loadedCSV.length === 1 && loadedCSV[0].length === 0) {
        finalStr += fileNotLoadedSearchStr
      } else {
        let searchRes = search(args[1], args[2]);
        if (searchRes != undefined && !outputUndef) {
          const cmdOutput = document.createElement("p");
          cmdOutput.textContent = finalStr;
          output.appendChild(cmdOutput);
          output.appendChild(searchRes);
          prePrinted = true;
        } else {
          finalStr += searchFailedStr;
        }
      }
    } else {
      ///////////////////          ERROR CASE            ///////////////////
      finalStr += cmdUndefStr;
    }
    if (!prePrinted && !outputUndef) {
      const cmdOutput = document.createElement("p");
      cmdOutput.textContent = finalStr;
      output.appendChild(cmdOutput);
    }
    return finalStr; // to use in testing
  }
  return line;
}

/**
 * Function that loads and stores a CSV into a global variable, and returns a 
 * string indicating success of loading the file 
 * @param filePath the file to load
 * @returns a string indicating the success of loading 
 */
function load_file(filePath: string) {
  const getRes = mockedJson.get(filePath);
  if (getRes == undefined) {
    return fileNotFoundStr;
  } else if (getRes === loadedCSV) {
    return fileAlreadyLoadedStr;
  } else {
    loadedCSV = getRes;
    return fileLoadedStr;
  }
}

/**
 * Function that takes in a parsed CSV file in the form of a 2D array and 
 * returns an HTMLElement displaying the parsed CSV data as a table.
 * @param csvToView the parsed CSV file we are trying to view
 * @returns an HTMLTableElement containing all of the parsed CSV file data
 */
function view(csvToView: Array<Array<any>>) {
  let loadedCSVTable = document.createElement("table");
  for (let i = 0; i < csvToView.length; i++) {
    const tableRow = document.createElement("tr");
    for (let j = 0; j < csvToView[i].length; j++) {
      let cell;
      if (i == 0) {
        // check if header cell
        cell = document.createElement("th");
      } else {
        // not header cell
        cell = document.createElement("td");
      }
      let cellContent = document.createTextNode(csvToView[i][j]);
      cell.appendChild(cellContent);
      tableRow.appendChild(cell);
    }
    loadedCSVTable.appendChild(tableRow);
  }
  return loadedCSVTable;
}

/**
 * Function that takes in the results of search function (2D array) and returns 
 * an HTMLElement displaying the search CSV data as a table.
 * @param resToView the results of the search function we are displaying
 * @returns an HTMLTableElement containing all of the search results
 */
function displayRes(resToView: Array<Array<any>>) {
  let loadedResTable = document.createElement("table");
  for (let i = 0; i < resToView.length; i++) {
    const tableRow = document.createElement("tr"); // make a table row
    for (let j = 0; j < resToView[i].length; j++) {
      let cell; // no header cells
      cell = document.createElement("td");
      let cellContent = document.createTextNode(resToView[i][j]);
      cell.appendChild(cellContent);
      tableRow.appendChild(cell);
    }
    loadedResTable.appendChild(tableRow);
  }
  return loadedResTable;
}

/**
 * Function that takes an a column identifier (index or name) and value to 
 * search the loaded parsed CSV file for and returns an HTML element displaying 
 * the search results as a table.
 * 
 * @param identifier the column identifer specifying the search on
 * @param value the value we are searching for in the loaded file
 * @returns an HTMLTableElement containing all of the search results
 */
function search(identifier: string, value: string) {
  let rowIndexArr = mockBackendSearch(identifier, value);
  if (rowIndexArr == undefined) {
    return undefined;
  }
  let searchRes: Array<Array<any>> = [[]];
  let i = 0;
  for (var j = 0; j < rowIndexArr.length; j++) {
    // parse through the row indices backend gave us
    // to iterate through the loadedCSV so we can display the search results
    searchRes[i] = loadedCSV[rowIndexArr[j]];
    i++;
  }
  return displayRes(searchRes);
}

/**
 * Function that mocks a backend function for search by taking in a column 
 * identifier (index or name) and value to search the loaded parsed CSV file 
 * for and returns an array of row indices in which the value is found. No 
 * actual searching takes place, as the function in reality just accesses some 
 * mocked data.
 * @param identifier the column identifer specifying the search on
 * @param value the value we are searching for in the loaded file
 * @returns an array containing all of the row indices the value is found on with the column specification
 */
function mockBackendSearch(identifier: string, value: string) {
  const toFind = identifier + value; // decided to map on concatenated string and store as key
  return mockedResults.get(toFind);
}

///////////////////////////////////////////////////////////////////////////////
// Helpers added specifically for testing and automation
///////////////////////////////////////////////////////////////////////////////

/**
 * Used to reset all global variables to default.
 */
function clear() {
  fileName = "";
  verbose = false;
  loadedCSV = [[]];
}

/**
 * Used for testing of mode switches.
 */
function getMode() {
  return verbose;
}

/**
 * Used for testing of loaded CSV contents.
 */
function getLoadedCSV() {
  return loadedCSV;
}

/**
 * Used for testing of loaded CSV file name.
 */
function getLoadedCSVName() {
  return fileName;
}

// IMPORTANT, allows for exporting this out to use in other files
// Provide this to other modules (e.g., for testing!)
// The configuration in this project will require /something/ to be exported.
export {
  handleKeypress,
  prepareKeypress,
  getMode,
  getLoadedCSV,
  clear,
  load_file,
  view,
  mockBackendSearch,
  search,
  parseLineWithOutput,
  getLoadedCSVName,
  outputExtraStr,
  cmdExtraStr,
  briefActivStr,
  verboseActivStr,
  loadUsageStr,
  fileNotLoadedViewStr,
  fileNotLoadedSearchStr,
  searchUsageStr,
  searchFailedStr,
  cmdUndefStr,
  fileLoadedStr,
  fileNotFoundStr,
  fileAlreadyLoadedStr,
  loadedCSV,
  fileName,
};
