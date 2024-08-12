import React, { useRef } from "react";
import Frame from "../components/Module/Frame";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";


const Contact = (props) => {
  let navigate = useNavigate();

  const ref = useRef(null);


  return (
    <Frame isVisible={true}>
          <div className="d-block">
            <button className="btn btn-link" onClick={() => navigate("..")}>
              <FontAwesomeIcon icon={faX} />
            </button>
            <div>
                <div>
                <span className="h1 px-3  shadow-4-strong" style={{textShadow: "-5px 5px 4px rgba(0, 0, 0, 0.25)"}}>درباره ما</span><br /><br />
                <span  className="px-3 fw-light h4">آشنایی با گالری گابی</span><br /><br />
                </div>
                <div ref={ref} className="px-3 d-block pt-5 pt-md-1">
                <p>واژه " گابی" تشکیل شده از گالری ابوطالبی می باشد.</p>
                <p>
                  گالری گابی در مهر ماه 1402 در ایران شهر شیراز کار خود را به طور
                  رسمی آغاز کرد .
                </p>
                <p>
                  سینا ابوطالبی به عنوان سرمایه گزار و مدیرعامل بنیانگزاران این
                  گالری می باشد .{" "}
                </p>
                <p>
                  این مجموعه حاصل تجربه چندین ساله از هنر , معماری و در نهایت طلا
                  می باشد .
                </p>
                <p>
                  امروزه مجموعه گابی با هدف ایجاد حس صمیمیت , اعتماد و ایجاد بستری
                  برای لبخند رضایت بر لبان مشتری در خدمت شما عزیزان است .
                </p>
                <p>
                  ما برای القای حس صمیمیت و شریک شدن این مجموعه با شما سعی کردیم
                  معماری و فضای آشنا را برای شما نمایشگر باشیم تا به راحتی این
                  مجموعه برای شما در هر کجای ایران عزیزمان قابل تمیز دادن و تشخیص
                  باشد . .
                </p>
                <p>سینا ابوطالبی</p>
                </div>
              </div>
          </div>
          <div>
            <div>
              
                <br></br>
              </div>
      </div>
    </Frame>
  );
};

export default Contact;
