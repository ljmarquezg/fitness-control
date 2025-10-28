import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { useAppUserState } from '~/composables/state/useAppUserState';
import type { UserProfileData, UserSettingsSchema } from '~/schemas/profile/UserProfileSchema';
import firebase from '~~/node_modules/firebase/compat';
import { useFirebase } from './useFirebase';
import DocumentReference = firebase.firestore.DocumentReference;
import DocumentData = firebase.firestore.DocumentData;

export const useFirestoreDatabase = () => {
  const { db } = useFirebase();
  const { currentUser } = useAppUserState();

  const documentRef = (...args: string[]) => {
    console.log(...args);
    const uid = currentUser.value?.uid;
    if (!uid) throw new Error('Usuario no autenticado');
    return doc(db, 'users', uid, ...args);
  }
  const addDocument = async (collectionName: string, data: any) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('❌ Error adding document:', error);
      throw error;
    }
  };

  const getDocument = async (...ref) => {
    try {
      const uid = currentUser.value?.uid;
      if (!uid) throw new Error('Usuario no autenticado');

      return await getDoc(documentRef(...ref));
    } catch (error) {
      console.error('❌ Error obteniendo documento:', error);
      throw error;
    }
  };

  const getDocuments = async (
    collectionName: string,
    conditions: Array<{ field: string; operator: FirebaseFirestore.WhereFilterOp; value: any }> = [],
    orderField: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc'
  ) => {
    try {
      const uid = currentUser.value?.uid;
      const user: UserProfileData = currentUser.value;
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const collectionRef = collection(db, 'users', uid, collectionName);

      const queryConstraints: QueryConstraint[] = [
        ...conditions.map((c) => where(c.field, c.operator, c.value)),
        orderBy(orderField, order)
      ];

      const querySnapshot = await getDocs(query(collectionRef, ...queryConstraints));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ Error getting documents:', error);
      throw error;
    }
  };

  const getCollection = async (collectionName: string) => {
    try {
      const uid = currentUser.value?.uid;
      const collectionRef = collection(db, 'users', uid, collectionName);
      return await getDocs(query(collectionRef));
    } catch (error) {
      console.error('❌ Error getting documents:', error);
      throw error;
    }
  };

  const setDocument = async (collectionName: string, id: string, data: any, params = {}) => {
    try {
      const docRef: DocumentReference<DocumentData, UserSettingsSchema> = documentRef(collectionName, id);
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date()
      }, params);
    } catch (error) {
      console.error('❌ Error updating document:', error);
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
    } catch (error) {
      console.error('❌ Error updating document:', error);
      throw error;
    }
  };

  const deleteDocument = async (collectionName: string, id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
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
    getDocument,
    getDocuments,
    getCollection,
    setDocument,
    updateDocument,
    deleteDocument,
    listenToCollection
  };
};
