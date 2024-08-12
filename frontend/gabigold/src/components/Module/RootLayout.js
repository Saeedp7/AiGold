import { Outlet, useNavigation } from "react-router-dom";
import AdressBar from "./AdressBar";
import Header from "./Header";
import BackgroundSlider from "../../lib/BackgroundSlider";
import image1 from "../../assets/images/image1.jpg";
import image2 from "../../assets/images/image2.jpg";
import image3 from "../../assets/images/image3.jpg";
import image4 from "../../assets/images/image1.jpg";
import image5 from "../../assets/images/image2.jpg";
import { ToastContainer } from "react-toastify";

function RootLayout() {
  const navigation = useNavigation();

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
      <AdressBar />
    </>
  );
}

export default RootLayout;
