import { AST, FailureExplanationTree } from "../../TreeParseGUIState";

export type HighlightInstruction = SomeChars | WeAreDoneHere;

interface SomeChars { eatChars: number; className: string | null; }

type WeAreDoneHere = "we are done here";

export function areWeDone(hi: HighlightInstruction): hi is WeAreDoneHere {
    return hi === "we are done here";
}

export type HighlightFunction = (lineFrom0: number, charFrom0: number) => HighlightInstruction;

export function highlightFromAst(
    code: string,
    ast: AST,
    lineFrom0: number,
    charFrom0: number) {
    console.log("This is the highlight function");

    // I would rather do this once per update, but sad day.
    const highlightMatches = ast.map((match) => ({
        begin: match.$offset,
        length: match.$value.length,
    }));

    return highlightinate(code, highlightMatches, lineFrom0, charFrom0);
}

export function highlightFromFailureExplanation(
    code: string,
    failureExplanation: FailureExplanationTree,
    lineFrom0: number,
    charFrom0: number) {

    // how far did the match get?

    const lastSuccessfulChild = findLastSuccessfulChild(failureExplanation);
    const lastSuccessfulMatchedChar = lastSuccessfulChild ?
        lastSuccessfulChild.$offset + lastSuccessfulChild.$value.length : 0;

    // I would rather do this once per update, but sad day.
    const highlightMatches = [{
        begin: 0,
        length: lastSuccessfulMatchedChar,
    }];

    return highlightinate(code, highlightMatches, lineFrom0, charFrom0);
}

function findLastSuccessfulChild(failureExplanation: FailureExplanationTree): FailureExplanationTree {
    if (!failureExplanation) {
        return undefined;
    }
    const firstFailedChild = failureExplanation.$children.find((c) => !c.successful);
    if (firstFailedChild) {
        return findLastSuccessfulChild(firstFailedChild);
    }
    const successfulChildren = failureExplanation.$children.filter((c) => c.successful);
    if (!successfulChildren) {
        return undefined;
    }
    const lastSuccessfulChild = successfulChildren[successfulChildren.length - 1];
    return lastSuccessfulChild;
}

function highlightinate(code: string,
                        highlightMatches: Array<{ begin: number, length: number }>,
                        lineFrom0: number,
                        charFrom0: number) {

    if (highlightMatches.length === 0) {
        return "we are done here";
    }

    const offset = offsetInFile(code, lineFrom0, charFrom0);

    const startingMatch = highlightMatches.find((m) => m.begin === offset);
    if (startingMatch) {
        return { eatChars: startingMatch.length, className: "match" };
    }
    const midMatch = highlightMatches.find((m) => m.begin < offset && offset < (m.begin + m.length));
    if (midMatch) {
        return { eatChars: midMatch.begin + midMatch.length - offset, className: "match" };
    }
    const nextMatch = highlightMatches.find((m) => m.begin > offset);
    if (nextMatch) {
        return { eatChars: nextMatch.begin - offset, className: null };
    }

    const lastMatch = highlightMatches[highlightMatches.length - 1];
    if (offset > (lastMatch.begin + lastMatch.length)) {
        return "we are done here";
    }
    console.log("Unexpected offset! " + offset);
    console.log("The matches I know are: " + JSON.stringify(highlightMatches));

    return "we are done here";
}

function offsetInFile(content: string, lineFrom0: number, charFrom0: number): number {
    if (lineFrom0 === 0) {
        return charFrom0;
    }
    const previousLines = content.split("\n").slice(0, lineFrom0).join("\n") + "\n";
    return previousLines.length + charFrom0;
}
