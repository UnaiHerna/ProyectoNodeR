export interface Tarjeta {
    title: string;
    subtitle: string;
    address: string;
    buttonText: string;
    imageUrl: string;
    iconUrl: string;
    status: string;
  }
  
  export const tarjetasData: Tarjeta[] = [
    {
      title: "EDAR Ranilla",
      subtitle: "EDAR Ranilla",
      address: "Calle Teodoro Murua, 20500,1C....",
      buttonText: "Gestionar Planta",
      imageUrl: "https://www.retema.es/sites/default/files/styles/imagen_contenido_ampliado/public/2022-07/eEtcKxBuiKPzy5JzmOeXqVkawLr6FICI9kP.jpg.webp?itok=eCVv0Mdi",
      iconUrl: "/online.png",
      status: "online",
    },
    {
      title: "EDAR Sedatez",
      subtitle: "EDAR Sedatex",
      address: "Calle Teodoro Murua, 20500,1C....",
      buttonText: "Gestionar Planta",
      imageUrl: "https://www.residuosprofesional.com/wp-content/uploads/2020/09/edar.jpg",
      iconUrl: "/online.png",
      status: "online",
    },
    {
      title: "EDAR Norte",
      subtitle: "EDAR Norte",
      address: "Av. Los Álamos, 30010, 2A....",
      buttonText: "Gestionar Planta",
      imageUrl: "https://www.aqualia.com/documents/14152670/14224437/Aqualia+gana+el+contrato+para+la+operaci%C3%B3n+y+mantenimiento+de+la+depuradora+La+Gavia%2C+en+Madrid.jpg/dffcc382-8264-48e4-8bb5-088ec5d39cb1?t=1482225505000",
      iconUrl: "/online.png",
      status: "online",
    },
    {
      title: "EDAR Sur",
      subtitle: "EDAR Sur",
      address: "Calle Las Lomas, 10020, B....",
      buttonText: "Gestionar Planta",
      imageUrl: "https://elperiodicodevillena.com/wp-content/uploads/2019/02/1362720-733x405.jpg",
      iconUrl: "/error.png",
      status: "offline",
    },
    {
      title: "EDAR Este",
      subtitle: "EDAR Este",
      address: "Calle Gran Vía, 50020, 1D....",
      buttonText: "Gestionar Planta",
      imageUrl: "https://www.serbis.es/serbis/blog/wp-content/uploads/depuradora-aguas-residuales.jpg",
      iconUrl: "/trasnimitin_w_error.png",
      status: "error",
    },
  ];