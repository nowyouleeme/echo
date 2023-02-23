## Project details

#### Project name
Sprint 2: Echo

#### Project description (for final projects)
For this project, we set up a basic web front-end application in HTML and CSS, practiced basic web development in Typescript, learned how to unit test web apps via the DOM Testing Library, and "mocked" data/functionality to be able to work on parts independently and make tests less expensive to run. More specifically, we implemented a web application command line interface in which a user can toggle between different display modes, load CSV files, view loaded CSV files, and search through loaded CSV files (though the parsing and searching functionality is not actually implemented in the front-end). 

#### Team members and contributions (include cs logins)
Team members: Henry Earnest (hearnest), Kathryn Lee (klee161)

#### Include the total estimated time it took to complete project
~14 hours

#### A link to your repo
https://github.com/cs0320-s2023/sprint-2-hearnest-klee161

#### Design choices -- high level design of your program
3 directories
1. public: this directory holds the index.html file that tells a web browser how to display text, images and other forms of media on a given webpage, as well as provide the UI for our application. 
2. src: this directory holds all of our typescript and compiled javascript files that are responsible for dynamically updating the content held in the index.html file. The files included are:
    - main.ts: holds all of the event listeners and functions responsible for handling user input. 
    - mockedJSON.ts: holds mocked parsed CSV files and search results that a backend
    would traditionally provide to the frontend
3. styles: this directory holds our CSS files that are responsible for the styling of the html file. 

Two primary functions:
1. handleKeypress(): This function initiates all input parsing functionality. If the user presses enter (checked in this function), their input is processed and commands are run (if applicable). This functionality occurs in parseLineWithOutput.
2. parseLineWithOutput(): This function parses a line of user input, and for each possible command, it can execute their functionality if the input is syntactically correct. Since all commands branch off from here, it also accesses the HTML elements in the webpage to update them (since most commands affect the user's display). 


#### Discuss any specific data structures you used, why you created it, and other high level explanations.
In main.ts, we stored the current output mode as a boolean global variable, so that our functions dealing with output would know whether or not to be verbose. 
Also, we stored the currently-loaded CSV file as a global 2D array of any values (named loadedCSV), to be able to store any CSV a backend might parse for us. (For example, CreatorFromRow<T> would produce elements of type T, which would fall under "any.")   
The last global variable was fileName, a string used in testing to see the name of the currently loaded file.
We stored our mocked JSON data in two different Maps. 
For the mock backend parsing output (stored in a variable named mockedJson), we mapped a string filepath to a 2D array (same format as the previously discussed loadedCSV). For the mock search results, we mapped a search query string to int array outputs.


#### Errors/Bugs
No known errors or bugs.

#### Explanations for checkstyle errors 
No known checkstyle errors. 

#### Tests 
1. main.dom.test Testing Suite (6 tests total)
    - test("repl-input exists")
        - this test checks that the DOM model of the index.html file properly loads our repl-history display (what holds all of the command line inputs and outputs as specified) upon first loading the web page.
    - test("mode")
        - this test checks that the DOM model of the index.html file updates appropriately when toggling between the two different modes. 
    - test("load_file")
        - this test checks that the DOM model of the index.html file updates appropriately when loading a file with a variety of command formats and parameters. 
    - test("view")
        - this test checks that the DOM model of the index.html file updates appropriately when calling view on a variety of command formats.  
    - test("search")
        - this test checks that the DOM model of the index.html file displays the appropriate HTML elements when calling search on a range of command formats and parameters. 
    - test("invalid command")
        - this test checks that the DOM model of the index.html file doesn't change when inputting an invalid command. 
2. main.test Testing Suite ()
    - test("parseLineWithOutput: mode”)
        - tests that the mode (and related output) properly updates when parseLineWithOutput executes the "mode" command.
    - test("parseLineWithOutput: load_file”)
        - tests that files are loaded properly when parseLineWithOutput executes the "load_file" command; tests that incorrect input syntax gives a proper output
    - test("parseModeWithOutput: search”)
        - tests that incorrect input syntax gives proper explanation output to the user
    - test("mockBackendSearch”)
        - checks that mock search results are returned correctly 
    - test("invalid command”)
        - checks that no variables change upon receiving invalid

#### How to…
## Run the tests you wrote/were provided
1. Open terminal and enter the project directory by typing in "cd <base> kathrynlee@kathryns-mbp-7sprint-2-hearnest-klee161/sprint2" if you are not in the project directory already. If you are already in the directory, your prompt should be "<base> kathrynlee@kathryns-mbp-7 sprint2 %".
2. Type in "npm test" and hit the Enter button to run the tests. 

## Build and run your program
1. As outlined in "Run the tests you wrote/were provided," first ensure that you are in the project directory.
2. Run npm install and npx tsc.
3. Go into the "public" folder, right click on the "index.html" and click on "Open with Live Server" to open the "index.html" file in an internet browser.
4. To run the program, we have provided a total of 4 commands a user may use: "mode", "load_file", "view", and "search".
5. To run the program using the mocked data, here are the mocked parsed CSV files we generated:
    1. exampleIndex.csv
    2. exampleName.csv
    3. stars.csv
    4. empty.csv
    5. singleHeader.csv
    6. singleHeaderRow.csv
    7. people.csv
