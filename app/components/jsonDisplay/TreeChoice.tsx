import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { ThemeKeys } from "react-json-view";
import { TreeChoices, TreeParseGUIState } from "../../TreeParseGUIState";
import { ChoiceGroup, RadioChoiceSpec } from "../ChoiceGroup";

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

type TreeChoiceProps = {
    treeToDisplay: TreeChoices,
    availableChoices: TreeChoices[],
    chooseTree: (event: React.ChangeEvent, tc: TreeChoices) => void,
}

function disableUnavailable<Enum>(
    ri: Array<RadioChoiceSpec<Enum>>,
    availables: Enum[]) {

    return ri.map((i) => ({ ...i, disabled: !availables.includes(i.value) }));
}

export function TreeChoice(props: TreeChoiceProps) {

    const radioOptions = disableUnavailable([
        { value: TreeChoices.ast, label: "Internal Details" },
        { value: TreeChoices.parsingError, label: "Failure Details" },
        { value: TreeChoices.valueStructure, label: "Values" },
    ], props.availableChoices);

    return ChoiceGroup<TreeChoices>({
        radioOptions,
        updateChoice: props.chooseTree,
        currentSelection: props.treeToDisplay,
        groupLabel: "Results",
        key: "tree-display-choice",
    });
}
