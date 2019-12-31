import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import React from "react";

export interface RadioChoiceSpec<Enum> {
    value: Enum; label: string; disabled?: boolean;
}

export type ChoiceGroupProps<Enum> = {
    groupLabel: string,
    key: string,
    radioOptions: RadioChoiceSpec<Enum>[],
    currentSelection: Enum,
    updateChoice: (event: React.ChangeEvent, tc: Enum) => void,
};

export function ChoiceGroup<Enum extends string>(props: ChoiceGroupProps<Enum>) {
    const { groupLabel,
        key,
        radioOptions,
        currentSelection,
        updateChoice } = props;
    return <FormControl>
        <FormLabel>{groupLabel}</FormLabel>
        <RadioGroup
            key={key}
            value={currentSelection}
            onChange={updateChoice}>
            {radioInputs(radioOptions)}
        </RadioGroup>
    </FormControl>
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
