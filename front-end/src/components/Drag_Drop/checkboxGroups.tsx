import {CheckboxGroup, Checkbox} from "@nextui-org/react";
interface Props {
    variables: string[];
}

function checkboxGroups({variables}:Props) {
  return (
    <CheckboxGroup
      label="Select cities"
      orientation="horizontal"
      color="secondary"
      defaultValue={["buenos-aires", "san-francisco"]}
    >
        {variables.map((variable)=>{
            return <Checkbox key={variable} value={variable}>{variable}</Checkbox>
        })}
    </CheckboxGroup>
  );
}

export default checkboxGroups;