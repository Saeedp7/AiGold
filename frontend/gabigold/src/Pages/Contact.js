import React from "react";
import Frame from "../components/Module/Frame";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import ContactForm from "../components/Module/contactusform";


const Contact = (props) => {
  let navigate = useNavigate();




  return (
    <Frame isVisible={true}>
          <div className="d-block">
            <button className="btn btn-link" onClick={() => navigate("..")}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
          <div>
            <div>
              <span
                className="h1 px-2 shadow-4-strong"
                style={{ textShadow: "-5px 5px 4px rgba(0, 0, 0, 0.25)" }}
              >
                تماس با ما
              </span>
            </div>         
              <div className="px-2">
              <br></br>
              <svg width="20" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 10c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2m0-5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3m-7 2.602c0-3.517 3.271-6.602 7-6.602s7 3.085 7 6.602c0 3.455-2.563 7.543-7 14.527-4.489-7.073-7-11.072-7-14.527m7-7.602c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602"/></svg>
                <span className="h5 fw-bold" >آدرس</span><br/>
              
                <span  className="h6 fw-light">
                  خیابان معالی آباد, ساختمان برلیان شیراز/ ایران
                </span><br /><br />
                <svg width="20" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M8.26 1.289l-1.564.772c-5.793 3.02 2.798 20.944 9.31 20.944.46 0 .904-.094 1.317-.284l1.542-.755-2.898-5.594-1.54.754c-.181.087-.384.134-.597.134-2.561 0-6.841-8.204-4.241-9.596l1.546-.763-2.875-5.612zm7.746 22.711c-5.68 0-12.221-11.114-12.221-17.832 0-2.419.833-4.146 2.457-4.992l2.382-1.176 3.857 7.347-2.437 1.201c-1.439.772 2.409 8.424 3.956 7.68l2.399-1.179 3.816 7.36s-2.36 1.162-2.476 1.215c-.547.251-1.129.376-1.733.376"/></svg>
                <span className="h5 fw-bold">تلفن</span><br/>
                <span dir="ltr"  className="h6 fw-light" style={{float:'right'}}>+98 (713)634 02 01</span><br /> <br />
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm.053 17c.466 0 .844-.378.844-.845 0-.466-.378-.844-.844-.844-.466 0-.845.378-.845.844 0 .467.379.845.845.845zm.468-2.822h-.998c-.035-1.162.182-2.054.939-2.943.491-.57 1.607-1.479 1.945-2.058.722-1.229.077-3.177-2.271-3.177-1.439 0-2.615.877-2.928 2.507l-1.018-.102c.28-2.236 1.958-3.405 3.922-3.405 1.964 0 3.615 1.25 3.615 3.22 0 1.806-1.826 2.782-2.638 3.868-.422.563-.555 1.377-.568 2.09z"/></svg>
                <span className="h5 fw-bold px-1" >پشتیبانی</span><br></br>
                <span className="h6 fw-light">INFO @GABIGOLDGALLERY.COM</span><br />
              </div>
            </div>
            <div className="px-2">
                <ContactForm />
                
      </div>
    </Frame>
  );
};

export default Contact;
