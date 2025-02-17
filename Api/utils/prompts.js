const prompts = {
  sqlConversion: `
  Convierte el siguiente texto en una consulta SQL válida para mi base de datos:
  
  Siendo esta mi base de datos:
  
  CREATE TABLE variable (
      id INT NOT NULL PRIMARY KEY,
      simbolo VARCHAR(10),
      u_medida VARCHAR(10),
      descripcion VARCHAR(50)
  );
  
  CREATE TABLE equipo (
      id INT NOT NULL PRIMARY KEY,
      nombre VARCHAR(50),
      descripcion VARCHAR(100)
  );
  
  CREATE TABLE sensor (
      id_equipo INT NOT NULL, 
      id_variable INT NOT NULL,
      deltat INT,
      PRIMARY KEY (id_equipo, id_variable),
      FOREIGN KEY (id_equipo) REFERENCES equipo(id),
      FOREIGN KEY (id_variable) REFERENCES variable(id)
  );
  
  CREATE TABLE sensor_datos (
      id_equipo INT NOT NULL,
      id_variable INT NOT NULL,
      timestamp DATETIME NOT NULL,
      valor FLOAT,
      PRIMARY KEY (id_equipo, id_variable, timestamp),
      FOREIGN KEY (id_equipo, id_variable) REFERENCES sensor(id_equipo, id_variable)
  );
  
  CREATE TABLE señal (
      id INT NOT NULL PRIMARY KEY,
      nombre VARCHAR(50)
  );
  
  CREATE TABLE señal_sensor (
      id_señal INT NOT NULL,
      id_equipo INT NOT NULL,
      id_variable INT NOT NULL,
      PRIMARY KEY (id_señal, id_equipo, id_variable),
      FOREIGN KEY (id_señal) REFERENCES señal(id),
      FOREIGN KEY (id_equipo, id_variable) REFERENCES sensor(id_equipo, id_variable)
  );
  
  CREATE TABLE señal_datos (
      id_señal INT NOT NULL,
      timestamp DATETIME NOT NULL,
      valor FLOAT,
      PRIMARY KEY (id_señal, timestamp),
      FOREIGN KEY (id_señal) REFERENCES señal(id)
  );
  
  CREATE TABLE consigna (
      id INT NOT NULL PRIMARY KEY,
      id_equipo INT NOT NULL,
      id_variable INT NOT NULL,
      nombre VARCHAR(50),
      UNIQUE (id_equipo, id_variable),
      FOREIGN KEY (id_equipo, id_variable) REFERENCES sensor(id_equipo, id_variable)
  );
  
  CREATE TABLE valores_consigna (
      id_consigna INT NOT NULL,
      timestamp DATETIME NOT NULL,
      valor FLOAT,
      mode INT,
      PRIMARY KEY (id_consigna, timestamp),
      FOREIGN KEY (id_consigna) REFERENCES consigna(id)
  );
  
  CREATE TABLE hlc (
      id INT NOT NULL,
      id_consigna_entrada INT NOT NULL,
      id_consigna_salida INT NOT NULL,
      nombre VARCHAR(100),
      PRIMARY KEY (id, id_consigna_entrada, id_consigna_salida),
      FOREIGN KEY (id_consigna_entrada) REFERENCES consigna(id),
      FOREIGN KEY (id_consigna_salida) REFERENCES consigna(id)
  );
  
  CREATE TABLE llc (
      id INT NOT NULL,
      id_consigna INT NOT NULL,
      nombre VARCHAR(100),
      PRIMARY KEY (id, id_consigna),
      FOREIGN KEY (id_consigna) REFERENCES consigna(id)
  );
  
  CREATE TABLE actuador (
      id INT NOT NULL PRIMARY KEY,
      id_llc INT NOT NULL,
      nombre VARCHAR(50),
      FOREIGN KEY (id_llc) REFERENCES llc(id)
  );
  
  CREATE TABLE actuador_datos (
      id_actuador INT NOT NULL,
      timestamp DATETIME NOT NULL,
      PRIMARY KEY (id_actuador, timestamp),
      FOREIGN KEY (id_actuador) REFERENCES actuador(id)
  );
  
  CREATE TABLE user (
      username VARCHAR(20) NOT NULL,
      email VARCHAR(50),
      password VARCHAR(100),
      nombre VARCHAR(50),
      disabled BOOLEAN
  );
  
  CREATE TABLE heatmap_sergio (
      id INT NOT NULL PRIMARY KEY auto_increment,
      temp FLOAT,
      mltss INT,
      sludge_prod FLOAT
  );
  
  Texto: "\${text}"`,
};

module.exports = prompts;
