import * as _ from "lodash";
import React from "react";
import { runMicrogrammar } from "../runMicrogrammar";
import {
  DataToParse,
  isErrorResponse, isNoPerfectMatch, MatchScope, ParseResponse, ParserInputProps, TreeChoices, TreeParseGUIState,
} from "../TreeParseGUIState";
import { highlightFromAst, highlightFromFailureExplanation, HighlightFunction } from "./codeSubmission/highlightCode";
import { ParserInput } from "./codeSubmission/ParserInput";
import { ErrorDisplay } from "./ErrorDisplay";
import { Tree } from "./jsonDisplay/tree";
import { availableTreeChoices, effectiveTreeChoice, howToDisplayTree, TreeChoice } from "./jsonDisplay/TreeChoice";
import { init as initMicrogrammarInput, MicrogrammarInputData } from "./MicrogrammarInput";
import { HeaderBar } from "./headerBar";

/* the main page for the index route of this app */
export class TreeParseGUI extends React.Component<{},
  TreeParseGUIState> {

  constructor(props) {
    super(props);
    this.state = {
      displayCode: false,
      parserInput: {
        code: "blah<other><thing> haha",
        microgrammarInput: initMicrogrammarInput,
      },
      microgrammarInput: initMicrogrammarInput,
      ast: [],
      chosenTree: TreeChoices.valueStructure,
      valueStructure: [],
      matchScope: MatchScope.within,
    };
  }

  public componentDidMount() {
    this.updateTree();
  }

  public updateTree = _.debounce(async () => {
    const dataToParse: DataToParse = {
      parser: this.state.parserInput.microgrammarInput,
      code: this.state.parserInput.code,
      matchScope: this.state.matchScope,
    };
    const parseResponse = await getTree(dataToParse);
    if (isErrorResponse(parseResponse)) {
      return this.setState({
        ast: [], valueStructure: [],
        failureExplanation: undefined,
        error: parseResponse,
      });
    }
    if (isNoPerfectMatch(parseResponse)) {
      return this.setState({
        ast: [], valueStructure: [],
        error: undefined,
        failureExplanation: parseResponse.failureExplanation,
      });
    }
    return this.setState({
      error: undefined, failureExplanation: undefined,
      ast: parseResponse.ast,
      valueStructure: parseResponse.valueStructure,
    });
  }, 500);

  public handleParserInputChange = async (data: ParserInputProps) => {
    console.log("in handleParserInputChange. data: ", data);
    await this.setState((s) => ({ parserInput: _.merge(s.parserInput, data), ast: [] }));
    this.updateTree();
  }

  public handleMicrogrammarInputChange = async (data: MicrogrammarInputData) => {
    console.log("in handleMicrogrammarInputChange. data: ", data);
    await this.setState((s) => ({ microgrammarInput: _.merge(s.microgrammarInput, data), ast: [] }));
    this.updateTree();
  }

  public changeMatchScope = async (event: React.ChangeEvent, matchScope: MatchScope) => {
    await this.setState((s) => ({ matchScope }));
    this.updateTree();
  }

  public updateChosenTree = async (event: React.ChangeEvent, tc: TreeChoices) => {
    this.setState((s) => ({ chosenTree: tc }));
  }

  public highlightFn: HighlightFunction = (lineFrom0: number, charFrom0: number) => {
    if (this.state.chosenTree === TreeChoices.parsingError) {
      return highlightFromFailureExplanation(this.state.parserInput.code,
        this.state.failureExplanation, lineFrom0, charFrom0);
    } else {
      return highlightFromAst(this.state.parserInput.code, this.state.ast, lineFrom0, charFrom0);
    }
  }

  public render() {

    const treeToDisplay = effectiveTreeChoice(this.state);

    const treeChoice = howToDisplayTree(this.state, treeToDisplay);

    console.log("rendering hello");
    return (
      <div className="gooeyOutside">
        <HeaderBar />
        <div style={{ display: "flex" }}>
          <div>
            <ErrorDisplay possibleError={this.state.error} />
            <ParserInput
              parserInput={this.state.parserInput}
              updateFn={this.handleParserInputChange}
              highlightFn={this.highlightFn}
              errorResponse={this.state.error}
              changeMatchScope={this.changeMatchScope}
              matchScope={this.state.matchScope}
              microgrammarInput={this.state.microgrammarInput}
              mgUpdateFn={this.handleMicrogrammarInputChange}
            />
          </div>
          <div className="preview"
            style={{ width: "50%" }}>
            <TreeChoice treeToDisplay={treeToDisplay}
              availableChoices={availableTreeChoices(this.state)}
              chooseTree={this.updateChosenTree} />
            <Tree
              treeToRender={treeChoice.treeToRender}
              theme={treeChoice.theme} />
          </div>
        </div>
      </div>
    );
  }
}

async function getTree(dataToParse: DataToParse): Promise<ParseResponse> {
  return runMicrogrammar(
    {
      parseThis: dataToParse.code,
      phrase: dataToParse.parser.microgrammarString,
      termDefinitionJS: dataToParse.parser.terms,
      matchScope: dataToParse.matchScope,
    },
  );
}
