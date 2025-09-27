import type { Dashboard } from '@api/types';
import { useMemo } from 'react';

interface DashboardCard {
  id: number;
  title: string;
  money: number;
  earnings: number;
  isPercentage: boolean;
}

interface ProductData {
  id: string;
  name: string;
  orders: number;
  ordersAmount: string;
  drr: string;
  ctr: string;
  cpc: string;
}

export function useDashboardCards(dashboards: Dashboard[]) {
  const cards = useMemo((): DashboardCard[] => {
    if (!dashboards.length) return [];

    // Берем последний дэшборд (самый актуальный)
    const latestDashboard = dashboards[0];
    const currentData = latestDashboard.current_data;
    const oldData = latestDashboard.old_data;

    // Функция для расчета изменения в процентах
    const calculateChange = (current: number, old: number | null): number => {
      if (!old || old === 0) return 0;
      return ((current - old) / old) * 100;
    };

    return [
      {
        id: 1,
        title: 'Заказы',
        money: currentData.orders_sum,
        earnings: calculateChange(currentData.orders_sum, oldData?.orders_sum || null),
        isPercentage: false,
      },
      {
        id: 2,
        title: 'ДРР',
        money: currentData.drr * 100, // Конвертируем в проценты
        earnings: calculateChange(currentData.drr, oldData?.drr || null),
        isPercentage: true,
      },
      {
        id: 3,
        title: 'CTR',
        money: currentData.ctr * 100, // Конвертируем в проценты
        earnings: calculateChange(currentData.ctr, oldData?.ctr || null),
        isPercentage: true,
      },
      {
        id: 4,
        title: 'CPC',
        money: currentData.cpc,
        earnings: calculateChange(currentData.cpc, oldData?.cpc || null),
        isPercentage: false,
      },
    ];
  }, [dashboards]);

  const products = useMemo((): ProductData[] => {
    if (!dashboards.length) return [];

    const latestDashboard = dashboards[0];
    const stats = latestDashboard.stats || [];

    return stats.map((stat, index) => ({
      id: `product-${stat.nm_id || index}`,
      name: stat.vendor_code,
      orders: stat.orders_count,
      ordersAmount: stat.orders_sum.toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      drr: `${(stat.drr * 100).toFixed(1)}%`,
      ctr: `${(stat.ctr * 100).toFixed(2)}%`,
      cpc: `${stat.cpc.toFixed(1)} ₽`,
    }));
  }, [dashboards]);

  return {
    cards,
    products,
  };
}
