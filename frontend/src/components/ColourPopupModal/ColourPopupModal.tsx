import React, { useState } from 'react';

import valueColours from './value-colours.png';
import { Button, Modal } from 'react-bootstrap';

const ColourPopupModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <Button variant="outline-dark" onClick={handleShow}>
        <i className="fas fa-info-circle mr-2"></i> Click for more information
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cost per Serving Colours</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={valueColours} className="img-fluid" id="colour-value" alt="value colors" />
          <p>
            The value of each purchasing option is represented visually by colors ranging from green to red.
          </p>
          <p>
            In the green section, the purchasing options are within <b>10%</b> of the best value option (the first
            item in the table). The yellow-orange section contains purchasing options that are within <b>20%</b> of
            the best purchasing option. Finally, the red zone offers very poor value. In the red section, the cost per
            serving can be upwards of <b>25%</b> when compared to the best purchasing option.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ColourPopupModal;

