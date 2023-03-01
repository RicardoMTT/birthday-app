import {SafeAreaView, StatusBar, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import AuthScreen from './src/components/Auth';
import ListBirthday from './src/components/ListBirthday';

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(userParam: any) {
    console.log('user', userParam);
    setUser(userParam);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    // const usersCollection = firestore()
    //   .collection('users')
    //   .get()
    //   .then(querySnapshot => {
    //     console.log('Total users: ', querySnapshot.size);
    //     querySnapshot.forEach(documentSnapshot => {
    //       console.log(
    //         'User ID: ',
    //         documentSnapshot.id,
    //         documentSnapshot.data(),
    //       );
    //     });
    //   });
  });

  useEffect(() => {
    auth()
      .signInWithEmailAndPassword('test@gmail.com', '12345678')
      .then(response => {
        console.log('response', response);
      })
      .catch(error => {
        console.log('error', error);
      });
  }, []);
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initializing) {
    return <Text>Alaa</Text>;
  }

  return (
    <>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.background}>
        {user ? <ListBirthday user={user} /> : <AuthScreen />}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#15212b',
    height: '100%',
  },
});
