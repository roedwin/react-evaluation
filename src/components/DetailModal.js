// src/components/DetailModal.js

import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const DetailModal = ({
  show,
  onHide,
  modalData,
  isEditable,
  handleModalInputChange,
  handleSave,
  handleDelete,
  handleEdit
}) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Detalle del Registro</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {modalData && Object.entries(modalData).map(([key, value]) => (
        <Form.Group key={key}>
          <Form.Label><strong>{key}</strong></Form.Label>
          <Form.Control
            type="text"
            name={key}
            value={value}
            onChange={handleModalInputChange}
            disabled={!isEditable || ['created_at', 'updated_at', 'id', 'provider_id'].includes(key)}
          />
        </Form.Group>
      ))}
    </Modal.Body>
    <Modal.Footer>
      {!isEditable ? (
        <Button variant="primary" onClick={handleEdit}>Edit</Button>
      ) : (
        <Button variant="success" onClick={handleSave}>Save</Button>
      )}
      <Button variant="danger" onClick={handleDelete}>Delete</Button>
      <Button variant="secondary" onClick={onHide}>
        Cerrar
      </Button>
    </Modal.Footer>
  </Modal>
);

export default DetailModal;
