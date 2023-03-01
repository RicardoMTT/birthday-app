import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {validateEmail} from '../utils/validations';
import auth from '@react-native-firebase/auth';

export default function RegisterForm(props) {
  const [formData, setFormData] = useState(defaultValue());
  const {changeForm} = props;
  const [formError, setFormError] = useState({});

  const register = () => {
    let errors = {};
    if (!formData.email || !formData.password || !formData.repeatPassword) {
      if (!formData.email) errors.email = true;
      if (!formData.password) errors.password = true;
      if (!formData.repeatPassword) errors.repeatPassword = true;
    } else if (!validateEmail(formData.email)) {
      errors.email = true;
    } else if (formData.password !== formData.repeatPassword) {
      errors.password = true;
      errors.repeatPassword = true;
    } else if (formData.password.length < 6) {
      errors.password = true;
      errors.repeatPassword = true;
    } else {
      console.log('formulario correcto');
      auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then(() => {
          console.log('account registered');
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
    console.log('zz');
  };
  return (
    <>
      <TextInput
        placeholder="Correo electronico"
        placeholderTextColor="#969696"
        style={[styles.input, formError.email && styles.error]}
        onChange={e =>
          setFormData({
            ...formData,
            email: e.nativeEvent.text,
          })
        }
      />
      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#969696"
        style={[styles.input, formError.password && styles.error]}
        secureTextEntry={true}
        onChange={e =>
          setFormData({
            ...formData,
            password: e.nativeEvent.text,
          })
        }
      />
      <TextInput
        placeholder="Repetir contraseña"
        placeholderTextColor="#969696"
        style={[styles.input, formError.repeatPassword && styles.error]}
        secureTextEntry={true}
        onChange={e =>
          setFormData({
            ...formData,
            repeatPassword: e.nativeEvent.text,
          })
        }
      />
      <Button title="Registrarse" onPress={register} />
      <View style={styles.login}>
        <TouchableOpacity onPress={changeForm}>
          <Text style={styles.btnText}>Inicia Sesión</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

function defaultValue() {
  return {
    email: '',
    password: '',
    repeatPassword: '',
  };
}

const styles = StyleSheet.create({
  btnText: {
    fontSize: 20,
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
  login: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  error: {
    borderColor: '#940c9c',
  },
});
