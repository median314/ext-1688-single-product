// shopeeUtils.js

export const processShopeeProduct = (item) => {
    const unixTimestamp = item.ctime;
    const startDate = new Date(unixTimestamp * 1000);
    const endDate = new Date();
    const yearDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthDiff = endDate.getMonth() - startDate.getMonth();
    const totalMonths = yearDiff * 12 + monthDiff;
    const global_revenue = item.historical_sold != null && item.price != null ? String(item.historical_sold * (item.price / 100000)) : '';
    const calAverageSold = item.historical_sold && totalMonths ? (item.historical_sold / parseInt(totalMonths)) : '';
    const calTrend = item.sold && calAverageSold ? (((item.sold - calAverageSold) / calAverageSold) * 100) : '';
    const calStockValue = item.stock && item.price ? (item.stock * (item.price / 100000)) : '';
    const averageIncome = global_revenue / totalMonths;
    const revenue = item.sold != null && item.price !== undefined ? parseInt(item.sold * (item.price / 100000)) : '';

    item.stock_int = item.stock !== undefined ? parseInt(item.stock) : '';
    item.revenue_int = revenue
    item.rating_int = item.shop_rating !== undefined ? parseInt(item.shop_rating) : '';
    item.liked_int = item.liked !== undefined ? parseInt(item.liked) : '';
    item.historical_sold_int = item.historical_sold !== undefined ? parseInt(item.historical_sold) : '';
    item.global_revenue_int = item.historical_sold != '' && item.price !== undefined ? parseInt(item.historical_sold * (item.price / 100000)) : '';
    item.sold_int = item.sold !== undefined ? parseInt(item.sold) : '';
    item.price_int = item.price !== undefined ? parseInt(item.price / 100000) : '';
    item.average_income_int = averageIncome !== undefined ? parseInt(averageIncome) : null;
    item.stock_value_int = calStockValue !== undefined ? parseInt(calStockValue) : null;
    item.average_sold_int = calAverageSold !== undefined ? parseInt(calAverageSold) : null;
    item.trend_int = calTrend !== undefined ? parseInt(calTrend) : null;
  
    item.average_income = averageIncome !== undefined ? averageIncome.toString() : null;
    item.stock_value = calStockValue !== undefined ? calStockValue.toString() : null;
    item.average_sold = calAverageSold !== undefined ? calAverageSold.toString() : null;
    item.trend = calTrend !== undefined ? calTrend.toString() : null;
    item.price = item.price !== undefined ? (parseInt(item.price / 100000)).toString() : '';
    item.stock = item.stock !== undefined ? item.stock.toString() : '';
    item.revenue = revenue.toString()
    item.rating = item.shop_rating !== undefined ? item.shop_rating.toString() : '';
    item.liked = item.liked !== undefined ? item.liked.toString() : '';
    item.historical_sold = item.historical_sold !== undefined ? item.historical_sold.toString() : '';
    item.global_revenue = item.historical_sold != null && item.price !== undefined ? parseInt(item.historical_sold * (item.price / 100000)) : null;
    item.sold = item.sold !== undefined ? item.sold.toString() : '';

    return item;
  };
  
  