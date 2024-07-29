import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Table.css';

const Table = ({ url, onRowClick, refreshKey }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false); // Nuevo estado para indicar cuando no hay datos

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url);
        setData(response.data);
        setNoData(false); // Restablecer en caso de que haya datos
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Manejo específico para el estado 404
          setNoData(true);
          setData([]); // Asegúrate de limpiar cualquier dato anterior
        } else {
          setError(error);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [url, refreshKey]); // Agregando refreshKey a las dependencias para disparar el re-fetch

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error al cargar los datos: {error.message}</p>;
  }

  if (noData) {
    return <p>No se encontraron registros.</p>; // Mostrar mensaje cuando no hay datos
  }

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            {data.length > 0 && Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} onClick={() => onRowClick(item)}>
              {Object.values(item).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
