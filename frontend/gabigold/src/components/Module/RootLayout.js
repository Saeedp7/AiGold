import { Outlet, useNavigation, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AddressBar from "./AddressBar";
import Header from "./Header";
import BackgroundSlider from "../../lib/BackgroundSlider";
import image1 from "../../assets/images/image1.jpg";
import image2 from "../../assets/images/image2.jpg";
import image3 from "../../assets/images/image3.jpg";
import image4 from "../../assets/images/image6.jpg";
import image5 from "../../assets/images/image4.JPG";
import { ToastContainer } from "react-toastify";

function RootLayout() {
  const navigation = useNavigation();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      document.documentElement.setAttribute("data-page", "home");
    } else {
      document.documentElement.removeAttribute("data-page");
    }
    return () => {
      document.documentElement.removeAttribute("data-page");
    };
  }, [location.pathname]);

  return (
    <>
      {navigation.state === "loading" && <p>Loading...</p>}
      <Header />
      <ToastContainer
          position="top-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      <BackgroundSlider
        images={[image1, image2, image3, image4, image5]}
        duration={5}
        transition={0.5}
      />
      <main className="flex-grow-1">
          <Outlet />
      </main>
      <AddressBar />
    </>
  );
}

export default RootLayout;
