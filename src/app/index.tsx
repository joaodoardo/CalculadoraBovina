import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NovoVeiculoModal, VeiculoCard, useVeiculos } from '@/features/veiculos';
import { cores } from '@/theme/cores';

export default function VeiculosScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { veiculos, carregando, adicionarVeiculo, excluirVeiculo } = useVeiculos();
    const [cadastroVisivel, setCadastroVisivel] = useState(false);

    function confirmarExclusao(id: number) {
        Alert.alert('Excluir veículo', 'Todos os dados serão perdidos. Confirma?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Excluir', style: 'destructive', onPress: () => excluirVeiculo(id) },
        ]);
    }

    return (
        <View style={styles.container}>
            <View style={[styles.cabecalho, { paddingTop: insets.top + 20 }]}>
                <Text style={styles.titulo}>CalculaBov</Text>
                <Text style={styles.subtitulo}>Gestão de carga bovina</Text>
            </View>

            <ScrollView contentContainerStyle={[styles.lista, { paddingBottom: insets.bottom + 100 }]}>
                {carregando ? (
                    <ActivityIndicator style={styles.carregando} color={cores.destaque} />
                ) : veiculos.length === 0 ? (
                    <View style={styles.vazio}>
                        <Feather name="truck" size={52} color={cores.begeMedio} />
                        <Text style={styles.vazioTitulo}>Nenhum veículo</Text>
                        <Text style={styles.vazioTexto}>Toque em + para cadastrar</Text>
                    </View>
                ) : veiculos.map((veiculo, index) => (
                    <VeiculoCard
                        key={index}
                        veiculo={veiculo}
                        numero={index + 1}
                        onAbrir={() => router.push({ pathname: '/veiculos/[id]', params: { id: String(index) } })}
                        onExcluir={() => confirmarExclusao(index)}
                    />
                ))}
            </ScrollView>

            <TouchableOpacity style={[styles.fab, { bottom: insets.bottom + 24 }]} onPress={() => setCadastroVisivel(true)}>
                <Text style={styles.fabTexto}>+</Text>
            </TouchableOpacity>

            <NovoVeiculoModal
                visivel={cadastroVisivel}
                onFechar={() => setCadastroVisivel(false)}
                onSalvar={adicionarVeiculo}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    cabecalho: { backgroundColor: cores.marrom, paddingBottom: 20, paddingHorizontal: 24 },
    titulo: { color: cores.bege, fontSize: 24, fontWeight: 'bold' },
    subtitulo: { color: cores.begeMedio, fontSize: 13, marginTop: 2 },
    lista: { padding: 16, gap: 12 },
    carregando: { marginTop: 80 },
    vazio: { alignItems: 'center', marginTop: 80, gap: 10 },
    vazioTitulo: { color: cores.textoSecundario, fontSize: 18, fontWeight: '600' },
    vazioTexto: { color: cores.textoTerciario, fontSize: 14 },
    fab: {
        position: 'absolute',
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: cores.destaque,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: cores.destaque,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    fabTexto: { color: cores.superficie, fontSize: 30, lineHeight: 34, fontWeight: '300' },
});
