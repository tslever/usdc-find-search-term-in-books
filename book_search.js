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
 * Searches for matches in scanned text.
 * @param {string} searchTerm - The word or term we're searching for. 
 * @param {JSON} scannedTextObj - A JSON object representing the scanned text.
 * @returns {JSON} - Search results.
 */ 
function findSearchTermInBooks(searchTerm, scannedTextObj) {

    /**
     * @typedef {Object} Line
     * @property {number} Page - Number of the page with this line in a book
     * @property {number} Line - Number of this line on the page with this line
     * @property {string} Text - Text of this line
     */

    /**
     * @typedef {Object} Book
     * @property {string} Title - Title of this book
     * @property {string} ISBN - ISBN of this book
     * @property {Line[]} Content - Array of lines in this book
    */

    /**
     * @typedef {Object} SearchResult
     * @property {string} ISBN - ISBN of a book
     * @property {number} Page - Number of the page with the line indicated by number Line
     * @property {number} Line - Number of a line with text containing the word searchTerm or the beginning of the word searchTerm. A word may be split by a hypen across two lines.
     */

    /**
     * @typedef {Object} Result
     * @property {string} SearchTerm - word searchTerm
     * @property {SearchResult[]} - array of search results arrayOfSearchResults
     */

    /** @type {SearchResult[]} */
    const arrayOfSearchResults = [];

    for (let i = 0; i < scannedTextObj.length; i++) {

        /** @type {Book} */
        const book = scannedTextObj[i];

        /** @type {string} */
        const isbn = book.ISBN;

        /** @type {Line[]} */
        const arrayOfLines = book.Content;
        
        /** @type {number} */
        const numberOfLines = arrayOfLines.length;

        for (let j = 0; j < numberOfLines; j++) {

            /** @type {Line} */
            const lineJ = arrayOfLines[j];

            /** @type {string} */
            const textOfLineJ = lineJ.Text;

            if (textOfLineJ.includes(searchTerm)) {

                /** @type {SearchResult} */
                const searchResult = {
                    "ISBN": isbn,
                    "Page": lineJ.Page,
                    "Line": lineJ.Line
                }

                arrayOfSearchResults.push(searchResult);

            } else if (textOfLineJ.endsWith("-")) {

                /** @type {string[]} */
                const arrayOfTokensOfLineJ = textOfLineJ.split(" ");

                /** @type {string} */
                const lastToken = arrayOfTokensOfLineJ[arrayOfTokensOfLineJ.length - 1];

                /** @type {string} */
                const lastTokenMinusHyphen = lastToken.slice(0, -1);

                if (j === numberOfLines - 1) {

                    if (searchTerm.includes("-")) {

                        if (searchTerm.startsWith(lastToken)) {

                            /** @type {SearchResult} */
                            const searchResult = {
                                "ISBN": isbn,
                                "Page": lineJ.Page,
                                "Line": lineJ.Line
                            }

                            arrayOfSearchResults.push(searchResult);

                            console.log(
                                "Search term starts with last token of content of book.\n" +
                                "Array of search results includes the last line of content even though search term was not found in last line."
                            );

                        }

                    } else {

                        if (searchTerm.startsWith(lastTokenMinusHyphen)) {

                            /** @type {SearchResult} */
                            const searchResult = {
                                "ISBN": isbn,
                                "Page": lineJ.Page,
                                "Line": lineJ.Line
                            }

                            arrayOfSearchResults.push(searchResult);

                            console.log(
                                "Search term starts with last token, minus hyphen, of content of book.\n" +
                                "Array of search results includes the last line of content even though search term was not found in last line."
                            );

                        }

                    }

                } else {

                    /** @type {Line} */
                    const lineJPlus1 = arrayOfLines[j + 1];

                    /** @type {string} */
                    const textOfLineJPlus1 = lineJPlus1.Text;

                    /** @type {string[]} */
                    const arrayOfTokens = textOfLineJPlus1.split(" ");

                    /** @type {string} */
                    const firstToken = arrayOfTokens[0];

                    if (searchTerm.includes("-")) {

                        /** @type {string} */
                        const lastTokenPlusFirstToken = lastToken + firstToken;

                        if (searchTerm === lastTokenPlusFirstToken) {

                            /** @type {SearchResult} */
                            const searchResult = {
                                "ISBN": isbn,
                                "Page": lineJ.Page,
                                "Line": lineJ.Line
                            }

                            arrayOfSearchResults.push(searchResult);

                        }

                    } else {

                        /** @type {string} */
                        const lastTokenMinusHyphenPlusFirstToken = lastTokenMinusHyphen + firstToken;

                        if (searchTerm === lastTokenMinusHyphenPlusFirstToken) {

                            /** @type {SearchResult} */
                            const searchResult = {
                                "ISBN": isbn,
                                "Page": lineJ.Page,
                                "Line": lineJ.Line
                            }

                            arrayOfSearchResults.push(searchResult);

                        }

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

/** Example input object. */
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
]
    
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
const test1result = findSearchTermInBooks("the", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut) === JSON.stringify(test1result)) {
    console.log("PASS: Test 1");
} else {
    console.log("FAIL: Test 1");
    console.log("Expected:", twentyLeaguesOut);
    console.log("Received:", test1result);
}

/** We could choose to check that we get the right number of results. */
const test2result = findSearchTermInBooks("the", twentyLeaguesIn); 
if (test2result.Results.length == 1) {
    console.log("PASS: Test 2");
} else {
    console.log("FAIL: Test 2");
    console.log("Expected:", twentyLeaguesOut.Results.length);
    console.log("Received:", test2result.Results.length);
}
