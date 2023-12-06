/** 
 * RECOMMENDATION
 * 
 * To test your code, you should open "tester.html" in a web browser.
 * You can then use the "Developer Tools" to see the JavaScript console.
 * There, you will see the results unit test execution. You are welcome
 * to run the code any way you like, but this is similar to how we will
 * run your code submission.
 * 
 * The Developer Tools in Chrome are available under the "..." menu, 
 * futher hidden under the option "More Tools." In Firefox, they are 
 * under the hamburger (three horizontal lines), also hidden under "More Tools." 
 */

/**
 * @typedef {JSON} Line
 * @property {number} Page - Number of the page with this line in a book
 * @property {number} Line - Number of this line on the page with this line
 * @property {string} Text - Text of this line
 */

/**
 * @typedef {JSON} ExcerptOfBook
 * @property {string} Title - Title of the book of this excerpt
 * @property {number} ISBN - ISBN of the book of this excerpt
 * @property {Line[]} Content - Array of lines in the book of this excerpt
*/

/**
 * @typedef {JSON} SearchResult
 * @property {number} ISBN - ISBN of a book
 * @property {number} Page - Number of the page with the line indicated by
 * number Line
 * @property {number} Line - Number of a line with text containing the word
 * searchTerm or the beginning of the word searchTerm. A word may be split by
 * a hypen across two lines.
 */

/**
 * @typedef {JSON} Result
 * @property {string} SearchTerm - word searchTerm
 * @property {SearchResult[]} - array of search results arrayOfSearchResults
 */

/**
 * Adds a created search result to an array of search results
 * @param {number} isbn - An ISBN
 * @param {number} page - A number of a page
 * @param {number} line - A number of a line
 * @param {SearchResult[]} arrayOfSearchResults
 * @returns {undefined}
 */
function addSearchResultToArrayOfSearchResults(isbn, page, line, arrayOfSearchResults) {

    /** @type {SearchResult} */
    const searchResult = {
        "ISBN": isbn,
        "Page": page,
        "Line": line
    }

    arrayOfSearchResults.push(searchResult);

}

/**
 * Creates array of indices of character in string
 * @param {string} character - character whose indices are stored in an array
 * @param {string} theString - string that is scanned for indices of a character
 * @returns {number[]} arrayOfIndicesOfCharacterInString - array of indices of character in string
 */
function createArrayOfIndicesOfCharacterInString(character, theString) {

    /** @type {number[]} */
    const arrayOfIndicesOfCharacterInString = [];

    /** @type {number} */
    let indexOfCharacterInString = theString.indexOf(character);
    
    while (indexOfCharacterInString !== -1) {

        arrayOfIndicesOfCharacterInString.push(indexOfCharacterInString);

        indexOfCharacterInString = theString.indexOf("-", indexOfCharacterInString + 1);

    }

    return arrayOfIndicesOfCharacterInString;

}


/**
 * Creates search term with optional syllables after the first syllable
 * @param {string} searchTerm - search term
 * @returns searchTermWithOptionalSyllables - search term with optional syllables
 */
function createSearchTermWithOptionalSyllables(searchTerm) {

    /** @type {number[]} */
    const arrayOfIndicesOfHyphenInSearchTerm = createArrayOfIndicesOfCharacterInString('-', searchTerm);
    
    /** @type {string[]} */
    const arrayDerivedFromSearchTerm = searchTerm.split("");

    for (let k = 0; k < arrayOfIndicesOfHyphenInSearchTerm.length; k++) {

        indexOfHyphenInSearchTerm = arrayOfIndicesOfHyphenInSearchTerm[k];

        /** @type {string} */
        const stringWithTwoCharactersBeginningAtIndexOfHyphenInSearchTerm = searchTerm.substring(indexOfHyphenInSearchTerm, indexOfHyphenInSearchTerm + 2);

        if (stringWithTwoCharactersBeginningAtIndexOfHyphenInSearchTerm === "-?") {

            arrayDerivedFromSearchTerm.splice(indexOfHyphenInSearchTerm + 2, 0, "(");

        } else {

            arrayDerivedFromSearchTerm.splice(indexOfHyphenInSearchTerm + 1, 0, "(");

        }

        if (k < arrayOfIndicesOfHyphenInSearchTerm.length - 1) {

            indexOfHyphenInSearchTerm = arrayOfIndicesOfHyphenInSearchTerm[k + 1];

            arrayDerivedFromSearchTerm.splice(indexOfHyphenInSearchTerm, 0, ")?");

        } else {

            arrayDerivedFromSearchTerm.splice(arrayDerivedFromSearchTerm.length, 0, ")?");

        }

    }

    /** @type {string} */
    const searchTermWithOptionalSyllables = arrayDerivedFromSearchTerm.join("");

    return searchTermWithOptionalSyllables;

}

/**
 * Searches for matches in scanned text.
 * @param {string} searchTerm - The word or term we're searching for. A word
 * contains one or more letters and contains either an optional / soft hyphen
 * or a required hyphen after each syllable. A word may contain one or more
 * non-adjacent apostrophes.
 * @param {ExcerptOfBook[]} scannedTextObj - An array of excerpts of books
 * @returns {Result} - A result containing search term searchTerm an an array
 * of search results
 */ 
function findSearchTermInBooks(searchTerm, scannedTextObj) {

    /** @type {SearchResult[]} */
    const arrayOfSearchResults = [];

    /** @type {RegExp} */
    const regularExpressionDerivedFromSearchTerm = new RegExp(searchTerm);

    /** @type {number} */
    const numberOfExcerptsOfBooks = scannedTextObj.length;

    for (let i = 0; i < numberOfExcerptsOfBooks; i++) {

        /** @type {ExcerptOfBook} */
        const excerptOfBook = scannedTextObj[i];

        /** @type {number} */
        const isbn = excerptOfBook.ISBN;

        /** @type {Line[]} */
        const arrayOfLines = excerptOfBook.Content;
        
        /** @type {number} */
        const numberOfLines = arrayOfLines.length;

        for (let j = 0; j < numberOfLines; j++) {

            /** @type {Line} */
            const lineJ = arrayOfLines[j];

            /** @type {string} */
            const textOfLineJ = lineJ.Text;

            if (regularExpressionDerivedFromSearchTerm.test(textOfLineJ)) {

                addSearchResultToArrayOfSearchResults(isbn, lineJ.Page, lineJ.Line, arrayOfSearchResults)

            } else if (textOfLineJ.endsWith('-')) {

                /** @type {string[]} */
                const arrayOfTokensOfLineJ = textOfLineJ.split(/[^a-zA-Z'-]+/);

                /** @type {number} */
                const numberOfTokensOfLineJ = arrayOfTokensOfLineJ.length;

                /** @type {string} */
                const lastTokenOfLineJ = arrayOfTokensOfLineJ[numberOfTokensOfLineJ - 1];

                if (j === numberOfLines - 1) {

                    /** @type {string} */
                    const searchTermWithOptionalSyllables = createSearchTermWithOptionalSyllables(searchTerm);

                    /** @type {RegExp} */
                    const regularExpressionDerivedFromSearchTermWithOptionalSyllables = new RegExp(searchTermWithOptionalSyllables);

                    if (regularExpressionDerivedFromSearchTermWithOptionalSyllables.test(lastTokenOfLineJ)) {

                        addSearchResultToArrayOfSearchResults(isbn, lineJ.Page, lineJ.Line, arrayOfSearchResults)

                    }

                } else {

                    /** @type {Line} */
                    const lineJPlus1 = arrayOfLines[j + 1];

                    /** @type {string} */
                    const textOfLineJPlus1 = lineJPlus1.Text;

                    /** @type {string[]} */
                    const arrayOfTokensOfLineJPlus1 = textOfLineJPlus1.split(/[^a-zA-Z'-]+/);

                    /** @type {string} */
                    const firstTokenOfLineJPlus1 = arrayOfTokensOfLineJPlus1[0];

                    /** @type {string} */
                    const lastTokenOfLineJPlusFirstTokenOfLineJPlus1 = lastTokenOfLineJ + firstTokenOfLineJPlus1;

                    if (regularExpressionDerivedFromSearchTerm.test(lastTokenOfLineJPlusFirstTokenOfLineJPlus1)) {

                        addSearchResultToArrayOfSearchResults(isbn, lineJ.Page, lineJ.Line, arrayOfSearchResults)

                    }

                }

            }

        }

    }

    /**
     * @type {Result}
     */
    const result = {
        "SearchTerm": searchTerm,
        "Results": arrayOfSearchResults
    };

    return result;

}

/** Input object for tests 1, 2, 3, 5, and 8 */
const twentyLeaguesIn = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            },
            {
                "Page": 31,
                "Line": 9,
                "Text": "ness was then profound; and however good the Canadian\'s"
            },
            {
                "Page": 31,
                "Line": 10,
                "Text": "eyes were, I asked myself how he had managed to see, and"
            } 
        ] 
    }
];

const arrayWithExcerptFromTwentyThousandLeaguesUnderTheSeaWithOneLine = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            }
        ] 
    }
];

/** Example input object. */
const arrayOfExcerptsFromBooksWithWordDarkHaired = [
    {
        "Title": "Example Book",
        "ISBN": "0123456789123",
        "Content": [
            {
                "Page": 0,
                "Line": 1,
                "Text": "now simply went on by her own momentum.  The dark-"
            },
            {
                "Page": 0,
                "Line": 2,
                "Text": "haired woman was beautiful; and however good the Canadian\'s"
            },
            {
                "Page": 0,
                "Line": 3,
                "Text": "eyes were, I asked myself how he had managed to see, and"
            } 
        ] 
    }
];
  
/** Example output object */
const twentyLeaguesOut = {
    "SearchTerm": "the",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
};

const outputOfFindSearchTermInBooksForSearchTermDarknessAndArrayTwentyLeaguesIn = {
    "SearchTerm": "dark-?ness",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 8
        }
    ]
};

const outputOfFindSearchTermInBooksForSearchTermDarknessAndArrayWithExcerptFromTwentyThousandLeaguesUnderTheSeaWithOneLine = {
    "SearchTerm": "dark-?ness",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 8
        }
    ]
};

const outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayTwentyLeaguesIn = {
    "SearchTerm": "dark-haired",
    "Results": []
};

const outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayWithExcerptFromTwentyThousandLeaguesUnderTheSeaWithOneLine = {
    "SearchTerm": "dark-haired",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 8
        }
    ]
};

const outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayOfExcerptsFromBooksWithWordDarkHaired = {
    "SearchTerm": "dark-haired",
    "Results": [
        {
            "ISBN": "0123456789123",
            "Page": 0,
            "Line": 1
        }
    ]
};

const outputOfFindSearchTermInBooksForSearchTermCanadiansAndTwentyLeaguesIn = {
    "SearchTerm": "Canadian's",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
};

/*
 _   _ _   _ ___ _____   _____ _____ ____ _____ ____  
| | | | \ | |_ _|_   _| |_   _| ____/ ___|_   _/ ___| 
| | | |  \| || |  | |     | | |  _| \___ \ | | \___ \ 
| |_| | |\  || |  | |     | | | |___ ___) || |  ___) |
 \___/|_| \_|___| |_|     |_| |_____|____/ |_| |____/ 
                                                      
 */

/* We have provided two unit tests. They're really just `if` statements that 
 * output to the console. We've provided two tests as examples, and 
 * they should pass with a correct implementation of `findSearchTermInBooks`. 
 * 
 * Please add your unit tests below.
 * */

/** We can check that, given a known input, we get a known output. */

/* Test 1 */
const test1result = findSearchTermInBooks("the", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut) === JSON.stringify(test1result)) {
    console.log("PASS: Test 1 - Word 'the' is found once on page 31, line 9 of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
} else {
    console.log("FAIL: Test 1 - Word 'the' is found once on page 31, line 9 of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
    console.log("Expected:", twentyLeaguesOut);
    console.log("Received:", test1result);
}

/** We could choose to check that we get the right number of results. */

/* Test 2 */
const test2result = findSearchTermInBooks("the", twentyLeaguesIn); 
if (test2result.Results.length == 1) {
    console.log("PASS: Test 2 - Word 'the' is found once on page 31, line 9 of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
} else {
    console.log("FAIL: Test 2 - Word 'the' is found once on page 31, line 9 of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
    console.log("Expected:", twentyLeaguesOut.Results.length);
    console.log("Received:", test2result.Results.length);
}

/* Test 3 */
const test3result = findSearchTermInBooks("dark-?ness", twentyLeaguesIn);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermDarknessAndArrayTwentyLeaguesIn) === JSON.stringify(test3result)) {
    console.log("PASS: Test 3 - Word 'darkness' is found once on page 31, line 8 (and line 9) of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
} else {
    console.log("FAIL: Test 3 - Word 'darkness' is found once on page 31, line 8 (and line 9) of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermDarknessAndArrayTwentyLeaguesIn);
    console.log("Received:", test3result);
}

/* Test 4 */
const test4result = findSearchTermInBooks("dark-?ness", arrayWithExcerptFromTwentyThousandLeaguesUnderTheSeaWithOneLine);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermDarknessAndArrayWithExcerptFromTwentyThousandLeaguesUnderTheSeaWithOneLine) === JSON.stringify(test4result)) {
    console.log("PASS: Test 4 - Beginning of 'darkness' is found once on page 31, line 8 of excerpt of Twenty Thousand Leagues Under The Sea with 1 line");
} else {
    console.log("FAIL: Test 4 - Beginning of 'darkness' is found once on page 31, line 8 of excerpt of Twenty Thousand Leagues Under The Sea with 1 line");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermDarknessAndArrayWithExcerptFromTwentyThousandLeaguesUnderTheSeaWithOneLine);
    console.log("Received:", test4result);
}

/* Test 5 */
const test5result = findSearchTermInBooks("dark-haired", twentyLeaguesIn);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayTwentyLeaguesIn) === JSON.stringify(test5result)) {
    console.log("PASS: Test 5 - Word 'dark-haired' is not found in excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
} else {
    console.log("FAIL: Test 5 - Word 'dark-haired' is not found in excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayTwentyLeaguesIn);
    console.log("Received:", test5result);
}

/* Test 6 */
const test6result = findSearchTermInBooks("dark-haired", arrayWithExcerptFromTwentyThousandLeaguesUnderTheSeaWithOneLine);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayWithExcerptFromTwentyThousandLeaguesUnderTheSeaWithOneLine) === JSON.stringify(test6result)) {
    console.log("PASS: Test 6 - Beginning of 'dark-haired' is found once on page 31, line 8 of excerpt of Twenty Thousand Leagues Under The Sea with 1 line");
} else {
    console.log("FAIL: Test 6 - Beginning of 'dark-haired' is found once on page 31, line 8 of excerpt of Twenty Thousand Leagues Under The Sea with 1 line");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayWithExcerptFromTwentyThousandLeaguesUnderTheSeaWithOneLine);
    console.log("Received:", test6result);
}

/* Test 7 */
const test7result = findSearchTermInBooks("dark-haired", arrayOfExcerptsFromBooksWithWordDarkHaired);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayOfExcerptsFromBooksWithWordDarkHaired) === JSON.stringify(test7result)) {
    console.log("PASS: Test 7 - Word 'dark-haired' is found once on page 31, line 8 of excerpt of Example Book");
} else {
    console.log("FAIL: Test 7 - Word 'dark-haired' is found once on page 31, line 8 of excerpt of Example Book");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayOfExcerptsFromBooksWithWordDarkHaired);
    console.log("Received:", test7result);
}

/* Test 8 */
const test8result = findSearchTermInBooks("Canadian's", twentyLeaguesIn);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermCanadiansAndTwentyLeaguesIn) === JSON.stringify(test8result)) {
    console.log("PASS: Test 8 - Word 'Canadian\'s' is found once on page 31, line 9 of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
} else {
    console.log("FAIL: Test 8 - Word 'Canadian\'s' is found once on page 31, line 9 of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermCanadiansAndTwentyLeaguesIn);
    console.log("Received:", test8result);
}