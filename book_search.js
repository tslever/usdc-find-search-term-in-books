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
 * @property {string} ISBN - ISBN of the book of this excerpt
 * @property {Line[]} Content - Array of lines in the book of this excerpt
*/

/**
 * @typedef {JSON} SearchResult
 * @property {string} ISBN - ISBN of a book
 * @property {number} Page - Number of the page with the line indicated by
 * number Line
 * @property {number} Line - Number of a line with text containing the word
 * searchTerm or the beginning of the word searchTerm. If a word is split by a
 * hyphen across two lines, a search result for the former line will be
 * provided.
 */

/**
 * @typedef {JSON} Result
 * @property {string} SearchTerm - word searchTerm
 * @property {SearchResult[]} - array of search results arrayOfSearchResults
 */

/**
 * Adds a created search result to an array of search results
 * @param {string} isbn - An ISBN
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
 * Creates search term with optional syllables after the first syllable
 * @param {string} searchTerm - search term
 * @returns searchTermWithOptionalSyllabicPhrases - search term with optional syllables
 */
function createSearchTermWithOptionalSyllabicPhrases(searchTerm) {

    let searchTermWithOptionalSyllabicPhrases = "";

    let numberOfOpenParentheses = 0;

    let k;

    for (k = 0; k < searchTerm.length - 1; k++) {

        if (searchTerm[k] === '-' && searchTerm[k + 1] !== '?') {

            searchTermWithOptionalSyllabicPhrases = searchTermWithOptionalSyllabicPhrases + "-(";

            numberOfOpenParentheses++;

        } else if (searchTerm[k] === '-' && searchTerm[k + 1] === '?') {

            searchTermWithOptionalSyllabicPhrases = searchTermWithOptionalSyllabicPhrases + "-?(";

            k = k + 1;

            numberOfOpenParentheses++;

        } else {

            searchTermWithOptionalSyllabicPhrases = searchTermWithOptionalSyllabicPhrases + searchTerm[k];

        }

    }

    searchTermWithOptionalSyllabicPhrases = searchTermWithOptionalSyllabicPhrases + searchTerm[k];

    for (let l = 0; l < numberOfOpenParentheses; l++) {

        searchTermWithOptionalSyllabicPhrases = searchTermWithOptionalSyllabicPhrases + ")?";

    }

    return searchTermWithOptionalSyllabicPhrases;

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
        let arrayOfLines = null;

        /** @type {number} */
        let numberOfLines = 0;
        
        if (excerptOfBook.hasOwnProperty('Content')) {
            
            arrayOfLines = excerptOfBook.Content;

            numberOfLines = arrayOfLines.length;

        }

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
                    const searchTermWithOptionalSyllabicPhrases = createSearchTermWithOptionalSyllabicPhrases(searchTerm);

                    /** @type {RegExp} */
                    const regularExpressionDerivedFromSearchTermWithOptionalSyllabicPhrases = new RegExp(searchTermWithOptionalSyllabicPhrases);

                    if (regularExpressionDerivedFromSearchTermWithOptionalSyllabicPhrases.test(lastTokenOfLineJ)) {

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

/** Input object for tests 1, 2, 3, 5, 8, and 11 */
/** @type {ExcerptOfBook[]} */
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

/** Input object for tests 4 and 6 */
/** @type {ExcerptOfBook[]} */
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

/** Input object for test 7 */
/** @type {ExcerptOfBook[]} */
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

/** Input object for test 9 */
/** @type {ExcerptOfBook[]} */
const arrayOfZeroExcerptsFromBooks = []

/** Input object for test 10 */
/** @type {ExcerptOfBook[]} */
const arrayOfExcerptFromBookWithNoContent = [
    {
        "Title": "Book With No Content",
        "ISBN": "3219876543210"
    }
]

/** Input object for test 13 */
/** @type {ExcerptOfBook[]} */
const arrayOfExcerptFromBookWithMoOnLastLine = [
    {
        "Title": "Mo-",
        "ISBN": "0246813579024",
        "Content": [
            {
                "Page": 0,
                "Line": 1,
                "Text": "The mother of a person's spouse is that person's mo-"
            }
        ] 
    }
];

/** Input object for test 14 */
/** @type {ExcerptOfBook[]} */
const arrayOfExcerptFromBookWithMotherOnLastLine = [
    {
        "Title": "Mother-",
        "ISBN": "0246813579024",
        "Content": [
            {
                "Page": 0,
                "Line": 1,
                "Text": "The mother of a person's spouse is that person's mother-"
            }
        ] 
    }
];

/** Input object for test 15 */
/** @type {ExcerptOfBook[]} */
const arrayOfExcerptFromBookWithMotherInOnLastLine = [
    {
        "Title": "Mother-In-",
        "ISBN": "0246813579024",
        "Content": [
            {
                "Page": 0,
                "Line": 1,
                "Text": "The mother of a person's spouse is that person's mother-in-"
            }
        ] 
    }
];
  
/** Output object for tests 1 and 2 */
/** @type {Result} */
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

/** Output object for test 3 */
/** @type {Result} */
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

/** Output object for test 4 */
/** @type {Result} */
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

/** Output object for test 5 */
/** @type {Result} */
const outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayTwentyLeaguesIn = {
    "SearchTerm": "dark-haired",
    "Results": []
};

/** Output object for test 6 */
/** @type {Result} */
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

/** Output object for test 7 */
/** @type {Result} */
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

/** Output object for test 8 */
/** @type {Result} */
const outputOfFindSearchTermInBooksForSearchTermCanadiansAndTwentyLeaguesIn = {
    "SearchTerm": "Ca-?na-?di-?an's",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
};

/** Output object for test 9 */
/** @type {Result} */
const outputOfFindSearchTermInBooksForSearchTermTheAndArrayOfZeroExcerptsFromBooks = {
    "SearchTerm": "the",
    "Results": []
}

/** Output object for test 10 */
/** @type {Result} */
const outputOfFindSearchTermInBooksForSearchTermTheAndArrayOfExcerptOfBookWithNoContent = {
    "SearchTerm": "the",
    "Results": []
}

/** Output object for test 11 */
/** @type {Result} */
const outputOfFindSearchTermInBooksForSearchTermTheAndArrayTwentyLeaguesIn = {
    "SearchTerm": "The",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 8
        }
    ]
};

/** Output object for tests 13, 14, and 15 */
/** @type {Result} */
const outputOfFindSearchTermInBooksForSearchTermMotherInLawAndArrayOfExcerptFromBooksWithMoMotherOrMotherInOnLastLine = {
    "SearchTerm": "mo-?ther-in-law",
    "Results": [
        {
            "ISBN": "0246813579024",
            "Page": 0,
            "Line": 1
        }
    ] 
}

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
/** @type {Result} */
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
/** @type {Result} */
const test2result = findSearchTermInBooks("the", twentyLeaguesIn); 
if (test2result.Results.length == 1) {
    console.log("PASS: Test 2 - Word 'the' is found once on page 31, line 9 of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
} else {
    console.log("FAIL: Test 2 - Word 'the' is found once on page 31, line 9 of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
    console.log("Expected:", twentyLeaguesOut.Results.length);
    console.log("Received:", test2result.Results.length);
}

/* Test 3 */
/** @type {Result} */
const test3result = findSearchTermInBooks("dark-?ness", twentyLeaguesIn);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermDarknessAndArrayTwentyLeaguesIn) === JSON.stringify(test3result)) {
    console.log("PASS: Test 3 - Word 'darkness' is found once on page 31, line 8 and line 9 of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
} else {
    console.log("FAIL: Test 3 - Word 'darkness' is found once on page 31, line 8 and line 9 of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermDarknessAndArrayTwentyLeaguesIn);
    console.log("Received:", test3result);
}

/* Test 4 */
/** @type {Result} */
const test4result = findSearchTermInBooks("dark-?ness", arrayWithExcerptFromTwentyThousandLeaguesUnderTheSeaWithOneLine);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermDarknessAndArrayWithExcerptFromTwentyThousandLeaguesUnderTheSeaWithOneLine) === JSON.stringify(test4result)) {
    console.log("PASS: Test 4 - Beginning of 'darkness' is found once on page 31, line 8 of excerpt of Twenty Thousand Leagues Under The Sea with 1 line");
} else {
    console.log("FAIL: Test 4 - Beginning of 'darkness' is found once on page 31, line 8 of excerpt of Twenty Thousand Leagues Under The Sea with 1 line");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermDarknessAndArrayWithExcerptFromTwentyThousandLeaguesUnderTheSeaWithOneLine);
    console.log("Received:", test4result);
}

/* Test 5 */
/** @type {Result} */
const test5result = findSearchTermInBooks("dark-haired", twentyLeaguesIn);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayTwentyLeaguesIn) === JSON.stringify(test5result)) {
    console.log("PASS: Test 5 - Word 'dark-haired' is not found in excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
} else {
    console.log("FAIL: Test 5 - Word 'dark-haired' is not found in excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayTwentyLeaguesIn);
    console.log("Received:", test5result);
}

/* Test 6 */
/** @type {Result} */
const test6result = findSearchTermInBooks("dark-haired", arrayWithExcerptFromTwentyThousandLeaguesUnderTheSeaWithOneLine);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayWithExcerptFromTwentyThousandLeaguesUnderTheSeaWithOneLine) === JSON.stringify(test6result)) {
    console.log("PASS: Test 6 - Beginning of 'dark-haired' is found once on page 31, line 8 of excerpt of Twenty Thousand Leagues Under The Sea with 1 line");
} else {
    console.log("FAIL: Test 6 - Beginning of 'dark-haired' is found once on page 31, line 8 of excerpt of Twenty Thousand Leagues Under The Sea with 1 line");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayWithExcerptFromTwentyThousandLeaguesUnderTheSeaWithOneLine);
    console.log("Received:", test6result);
}

/* Test 7 */
/** @type {Result} */
const test7result = findSearchTermInBooks("dark-haired", arrayOfExcerptsFromBooksWithWordDarkHaired);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayOfExcerptsFromBooksWithWordDarkHaired) === JSON.stringify(test7result)) {
    console.log("PASS: Test 7 - Word 'dark-haired' is found once on page 31, line 8 of excerpt of Example Book");
} else {
    console.log("FAIL: Test 7 - Word 'dark-haired' is found once on page 31, line 8 of excerpt of Example Book");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermDarkHairedAndArrayOfExcerptsFromBooksWithWordDarkHaired);
    console.log("Received:", test7result);
}

/* Test 8 */
/** @type {Result} */
const test8result = findSearchTermInBooks("Ca-?na-?di-?an's", twentyLeaguesIn);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermCanadiansAndTwentyLeaguesIn) === JSON.stringify(test8result)) {
    console.log("PASS: Test 8 - Word 'Canadian\'s' is found once on page 31, line 9 of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
} else {
    console.log("FAIL: Test 8 - Word 'Canadian\'s' is found once on page 31, line 9 of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermCanadiansAndTwentyLeaguesIn);
    console.log("Received:", test8result);
}

/* Test 9 */
/** @type {Result} */
const test9result = findSearchTermInBooks("the", arrayOfZeroExcerptsFromBooks);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermTheAndArrayOfZeroExcerptsFromBooks) === JSON.stringify(test9result)) {
    console.log("PASS: Test 9 - Word 'the' is not found when there are no excerpts of books");
} else {
    console.log("FAIL: Test 9 - Word 'the' is not found when there are no excerpts of books");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermTheAndArrayOfZeroExcerptsFromBooks);
    console.log("Received:", test9result);
}

/* Test 10 */
/** @type {Result} */
const test10result = findSearchTermInBooks("the", arrayOfExcerptFromBookWithNoContent);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermTheAndArrayOfExcerptOfBookWithNoContent) === JSON.stringify(test10result)) {
    console.log("PASS: Test 10 - Word 'the' is not found in an excerpt of a book with no lines");
} else {
    console.log("FAIL: Test 10 - Word 'the' is not found in an excerpt of a book with no lines");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermTheAndArrayOfExcerptOfBookWithNoContent);
    console.log("Received:", test10result);
}

/* Test 11 */
/** @type {Result} */
const test11result = findSearchTermInBooks("The", twentyLeaguesIn);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermTheAndArrayTwentyLeaguesIn) === JSON.stringify(test11result)) {
    console.log("PASS: Test 11 - Word 'The' is found once on page 31, line 8 of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
} else {
    console.log("FAIL: Test 11 - Word 'The' is found once on page 31, line 8 of excerpt of Twenty Thousand Leagues Under The Sea with 3 lines");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermTheAndArrayTwentyLeaguesIn);
    console.log("Received:", test11result);
}

/* Test 12 */
/** @type {Result} */
const test12result = createSearchTermWithOptionalSyllabicPhrases("mo-?ther-in-law");
if (test12result === "mo-?(ther-(in-(law)?)?)?") {
    console.log("PASS: Test 12 - createSearchTermWithOptionalSyllabicPhrases(\"mo-?ther-in-law\") returns \"mo-?(ther-(in-(law)?)?)?\"")
}

/* Test 13 */
/** @type {Result} */
const test13result = findSearchTermInBooks("mo-?ther-in-law", arrayOfExcerptFromBookWithMoOnLastLine);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermMotherInLawAndArrayOfExcerptFromBooksWithMoMotherOrMotherInOnLastLine) === JSON.stringify(test13result)) {
    console.log("PASS: Test 13 - Word 'mo-?ther-in-law' is found once on page 0, line 1 of excerpt of Mo-");
} else {
    console.log("FAIL: Test 13 - Word 'mo-?ther-in-law' is found once on page 0, line 1 of excerpt of Mo-");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermMotherInLawAndArrayOfExcerptFromBooksWithMoMotherOrMotherInOnLastLine);
    console.log("Received:", test13result);
}

/* Test 14 */
/** @type {Result} */
const test14result = findSearchTermInBooks("mo-?ther-in-law", arrayOfExcerptFromBookWithMotherOnLastLine);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermMotherInLawAndArrayOfExcerptFromBooksWithMoMotherOrMotherInOnLastLine) === JSON.stringify(test14result)) {
    console.log("PASS: Test 14 - Word 'mo-?ther-in-law' is found once on page 0, line 1 of excerpt of Mother-");
} else {
    console.log("FAIL: Test 14 - Word 'mo-?ther-in-law' is found once on page 0, line 1 of excerpt of Mother-");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermMotherInLawAndArrayOfExcerptFromBooksWithMoMotherOrMotherInOnLastLine);
    console.log("Received:", test14result);
}

/* Test 15 */
/** @type {Result} */
const test15result = findSearchTermInBooks("mo-?ther-in-law", arrayOfExcerptFromBookWithMotherInOnLastLine);
if (JSON.stringify(outputOfFindSearchTermInBooksForSearchTermMotherInLawAndArrayOfExcerptFromBooksWithMoMotherOrMotherInOnLastLine) === JSON.stringify(test15result)) {
    console.log("PASS: Test 15 - Word 'mo-?ther-in-law' is found once on page 0, line 1 of excerpt of Mother-In-");
} else {
    console.log("FAIL: Test 15 - Word 'mo-?ther-in-law' is found once on page 0, line 1 of excerpt of Mother-In-");
    console.log("Expected:", outputOfFindSearchTermInBooksForSearchTermMotherInLawAndArrayOfExcerptFromBooksWithMoMotherOrMotherInOnLastLine);
    console.log("Received:", test15result);
}