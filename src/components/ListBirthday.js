import {StyleSheet, Alert, View, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import ActionBar from './ActionBar';
import AddBirthday from './AddBirthday';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import Birthday from './Birthday';

export default function ListBirthday(props) {
  const {user} = props;

  const [showList, setShowList] = useState(false);
  const [birthday, setBirthday] = useState(false);
  const [pasatBirthday, setPasatBirthday] = useState(false);
  const [reloadData, setReloadData] = useState(false);

  useEffect(() => {
    setBirthday([]);
    firestore()
      .collection(user.uid)
      .orderBy('dateBirth', 'asc')
      .get()
      .then(response => {
        const itemArray = [];
        response.forEach(doc => {
          console.log('doc', doc.data());
          const data = doc.data();
          data.id = doc.id;
          itemArray.push(data);
        });
        formatData(itemArray);
        console.log('itemArray', itemArray);
      })
      .catch(error => {
        console.log('error', error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setReloadData(false);
  }, [reloadData]);

  const formatData = items => {
    const currentDate = moment().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    const birthdayTempArray = [];
    const pasatBirthdayTempArray = [];
    items.forEach(item => {
      console.log('item', item);
      const dateBirth = new Date(item.dateBirth.seconds * 1000);
      const dateBirthday = moment(dateBirth);
      const currentYear = moment().get('year');
      dateBirthday.set({
        year: currentYear,
      });
      const diffDate = currentDate.diff(dateBirthday, 'days');
      const itemTemp = item;
      itemTemp.dateBirth = dateBirthday;
      itemTemp.days = diffDate;
      if (diffDate <= 0) {
        //Cuando el cumpleaños va a llegar o es hoy
        birthdayTempArray.push(itemTemp);
      } else {
        pasatBirthdayTempArray.push(itemTemp);
      }
    });
    setBirthday(birthdayTempArray);
    setPasatBirthday(pasatBirthdayTempArray);

    console.log('birthday', birthday);
    console.log('pasatBirthday', pasatBirthday);
  };

  const deleteBirthday = birthday => {
    Alert.alert(
      'Eliminar cumpleaños',
      `Estas seguro de eliminar el cumpleaños de ${birthday.name} ${birthday.lastName}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            console.log('Eliminando');
            firestore()
              .collection(user.uid)
              .doc(birthday.id)
              .delete()
              .then(() => {
                setReloadData();
              })
              .catch(error => {
                console.log('error', error);
              });
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  return (
    <View style={styles.container}>
      {showList ? (
        <ScrollView style={styles.scrollview}>
          {birthday.map((item, index) => (
            <Birthday
              key={index}
              birthday={item}
              deleteBirthday={deleteBirthday}
            />
          ))}
          {pasatBirthday.map((item, index) => (
            <Birthday
              key={index}
              birthday={item}
              deleteBirthday={deleteBirthday}
            />
          ))}
        </ScrollView>
      ) : (
        <AddBirthday
          user={user}
          setShowList={setShowList}
          setReloadData={setReloadData}
        />
      )}
      <ActionBar showList={showList} setShowList={setShowList} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
  },
  scrollview: {
    marginBottom: 50,
    width: '100%',
  },
});
