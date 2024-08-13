import React, { useState } from "react";
import { Button, Collapse } from "react-bootstrap";

const AdressBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <footer id="footer" className="footer fixed-bottom pt-3 fs-10">
      <div className="container-fluid overflow-hidden">
        <div className="row gx-sm-5 justify-content-sm-between align-items-baseline flex-column">
            <div className="col-auto text-white h7">
            SHIRAZ, MALI ABAD, BRILIAN BUILDING
            </div>
          <div className="col-auto text-white h7">
            <Button
              variant="link"
              className="text-decoration-none text-white ms-0 p-0"
              onClick={() => setOpen(!open)}
              aria-controls="more-info-collapse"
              aria-expanded={open}
              style={{fontSize:"10px"}}
            >
              More Info <span style={{ fontSize: '1.0rem' }}>&gt;</span>
            </Button>
            <Collapse in={open}>
              <div id="more-info-collapse" className="mt-2">
                <div className="text-white">
                  Phone Numbers:
                  <br />
                  <a
                    className="text-decoration-none"
                    href="tel:+987136340201"
                    style={{ pointerEvents: "auto", color: "#fff" }}
                  >
                    +98 713 634 02 01
                  </a>
                  <br />
                  <a
                    className="text-decoration-none"
                    href="tel:+989363684122"
                    style={{ pointerEvents: "auto", color: "#fff" }}
                  >
                    +98 936 368 41 22
                  </a>
                </div>
                <div className="text-white mt-2">
                  Instagram:
                  <br />
                  <a
                    className="text-decoration-none"
                    href="https://www.instagram.com/gabigoldgallery/"
                    style={{ pointerEvents: "auto", color: "#fff" }}
                  >
                    @GABIGOLDGALLERY
                  </a>
                </div>
                <div className="text-white mt-2">
                  Email:
                  <br />
                  <a
                    className="text-decoration-none"
                    href="mailto:info@gabigoldgallery.com"
                    style={{ pointerEvents: "auto", color: "#fff" }}
                  >
                    INFO@GABIGOLDGALLERY.COM
                  </a>
                </div>
              </div>
            </Collapse>
          </div>
          <div className="col-auto text-white">
            © 2024 GABI
          </div>
          <div className="col-auto text-white">
            <a
              href="https://www.saeedp7.ir/"
              target="_blank"
              rel="noreferrer"
              className="text-decoration-none d-inline-flex align-items-center text-reset"
            >
              website by saeedp7 ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdressBar;
