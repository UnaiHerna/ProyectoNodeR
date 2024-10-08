import React, { useEffect, useState } from "react";
import { fetchApi_R_Data, fetchApi_Java_Data, fetchApi_Python_Data } from "../helpers/apiHelper";
import { Input, Progress } from "@nextui-org/react";

interface ApiResponseR {
  v_conc_anx: number[];
  v_conc_aer: number[];
  precis: number;
  mltss: number;
  kla_aer: number;
  tss_eff: number;
  sludge_prod: number;
}

interface NumericInputFormProps {
  num1: string;
  num2: string;
  onInputChange: (field: string, value: string) => void;
}

interface ApiResponseJava {
  clase: number;
  prob0: number;
  prob1: number;
}

interface ApiPythonResponse {
  num: number;
}

interface PatientInfoFormProps {
  age: string;
  race: string;
  psa: string;
  gleason: string;
  onInputChange: (field: string, value: string) => void;
}

interface DataProps {
  title: string;
  values: { clase: number; prob0: number; prob1: number };
}
interface ApiPythonResponse {
  num: number;
}

interface DataPythonCardProps {
  data: ApiPythonResponse;
  title: string;
}
interface Props {
  titulo: string;
}

// Validation functions for numeric inputs
const isNumeric = (value: string) => {
  const number = parseFloat(value);
  return !isNaN(number) && isFinite(number);
};
const isNumericAndFirstLessThanSecond = (num1: string, num2: string) => {
  const number1 = parseFloat(num1);
  const number2 = parseFloat(num2);
  return !isNaN(number1) && !isNaN(number2) && isFinite(number1) && isFinite(number2) && number1 < number2;
};

// Validation functions for Python fields
const isMltssSpValid = (value: string) =>
  isNumeric(value) && parseFloat(value) >= 2500 && parseFloat(value) <= 4000;
const isSoAerSpValid = (value: string) =>
  isNumeric(value) && parseFloat(value) >= 0.5 && parseFloat(value) <= 3.5;
const isQIntValid = (value: string) =>
  isNumeric(value) && parseFloat(value) >= 20648 && parseFloat(value) <= 20648*5;
const isTssEffSpValid = (value: string) =>
  isNumeric(value) && parseFloat(value) >= 0 && parseFloat(value) <= 20;
const isTempValid = (value: string) =>
  isNumeric(value) && parseFloat(value) >= 13 && parseFloat(value) <= 25;

// Validate all Python fields together
const areRFieldsValid = (
  mltssSp: string,
  soAerSp: string,
  qInt: string,
  tssEffSp: string,
  temp: string
) =>
  isMltssSpValid(mltssSp) &&
  isSoAerSpValid(soAerSp) &&
  isQIntValid(qInt) &&
  isTssEffSpValid(tssEffSp) &&
  isTempValid(temp);

// Validate all Java fields together
const areJavaFieldsValid = (
  age: string,
  race: string,
  psa: string,
  gleason: string
) =>
  isNumeric(age) &&
  (race === "0" || race === "1") &&
  isNumeric(psa) &&
  isNumeric(gleason);

const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  validate: (value: string) => boolean;
  errorMessage: string;
}> = ({ label, value, onChange, placeholder, validate, errorMessage }) => {
  const [isInvalid, setIsInvalid] = React.useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setIsInvalid(!validate(newValue));
    onChange(event);
  };

  return (
    <div className="mb-4">
      <label className="block mb-2">
        {label}:
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label={label}
          variant="underlined"
          className="mt-1"
          color={isInvalid ? "danger" : "primary"}
          fullWidth
        />
        {isInvalid && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </label>
    </div>
  );
};

const PatientInfoForm: React.FC<PatientInfoFormProps> = ({
  age,
  race,
  psa,
  gleason,
  onInputChange,
}) => (
  <div className="font-semibold text-small">
    <InputField
      label="AGE"
      value={age}
      onChange={(e) => onInputChange("age", e.target.value)}
      placeholder="Age"
      validate={isNumeric}
      errorMessage="Please enter a valid number for AGE"
    />
    <InputField
      label="RACE"
      value={race}
      onChange={(e) => onInputChange("race", e.target.value)}
      placeholder="Race"
      validate={(value) => value === "0" || value === "1"}
      errorMessage="RACE must be 0 or 1"
    />
    <InputField
      label="PSA"
      value={psa}
      onChange={(e) => onInputChange("psa", e.target.value)}
      placeholder="PSA"
      validate={isNumeric}
      errorMessage="Please enter a valid number for PSA"
    />
    <InputField
      label="GLEASON"
      value={gleason}
      onChange={(e) => onInputChange("gleason", e.target.value)}
      placeholder="Gleason Score"
      validate={isNumeric}
      errorMessage="Please enter a valid number for GLEASON"
    />
  </div>
);

const NumericInputForm: React.FC<NumericInputFormProps> = ({
  num1,
  num2,
  onInputChange,
}) => (
  <div className="font-semibold text-small">
    <InputField
      label="NUMERO 2"
      value={num2}
      onChange={(e) => onInputChange("num2", e.target.value)}
      placeholder="numero 2"
      validate={isNumeric}
      errorMessage="LOS CAMPOS TIENEN QUE SER NUMERICOS"
    />
    <InputField
      label="NUMERO 1"
      value={num1}
      onChange={(e) => onInputChange("num1", e.target.value)}
      placeholder="numero 1"
      validate={(value)=>isNumericAndFirstLessThanSecond(value,num2)}
      errorMessage="Numero 1 tiene que ser menor a numero 2"
    />
  </div>
);

const DataCard: React.FC<DataProps> = ({ title, values }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg transform transition hover:scale-105 cursor-pointer hover:shadow-2xl">
    <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">
      {title}
    </h3>
    <div className="text-gray-700 space-y-2">
      <p>
        <strong>Clase:</strong> {values.clase}
      </p>
      <p>
        <strong>Probabilidad 0:</strong> {values.prob0.toFixed(2)}
      </p>
      <p>
        <strong>Probabilidad 1:</strong> {values.prob1.toFixed(2)}
      </p>
    </div>
  </div>
);

const DataPythonCard: React.FC<DataPythonCardProps> = ({ data, title }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg transform transition hover:scale-105 cursor-pointer hover:shadow-2xl">
    <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">
      {title}
    </h3>
    <div className="text-gray-700 space-y-2">
      <p>
        <strong>Result:</strong> {data.num}
      </p>
    </div>
  </div>
);

const DataDetails: React.FC<{ data: ApiResponseR }> = ({ data }) => (
  <div className="p-4 bg-gray-100 rounded-lg shadow-md">
    <h3 className="text-lg font-bold mb-2">Details</h3>
    <p>
      <strong>Precision:</strong> {data.precis.toFixed(2)}
    </p>
    <p>
      <strong>MLTSS:</strong> {data.mltss.toFixed(2)}
    </p>
    <p>
      <strong>KLA Aer:</strong> {data.kla_aer.toFixed(2)}
    </p>
    <p>
      <strong>TSS Efficiency:</strong> {data.tss_eff.toFixed(2)}
    </p>
    <p>
      <strong>Sludge Production:</strong> {data.sludge_prod.toFixed(2)}
    </p>
  </div>
);

const DataDisplay: React.FC<Props> = ({ titulo }) => {
  const [inputMltssSp, setInputMltssSp] = useState<string>("");
  const [inputSoAerSp, setInputSoAerSp] = useState<string>("");
  const [inputQInt, setInputQInt] = useState<string>("");
  const [inputTssEffSp, setInputTssEffSp] = useState<string>("");
  const [inputTemp, setInputTemp] = useState<string>("");

  const [age, setAge] = useState<string>("");
  const [race, setRace] = useState<string>("");
  const [psa, setPsa] = useState<string>("");
  const [gleason, setGleason] = useState<string>("");

  const [num1,setNum1] = useState<string>("");
  const [num2,setNum2] = useState<string>("");

  const [data, setData] = useState<ApiResponseR | ApiResponseJava | ApiPythonResponse |null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);

  // Parámetros de Python
  const RParams = {
    mltss_sp: parseFloat(inputMltssSp) || 0,
    so_aer_sp: parseFloat(inputSoAerSp) || 0,
    q_int: parseFloat(inputQInt) || 0,
    tss_eff_sp: parseFloat(inputTssEffSp) || 0,
    temp: parseFloat(inputTemp) || 0,
  };

  // Parámetros de Java
  const javaParams = {
    age: age,
    race: race,
    psa: psa,
    gleason: gleason,
  };

  const Pythonparms= {
    num1: parseFloat(num1) | 0,
    num2: parseFloat(num2) | 0
  }
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    };

  // Función para diferenciar entre las solicitudes de Python o Java
  const fetchData = async () => {
    setLoading(true);
    try {
      let apiData: ApiResponseR | ApiResponseJava | ApiPythonResponse |null = null;
      if (titulo === "R") {
        apiData = await fetchApi_R_Data(RParams); // Llama a la función API de Python
      } else if (titulo === "Java") {
        apiData = await fetchApi_Java_Data(javaParams); // Llama a la función API de Java
      } else if (titulo==="Python") {
        apiData = await fetchApi_Python_Data(Pythonparms.num1,Pythonparms.num2);
        console.log(apiData);
        
      }
      if (apiData) {
        setData(apiData); // Establece los datos recibidos
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setShouldFetch(false); // Reset fetching state
    }
  }, [shouldFetch]);

  const handleSubmit = () => {
    if (
      titulo === "R" &&
      areRFieldsValid(
        inputMltssSp,
        inputSoAerSp,
        inputQInt,
        inputTssEffSp,
        inputTemp
      )
    ) {
      setShouldFetch(true);
    } else if (
      titulo === "Java" &&
      areJavaFieldsValid(age, race, psa, gleason)
    ) {
      setShouldFetch(true);
    } else{
      setShouldFetch(true);
    }
  };

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-4">Data Display - {titulo}</h1>
      {titulo === "Java" && (
        <PatientInfoForm
          age={age}
          race={race}
          psa={psa}
          gleason={gleason}
          onInputChange={(field, value) => {
            switch (field) {
              case "age":
                setAge(value);
                break;
              case "race":
                setRace(value);
                break;
              case "psa":
                setPsa(value);
                break;
              case "gleason":
                setGleason(value);
                break;
            }
          }}
        />
      )}
      {titulo === "R" && (
        <div>
          <InputField
            label="MLTSS"
            value={inputMltssSp}
            onChange={handleInputChange(setInputMltssSp)}
            placeholder="MLTSS"
            validate={isMltssSpValid}
            errorMessage="MLTSS debe ser de 2500 a 4000"
          />
          <InputField
            label="SO Aer"
            value={inputSoAerSp}
            onChange={handleInputChange(setInputSoAerSp)}
            placeholder="SO Aer"
            validate={isSoAerSpValid}
            errorMessage="SO Aer debe ser de 0.5 a 3.5"
          />
          <InputField
            label="Q Int"
            value={inputQInt}
            onChange={handleInputChange(setInputQInt)}
            placeholder="Q Int"
            validate={isQIntValid}
            errorMessage="Q Int debe ser de 20648 a 103.240"
          />
          <InputField
            label="TSS Eff"
            value={inputTssEffSp}
            onChange={handleInputChange(setInputTssEffSp)}
            placeholder="TSS Eff"
            validate={isTssEffSpValid}
            errorMessage="TSS Efficiency debe ser de 0 a 20"
          />
          <InputField
            label="Temperature"
            value={inputTemp}
            onChange={handleInputChange(setInputTemp)}
            placeholder="Temperature"
            validate={isTempValid}
            errorMessage="Temperature debe ser de 13 a 25"
          />
        </div>
      )}{titulo==="Python" && (
        <div>
          <NumericInputForm
          num1={num1}
          num2={num2}
          onInputChange={(field, value) => {
            switch (field) {
              case "num1":
                setNum1(value);
                break;
              case "num2":
                setNum2(value);
                break;
            }
          }}
          />
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        >
        {loading ? "Loading..." : "Submit"}
      </button>
      {loading && <Progress color="primary" isIndeterminate  size="md" className="mt-4" />}
      {data && (
        <div className="mt-4">
          {titulo === "R" && data && "v_conc_anx" in data && (
            <DataDetails data={data as ApiResponseR} />
          )}
          {titulo === "Java" && data && "clase" in data && (
            <DataCard
            title="Java Data"
            values={{
              clase: data.clase,
              prob0: data.prob0 ? parseFloat(data.prob0.toFixed(2)) : 0,  // Convertimos de nuevo a número
              prob1: data.prob1 ? parseFloat(data.prob1.toFixed(2)) : 0,  // Convertimos de nuevo a número
            }}
            />
          )}{titulo === "Python" && "num" in data && (
            
            <DataPythonCard data={data as ApiPythonResponse} title="Response Python"/>
          )}
        </div>
      )}
    </div>
  );
};


export default DataDisplay;
