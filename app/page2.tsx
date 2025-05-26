import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Keyboard, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

let i = 0
let area_boi = 0

export default function Page2() {

    const [areaCompleta, setAreaCompleta] = useState(50); // valor inicial
    const [dataArray, setDataArray] = useState([]);
    const { quantidade } = useLocalSearchParams(); 
    const qtd = parseInt(quantidade);         
    const router = useRouter();   
    const [modalVisible,  setModalVisible] = useState(false);
    const [peso, setPesokg] = useState('');
    const [possuiChifres, setIsChecked] = useState(false);
    const toggleCheck = () => {
      setIsChecked(!possuiChifres);
    };

    const calcularAreaTotal = () => {
      return dataArray.reduce((total, item) => total + item.area_boi, 0);
    };


    function enviarDados() {
      if (peso == '' || peso < 1) {
        Alert.alert('Atenção', 'Insira o peso do animal!')
        return
      }

      //Calculos
      if(possuiChifres == true) {
        area_boi = 0.021 * peso ** 0.67 * 1.07;
      }
      else {
        area_boi = 0.021 * peso ** 0.67;
      }
  
      console.log(area_boi);

      const data = {possuiChifres, peso, area_boi}
      setDataArray([...dataArray, data])

      if(possuiChifres == true) {
        toggleCheck()
      }
      setPesokg('');
      setModalVisible(false);
      
    }

    function excluirBoi(index) {
      Alert.alert('Excluir', 'Deseja excluir este boi?', [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const novaLista = [...dataArray];
            novaLista.splice(index, 1); // Remove o boi pelo índice
            setDataArray(novaLista);
          },
        },
      ]);

    }

    return(
        <View style={styles.container}>  

          <View style={styles.topcontainer}>
            <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(calcularAreaTotal()  / qtd) * 100}%` }]} />
            </View>
            <View style={styles.contagem_container}>
              <Text style={styles.pergunta}>{calcularAreaTotal().toFixed(2)}/{qtd} m²</Text>
              <Text style={styles.pergunta}>{Math.min((calcularAreaTotal() / qtd) * 100, 100).toFixed(2)}%</Text>
            </View>
          </View>
          
          <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={styles.boicardsContainer}>
            {dataArray.map((item, index) => (
              <View key={index} style={styles.boicard}>
                

                <Text style={styles.pergunta}>#{index + 1}: {item.peso} Kg {item.possuiChifres ? "(chifres)" : ""} Área {(item.area_boi).toFixed(2)}</Text>


                <TouchableOpacity onPress={() => excluirBoi(index)} style={styles.excluir}>
                  <Feather name="trash-2" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          








          

          <TouchableOpacity style={styles.botaoadd} onPress={()=>{setModalVisible(true)}}>
            <Text style={styles.texto}>+</Text>
          </TouchableOpacity>
          



          <Modal visible={modalVisible} onRequestClose={()=>{setModalVisible(false)}} animationType='slide' presentationStyle='pageSheet'>
            <TouchableOpacity style={styles.modalcontainer} onPress={() => Keyboard.dismiss()} activeOpacity={1}>
              <Text style={styles.texto}>Peso do animal (Kg)</Text>
              <View style={styles.form}>
                <TextInput keyboardType='numeric' placeholder='0 Kg' placeholderTextColor="#888" style={styles.input} onChangeText={setPesokg} value={peso}></TextInput>
                
                {/*    Checkbox    */}
                <View style={styles.checkcontainer}>
                  <TouchableOpacity style={styles.check} onPress={toggleCheck}><View style={[styles.checkicon, possuiChifres ? styles.visible : styles.hidden]}></View></TouchableOpacity>
                  <Text style={styles.checktext}>Possui chifres?</Text>
                </View>
        
                {/*    Adicionar    */}
                <TouchableOpacity style={styles.botao} onPress={enviarDados}>
                  <Text style={styles.texto}>Adicionar</Text>
                </TouchableOpacity>

              </View>
            </TouchableOpacity>
          </Modal>
                      
        </View>
    );
}

const styles = StyleSheet.create({
    excluir: {
      justifyContent: 'center'

    },
    boicardsContainer: {
      paddingVertical: 10,
      alignItems: 'center',
      gap: 8, // espaçamento entre os cards
      paddingBottom: 100, // espaço extra para não cobrir com o botão "+"
    },

    boicard: {
      width: '95%',
      minHeight: 70,
      backgroundColor: '#ffffff',
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5, // sombra no Android
      flexDirection: 'row'
    },
    container: {
      flex: 1,
      backgroundColor: '#f7c785', 
      alignItems: 'center',
      minHeight: 850,
    },
    topcontainer: {
      width: '100%',
      height: '30%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fad6a2'
    },
    modalcontainer: {
      flex: 1,
      backgroundColor: '#331701',
      alignItems: 'center',
      justifyContent: 'space-around',
      minHeight: 850,
    },
    contagem_container: {
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "center",
      width: "71%",
      marginTop: "2%"

    },
    texto: {
      color: '#fad6a2',
      fontWeight: 'bold',
      fontSize: 20
    },
    pergunta: {
      color: '#331701',
      fontWeight: 'bold',
      fontSize: 20,
    },
    botao: {
      backgroundColor: '#b43602',
      width: '100%',
      height: '50%',
      borderRadius: 6,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center', 

    },
    botaoadd: {
      backgroundColor: '#b43602',
      width: 70,
      height: 70,
      borderRadius: 15,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center', 
      position: 'absolute',
      bottom: '15%'
    },
    input: {
      backgroundColor: '#fad6a2',
      width: '100%',
      height: '50%',
      borderRadius: 6,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '10%',
      fontSize: 20,
      color: '#4d3e37',
      textAlign: 'center'
    },
    form: {
      width: '65%',
      height: '16%',
      marginBottom: '90%'
    },
    checkcontainer: {
      width: '100%',
      marginBottom: '10%',
      height: 25,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    checktext: {
      color: '#fad6a2',
      fontWeight: 'bold',
    },
    check: {
      backgroundColor: '#fad6a2',
      width: 25,
      height: 25,
      borderRadius: 5,
      marginRight: '5%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    checkicon: {
      backgroundColor: '#b43602',
      height: '80%',
      width: '80%',
      borderRadius: 4,
     
    },
    visible: {
      display: 'flex',
    },
    hidden: {
      display: 'none',
    },
    progressBar: {
      width: '80%',
      height: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#b43602'
    },

});