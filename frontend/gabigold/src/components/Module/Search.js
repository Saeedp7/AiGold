import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // Import the styles for the slider
import { useNavigate } from "react-router-dom";

const Search = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [weightRange, setWeightRange] = useState([0, 100]); // Initial range for weight
  const [wageRange, setWageRange] = useState([0, 20]); // Initial range for wage
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/searchresults", {
      state: {
        searchTerm,
        minWeight: weightRange[0],
        maxWeight: weightRange[1],
        minWage: wageRange[0],
        maxWage: wageRange[1],
      },
    });
    props.onHide(); // Close the modal after search
  };

  useEffect(() => {
    if (!props.show) {
      // Reset form fields when the modal is closed
      setSearchTerm("");
      setWeightRange([0, 100]);
      setWageRange([0, 20]);
    }
  }, [props.show]);

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        dialogClassName="search-modal"
        dir="rtl"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-center w-100">جستجوی محصولات</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="searchTerm">
              <Form.Label>عبارت جستجو</Form.Label>
              <Form.Control
                className="w-100"
                type="text"
                placeholder="عبارت مورد نظر را وارد کنید"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>

            <Row className="mt-4">
              <Col>
                <Form.Group controlId="weightRange">
                  <Form.Label>بازه وزن (گرم)</Form.Label>
                  <div dir="rtl">
                    <Slider
                      range
                      min={0}
                      max={100}
                      value={weightRange}
                      onChange={setWeightRange}
                      trackStyle={[{ backgroundColor: 'black' }]}
                      railStyle={{ backgroundColor: 'black' }}
                      handleStyle={[
                        { borderColor: 'black', backgroundColor: 'black' },
                        { borderColor: 'black', backgroundColor: 'black' }
                      ]}
                      reverse
                    />
                  </div>
                  <div className="d-flex justify-content-between mt-2 text-muted">
                    <span>{weightRange[0]} گرم</span>
                    <span>{weightRange[1]} گرم</span>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col>
                <Form.Group controlId="wageRange">
                  <Form.Label>بازه اجرت (%)</Form.Label>
                  <div dir="rtl">
                    <Slider
                      range
                      min={0}
                      max={100}
                      value={wageRange}
                      onChange={setWageRange}
                      trackStyle={[{ backgroundColor: 'black' }]}
                      railStyle={{ backgroundColor: 'black' }}
                      handleStyle={[
                        { borderColor: 'black', backgroundColor: 'black' },
                        { borderColor: 'black', backgroundColor: 'black' }
                      ]}
                      reverse
                    />
                  </div>
                  <div className="d-flex justify-content-between mt-2 text-muted">
                    <span>{wageRange[0]}%</span>
                    <span>{wageRange[1]}%</span>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="primary" onClick={handleSearch} className="w-50">
            جستجو
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Search;
