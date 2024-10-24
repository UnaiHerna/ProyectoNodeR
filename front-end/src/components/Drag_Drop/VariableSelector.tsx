import React, { useEffect, useState } from 'react';

type VariableType = "NH4" | "NH4_FILT" | "DO_SP" | "DO_SPDO_SPDO_SP";

interface VariableSelectorProps {
  selectedVariable: VariableType;
  setSelectedVariable: (variable: VariableType) => void;
  handleAddVariable: (variable: VariableType) => void;
  addedVariables: Array<{ id: string; variable: VariableType; enabled: boolean }>;
}

const VariableSelector: React.FC<VariableSelectorProps> = ({
  selectedVariable,
  setSelectedVariable,
  handleAddVariable,
  addedVariables,
}) => {
  const [data, setData] = useState(addedVariables);

  // Update local state when addedVariables prop changes
  useEffect(() => {
    setData(addedVariables);
  }, [addedVariables]);

  const handleAdd = () => {
    if (selectedVariable) {
      handleAddVariable(selectedVariable);
    }
  };

  return (
    <div className="variable-selector">
      <select
        value={selectedVariable}
        onChange={(e) => setSelectedVariable(e.target.value as VariableType)}
      >
        <option value="" disabled>Select a variable</option>
        <option value="NH4">NH4</option>
        <option value="NH4_FILT">NH4_FILT</option>
        <option value="DO_SP">DO_SP</option>
        <option value="DO">DO</option>
      </select>
      <button onClick={handleAdd}>Add Variable</button>

      <ul>
        {data.map(item => (
          <li key={item.id}>
            {item.variable} - {item.enabled ? 'Enabled' : 'Disabled'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VariableSelector;
