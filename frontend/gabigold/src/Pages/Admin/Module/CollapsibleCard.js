// src/components/CollapsibleCard.js
import React, { useState } from 'react';
import { Card, Button, Collapse } from 'react-bootstrap';

const CollapsibleCard = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header>
        <Button
          variant="link"
          onClick={() => setOpen(!open)}
          aria-controls="collapse-content"
          aria-expanded={open}
          className="w-100 text-start text-decoration-none"
        >
          <h2 className="mb-0">{title}</h2>
        </Button>
      </Card.Header>
      <Collapse in={open}>
        <Card.Body id="collapse-content">
          {children}
        </Card.Body>
      </Collapse>
    </Card>
  );
};

export default CollapsibleCard;
