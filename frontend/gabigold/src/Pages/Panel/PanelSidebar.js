import { useState, useEffect } from "react";
import Preloader from "../../components/Module/Preloader";
import Sidebar from "../../components/Module/Sidebar";
import Navbar from "../../components/Module/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Module/Footer";


const PanelSideBar = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true;
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  return (
    <div dir="rtl">
      <Preloader show={!loaded} />
      <Sidebar />
      <div className="content felx-grow-1">
        <Navbar />
        <Outlet />
        <Footer toggleSettings={toggleSettings} showSettings={showSettings} />
      </div>
    </div>
  );
}

export default PanelSideBar;
