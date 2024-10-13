import { VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/react';
import { data_product_detail } from '../../utils/exampleDataResult';
import icons from '../../assets/success.svg';

AppPage.propTypes = {
  addProduct1688: PropTypes.func, // Tidak wajib
};

function AppPage({ addProduct1688 }) {
  const [data1688, setData1688] = useState(null);

  const checkUrl = window.location.href
  console.log(checkUrl, 'this is check url')

  const processDataFromStorage = async() => {
    try {
      const interceptedDataFromStorage = JSON.parse(localStorage.getItem('interceptedArr')) ?? data_product_detail;
      const htmlDescriptionData = localStorage.getItem('detailContent') ?? null
      console.log(interceptedDataFromStorage, 'ppoopp')

      if (interceptedDataFromStorage.globalData) {
        // const mainData = interceptedDataFromStorage[interceptedDataFromStorage.length - 1]?.data?.CategoryProducts?.data
        const { data, globalData } = interceptedDataFromStorage

        //needed to be translated, get api for translation
        // const translateTitle = await translateText(globalData.tempModel?.offerTitle)

        // console.log(translateTitle, 'this is trnaslate')

        //variant group
        let groupedVariantData
        const skuModel = globalData?.skuModel

        console.log(skuModel)

        if((Array.isArray(skuModel?.skuProps) && skuModel?.skuProps?.length !== 0) || typeof skuModel?.skuProps === 'object' ) {
          const { skuProps } = skuModel;
          const { skuInfoMap } = skuModel;
          
          const groupedData = skuProps[0].value.map((item) => {
            const name = item.name;
            const skuInfo = skuInfoMap[name]; // Find matching data in skuInfoMap
          
            return {
              ...item, // Spread the properties of the original object (name, imageUrl)
              ...skuInfo, // Add the matching skuInfoMap data
              title: item?.name,
              titleOri: item?.name,
              price: skuInfo?.price,
              skuId: skuInfo?.skuId,
              amountOnSale: skuInfo?.canBookCount,
              stock: skuInfo?.canBookCount,
            };
          });

          groupedVariantData = groupedData
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
        
        const weightObjectKey = '1081181309884';

        const mainData = {
          product_id:`${globalData?.tempModel?.offerId}`,
          category: {id: globalData?.tempModel?.postCategoryId, name: 'default'},
          platformType: '1688',
          description: JSON.parse(htmlDescriptionData)?.data || '',
          moq: globalData?.orderParamModel?.orderParam?.beginNum,
          title: globalData.tempModel?.offerTitle,
          price: globalData?.orderParamModel?.orderParam?.skuParam?.skuRangePrices,
          priceType: typeOfPrice,
          sold: globalData?.tempModel?.saledCount,
          stock: globalData?.orderParamModel?.orderParam?.canBookedAmount,
          price_ranges: globalData?.orderParamModel?.orderParam?.skuParam?.skuRangePrices?.length > 0 ? globalData?.orderParamModel?.orderParam?.skuParam?.skuRangePrices : [],
          product_images: imageProduct,
          variants: [{variant_items: groupedVariantData }],
          variant_type: skuModel?.skuInfoMap?.length > 0 ? 'mutliple_items' : 'no_variants',
          productUrl: window.location.href,
          weight: data[weightObjectKey]?.data?.freightInfo?.unitWeight || null,
          supplier: {
            url: globalData?.offerBaseInfo?.sellerWinportUrl,
            id: globalData?.offerBaseInfo?.sellerUserId,
            name: globalData?.tempModel?.companyName,
          }
        }

        setData1688(mainData);
        console.log(mainData, 'this is main data')
      }
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(error);
    }
  };

  const pushData = () => {
    addProduct1688(data1688)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      processDataFromStorage();
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
        height="120px"
        width="200px"
        top="0px"
        right="0px"
        boxShadow="1px 8px 6px -2px black"
      >
      {data1688 !== null && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: "center", padding: "5px" }}>
          <img src={icons} width={'40px'} />
          <div style={{ fontWeight: 500, padding: "2px", color: 'white' }}>Success Add Product</div>
          <div onClick={() => pushData(data1688)} style={{ fontWeight: 500, padding: "2px 3px", borderRadius: '5px', backgroundColor: '#FFF', cursor: 'pointer' }}>
            <p>Save Product</p>
          </div>
        </div>
      )}
      </VStack>
    </>
  );
}

export default AppPage;
