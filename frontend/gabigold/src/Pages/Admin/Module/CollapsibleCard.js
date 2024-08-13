// src/components/CollapsibleCard.js
import React, { useState } from 'react';
import { Button, Collapse } from 'react-bootstrap';

const CollapsibleCard = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="shadow-sm mb-4 rounded border">
      <div className="p-3 bg-light border-bottom">
        <Button
          variant="link"
          onClick={() => setOpen(!open)}
          aria-controls="collapse-content"
          aria-expanded={open}
          className="w-100 text-start text-decoration-none"
        >
          <h4 className="mb-0 text-primary">{title}</h4>
        </Button>
      </div>
      <Collapse in={open}>
        <div id="collapse-content" className="p-3">
          {children}
        </div>
      </Collapse>
    </div>
  );
};

export default CollapsibleCard;
