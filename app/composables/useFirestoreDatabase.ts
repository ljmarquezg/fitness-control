import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { useFirebase } from './useFirebase';

export const useFirestoreDatabase = () => {
  const { db } = useFirebase();
  console.log('Firebase initialized successfully', db);
  const addDocument = async (collectionName: string, data: any) => {
    try {
      console.log('Adding document to collection:', collectionName, data);
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Document added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error adding document:', error);
      throw error;
    }
  };

  const getDocuments = async (collectionName: string) => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, collectionName), orderBy('createdAt', 'desc'))
      );
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('✅ Retrieved', documents.length, 'documents');
      return documents;
    } catch (error) {
      console.error('❌ Error getting documents:', error);
      throw error;
    }
  };

  const updateDocument = async (collectionName: string, id: string, data: any) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      console.log('✅ Document updated:', id);
    } catch (error) {
      console.error('❌ Error updating document:', error);
      throw error;
    }
  };

  const deleteDocument = async (collectionName: string, id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      console.log('✅ Document deleted:', id);
    } catch (error) {
      console.error('❌ Error deleting document:', error);
      throw error;
    }
  };

  const listenToCollection = (
    collectionName: string,
    callback: (data: any[]) => void,
    conditions: any[] = []
  ) => {
    try {
      let q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));

      // Add where conditions if provided
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('🔄 Real-time update:', documents.length, 'documents');
        callback(documents);
      }, (error) => {
        console.error('❌ Error in real-time listener:', error);
      });

      return unsubscribe;
    } catch (error) {
      console.error('❌ Error setting up listener:', error);
      throw error;
    }
  };

  return {
    addDocument,
    getDocuments,
    updateDocument,
    deleteDocument,
    listenToCollection
  };
};
