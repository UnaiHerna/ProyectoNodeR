import { CheckboxGroup, Checkbox } from "@nextui-org/react";

interface Props {
    variables: string[];
    onVariableChange: (variables: string[])=>void;
}

const CheckboxGroups: React.FC<Props> = ({ variables,onVariableChange }) => {
    return (
        <CheckboxGroup
            label="Select variables"
            orientation="horizontal"
            color="secondary"
            onChange={onVariableChange}
        >
            {variables.map((variable) => (
                <Checkbox key={variable} value={variable}>{variable}</Checkbox>
            ))}
        </CheckboxGroup>
    );
};

export default CheckboxGroups;
