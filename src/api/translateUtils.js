import axios from "axios";

 const baseUrl = 'https://importir-next.vercel.app/api/services/translate/google'

export const translateText = async (text) => {
    try {
      const response = await axios.post(baseUrl, {
        text: text,
        targetLanguage: 'en'
    });

    if(response.status) {
        return response.data; // Get translated text
    } else {
        return response
    }
    } catch (error) {
      console.error('Error translating text:', error);
      return null;
    }
  };