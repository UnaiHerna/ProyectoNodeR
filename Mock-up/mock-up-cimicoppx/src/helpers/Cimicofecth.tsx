const Cimico_API = () => {
  fetch("./forecast_data.json")
    .then((res) => res.json())
    .then((data) => console.log(data));
};

export default Cimico_API;
