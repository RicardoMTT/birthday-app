import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {validateEmail} from '../utils/validations';
import auth from '@react-native-firebase/auth';

export default function LoginForm(props) {
  const {changeForm} = props;

  const [formData, setFormData] = useState(defaultValue);
  const [formError, setFormError] = useState({});
  const login = () => {
    let errors = {};
    if (!formData.email || !formData.password) {
      if (!formData.email) {
        errors.email = true;
      }
      if (!formData.password) {
        errors.password = true;
      }
    } else if (!validateEmail(formData.email)) {
      errors.email = true;
    } else {
      auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then(user => {
          console.log('user', user);
        })
        .catch(error => {
          console.log('error', error);
          setFormError({
            email: true,
            password: true,
          });
        });
    }

    setFormError(errors);
  };

  const onChange = (e, type) => {
    setFormData({
      ...formData,
      [type]: e.nativeEvent.text,
    });
  };
  return (
    <>
      <TextInput
        style={(styles.input, formError.email && styles.error)}
        placeholder="Correo electronico"
        placeholderTextColor="#969696"
        onChange={e => onChange(e, 'email')}
      />
      <TextInput
        style={(styles.input, formError.password && styles.error)}
        secureTextEntry={true}
        placeholder="contraseña"
        placeholderTextColor="#969696"
        onChange={e => onChange(e, 'password')}
      />
      <TouchableOpacity onPress={login}>
        <Text style={styles.btnText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <View style={styles.register}>
        <TouchableOpacity onPress={changeForm}>
          <Text style={styles.btnText}>Registrate</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

function defaultValue() {
  return {
    email: '',
    password: '',
  };
}

const styles = StyleSheet.create({
  btnText: {
    fontSize: 20,
    color: '#fff',
  },
  input: {
    height: 40,
    color: '#fff',
    width: '80%',
    marginBottom: 25,
    backgroundColor: '#1e3040',
    paddingHorizontal: 20,
    borderRadius: 50,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#1e3040',
  },
  register: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  error: {
    borderColor: '#940c9c',
  },
});
