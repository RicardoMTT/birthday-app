import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';

export default function AddBirthday(props) {
  const {user, setShowList, setReloadData} = props;
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState({});

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };
  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };
  const handleConfirm = date => {
    console.log('data', date);
    const dateBirth = date;
    dateBirth.setHours(0);
    dateBirth.setMinutes(0);
    dateBirth.setSeconds(0);
    setFormData({
      ...formData,
      dateBirth,
    });
    hideDatePicker();
  };

  const onChange = (e, type) => {
    setFormData({
      ...formData,
      [type]: e.nativeEvent.text,
    });
  };

  const onSubmit = () => {
    let errors = {};
    console.log('formData', formData);
    if (!formData.name || !formData.lastName || !formData.dateBirth) {
      if (!formData.name) {
        errors.name = true;
      }
      if (!formData.lastName) {
        errors.lastName = true;
      }
      if (!formData.dateBirth) {
        errors.dateBirth = true;
      }
      setFormError(errors);
    } else {
      const date = formData;
      date.dateBirth.setYear(0);
      // Separar los cumpleaños, para que cada usuario solo veo su lista de cumpleaños y no ver lo de los demas usuarios
      firestore()
        .collection(user.uid)
        .add(date)
        .then(() => {
          console.log('ok');
          setReloadData(true);
          setShowList(true);
        })
        .catch(error => {
          console.log('error', error);
          setFormError({
            name: true,
            lastName: true,
            dateBirth: true,
          });
        });
      // firestore()
      //   .collection('cumples')
      //   .add(date)
      //   .then(() => {
      //     console.log('ok');
      //   })
      //   .catch(error => {
      //     setFormError({
      //       name: true,
      //       lastName: true,
      //       dateBirth: true,
      //     });
      //   });
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={[styles.input, formError.name && {borderColor: '#940c0c'}]}
          placeholder="Nombreeee"
          placeholderTextColor="#969696"
          onChange={e => onChange(e, 'name')}
        />
        <TextInput
          style={[styles.input, formError.lastName && {borderColor: '#940c0c'}]}
          placeholder="Apellidos"
          onChange={e => onChange(e, 'lastName')}
          placeholderTextColor="#969696"
        />
        <View
          style={[
            styles.input,
            styles.datepicker,
            formError.dateBirth && {borderColor: '#940c0c'},
          ]}>
          <Text
            style={{
              color: formData.dateBirth ? '#ffffff' : '#969696',
              fontSize: 18,
            }}
            onPress={showDatePicker}>
            {formData.dateBirth
              ? moment(formData.dateBirth).format('LL')
              : 'Fecha de nacimiento'}
          </Text>
        </View>
        <TouchableOpacity onPress={onSubmit}>
          <Text style={styles.addButton}>Crear cumpleaños</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    fontSize: 18,
    color: '#fff',
  },
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datepicker: {
    justifyContent: 'center',
  },
  input: {
    height: 40,
    color: '#fff',
    width: '80%',
    marginBottom: 25,
    backgroundColor: '#1e3040',
    paddingHorizontal: 20,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#1e3040',
  },
  textDate: {
    fontSize: 18,
  },
});
