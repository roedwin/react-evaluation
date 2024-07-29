// src/components/NewRecordModal.js

import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const NewRecordModal = ({
  show,
  onHide,
  urlBase,
  newRecordData,
  handleNewRecordChange,
  handleNewRecordSave,
  providers // Lista de proveedores pasada como prop
}) => {
  const [providerOptions, setProviderOptions] = useState([]);

  useEffect(() => {
    if (urlBase === "http://127.0.0.1:8000/products" && providers) {
      setProviderOptions(providers.map(provider => (
        <option key={provider.id} value={provider.id}>{provider.name}</option>
      )));
    }
  }, [urlBase, providers]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Registro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {urlBase === "http://127.0.0.1:8000/providers" ? (
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newRecordData?.name || ''}
                onChange={handleNewRecordChange}
              />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={newRecordData?.address || ''}
                onChange={handleNewRecordChange}
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newRecordData?.phone || ''}
                onChange={handleNewRecordChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newRecordData?.description || ''}
                onChange={handleNewRecordChange}
              />
            </Form.Group>
          </Form>
        ) : (
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newRecordData?.name || ''}
                onChange={handleNewRecordChange}
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                step="0.01"
                value={newRecordData?.price || ''}
                onChange={handleNewRecordChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newRecordData?.description || ''}
                onChange={handleNewRecordChange}
              />
            </Form.Group>
            <Form.Group controlId="formProviderId">
              <Form.Label>Provider</Form.Label>
              <Form.Control
                as="select"
                name="provider_id"
                value={newRecordData?.provider_id || ''}
                onChange={handleNewRecordChange}
              >
                <option value="">Select a Provider</option>
                {providerOptions}
              </Form.Control>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleNewRecordSave}>Save</Button>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewRecordModal;
