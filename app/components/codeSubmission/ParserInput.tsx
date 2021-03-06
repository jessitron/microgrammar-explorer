import { FormControl, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import React from "react";
import { ErrorResponse, MatchScope, ParserInputProps } from "../../TreeParseGUIState";
import { MicrogrammarInput, MicrogrammarInputData } from "../MicrogrammarInput";
import { CodeDisplay } from "./codeDisplay";
import { HighlightFunction } from "./highlightCode";
import { RadioChoiceSpec, ChoiceGroup } from "../ChoiceGroup";

export interface AllParserInputProps {
  parserInput: ParserInputProps;
  microgrammarInput: MicrogrammarInputData;
  mgUpdateFn: (dtp: Partial<MicrogrammarInputData>) => Promise<void>;
  highlightFn: HighlightFunction;
  errorResponse?: ErrorResponse;
  matchScope: MatchScope;
  updateFn: (dtp: Partial<ParserInputProps>) => Promise<void>;
  changeMatchScope: (ce: React.ChangeEvent, ms: MatchScope) => Promise<void>;
}

export class ParserInput extends React.Component<AllParserInputProps, {}> {
  constructor(props) {
    super(props);
  }

  public handleCodeChange = (code: string) => {
    this.props.updateFn({ code });
  }

  public handleSubmit = (event) => {
    console.log("You pushed submit.");
    event.preventDefault();
  }

  public radioInputs(name, valueAndLabelses) {
    const oneInput = (value, label) => {
      return <FormControlLabel
        value={value} name={name}
        control={<Radio color="primary" />}
        label={label}
        color="white"
        key={value} />;
    };
    return valueAndLabelses.map((o) => oneInput(o.value, o.label));
  }

  public render() {
    return (
      <div>
        <div className="parserInput"
          style={{ width: "100%", backgroundColor: "'#172330'" }}>
          <form
            style={{ backgroundColor: "#172330" }}
            onSubmit={this.handleSubmit}
          >
            <MicrogrammarInput
              microgrammarInputProps={this.props.microgrammarInput}
              handleChange={this.props.mgUpdateFn}
              errorResponse={this.props.errorResponse} />
            {this.formControl()}
            In this sample input:
              <CodeDisplay
              key="parseThisInput"
              highlightFn={this.props.highlightFn}
              className="parseThisInput"
              code={this.props.parserInput.code}
              handleCodeChange={this.handleCodeChange}
            />

          </form>
        </div>
      </div>
    );
  }

  public formControl() {
    const radioOptions: RadioChoiceSpec<MatchScope>[] = [
      {
        value: MatchScope.exact,
        label: "exactly ",
      },
      {
        value: MatchScope.within,
        label: "within"
      }
    ];
    const key = "tree-display-choice";
    const updateChoice = this.props.changeMatchScope;
    const currentSelection = this.props.matchScope;
    return ChoiceGroup<MatchScope>({
      groupLabel: undefined,
      radioOptions,
      key,
      updateChoice,
      currentSelection,
    })
  }
}
