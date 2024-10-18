import { useEffect } from 'react';
import useUserStore from './hooks/userStore';
import AppPage from './pages/app/AppPage';
import { decryptToken } from './utils/encrypToken';
// import { processShopeeProduct } from './utils/addDataUtils';
import { setDocumentFirebase } from './api/firebaseApi';
import * as Sentry from '@sentry/react';
import { addOrUpdateDocument } from './api/typeSense';
import { data_product_detail } from './utils/exampleDataResult';
import { translateText } from './api/translateUtils';

function App() {
  const globalState = useUserStore();
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const processDataFromStorage = async () => {
    await delay(3000);

    try {
      const interceptedDataFromStorage = JSON.parse(localStorage.getItem('interceptedArr')) ?? data_product_detail;
      const htmlDescriptionData = localStorage.getItem('detailContent') ?? null
      if (interceptedDataFromStorage.globalData) {
        // const mainData = interceptedDataFromStorage[interceptedDataFromStorage.length - 1]?.data?.CategoryProducts?.data
        const { data, globalData } = interceptedDataFromStorage

        const translateTitle = await translateText(globalData.tempModel?.offerTitle)
        // console.log(translateTitle, 'this is title')
        //variant group
        let groupedVariantData
        const skuModel = globalData?.skuModel

        // console.log(skuModel)

        if ((Array.isArray(skuModel?.skuProps) && skuModel?.skuProps?.length !== 0) || typeof skuModel?.skuProps === 'object') {
          const { skuProps } = skuModel;
          const { skuInfoMap } = skuModel;
        
          // Use Promise.all to resolve all promises returned by the map function
          const groupedData = await Promise.all(skuProps[0].value.map(async (item) => {
            const name = item.name;
            const skuInfo = skuInfoMap[name]; // Find matching data in skuInfoMap
        
            // Translate title
            const variantNameTranslate = await translateText(name);
        
            return {
              ...item, // Spread the properties of the original object (name, imageUrl)
              ...skuInfo, // Add the matching skuInfoMap data
              title: variantNameTranslate?.data || item?.name,
              titleOri: item?.name,
              price: skuInfo?.price || skuInfo?.discountPrice,
              skuId: skuInfo?.skuId,
              image_parent: item?.imageUrl || '',
              amountOnSale: skuInfo?.canBookCount,
              stock: skuInfo?.canBookCount,
            };
          }));
        
          groupedVariantData = groupedData; // Now the promises are resolved
        }

        //image
        const imageProduct = globalData?.images?.map((x) => { return { link: x?.fullPathImageURI } })

        //price type
        let typeOfPrice
        const priceType = globalData?.orderParamModel?.orderParam?.skuParam?.skuPriceType
        if(priceType === 'skuPrice') {
          typeOfPrice = 'PRICE_BY_VARIANTS'
        } else if (priceType === 'rangePrice') {
          typeOfPrice = 'RANGE'
        } else {
          typeOfPrice = priceType
        }
        
        // console.log(groupedVariantData); 
        
        const weightObjectKey = '1081181309884';

        const mainData = {
          product_id:`${globalData?.tempModel?.offerId}`,
          category: {id: globalData?.tempModel?.postCategoryId, name: 'default'},
          platformType: '1688',
          description: JSON.parse(htmlDescriptionData)?.data || '',
          moq: globalData?.orderParamModel?.orderParam?.beginNum,
          title: translateTitle?.data || globalData.tempModel?.offerTitle,
          prices: parseFloat(globalData?.orderParamModel?.orderParam?.skuParam?.skuRangePrices[0]?.price),
          price_type: typeOfPrice,
          sold: globalData?.tempModel?.saledCount,
          stock: globalData?.orderParamModel?.orderParam?.canBookedAmount,
          price_ranges: globalData?.orderParamModel?.orderParam?.skuParam?.skuRangePrices?.length > 0 ? globalData?.orderParamModel?.orderParam?.skuParam?.skuRangePrices : [],
          product_images: imageProduct,
          variants: [{name: translateTitle?.data, image: imageProduct[0]?.link, variant_items: groupedVariantData }],
          variant_type: skuModel?.skuInfoMap?.length === 0 ? 'no_variants' : 'multiple_items',
          productUrl: window.location.href,
          weight: data[weightObjectKey]?.data?.freightInfo?.unitWeight || null,
          currency: 'rmb',
          supplier: {
            url: globalData?.offerBaseInfo?.sellerWinportUrl,
            id: globalData?.offerBaseInfo?.sellerUserId,
            name: globalData?.tempModel?.companyName,
          }
        }

        console.log('data =>', mainData)
      }

      // if(interceptedDataFromStorage?.globalData) addProduct1688(interceptedDataFromStorage?.globalData)
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(error);
    }
  };

  const addProduct1688 = async (data) => {
    // console.log(data, 'this is the data')
    if(data) {
      try {
        const resAdd = await setDocumentFirebase('product_details', `${data?.product_id}`, data);
        console.log(resAdd, 'success add data')
        
        const documentWithId = { 
          ...data,
          id: String(data?.product_id)
        };
        addOrUpdateDocument(documentWithId, 'product_details');
      } catch (error) {
        Sentry.captureException(error);
        console.error('Error while processing item:', error);
        throw new Error(error);
      } finally {
        alert('Data saved')
      }
    }
  }

  useEffect(() => {
    try {
      // const inPageset = localStorage.getItem('inPage');
      // let totalPage = inPageset !== null ? parseInt(inPageset) : 1;
      const localUser = localStorage.getItem('users');
      const token = localStorage.getItem('setAccessToken');
      const itemStr = localStorage.getItem('expired');
      if (itemStr) {
        const item = JSON.parse(itemStr);
        const now = new Date();

        if (now.getTime() > item) {
          // Jika data sudah kadaluwarsa, hapus dari localStorage
          localStorage.removeItem('users');
          localStorage.removeItem('setAccessToken');
          localStorage.removeItem('expired');
        } else {
          // Jika data belum kadaluwarsa, set global state
          if (localUser && token) {
            const dataUser = JSON.parse(localUser);
            const dataToken = decryptToken(token);
            globalState.setUsers(dataUser);
            globalState.setAccessToken(dataToken);
            globalState.setIsLoggedIn(true);
          }
        }
      }
      // processDataFromStorage();
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(error);
    }
  }, [globalState.isLoggedIn]);

  useEffect(() => {
    processDataFromStorage();

  }, [])
  return (
    <>
      <AppPage addProduct1688={addProduct1688} />
    </>
  );
}

export default App;


//mau ada detail product nya
//mau ada category id, fetching categorynya
//simpen data nya di products di firebase importir