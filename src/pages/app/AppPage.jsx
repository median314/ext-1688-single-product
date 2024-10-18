import { VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/react';
import { data_product_detail } from '../../utils/exampleDataResult';
import icons from '../../assets/success.svg';
import { translateText } from '../../api/translateUtils';

AppPage.propTypes = {
  addProduct1688: PropTypes.func, // Tidak wajib
};

function AppPage({ addProduct1688 }) {
  const [data1688, setData1688] = useState(null);
  const [lastCapturePosition, setLastCapturePosition] = useState(0);

  const checkUrl = window.location.href
  // console.log(checkUrl, 'this is check url')

  const processDataFromStorage = async() => {
    try {
      const interceptedDataFromStorage = JSON.parse(localStorage.getItem('interceptedArr')) ?? data_product_detail;
      const htmlDescriptionData = localStorage.getItem('detailContent') ?? null
      // console.log(interceptedDataFromStorage, 'ppoopp')

      
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
              image_parent: item?.imageUrl || '',
              price: skuInfo?.price || skuInfo?.discountPrice,
              skuId: skuInfo?.skuId,
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
          typeOfPrice = "FIX"
        }
        
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

        setData1688(mainData);
        // console.log(mainData, 'this is data app')
      }
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY;
      if (currentPosition - lastCapturePosition >= 4000) {
        const detailDiv = document.querySelector('.detail-description-content');
        if (detailDiv) {
          const newCapture = detailDiv.innerHTML;
          setData1688((prev) => ({ ...prev, description: newCapture }));
          // console.log('New HTML captured at', currentPosition, 'px');
        } else {
          console.log('No div with class "detail-description-content" found at', currentPosition, 'px');
          // setCapturedHtml('');
        }
        setLastCapturePosition(currentPosition);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastCapturePosition]);

  const pushData = () => {
    addProduct1688(data1688)
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      processDataFromStorage();
      pushData(data1688)
    }, 3000); // Tunggu 3 detik sebelum eksekusi

    return () => clearTimeout(timer); // Hapus timer jika komponen dibongkar
  }, [checkUrl]);

  return (
    <>
      <VStack
        position="fixed"
        backgroundColor="#ED8936"
        zIndex="999"
        borderTopLeftRadius="25px"
        borderBottomLeftRadius="25px"
        borderColor="gray.300"
        height="150px"
        width="200px"
        top="0px"
        right="0px"
        boxShadow="1px 8px 6px -2px black"
      >
      {data1688 !== null && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: "center", padding: "5px" }}>
          <img src={icons} width={'40px'} />
          <div style={{ fontWeight: 500, padding: "2px", color: 'white' }}>Success Get Product</div>
          <div onClick={() => pushData(data1688)} style={{ fontWeight: 500, fontSize: '13px', padding: "2px 3px", borderRadius: '5px', backgroundColor: '#FFF', cursor: 'pointer' }}>
            <p>Save Product</p>
          </div>
        </div>
      )}
        <div onClick={scrollToBottom} style={{ fontWeight: 500, fontSize: '13px', padding: "2px 3px", borderRadius: '5px', backgroundColor: '#FFF', cursor: 'pointer' }}>
          <p>Go To Bottom Page</p>
        </div>
      </VStack>
    </>
  );
}

export default AppPage;
