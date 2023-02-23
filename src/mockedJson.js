// We suggest maintaining a map between mocked datasets and (pretend) file paths,
// to make switching between them easier.
var mockedJson = new Map();
var mockedResults = new Map();
/**
 * Example ParsedCSV objects for testing purposes.
 */
var exampleFilePath1 = "exampleIndex.csv";
var exampleCSV1 = [
    [1, 2, 3, 4, 5],
    ["The", "song", "remains", "the", "same."],
    ["The", "song", "remains", "the", "same."],
    ["The", "song", "remains", "the", "same."],
    ["The", "long", "remains", "the", "same."],
    ["The", "song", "remains", "the", "same."],
];
var exampleFilePath2 = "exampleName.csv";
var exampleCSV2 = [
    ["First", "Second", "Third", "Fourth", "Fifth"],
    ["The", "song", "remains", "the", "same."],
    ["The", "song", "remains", "the", "same."],
    ["The", "song", "remains", "the", "same."],
    ["The", "long", "remains", "the", "same."],
    ["The", "song", "remains", "the", "same."],
];
var starsFile = "stars.csv";
var starsCSV = [
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
];
var emptyFile = "empty.csv";
var emptyCSV = [[]];
var singleHeader = "singleHeader.csv";
var singleHeaderCSV = [["Name", "Age", "Hobby", "EyeColor"]];
var singleHeaderRow = "singleHeaderRow.csv";
var singleHeaderRowCSV = [
    ["Name", "Age", "Hobby", "EyeColor"],
    ["Owen", "19", "Guitar", "Brown"],
];
var pplFile = "people.csv";
var pplCSV = [
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
];
var exampleSearchInputFoundIndex = "2song";
var foundRows = [1, 2, 3, 5];
var exampleSearchInputFoundName = "Secondsong";
var searchPeople1 = "Age20";
var searchPeopleRows1 = [1, 3];
var searchPeople2 = "EyeColorBrown";
var searchPeopleRows2 = [1, 2, 3, 4, 5, 6];
var searchStars = "ProperNameMortimer";
var searchStarsRes = [4];
mockedResults.set(exampleSearchInputFoundIndex, foundRows);
mockedResults.set(exampleSearchInputFoundName, foundRows);
mockedResults.set(searchPeople1, searchPeopleRows1);
mockedResults.set(searchPeople2, searchPeopleRows2);
mockedResults.set(searchStars, searchStarsRes);
mockedJson.set(exampleFilePath1, exampleCSV1);
mockedJson.set(exampleFilePath2, exampleCSV2);
mockedJson.set(starsFile, starsCSV);
mockedJson.set(emptyFile, emptyCSV);
mockedJson.set(singleHeader, singleHeaderCSV);
mockedJson.set(pplFile, pplCSV);
mockedJson.set(singleHeaderRow, singleHeaderRowCSV);
export { mockedJson, mockedResults };
