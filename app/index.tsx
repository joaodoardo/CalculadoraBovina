import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Keyboard, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const LARGURA_PADRAO = 2.5;

type Caminhao = { comprimento: number; area: number };

export default function HomeScreen() {
    const router = useRouter();
    const [caminhoes, setCaminhoes] = useState<Caminhao[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [comprimento, setComprimento] = useState('');

    function adicionarCaminhao() {
        const comp = parseFloat(comprimento);
        if (!comprimento || isNaN(comp) || comp <= 0) {
            Alert.alert('Atenção', 'Insira um comprimento válido!');
            return;
        }
        const area = parseFloat((comp * LARGURA_PADRAO).toFixed(2));
        setCaminhoes([...caminhoes, { comprimento: comp, area }]);
        setComprimento('');
        setModalVisible(false);
    }

    function excluirCaminhao(index: number) {
        Alert.alert('Excluir', 'Deseja excluir este caminhão?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: () => {
                    const nova = [...caminhoes];
                    nova.splice(index, 1);
                    setCaminhoes(nova);
                },
            },
        ]);
    }

    return (
        <View style={styles.container}>
            <View style={styles.topcontainer}>
                <Image source={require('../assets/page1pic.png')} style={styles.img} />
                <Text style={styles.titulo}>Meus Caminhões</Text>
            </View>

            <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={styles.listContainer}>
                {caminhoes.length === 0 && (
                    <Text style={styles.vazio}>Nenhum caminhão cadastrado.{'\n'}Toque em + para adicionar.</Text>
                )}
                {caminhoes.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => router.push(`/page2?quantidade=${item.area}`)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitulo}>Caminhão #{index + 1}</Text>
                            <Text style={styles.cardSub}>
                                {item.comprimento} m × 2,5 m = {item.area} m²
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => excluirCaminhao(index)} style={styles.excluir}>
                            <Feather name="trash-2" size={24} color="red" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.botaoadd} onPress={() => setModalVisible(true)}>
                <Text style={styles.textoBotaoAdd}>+</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <TouchableOpacity style={styles.modalcontainer} onPress={Keyboard.dismiss} activeOpacity={1}>
                    <Text style={styles.modalTitulo}>Comprimento do caminhão (m)</Text>
                    <View style={styles.form}>
                        <TextInput
                            keyboardType="numeric"
                            placeholder="0 m"
                            placeholderTextColor="#888"
                            style={styles.input}
                            onChangeText={setComprimento}
                            value={comprimento}
                        />
                        <Text style={styles.larguraInfo}>Largura fixa: 2,5 m</Text>
                        <TouchableOpacity style={styles.botao} onPress={adicionarCaminhao}>
                            <Text style={styles.textoBotao}>Adicionar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fad6a2',
        alignItems: 'center',
        minHeight: 850,
    },
    topcontainer: {
        width: '100%',
        height: '28%',
        backgroundColor: '#fad6a2',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 16,
    },
    img: {
        width: 120,
        height: 90,
        resizeMode: 'contain',
        marginBottom: 8,
    },
    titulo: {
        color: '#331701',
        fontWeight: 'bold',
        fontSize: 22,
    },
    listContainer: {
        paddingVertical: 10,
        alignItems: 'center',
        gap: 8,
        paddingBottom: 100,
    },
    vazio: {
        color: '#331701',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
        opacity: 0.6,
        lineHeight: 26,
    },
    card: {
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
        elevation: 5,
        flexDirection: 'row',
    },
    cardInfo: {
        flex: 1,
    },
    cardTitulo: {
        color: '#331701',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cardSub: {
        color: '#555',
        fontSize: 14,
        marginTop: 2,
    },
    excluir: {
        justifyContent: 'center',
        paddingLeft: 10,
    },
    botaoadd: {
        backgroundColor: '#b43602',
        width: 70,
        height: 70,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: '15%',
    },
    textoBotaoAdd: {
        color: '#fad6a2',
        fontWeight: 'bold',
        fontSize: 32,
        lineHeight: 36,
    },
    modalcontainer: {
        flex: 1,
        backgroundColor: '#331701',
        alignItems: 'center',
        justifyContent: 'space-around',
        minHeight: 850,
    },
    modalTitulo: {
        color: '#fad6a2',
        fontWeight: 'bold',
        fontSize: 20,
    },
    form: {
        width: '65%',
        marginBottom: '90%',
        gap: 12,
    },
    input: {
        backgroundColor: '#fad6a2',
        width: '100%',
        height: 50,
        borderRadius: 6,
        fontSize: 20,
        color: '#4d3e37',
        textAlign: 'center',
    },
    larguraInfo: {
        color: '#fad6a2',
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.8,
    },
    botao: {
        backgroundColor: '#b43602',
        width: '100%',
        height: 50,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoBotao: {
        color: '#fad6a2',
        fontWeight: 'bold',
        fontSize: 20,
    },
});
