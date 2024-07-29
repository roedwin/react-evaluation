// src/App.js

import React, { useState, useEffect } from 'react';
import Table from './components/Table';
import DetailModal from './components/DetailModal';
import NewRecordModal from './components/NewRecordModal';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const urlProviders = "http://127.0.0.1:8000/providers";
  const urlProducts = "http://127.0.0.1:8000/products";
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

  const [newRecordData, setNewRecordData] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [providers, setProviders] = useState([]); // Para guardar los proveedores

  useEffect(() => {
    if (urlBase === urlProducts) {
      axios.get(urlProviders)
        .then(response => {
          setProviders(response.data);
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
    const newUrl = `${urlBase}?limit=${limit}&offset=${offset || 0}&name=${name}`;
    setUrl(newUrl);
  };

  const handleRowClick = (data) => {
    setModalData(data);
    setShowModal(true);
    setIsEditable(false); // Disable fields initially
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
      const id = modalData.id; // Assuming the ID field is named 'id'
      const updateUrl = urlBase === urlProviders ? `${urlProviders}/${id}` : `${urlProducts}/${id}`;
      const response = await axios.put(updateUrl, modalData);
      if (response.status === 200) {
        setIsEditable(false);
        setShowModal(false); // Close the modal after saving
        setRefreshKey(oldKey => oldKey + 1); // Refresh the table
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const id = modalData.id; // Assuming the ID field is named 'id'
        const deleteUrl = urlBase === urlProviders ? `${urlProviders}/${id}` : `${urlProducts}/${id}`;
        const response = await axios.delete(deleteUrl);
        if (response.status === 200) {
          setShowModal(false); // Close the modal after deleting
          setRefreshKey(oldKey => oldKey + 1); // Refresh the table
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
        setShowNewModal(false); // Cierra el modal
        setNewRecordData({}); // Limpia los datos del nuevo registro
        setRefreshKey(oldKey => oldKey + 1); // Refresca la tabla
      }
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  return (
    <div className="App container mt-4">
      <div className="d-flex justify-content-center align-items-center mb-3">
        <h1 className="mr-3">Tabla de Datos</h1>
        <button className="btn btn-primary mr-3" onClick={handleUrlChange}>
          {urlBase === urlProviders ? "Mostrar Productos" : "Mostrar Proveedores"}
        </button>
        <button className="btn btn-secondary" onClick={() => setShowNewModal(true)}>New</button>
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
        providers={providers} // Pasar la lista de proveedores al modal
      />
    </div>
  );
};

export default App;
