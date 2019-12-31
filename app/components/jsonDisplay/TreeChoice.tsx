import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { ThemeKeys } from "react-json-view";
import { TreeChoices, TreeParseGUIState } from "../../TreeParseGUIState";

export interface HowToDisplay {
    treeToRender: any;
    theme: ThemeKeys;
}

/**
 * If you had chosen "AST" for instance, but you now have an error and AST is not available
 * this will pick a choice that IS available.
 */
export function effectiveTreeChoice(tpgs: TreeParseGUIState) {
    const available = availableTreeChoices(tpgs);
    if (available.includes(tpgs.chosenTree)) {
        return tpgs.chosenTree;
    }
    return available[0];
}

export function howToDisplayTree(tpgs: TreeParseGUIState, tc: TreeChoices): HowToDisplay {
    switch (tc) {
        case TreeChoices.ast:
            return {
                treeToRender: tpgs.ast,
                theme: "apathy",
            };
        case TreeChoices.parsingError:
            return {
                treeToRender: tpgs.failureExplanation,
                theme: "apathy:inverted",
            };
        case TreeChoices.valueStructure:
            return {
                treeToRender: tpgs.valueStructure,
                theme: "bright",
            };
    }
}

export function availableTreeChoices(tpgs: TreeParseGUIState): TreeChoices[] {
    const available = [];
    if (!!tpgs.ast) { available.push(TreeChoices.ast); }
    if (!!tpgs.valueStructure) { available.push(TreeChoices.valueStructure); }
    if (!!tpgs.failureExplanation) { available.push(TreeChoices.parsingError); }
    return available;
}

export interface RadioChoiceSpec<Enum> {
    value: Enum; label: string; disabled?: boolean;
}

type TreeChoiceProps = {
    treeToDisplay: TreeChoices,
    availableChoices: TreeChoices[],
    chooseTree: (event: React.ChangeEvent, tc: TreeChoices) => void,
}

export function TreeChoice(props: TreeChoiceProps) {

    const radioOptions = disableUnavailable([
        { value: TreeChoices.ast, label: "Parsed" },
        { value: TreeChoices.parsingError, label: "Parsing Error" },
        { value: TreeChoices.valueStructure, label: "Value Structure" },
    ], props.availableChoices);

    return ChoiceGroup({
        radioOptions,
        updateChoice: props.chooseTree,
        treeToDisplay: props.treeToDisplay,
        groupLabel: "Choose A Tree",
        key: "tree-display-choice",
    });
}

function ChoiceGroup(properties: {
    groupLabel: string,
    key: string,
    radioOptions: RadioChoiceSpec<TreeChoices>[],
    treeToDisplay: TreeChoices,
    updateChoice: (event: React.ChangeEvent, tc: TreeChoices) => void,
}) {
    const { groupLabel,
        key,
        radioOptions,
        treeToDisplay,
        updateChoice } = properties;
    return <FormControl>
        <FormLabel>{groupLabel}</FormLabel>
        <RadioGroup
            key={key}
            value={treeToDisplay}
            onChange={updateChoice}>
            {radioInputs(radioOptions)}
        </RadioGroup>
    </FormControl>
}

function disableUnavailable<Enum>(
    ri: Array<RadioChoiceSpec<Enum>>,
    availables: Enum[]) {

    return ri.map((i) => ({ ...i, disabled: !availables.includes(i.value) }));
}

function radioInputs(valueAndLabelses) {
    const oneInput = (params: RadioChoiceSpec<any>) => {
        const { value, label, disabled } = params;
        return <FormControlLabel
            value={value}
            control={<Radio color="primary" />}
            label={label}
            disabled={!!disabled}
            color="white"
            key={value} />;
    };
    return valueAndLabelses.map(oneInput);
}

// TODO next: make unavailable the choices that don't work
