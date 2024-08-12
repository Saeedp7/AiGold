import '../src/css/gabi.css'
import './css/custom.css'
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import "react-datetime/css/react-datetime.css";
import RootLayout from './components/Module/RootLayout';
import MainContent from './Pages/content';
import Contact from './Pages/Contact';
import AboutUs from './Pages/About';
import Rules from './Pages/Rules';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor} from './store/configureStore';
// import LivePrice, { loader as PriceLoader } from './pages/Price';
import Login from './components/Module/Login';
import Signup from './Pages/Signup';
import RecoverPassword from './Pages/Forget';
import Shop from './components/Module/ShopHeader';
import ProductCat from './Pages/ProductCat';
import ProductDetail from './Pages/ProductDetails';
import PanelSideBar from './Pages/Panel/PanelSidebar';
import Checkout from './Pages/Checkout';
import PrivateRoute from './components/Module/PrivateRoute';
import Dashboard from './Pages/Panel/Dashboard';
import ProfileUpdate from './Pages/Panel/ProfileUpdate';
import { logout } from './store/actions/authActions';
import { isTokenExpired } from './components/utils/CheckToken';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Orders from './Pages/Panel/Orders';
import OrderDetails from './Pages/Panel/OrderDetails';
import CheckoutComplete from './Pages/CheckoutComplete';
import TicketList from './Pages/Panel/TicketList';
import SendTicket from './Pages/Panel/SendTicket';
import TicketDetails from './Pages/Panel/TicketDetails';
import NotAuthorized from './Pages/NotAuthorized';
import ChangePassword from './Pages/Panel/ChangePassword';
import AdminRoute from './components/Module/AdminRoute';
import CategoryList from './Pages/Admin/CategoryList';
import ProductList from './Pages/Admin/ProductList';
import AddProduct from './Pages/Admin/AddProduct';
import AdminOrderDetails from './Pages/Admin/AdminOrderDetails';
import OrdersList from './Pages/Admin/Orderlist';
import AdminTicketList from './Pages/Admin/AdminTicketList';
import SearchResults from './Pages/SearchResult';
import ReviewList from './Pages/Admin/ReviewList';
import UserList from './Pages/Admin/UserList';
import LivePriceComponent from './Pages/LivePrice';
import GoldPriceCalculatorPage from './Pages/GoldCalculator';
import Analytics from './Pages/Admin/Analytics';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,

    children: [
      { index: true, element: <MainContent /> },
      { path: 'contact-us', element: <Contact /> },
      { path: 'rules', element: <Rules /> },
      { path: 'about-us', element: <AboutUs /> },
      { path: 'live-price', element: <LivePriceComponent />},
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'forget', element: <RecoverPassword /> },
      { path: 'forbidden', element:<NotAuthorized />} ,
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
  {
     path: 'category',
     element: <Shop />,
     children: [
       { index: true, element: <Navigate to='/' /> },
       { path: ':categoryid', element: <ProductCat />, },
     ]
   },
   {
    path: 'searchresults',
    element: <Shop />,
    children: [
      { index: true, element: <SearchResults /> },
    ]
  },
  
  {
    path: 'calculator',
    element: <Shop />,
    children: [
      { index: true, element: <GoldPriceCalculatorPage /> },
    ]
  },
   {
    path: 'panel',
    element: <PanelSideBar />,
    children: [
      { index: true, element: <PrivateRoute><Dashboard /></PrivateRoute> },
      { path: 'profile', element: <PrivateRoute><ProfileUpdate /></PrivateRoute>},
      { path: 'changepassword', element: <PrivateRoute><ChangePassword /></PrivateRoute>},
      { path: 'orders', element: <PrivateRoute><Orders /></PrivateRoute> },
      { path: 'orders/:transaction_id', element: <PrivateRoute><OrderDetails /></PrivateRoute> },
      { path: 'tickets', element: <PrivateRoute><TicketList /></PrivateRoute> },
      { path: 'send-ticket', element: <PrivateRoute><SendTicket /></PrivateRoute> },
      { path: 'tickets/:ticketid', element: <PrivateRoute><TicketDetails /></PrivateRoute> },
      { path: 'category', element: <AdminRoute><CategoryList /></AdminRoute> },
      { path: 'productlist', element: <AdminRoute><ProductList /></AdminRoute> },
      { path: 'addproduct', element: <AdminRoute><AddProduct /></AdminRoute> },
      { path: 'orderslist', element: <AdminRoute><OrdersList /></AdminRoute> },
      { path: 'orderslist/:transaction_id', element: <AdminRoute><AdminOrderDetails /></AdminRoute> },
      { path: 'alltickets', element: <AdminRoute><AdminTicketList /></AdminRoute> },
      { path: 'allreviews', element: <AdminRoute><ReviewList /></AdminRoute> },
      { path: 'users', element: <AdminRoute><UserList /></AdminRoute> },
      { path: 'analytics', element: <AdminRoute><Analytics /></AdminRoute> },
    ]
  },
  {
     path: 'product',
     element: <Shop />,
     children: [
       { index: true, element: <Navigate to='/' /> },
       { path: ':productid', element: <ProductDetail />},
    ]
  },
   {
     path: 'checkout',
     element: <PanelSideBar />,
     children: [
       { index: true, element: <PrivateRoute><Checkout /></PrivateRoute>},
       { path: 'success', element: <CheckoutComplete /> },
     ]
   },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
      const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (accessToken && isTokenExpired(accessToken)) {
          dispatch(logout());
      }
  }, [dispatch]);

  return (
    <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
  );
}

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>

)
const root = createRoot(document.getElementById('gabigold'));
root.render(<Root />);

