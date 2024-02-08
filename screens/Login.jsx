import { StatusBar } from 'expo-status-bar';
import { View, TextInput, Button, StyleSheet, Alert ,Pressable,Text} from 'react-native';
import { useState,useEffect } from 'react';
import {app,auth} from '../firebase'; 
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const Login=({navigation})=>
{
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 // const auth = getAuth(app);
  

  const handleLogin = async() => {
    // Here you would typically validate the email and password
    // and perform authentication, e.g., by calling an API endpoint

    signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("success");
              //  console.log("user",user);
                //(false);
             //   Alert.alert('success');
              navigation.navigate('Home')
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Alert.alert('Error', 'Invalid email or password');
              //  navigatation.navigate('Home')
                });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={handleLogin}>
      <Text style={{color:'white'}}>Login</Text>
    </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
});
export default Login;
