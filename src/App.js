import React, { useState, useEffect } from 'react';
import Table from './components/Table';
import DetailModal from './components/DetailModal';
import NewRecordModal from './components/NewRecordModal';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Papa from 'papaparse';

const App = () => {
  const urlProviders = "https://fastapi-evaluation.onrender.com/providers";
  const urlProducts = "https://fastapi-evaluation.onrender.com/products";
  const [urlBase, setUrlBase] = useState(urlProviders);
  const [url, setUrl] = useState(urlProviders);
  const [searchParams, setSearchParams] = useState({
    limit: '',
    offset: '',
    name: ''
  });

  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [newRecordData, setNewRecordData] = useState({});
  const [showNewModal, setShowNewModal] = useState(false);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    if (urlBase === urlProducts) {
      axios.get(urlProviders)
        .then(response => {
          setProviders(response.data);
          console.log("Providers loaded: ", response.data); // Log para verificar los proveedores cargados
        })
        .catch(error => {
          console.error("Error fetching providers:", error);
        });
    }
  }, [urlBase]);

  const handleUrlChange = () => {
    const newUrlBase = (urlBase === urlProviders ? urlProducts : urlProviders);
    setUrlBase(newUrlBase);
    setUrl(newUrlBase);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearch = () => {
    const { limit, offset, name } = searchParams;
    const newUrl = `${urlBase}?limit=${limit || 10}&offset=${offset || 0}&name=${name}`;
    setUrl(newUrl);
  };

  const handleRowClick = (data) => {
    setModalData(data);
    setShowModal(true);
    setIsEditable(false);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setModalData({ ...modalData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const id = modalData.id;
      const updateUrl = urlBase === urlProviders ? `${urlProviders}/${id}` : `${urlProducts}/${id}`;
      const response = await axios.put(updateUrl, modalData);
      if (response.status === 200) {
        setIsEditable(false);
        setShowModal(false);
        setRefreshKey(oldKey => oldKey + 1);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const id = modalData.id;
        const deleteUrl = urlBase === urlProviders ? `${urlProviders}/${id}` : `${urlProducts}/${id}`;
        const response = await axios.delete(deleteUrl);
        if (response.status === 200) {
          setShowModal(false);
          setRefreshKey(oldKey => oldKey + 1);
        }
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleNewRecordChange = (e) => {
    const { name, value } = e.target;
    setNewRecordData({ ...newRecordData, [name]: value });
  };

  const handleNewRecordSave = async () => {
    try {
      const createUrl = urlBase;
      const response = await axios.post(createUrl, newRecordData);
      if (response.status === 200) {
        setShowNewModal(false);
        setNewRecordData({});
        setRefreshKey(oldKey => oldKey + 1);
      }
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const isProviders = urlBase === urlProviders;
                const formattedData = results.data.map(item => {
                    if (isProviders) {
                        return {
                            name: item.name.trim(),
                            address: item.address.trim(),
                            phone: item.phone.trim(),
                            description: item.description.trim()
                        };
                    } else {
                        return {
                            name: item.name.trim(),
                            price: parseFloat(item.price),
                            description: item.description.trim(),
                            provider_id: item.provider_id.trim()
                        };
                    }
                });
                
                try {
                    const endpoint = isProviders ? `${urlProviders}/multiple` : `${urlProducts}/multiple`;
                    const response = await axios.post(endpoint, formattedData);
                    if (response.status === 200) {
                        setRefreshKey(oldKey => oldKey + 1);
                        alert("Registros cargados correctamente.");
                    } else {
                        console.error('Error uploading data:', response.data);
                    }
                } catch (error) {
                    console.error('Error uploading file:', error.response ? error.response.data : error);
                }
            }
        });
    }
};

  return (
    <div className="App container mt-4">
      <div className="d-flex justify-content-center align-items-center mb-3">
        <h1 className="mr-3">Tabla de Datos</h1>
        <button className="btn btn-primary mr-3" onClick={handleUrlChange}>
          {urlBase === urlProviders ? "Mostrar Productos" : "Mostrar Proveedores"}
        </button>
        <button className="btn btn-secondary mr-3" onClick={() => setShowNewModal(true)}>New</button>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="btn btn-info"
        />
      </div>
      <div className="mb-3">
        <div className="form-row">
          <div className="form-group col-md-4">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={searchParams.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group col-md-2">
            <input
              type="number"
              name="limit"
              className="form-control"
              placeholder="Limit"
              value={searchParams.limit}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group col-md-2">
            <input
              type="number"
              name="offset"
              className="form-control"
              placeholder="Offset"
              value={searchParams.offset}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group col-md-4">
            <button className="btn btn-success" onClick={handleSearch}>Buscar</button>
          </div>
        </div>
      </div>
      <Table url={url} onRowClick={handleRowClick} refreshKey={refreshKey} />
      <DetailModal
        show={showModal}
        onHide={handleCloseModal}
        modalData={modalData}
        isEditable={isEditable}
        handleModalInputChange={handleModalInputChange}
        handleSave={handleSave}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
      <NewRecordModal
        show={showNewModal}
        onHide={() => setShowNewModal(false)}
        urlBase={urlBase}
        newRecordData={newRecordData}
        handleNewRecordChange={handleNewRecordChange}
        handleNewRecordSave={handleNewRecordSave}
        providers={providers}
      />
    </div>
  );
};

export default App;
