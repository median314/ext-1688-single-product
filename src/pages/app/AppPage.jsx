import { Box, Button, Card, CardBody, CardHeader, Divider, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, SimpleGrid, Spacer, Stack, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useShowToastError } from '../../utils/toastUtils';
import * as Sentry from '@sentry/react';
import { data_product_detail } from '../../utils/exampleDataResult';
import { extractNumber } from '../../utils/extractNumberFromString';

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

        //needed to be translated
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
              description: JSON.parse(htmlDescriptionData)?.data || ''
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
          weight: data[weightObjectKey]?.data?.freightInfo?.unitWeight,
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
    <Box>
      <VStack
        position="fixed"
        backgroundColor="#ED8936"
        zIndex="999"
        padding="5px"
        borderTopLeftRadius="25px"
        borderBottomLeftRadius="25px"
        borderColor="gray.300"
        height="150px"
        width="200px"
        top="150px"
        right="0px"
        boxShadow="1px 8px 6px -2px black"
      >
      {/* <Button colorScheme='orange'>Get Product Detail Data</Button> */}
      {/* <Box bg={'white'} cursor={'pointer'} fontWeight={500} rounded={'md'}>Get Product</Box> */}
      {data1688 !== null && (
        <div style={{ fontWeight: 500 }}>Data Didapatkan</div>
      )}
      <Box _disabled={true} bg={'white'} cursor={'pointer'} fontWeight={500} rounded={'md'} onClick={() => pushData()}>Push Product</Box>
      </VStack>

      {/* <Modal isOpen={isOpenCreate} onClose={() => closeModal()} size={"5xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Product Variant</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack mb={3} shadow={'md'}>
              <Spacer />
              <Text>Sort:</Text>

              <Select value={sortOption} onChange={handleSortChange} size={'md'}>
                <option value="price">Harga Terendah</option>
                <option value="liked_count">Terbanyak Disukai</option>
                <option value="sold">Terbanyak Terjual</option>
                <option value="stock">Stock Terbanyak</option>
              </Select>
            </HStack>
            <SimpleGrid
              spacing={4}
              templateColumns={{
                base: 'repeat(1, 1fr)', // untuk ponsel
                md: 'repeat(2, 1fr)',   // untuk iPad (medium device)
                lg: 'repeat(3, 1fr)'    // untuk web (large device)
              }}
            >
              {sortedData?.map((x, i) => (
                <a key={i} href={`${x?.url}`} style={{ width: '100%', cursor: 'pointer', textDecoration: 'none' }} target="_blank">

                  <Card key={i} width="100%">
                    <CardHeader>
                      <Image p="2" src={x?.imageUrl} alt={x?.name} />
                    </CardHeader>
                    <CardBody>
                      <Stack align='center' direction='row' justifyContent='center'>
                        <Text title={x?.name}>
                          {x?.name.length > 25 ? `${x?.name.substring(0, 25)} ...` : x?.name}
                        </Text>
                      </Stack>
                      <Divider borderColor="black" width="100%" />
                      <Stack align='center' direction='row'>
                        <Text>Toko</Text>
                        <Spacer />
                        <Text title={x?.shop?.name ?? 'Nama Toko Tidak Tersedia'}>{productName(x?.shop?.name ?? 'Nama Toko Tidak Tersedia')}</Text>
                      </Stack>
                      <Divider borderColor="black" width="100%" />
                      <Stack align='center' direction='row'>
                        <Text>Lokasi Toko</Text>
                        <Spacer />
                        <Text title={x?.shop?.location?.trim() ? x.shop?.location : 'Lokasi Toko Tidak Tersedia'}>{productName(x?.shop?.location?.trim() ? x?.shop?.location : 'Lokasi Toko Tidak Tersedia')}</Text>
                      </Stack>
                      <Divider borderColor="black" width="100%" />
                      <Stack align='center' direction='row'>
                        <Text>Trend</Text>
                        <Spacer />
                        <Text>
                          {parseInt(averageSoldCalculate(x?.historical_sold, x?.ctime, x?.sold)) > 0 ? (
                            <Icon as={FaArrowUp} color="green.500" />
                          ) : parseInt(averageSoldCalculate(x?.historical_sold, x?.ctime, x?.sold)) == 0 ? (
                            <Icon as={FaEquals} color="gray.500" />
                          ) : (
                            <Icon as={FaArrowDown} color="red.500" />
                          )}
                          {'( ' + averageSoldCalculate(x?.historical_sold, x?.ctime, x?.sold) + ' %)'}
                        </Text>
                      </Stack>
                      <Divider borderColor="black" width="100%" />
                      <Stack align='center' direction='row'>
                        <Text>{x?.discountPercentage > 0 ? 'Harga Terbaik' : 'Harga'}</Text>
                        <Spacer />
                        <Text>{formatPriceV2((x?.price ?? 0 / 1000000))}</Text>
                        <Text>{formatPriceV2((x?.priceInt ?? 0) * 2239.90)}</Text>
                      </Stack>
                      <Divider borderColor="black" width="100%" />
                      <Stack align='center' direction='row'>
                        <Text>Stok</Text>
                        <Spacer />
                        <Text>{formatNumberV2(x?.stock)} Pcs</Text>
                      </Stack>
                      
                      <Divider borderColor="black" width="100%" />
                      <Stack align='center' direction='row'>
                        <Text>Nilai Ulasan</Text>
                        <Spacer />
                        <Text>{'⭐'.repeat(Math.round(x?.rating ?? 0))} {formatNumber(x?.rating ?? 0)} / 5</Text>
                      </Stack>
                      <Divider borderColor="black" width="100%" />
                      <Stack align='center' direction='row'>
                        <Text>Jumlah Review</Text>
                        <Spacer />
                        <Text> ❤️ {formatNumberV2(x?.countReview)}</Text>
                      </Stack>
                      <Divider borderColor="black" width="100%" />
                      <Stack align='center' direction='row'>
                        <Text>Penjualan</Text>
                        <Spacer />
                        <Text>{x?.labelGroups[0]?.title}</Text>
                      </Stack>
                      <Divider borderColor="black" width="100%" />
                      <Stack align='center' direction='row'>
                        <Text>Dibuat</Text>
                        <Spacer />
                        <Text>{formatDate(x?.ctime)}</Text>
                      </Stack>
                      <Divider borderColor="black" width="100%" />
                      <Stack align='center' direction='row'>
                        <Text>Rata-Rata Terjual / Bulan</Text>
                        <Spacer />
                        <Text>{averageSoldCalculate(x?.historical_sold, x?.ctime)} Pcs</Text>
                      </Stack>

                      {x?.sold !== undefined && (
                        <>
                          <Divider borderColor="black" width="100%" />
                          <Stack align='center' direction='row'>
                            <Text>Total Terjual</Text>
                            <Spacer />
                            <Text>{formatNumberV2(x.sold)} Pcs</Text>
                          </Stack>
                        </>
                      )}
                      {x?.sold !== undefined && (
                        <>
                          <Divider borderColor="black" width="100%" />
                          <Stack align='center' direction='row'>
                            <Text>Total Omzet</Text>
                            <Spacer />
                            <Text>{formatPriceV2((x?.sold ?? 0) * ((x?.price ?? 0) * 2239.9))}</Text>
                          </Stack>
                        </>
                      )}
                    </CardBody>
                  </Card>
                </a>
              ))}

            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal> */}
    </Box>
  );
}

export default AppPage;
