import { useRouter } from 'expo-router';
import { useState } from "react";
import { Alert, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function HomeScreen() {


    const [quantidade, setQuantidade] = useState('')
    const router = useRouter(); 

    function enviarQuantidade() {
        if (quantidade == '' || quantidade < 1) {
            Alert.alert('Atenção', 'Insira pelo menos 1 animal!');
            return
        }

        console.log(quantidade);
        router.push(`/page2?quantidade=${quantidade}`);
        setQuantidade('');
    }





  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <View style={styles.containermaior}>
                    <Image source={require("../assets/page1pic.png")} style={styles.img}/> 
                    <View style={styles.containermenor}>
                        <Text style={styles.pergunta}>Área do caminhão (m²)</Text>
                        <TextInput keyboardType='numeric' placeholder='0 m²' placeholderTextColor="#888" onChangeText={setQuantidade} value={quantidade} style={styles.input}></TextInput>
                        <TouchableOpacity style={styles.botao} onPress={enviarQuantidade}>
                            <Text style={styles.texto}>Prosseguir</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
    </TouchableWithoutFeedback> 
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fad6a2',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 850
    },
    containermaior: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '90%',
        height: 600, 
        marginBottom: '15%',   
    },
    containermenor: {
        display: 'flex',
        backgroundColor: '#331701',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        height: 418,
        borderRadius: 25,
    },
    pergunta: {
        color: '#fad6a2',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: '10%'
    },
    texto: {
        color: '#fad6a2',
        fontWeight: 'bold',
        fontSize: 20
    },
    img: {
        width: 241.5,
        height: 182,
        resizeMode: 'contain',
        position: 'absolute',
        top: 8
    },
    botao: {
        backgroundColor: '#b43602',
        width: '70%',
        height: '15%',
        borderRadius: 6,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
        marginBottom: '30%'
       
    },
    input: {
        backgroundColor: '#fad6a2',
        width: '70%',
        height: '15%',
        borderRadius: 6,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        color: '#4d3e37',
        textAlign: 'center'
    },
});
