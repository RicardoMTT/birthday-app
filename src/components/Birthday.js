import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

export default function Birthday(props) {
  const {birthday, deleteBirthday} = props;
  const pasat = birthday.days > 0 ? true : false;

  const infoDay = () => {
    if (birthday.days === 0) {
      return <Text style={{color: '#fff'}}>Es su cumpleaños</Text>;
    } else {
      const days = -birthday.days;

      return (
        <View>
          <Text style={{color:'#fff'}}>{days}</Text>
          <Text style={{color:'#fff'}}>{days === 1 ? 'día' : 'dias'}</Text>
        </View>
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={() => deleteBirthday(birthday)}
      style={[
        styles.card,
        pasat
          ? styles.pasat
          : birthday.days === 0
          ? styles.actual
          : styles.current,
      ]}>
      <Text style={styles.username}>
        {birthday.name}
        {birthday.lastName}
      </Text>
      {pasat ? <Text style={{color: '#fff'}}>Pasado</Text> : infoDay()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actual: {
    backgroundColor: '#559204',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    alignItems: 'center',
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 15,
  },
  pasat: {
    backgroundColor: '#FF5F5D',
  },
  current: {
    backgroundColor: '#3F7C85',
  },
  username: {
    color: '#fff',
    fontSize: 16,
  },
});
