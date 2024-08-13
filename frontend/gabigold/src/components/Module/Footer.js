import React from "react";
import { Row, Col, Card } from "react-bootstrap";

export default function Footer(props) {
  return (
    <footer className="footer section py-4 mt-auto">
      <Row className="align-items-center justify-content-between flex-wrap">
        <Col xs={12} lg={4} className="mb-3 mb-lg-0 text-center text-lg-left">
          <p className="mb-0">
            Copyright © 2019-2024{" "}
            <Card.Link
              href="https://www.gabigoldgallery.com"
              target="_blank"
              className="text-primary text-decoration-none fw-normal"
            >
              Gabi Gold Gallery
            </Card.Link>
          </p>
        </Col>
        <Col xs={12} lg={4} className="text-center mb-3 mb-lg-0">
          <ul className="list-inline mb-0">
            <li className="list-inline-item mx-2">
              <Card.Link href="/about-us" className="text-muted">
                درباره / About
              </Card.Link>
            </li>
            <li className="list-inline-item mx-2">
              <Card.Link href="/rules" className="text-muted">
                قوانین / Rules
              </Card.Link>
            </li>
            <li className="list-inline-item mx-2">
              <Card.Link href="/contact-us" className="text-muted">
                تماس با ما / Contact
              </Card.Link>
            </li>
          </ul>
        </Col>
        <Col xs={12} lg={4} className="text-center text-lg-right">
          <p className="mb-0">
            Website by{" "}
            <Card.Link
              href="https://www.saeedp7.ir"
              target="_blank"
              className="text-muted text-decoration-none fw-normal"
            >
              SaeedP7
            </Card.Link>
          </p>
        </Col>
      </Row>
    </footer>
  );
}
