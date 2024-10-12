/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
import CryptoJS from 'crypto-js';

export const encryptToken = (message) => {
  const secretKey = import.meta.env.VITE_ACCOUNT_KEY;
  if (!secretKey) {
    console.log("Error")
  }

  const token = CryptoJS.AES.encrypt(message, secretKey).toString();

  return token;
};

export const decryptToken = (message) => {
  const secretKey = import.meta.env.VITE_ACCOUNT_KEY;
  if (!secretKey) {
    console.log("Error")
  }

  // Dekripsi pesan
  try {
    const bytes = CryptoJS.AES.decrypt(message, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    return (
      console.log("Error")

    );
  }
};
