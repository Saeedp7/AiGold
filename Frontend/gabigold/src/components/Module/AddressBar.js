import React, { useState } from "react";
import { Button, Collapse } from "react-bootstrap";

const AddressBar = () => {
  const [open, setOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  return (
    <footer id="footer" className="footer fixed-bottom pt-3 pb-1 fs-10 text-white">
      <div className="container-fluid position-relative" style={{ minHeight: '15vh' }}>
        {/* MAIN WRAPPER: Flex parent for two columns */}
        <div className="d-flex flex-row justify-content-between gap-4">

          {/* LEFT COLUMN: Address, More Info, Credits */}
          <div className="d-flex flex-column gap-2" style={{ flex: 1 }}>
            <div>SHIRAZ, MALI ABAD, BRILIAN BUILDING</div>

            <div>
              <Button
                variant="link"
                className="text-decoration-none text-white p-0"
                onClick={() => setOpen(!open)}
                aria-controls="more-info-collapse"
                aria-expanded={open}
                style={{ fontSize: "10px" }}
              >
                More Info <span style={{ fontSize: '1rem' }}>&gt;</span>
              </Button>
              <Collapse in={open}>
                <div id="more-info-collapse" className="mt-2">
                  <div>
                    Phone Numbers:<br />
                    <a href="tel:+987136340201" className="text-white text-decoration-none">+98 713 634 02 01</a><br />
                    <a href="tel:+989363684122" className="text-white text-decoration-none">+98 936 368 41 22</a>
                  </div>
                  <div className="mt-2">
                    Instagram:<br />
                    <a href="https://www.instagram.com/gabigoldgallery/" className="text-white text-decoration-none">@GABIGOLDGALLERY</a>
                  </div>
                  <div className="mt-2">
                    Email:<br />
                    <a href="mailto:info@gabigoldgallery.com" className="text-white text-decoration-none">INFO@GABIGOLDGALLERY.COM</a>
                  </div>
                </div>
              </Collapse>
            </div>

            <div>© 2025 GABI</div>

            <div>
              <a
                href="https://www.saeedp7.ir/"
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none text-reset"
              >
                website by saeedp7 ↗
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Gold Price */}
          <div
            className="d-flex flex-column align-items-end gap-2 text-end"
            style={{ flex: 1 }}
          >
            <div className="text-md-end text-start">
              <Button
                variant="link"
                className="text-decoration-none text-white p-0 direction-rtl"
                onClick={() => setPriceOpen(!priceOpen)}
                aria-controls="more-price-collapse"
                aria-expanded={priceOpen}
                style={{ fontSize: "16px" }}
              >
                <span style={{ fontSize: '1rem' }}>&lt;</span>
                قیمت لحظه ای طلا
              </Button>
            </div>
            <Collapse in={priceOpen}>
              <div id="more-price-collapse" className="mt-2 text-white text-end">
                <div>هر گرم طلای 18 عیار: 6654000 تومان</div>
                <div className="mt-2">مظنه: 27854000 تومان</div>
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AddressBar;
