// src/pages/AnalyticsPage.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../components/utils/axiosinterceptor';
import { Container } from 'react-bootstrap';
import SalesAnalytics from './Module/SalesAnalytics';
import UserAnalytics from './Module/UserAnalytics';
import CartAnalytics from './Module/CartAnalytics';
import OrderAnalytics from './Module/OrderAnalytics';
import TicketAnalytics from './Module/TicketAnalytics';
import ProductAnalytics from './Module/ProductAnalytics';
import { BACKEND_URL } from '../../components/utils/api';
import CollapsibleCard from './Module/CollapsibleCard';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance.get(BACKEND_URL + '/analytics/summary/').then((response) => {
      setData(response.data);
    });
  }, []);

  if (!data) return <p>بارگذاری...</p>;

  return (
    <Container  className="font-fa w-75">
      <h1 className="text-center my-4">تحلیل و آمار</h1>

      <CollapsibleCard title="فروش">
        <SalesAnalytics data={data} />
      </CollapsibleCard>

      <CollapsibleCard title="کاربران">
        <UserAnalytics data={data} />
      </CollapsibleCard>

      <CollapsibleCard title="سبد خرید">
        <CartAnalytics data={data} />
      </CollapsibleCard>

      <CollapsibleCard title="سفارشات">
        <OrderAnalytics data={data} />
      </CollapsibleCard>

      <CollapsibleCard title="تیکت‌ها">
        <TicketAnalytics data={data} />
      </CollapsibleCard>

      <CollapsibleCard title="محصولات">
        <ProductAnalytics data={data} />
      </CollapsibleCard>
    </Container>
  );
};

export default AnalyticsPage;
