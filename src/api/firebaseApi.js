/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/react-in-jsx-scope */
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    startAfter,
    updateDoc,
    where,
  } from 'firebase/firestore';

  // import { errorSlack } from './slackApi';
  import { auth, db } from '../config/firebase';
  
  // get Doc Firebase
  
  export const getSingleDocumentFirebase = async (collectionName, docName) => {
    try {
      const docRef = doc(db, collectionName, docName);
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists) {
        const docData = docSnapshot.data();
        // Lakukan manipulasi data atau operasi lain jika diperlukan
        return { id: docSnapshot.id, ...docData };
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(error.message, 'Failed to send  error message');
    }
  };
  
  // Example Call :
  // const testData = async ()=>{
  //     try {
  //       const result = await getSingleDocumentFirebase('Book', 'The Secret')
  //       console.log(result, 'ini resut')
  //     } catch (error) {
  //       console.log(error)
  //     }
  // }
  
  // finish
  
  // get collection firebase
  
  export const getCollectionFirebase = async (
    collectionName,
    conditions = [],
    sortBy = null,
    limitValue = null,
    startAfterData = null
  ) => {
    try {
      let collectionRef = collection(db, collectionName);
  
      // Tambahkan kondisi filter jika ada
      if (conditions.length > 0) {
        conditions.forEach((condition) => {
          const { field, operator, value } = condition;
          collectionRef = query(collectionRef, where(field, operator, value));
        });
      }
  
      // Tambahkan pengurutan jika ada
      if (sortBy) {
        const { field, direction } = sortBy;
        collectionRef = query(collectionRef, orderBy(field, direction));
      }
  
      // Tambahkan batasan jumlah dokumen jika ada
      if (limitValue) {
        collectionRef = query(collectionRef, limit(limitValue));
      }
  
      if (startAfterData) {
        // console.log(startAfterData)
        // collectionRef = query(collectionRef, startAfter(startAfterData));
      }
  
      const querySnapshot = await getDocs(collectionRef);
      const collectionData = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        // Lakukan manipulasi data atau operasi lain jika diperlukan
        collectionData.push({ id: doc.id, ...docData });
      });
      return collectionData; // Outputkan data koleksi ke konsol (bisa diganti sesuai kebutuhan)
    } catch (error) {
      throw new Error(error.message, 'Failed to send  error message');
    }
  };
  
  export const getCollectionFirebaseV4 = async (
    collectionName,
    { conditions = [] },
    { sortBy = null },
    { limitValue = null },
    { startAfterData = null }
  ) => {
    try {
      let collectionRef = collection(db, collectionName);
  
      // Tambahkan kondisi filter jika ada
      if (conditions.length > 0) {
        conditions.forEach((condition) => {
          const { field, operator, value } = condition;
          collectionRef = query(collectionRef, where(field, operator, value));
        });
      }
  
      // Tambahkan pengurutan jika ada
      if (sortBy) {
        const { field, direction } = sortBy;
        collectionRef = query(collectionRef, orderBy(field, direction));
      }
  
      // Tambahkan batasan jumlah dokumen jika ada
      if (limitValue) {
        collectionRef = query(collectionRef, limit(limitValue));
      }
  
      if (startAfterData) {
        // console.log(startAfterData)
        collectionRef = query(collectionRef, startAfter(startAfterData));
      }
  
      const querySnapshot = await getDocs(collectionRef);
      const collectionData = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        // Lakukan manipulasi data atau operasi lain jika diperlukan
        collectionData.push({ id: doc.id, ...docData });
      });
      //   console.log(collectionData,'ini data di collectiondata')
      return collectionData; // Outputkan data koleksi ke konsol (bisa diganti sesuai kebutuhan)
    } catch (error) {
      throw new Error(error.message, 'Failed to send  error message');
    }
  };
  
  // Example Call :
  
  // const fetchData = async () => {
  //   const conditions = [
  //     { field: "nama_field_1", operator: "==", value: "nilai_1" },
  //     { field: "nama_field_2", operator: ">", value: "nilai_2" },
  //   ];
  //   const sortBy = { field: "nama_field_sort", direction: "asc" };
  //   const limitValue = 10;
  
  //   try {
  //     const res = await getCollectionFirebase(
  //       "nama_koleksi",
  //       conditions,
  //       sortBy,
  //       limitValue
  //     );
  //     console.log(res.data, "xx");
  //   } catch (error) {
  //     console.log(error, "ini error");
  //   }
  // };
  
  // finish
  
  // get Doc with on snapshot
  
  export const getDocWithSnapshotFirebase = (collectionName, docName) => {
    doc(db, collectionName, docName);
  
    return new Promise((resolve, reject) => {
      onSnapshot(
        collection(db, collectionName),
        (querySnapshot) => {
          querySnapshot.forEach((docSnapshot) => {
            if (docSnapshot.id === docName) {
              if (docSnapshot.exists()) {
                const docData = docSnapshot.data();
                // Lakukan manipulasi data atau operasi lain jika diperlukan
                resolve(docData);
              } else {
                resolve(null);
              }
            }
          });
        },
        (error) => {
          reject(error);
        }
      );
  
      // Hentikan pemantauan snapshot jika perlu
      // unsubscribe();
  
      // Contoh cara menggunakan unsubscribe:
      // setTimeout(() => {
      //   unsubscribe();
      //   console.log("Pemantauan snapshot dihentikan.");
      // }, 5000);
    });
  };
  // Example Call :
  
  // const fetchData = async () => {
  //   try {
  //     const docData = await getDocWithSnapshotFirebase(collectionName, docName);
  //     // Lakukan sesuatu dengan data dokumen yang diperoleh
  //     console.log(docData);
  //   } catch (error) {
  //     // Tangani kesalahan
  //     console.log('Terjadi kesalahan:', error);
  //   }
  // };
  
  // finish
  
  // get collection with onsnapshot
  
  export const getCollectionWithSnapshotFirebase = async (
    collectionName,
    conditions = [],
    sortBy = null
  ) => {
    try {
      let collectionRef = collection(db, collectionName);
  
      // Tambahkan kondisi filter jika ada
      if (conditions.length > 0) {
        conditions.forEach((condition) => {
          const { field, operator, value } = condition;
          collectionRef = query(collectionRef, where(field, operator, value));
        });
      }
  
      // Tambahkan pengurutan jika ada
      if (sortBy) {
        const { field, direction } = sortBy;
        collectionRef = query(collectionRef, orderBy(field, direction));
      }
  
      onSnapshot(collectionRef, (querySnapshot) => {
        const collectionData = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          // Lakukan manipulasi data atau operasi lain jika diperlukan
          collectionData.push(docData);
        });
        //   console.log(collectionData); // Outputkan data koleksi ke konsol (bisa diganti sesuai kebutuhan)
        return collectionData;
      });
    } catch (error) {
      throw new Error(error.message, 'Failed to send  error message');
    }
  };
  
  // Example Call :
  
  // const getDataCollection = async () => {
  //   const conditions = [
  //     { field: "nama_field_1", operator: "==", value: "nilai_1" },
  //     { field: "nama_field_2", operator: ">", value: "nilai_2" },
  //   ];
  //   const sortBy = { field: "nama_field_sort", direction: "asc" };
  //   try {
  //     const res = await getCollectionWithSnapshotFirebase(
  //       "nama_koleksi",
  //       conditions,
  //       sortBy
  //     );
  //     console.log(res.data);
  //   } catch (error) {
  //     console.log(error, "ini error");
  //   }
  // };
  
  // finish
  
  // Set Document firebase
  
  export const setDocumentFirebase = async (collectionName, docName, data) => {
    try {
      if (data?.createdAt === undefined) {
        data.createdAt = new Date();
      }
      data.lastUpdated = new Date();
      if (auth.currentUser) {
        data.lastUpdatedBy = {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
        };
      }
  
      const docRef = doc(db, collectionName, docName);
      await setDoc(docRef, data, { merge: true });
  
      // Kembalikan pesan toast yang sesuai (bisa disesuaikan)
      return { message: 'Dokumen berhasil disimpan.', data };
    } catch (error) {
      throw new Error(error.message, 'Failed to send  error message');
    }
  };
  
  // example call :
  
  // const collectionName = 'namaKoleksi';
  // const docName = 'namaDokumen';
  // const data = {
  //   field1: 'Nilai 1',
  //   field2: 'Nilai 2',
  // };
  
  // try {
  //   const result = await setDocumentFirebase(collectionName, docName, data, companyId);
  //   console.log(result); // Pesan toast yang berhasil
  // } catch (error) {
  //   console.log('Terjadi kesalahan:', error);
  // }
  
  // finish
  
  // add document firebase
  
  export const addDocumentFirebase = async (collectionName, data) => {
    // if (!companyId) return 'No Company ID';
  
    try {
      data.createdAt = new Date();
      data.lastUpdated = new Date();
      data.date = String(new Date().getTime()) 
      // if (auth?.currentUser) data.createdBy = auth.currentUser.uid;
      // data.companyId = companyId;
  
      const docRef = await addDoc(collection(db, collectionName), data);
  
      // Kembalikan ID dokumen yang baru dibuat
      return docRef.id;
    } catch (error) {
      throw new Error(error.message, 'Failed to send  error message');
    }
  };
  
  // Example call :
  
  // const collectionName = 'namaKoleksi';
  // const data = {
  //   field1: 'Nilai 1',
  //   field2: 'Nilai 2',
  // };
  
  // try {
  //   const docID = await addDocumentFirebase(collectionName, data, companyId);
  //   console.log('ID Dokumen Baru:', docID);
  // } catch (error) {
  //   console.log('Terjadi kesalahan:', error);
  // }
  
  // finish
  
  export const updateDocumentFirebase = async (collectionName, docName, data) => {
    try {
      if (auth?.currentUser) {
        data.lastUpdatedBy = {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
        };
      }
      data.lastUpdated = new Date();
  
      const docRef = doc(db, collectionName, docName);
      await updateDoc(docRef, data);
  
      // Kembalikan pesan toast yang sesuai (bisa disesuaikan)
      return 'Dokumen berhasil diperbarui.';
    } catch (error) {
      throw new Error(error.message, 'Failed to send  error message');
    }
  };
  
  // example Call
  
  // const collectionName = 'namaKoleksi';
  // const docName = 'namaDokumen';
  // const data = {
  //   field1: 'Nilai 1 yang diperbarui',
  // };
  
  // try {
  //   const result = await updateDocumentFirebase(collectionName, docName, data);
  //   console.log(result); // Pesan toast yang berhasil
  // } catch (error) {
  //   console.log('Terjadi kesalahan:', error);
  // }
  
  // finish
  
  export const deleteDocumentFirebase = async (collectionName, docName) => {
    try {
      const docRef = doc(db, collectionName, docName);
      await deleteDoc(docRef);
  
      // Kembalikan pesan toast yang sesuai (bisa disesuaikan)
      return 'Dokumen berhasil dihapus.';
    } catch (error) {
      throw new Error(error.message, 'Failed to send  error message');
    }
  };
  
  // Example Call
  
  // const collectionName = 'namaKoleksi';
  // const docName = 'namaDokumen';
  
  // try {
  //   const result = await deleteDocumentFirebase(collectionName, docName);
  //   console.log(result); // Pesan toast yang berhasil
  // } catch (error) {
  //   console.log('Terjadi kesalahan:', error);
  // }
  // Finish
  
  export const arrayUnionFirebase = async (
    collectionName,
    docName,
    field,
    values
  ) => {
    try {
      const docRef = doc(db, collectionName, docName);
  
      const updatedData = {
        [field]: arrayUnion(...values),
      };
  
      await updateDoc(docRef, updatedData);
  
      // Kembalikan pesan toast yang sesuai (bisa disesuaikan)
      return 'Array berhasil diperbarui dengan nilai ditambahkan.';
    } catch (error) {
      throw new Error(error.message, 'Failed to send  error message');
    }
  };
  
  // Example Call
  
  // const collectionName = 'namaKoleksi';
  // const docName = 'namaDokumen';
  // const field = 'namaField';
  // const values = ['nilai1', 'nilai2'];
  
  // try {
  //   const result = await arrayUnionFirebase(collectionName, docName, field, values);
  //   console.log(result); // Pesan toast yang berhasil
  // } catch (error) {
  //   console.log('Terjadi kesalahan:', error);
  // }
  
  // finish
  
  // Array Remove Firebase
  
  export const arrayRemoveFirebase = async (
    collectionName,
    docName,
    field,
    values
  ) => {
    try {
      const docRef = doc(db, collectionName, docName);
  
      const updatedData = {
        [field]: arrayRemove(...values),
      };
  
      await updateDoc(docRef, updatedData);
  
      // Kembalikan pesan toast yang sesuai (bisa disesuaikan)
      return 'Array berhasil diperbarui dengan nilai dihapus.';
    } catch (error) {
      throw new Error(error.message, 'Failed to send  error message');
    }
  };
  
  // Example Call
  
  // const collectionName = 'namaKoleksi';
  // const docName = 'namaDokumen';
  // const field = 'namaField';
  // const values = ['nilai1', 'nilai2'];
  
  // try {
  //   const result = await arrayRemoveFirebase(collectionName, docName, field, values);
  //   console.log(result); // Pesan toast yang berhasil
  // } catch (error) {
  //   console.log('Terjadi kesalahan:', error);
  // }
  
  // Finish
  


  


  
  export const updateProfileFirebase = async (data) => {
    try {
      // Pastikan alamat email tidak diubah
      if (data.email) {
        throw new Error(
          'Alamat email tidak dapat diubah melalui fungsi updateProfileFirebase.'
        );
      }
  
      console.log('Profil berhasil diperbarui.');
    } catch (error) {
      console.log(error);
      // errorSlack(error.message,);
      throw error;
    }
  };
  
  // Example Call
  
  // const data = {
  //   displayName: "Nama Pengguna Baru",
  //   photoURL: "https://example.com/photo.jpg",
  // };
  
  // try {
  //   await updateProfileFirebase(data);
  //   console.log("Profil berhasil diperbarui.");
  // } catch (error) {
  //   console.log("Terjadi kesalahan:", error);
  // }
  
  // Finish
  
  export const getCollectionWhereFirebase = async (
    collectionName,
    whereKey,
    operator,
    whereValue
  ) => {
    const ref = collection(db, collectionName);
    const q = query(ref, where(whereKey, operator, whereValue));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      const obj = { id: doc.id, ...doc.data() };
      data.push(obj);
    });
    return data;
  };
  

  
  export const deleteSubcollection = async (subcollectionPath) => {
    try {
      const subcollectionRef = collection(db, subcollectionPath);
      const subcollectionSnapshot = await getDocs(subcollectionRef);
  
      // Delete each document in the subcollection
      const deletePromises = subcollectionSnapshot.docs.map(
        async (docSnapshot) => {
          await deleteDoc(doc(db, subcollectionPath, docSnapshot.id));
        }
      );
  
      // Wait for all documents to be deleted
      await Promise.all(deletePromises);
  
      return 'Subcollection deleted successfully.';
    } catch (error) {
      console.error('Error deleting subcollection:', error);
      throw error;
    }
  };
  
  // Get collection firebase with 2 or more sort conditional
  export const getCollectionFirebaseV2 = async (
    collectionName,
    conditions = [],
    sortBy = null,
    limitValue = null,
    startAfterData = null
  ) => {
    try {
      let collectionRef = collection(db, collectionName);
  
      // Tambahkan kondisi filter jika ada
      if (conditions.length > 0) {
        conditions.forEach((condition) => {
          const { field, operator, value } = condition;
          collectionRef = query(collectionRef, where(field, operator, value));
        });
      }
  
      // Tambahkan 1 atau lebih pengurutan jika ada
      if (sortBy) {
        sortBy.forEach((sort) => {
          const { field, direction } = sort;
          collectionRef = query(collectionRef, orderBy(field, direction));
        });
      }
  
      // Tambahkan batasan jumlah dokumen jika ada
      if (limitValue) {
        collectionRef = query(collectionRef, limit(limitValue));
      }
  
      if (startAfterData) {
        // console.log(startAfterData)
        // collectionRef = query(collectionRef, startAfter(startAfterData));
      }
  
      const querySnapshot = await getDocs(collectionRef);
      const collectionData = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        // Lakukan manipulasi data atau operasi lain jika diperlukan
        collectionData.push({ id: doc.id, ...docData });
      });
      return collectionData; // Outputkan data koleksi ke konsol (bisa diganti sesuai kebutuhan)
    } catch (error) {
      throw new Error(error.message, 'Failed to send  error message');
    }
  };
  
  // Example call
  // const fetchData = async () => {
  //   try {
  //     const collectionName = 'sopee_products';
  //     const sortBy = [
  //       { field: 'global_sold_count', direction: 'desc' }, // Urutkan berdasarkan global_sold_count secara menurun
  //       { field: 'ctime', direction: 'desc' } // Kemudian, urutkan berdasarkan ctime secara terbalik
  //     ];
  //     const limitValue = 5;
  
  //     const data = await getCollectionFirebase(collectionName, [], sortBy, limitValue);
  
  //     console.log(data);
  //   } catch (error) {
  //     console.error('Error fetching data: ', error);
  //   }
  // };
  
  // fetchData();
  
  export const getDataByIds = async (collectionName, ids) => {
    try {
      // Mendefinisikan koleksi Firebase tempat Anda menyimpan data
      const collectionRef = collection(db, collectionName);
  
      // Membuat query untuk mendapatkan data berdasarkan ID yang telah Anda dapatkan
      const q = query(collectionRef, where('id', 'in', ids));
  
      // Mengambil data berdasarkan query yang telah dibuat
      const snapshot = await getDocs(q);
  
      // Membuat array untuk menyimpan data yang ditemukan
      const retrievedData = [];
  
      snapshot.forEach(doc => {
        if (doc.exists()) {
          retrievedData.push(doc.data());
        }
      });
  
      return retrievedData;
    } catch (error) {
      throw new Error(`Failed to get data: ${error.message}`);
    }
  };

  export const getMultipleDocumentsFirebase = async (collectionName, docIds) => {
    try {
        const docsData = [];
        for (const docId of docIds) {
            const docRef = doc(db, collectionName, docId);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists) {
                const docData = docSnapshot.data();
                docsData.push({ id: docSnapshot.id, ...docData });
            }
        }
        return docsData;
    } catch (error) {
        throw new Error(error.message, 'Failed to retrieve documents');
    }
};
