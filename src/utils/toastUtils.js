// toastUtils.js
import { useToast } from '@chakra-ui/react';

export function useShowToastSuccess() {
  const toast = useToast();

  const showToastSuccess = (message) => {
    toast({
      title: 'Autopilot',
      description: message,
      status: 'success',
      position: 'top-right',
      isClosable: true,
    });
  };

  return showToastSuccess;
}

export function useShowToastError() {
  const toast = useToast();

  const showToastError = (message) => {
    toast({
      title: 'Autopilot',
      description: message,
      status: 'error',
      position: 'top-right',
      isClosable: true,
    });
  };

  return showToastError;
}
