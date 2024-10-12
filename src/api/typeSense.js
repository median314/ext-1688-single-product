// typesenseClient.js
import * as Typesense from 'typesense';

const API = import.meta.env.VITE_TYPESENSE_API_KEY;

export const clientTypesense = new Typesense.Client({
  nodes: [
    {
      host: import.meta.env.VITE_TYPESENSE_HOST,
      port: '443',
      protocol: 'https',
    },
  ],
  apiKey: API,
  connectionTimeoutSeconds: 15,
});

export const addOrUpdateDocument = async (documentData, indexName) => {
  try {
    const documentWithId = { ...documentData, id: documentData.itemid };  // Set ID di sini
    try {
      // Coba ambil dokumen dengan ID yang sama
      await clientTypesense.collections(indexName).documents(documentWithId.id).retrieve();
      // Jika dokumen ditemukan, perbarui
      await clientTypesense.collections(indexName).documents().upsert(documentWithId);
      console.log('Document updated successfully');
    } catch (retrieveError) {
        await clientTypesense.collections(indexName).documents().create(documentWithId);
        console.log('Document created successfully');
    }
  } catch (error) {
    console.error('Error adding or updating document:', error);
  }
};
