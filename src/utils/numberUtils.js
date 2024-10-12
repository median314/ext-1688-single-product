export function formatPrice(value,) {
    if (typeof value === 'number') {
      if (value < 1000) {
        let val = value.toFixed(2,);
        if (val === '0.00') {
          val = '0';
        } else {
          val = parseFloat(val,).toString();
        }
        return val.replace(/\B(?=(\d{3})+(?!\d))/g, ',',);
      } else {
        return value.toFixed(0,).replace(/\B(?=(\d{3})+(?!\d))/g, ',',);
      }
    } else {
      return '0';
    }
  }

  export const formatNumber = (number) => {
    return new Intl.NumberFormat('id-ID', { maximumSignificantDigits: 2 }).format(number);
  };

  export const formatNumberV2 = (number) => {
    return new Intl.NumberFormat('id-ID').format(number);
  };

  export const formatPriceV2 = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number)
  };

  export const formatPriceYuan = (number) => {
    return new Intl.NumberFormat('cn-CN', { style: 'currency', currency: 'CNY' }).format(number)
  };