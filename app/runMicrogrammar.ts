import * as mgModule from "@atomist/microgrammar";
import {
    MatchScope,
    ParseResponse,
} from "./TreeParseGUIState";

export function runMicrogrammar(params: {
    parseThis: string,
    phrase: string,
    termDefinitionJS: string,
    matchScope: MatchScope,
}): ParseResponse {

    const { phrase, parseThis, termDefinitionJS, matchScope } = params;

    let terms: (mg) => mgModule.TermsDefinition<any>;
    try {
        terms = Function(`"use strict";return (${termDefinitionJS})`)()(mgModule);
    } catch (e) {
        console.log("Failed to parse terms: " + e.message);
        return {
            error: {
                message: e.message,
                complainAbout: "microgrammar terms",
            },
        };
    }
    console.log("Terms have been parsed.");

    let mg: mgModule.Grammar<any>;
    try {
        mg = mgModule.microgrammar({ phrase, terms });
    } catch (e) {
        console.log("Failed to parse microgrammar: " + e.message);
        return {
            error: {
                message: e.message,
                complainAbout: "microgrammar phrase",
                // todo: provide the tree
            },
        };
    }
    console.log("Microgrammar has been parsed.");

    if (matchScope === MatchScope.within) {
        const r = (mg as mgModule.Microgrammar<any>).matchReportIterator(parseThis);
        const allMatches = Array.from(r);
        return {
            ast: allMatches.map((mr) => mr.toParseTree()),
            valueStructure: allMatches.map((mr) => mr.toValueStructure()),
        };
    } else { // perfect match
        const mr = mg.perfectMatch(parseThis);
        if (mgModule.isSuccessfulMatchReport(mr)) {
            return {
                ast: [mr.toParseTree()],
                valueStructure: [mr.toValueStructure()],
            };
        } else { // failed
            return {
                failureExplanation: mr.toExplanationTree(),
            };
        }
    }
}
