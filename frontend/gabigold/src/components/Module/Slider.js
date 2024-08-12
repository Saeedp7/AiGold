import React, { useState, useEffect } from 'react';
import image1 from '../../assets/images/Slide1.JPG';
import image2 from '../../assets/images/Slide2.png';
import image3 from '../../assets/images/Slide3.png';


export const SliderData = [
    {
      image:
        image1
    },
    {
      image:
      image2
    },
    {
      image:
      image3
    },
  ];

const delay = 10000;

const ImageSlider = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = React.useRef(null);
  const length = SliderData.length;

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
      setCurrent((prevIndex) =>
          prevIndex === length - 1 ? 0 : prevIndex + 1
        ),
        delay
        );

    return () => {
      resetTimeout();
    };
  }, [current, length]);


  return (
    <section className='slider mx-3 px-1 pt-2 me-4 pe-3 me-md-0 pe-md-0'  style={{height:"72vh"}}>
      {SliderData.map((slide, index) => {
        return (
          <div
            className={index === current ? 'slide active' : 'slide'}
            key={index}
          >
            {index === current && (
              <img src={slide.image} alt='GabiGoldGallery' className='img-fluid' style={{minHeight:"100%", minWidth:"100%"}} />
            )}
          </div>
        );
      })}
    </section>
  );
};

export default ImageSlider;

