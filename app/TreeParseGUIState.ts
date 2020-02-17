import { MatchExplanationTreeNode } from "@atomist/microgrammar";
import { MicrogrammarInputProps } from "./components/MicrogrammarInput";

export interface MicrogrammarParserSpec {
    microgrammarString: string;
    terms: string;
}

// server interface
export interface DataToParse {
    code: string;
    parser: MicrogrammarParserSpec;
    matchScope: MatchScope;
}
export interface TreeNodeCompatible {

    /**
     * Name of the node, available in path expressions
     */
    readonly $name: string;

    /**
     * Children of the node if it's a non-terminal
     */
    $children?: TreeNodeCompatible[];

    /**
     * String represented by this tree node
     */
    $value: string;

    /**
     * Offset from 0 in the file
     */
    readonly $offset: number;

}

export type AST = TreeNodeCompatible[];

export interface ParserInputProps {
    microgrammarInput: MicrogrammarInputProps;
    code: string;
}

export enum MatchScope { exact = "matchExact", within = "matchWithin" }

export type FailureExplanationTree = MatchExplanationTreeNode;

export interface TreeParseGUIState {
    displayCode: boolean;
    ast: AST;
    valueStructure: any[];
    failureExplanation?: FailureExplanationTree;
    error?: ErrorResponse;
    parserInput: ParserInputProps;
    microgrammarInput: MicrogrammarInputProps;
    chosenTree: TreeChoices;
    matchScope: MatchScope;
}

export enum TreeChoices {
    ast = "parseThis",
    parsingError = "error",
    valueStructure = "valueStructure",
}

export interface ErrorResponse {
    error: {
        message: string,
        complainAbout?: KnownErrorLocation,
    };
}

export interface NoPerfectMatch {
    failureExplanation: FailureExplanationTree;
}

export type KnownErrorLocation = "code parse" | "microgrammar terms" | "microgrammar phrase";

export type ParseResponse = {
    ast: AST,
    valueStructure: any[],
} | ErrorResponse | NoPerfectMatch;

export function isErrorResponse(pr: ParseResponse): pr is ErrorResponse {
    const maybe = pr as ErrorResponse;
    return !!maybe.error;
}

export function isNoPerfectMatch(pr: ParseResponse): pr is NoPerfectMatch {
    const maybe = pr as NoPerfectMatch;
    return !!maybe.failureExplanation;
}
