import { Box, Divider, Flex, Image, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { formatPrice } from '../../utils/numberUtils';
import axios from 'axios';
import { exampleSearchProduct } from './exampleProduct';

function RecomendProductComponent() {
  // const [recomendProducts, setRecomendProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiProductRecomend = import.meta.env.VITE_IMPORTIR_PRODUCT

  const exampleData = exampleSearchProduct[0]

  const productName = (data) => {
    if (!data || typeof data !== 'string') return '';
    return data.length > 10 ? data.substring(0, 10) + ' ...' : data;
  }

  const getDataRecomend = async () => {
    try {
      // const res = await axios.get(apiProductRecomend,
      await axios.get(apiProductRecomend,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
      // setRecomendProducts(res.data.data.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching recommended products:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDataRecomend();
  }, []);

  return (
    <Flex direction="column" position="relative" backgroundColor="#FFF" maxW="200px">
      <Flex overflowX="auto">
        {isLoading ? (
          <Spinner
            mt={12}
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : (
          exampleData && exampleData?.data?.CategoryProducts?.data.map((x, i) => (
            <Box
              p={2}
              key={i}
              flex="0 0 auto"
              mr="15px"
              maxW="125px"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
              sx={{
                transition: 'transform 0.3s',
                _hover: {
                  transform: 'scale(1.05)'
                }
              }}

            >
              <a
                href={`https://www.importir.com/product/1688/${x?.id}`}
                target="_blank"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Box>
                  <Image
                    src={x?.imageUrl}
                    alt="Product Image"
                    boxSize="125px"
                    objectFit="cover"
                  />
                  <Text mt="2" fontSize={14} title={x['title-en']?.en} color="black">
                    {productName(
                      x?.name
                    )}
                    <Divider />
                    Rp{formatPrice(x?.priceInt )}
                  </Text>
                </Box>
              </a>
            </Box>
          ))
        )}
      </Flex>
      <Box
        position="absolute"
        top={0}
        right={0}
        bottom={0}
        width="50px"
        background="linear-gradient(to right, rgba(255, 214, 0, 0), #FFF)"
        pointerEvents="none"
      />
    </Flex>
  );
}

export default RecomendProductComponent;
