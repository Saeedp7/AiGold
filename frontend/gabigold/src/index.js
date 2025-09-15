import './css/gabi.css';
import React, { Suspense, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import 'react-datetime/css/react-datetime.css';
import RootLayout from './components/Module/RootLayout';
import MainContent from './Pages/content';
import Contact from './Pages/Contact';
import AboutUs from './Pages/About';
import Rules from './Pages/Rules';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor} from './store/configureStore';
// import LivePrice, { loader as PriceLoader } from './pages/Price';
import { logout } from './store/actions/authActions';
import { isTokenExpired } from './components/utils/CheckToken';
import { useDispatch } from 'react-redux';

const RootLayout = React.lazy(() => import('./components/Module/RootLayout'));
const MainContent = React.lazy(() => import('./Pages/content'));
const Contact = React.lazy(() => import('./Pages/Contact'));
const AboutUs = React.lazy(() => import('./Pages/About'));
const Rules = React.lazy(() => import('./Pages/Rules'));
const Login = React.lazy(() => import('./components/Module/Login'));
const Signup = React.lazy(() => import('./Pages/Signup'));
const RecoverPassword = React.lazy(() => import('./Pages/Forget'));
const Shop = React.lazy(() => import('./components/Module/ShopHeader'));
const ProductCat = React.lazy(() => import('./Pages/ProductCat'));
const ProductDetail = React.lazy(() => import('./Pages/ProductDetails'));
const PanelSideBar = React.lazy(() => import('./Pages/Panel/PanelSidebar'));
const Checkout = React.lazy(() => import('./Pages/Checkout'));
const PrivateRoute = React.lazy(() => import('./components/Module/PrivateRoute'));
const Dashboard = React.lazy(() => import('./Pages/Panel/Dashboard'));
const ProfileUpdate = React.lazy(() => import('./Pages/Panel/ProfileUpdate'));
const Orders = React.lazy(() => import('./Pages/Panel/Orders'));
const OrderDetails = React.lazy(() => import('./Pages/Panel/OrderDetails'));
const CheckoutComplete = React.lazy(() => import('./Pages/CheckoutComplete'));
const TicketList = React.lazy(() => import('./Pages/Panel/TicketList'));
const SendTicket = React.lazy(() => import('./Pages/Panel/SendTicket'));
const TicketDetails = React.lazy(() => import('./Pages/Panel/TicketDetails'));
const NotAuthorized = React.lazy(() => import('./Pages/NotAuthorized'));
const ChangePassword = React.lazy(() => import('./Pages/Panel/ChangePassword'));
const AdminRoute = React.lazy(() => import('./components/Module/AdminRoute'));
const CategoryList = React.lazy(() => import('./Pages/Admin/CategoryList'));
const ProductList = React.lazy(() => import('./Pages/Admin/ProductList'));
const AddProduct = React.lazy(() => import('./Pages/Admin/AddProduct'));
const AdminOrderDetails = React.lazy(() => import('./Pages/Admin/AdminOrderDetails'));
const OrdersList = React.lazy(() => import('./Pages/Admin/Orderlist'));
const AdminTicketList = React.lazy(() => import('./Pages/Admin/AdminTicketList'));
const SearchResults = React.lazy(() => import('./Pages/SearchResult'));
const ReviewList = React.lazy(() => import('./Pages/Admin/ReviewList'));
const UserList = React.lazy(() => import('./Pages/Admin/UserList'));
const LivePriceComponent = React.lazy(() => import('./Pages/LivePrice'));
const GoldPriceCalculatorPage = React.lazy(() => import('./Pages/GoldCalculator'));
const Analytics = React.lazy(() => import('./Pages/Admin/Analytics'));
const CronJobs = React.lazy(() => import('./Pages/Admin/Cronjobs'));

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
      { path: 'cronjobs', element: <AdminRoute><CronJobs /></AdminRoute> },
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
      const accessToken = localStorage.getItem('access_token');
      if (accessToken && isTokenExpired(accessToken)) {
          dispatch(logout());
      }
  }, [dispatch]);

  return (
    <PersistGate loading={null} persistor={persistor}>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
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

