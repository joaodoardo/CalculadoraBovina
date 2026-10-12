import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { BarraProgresso } from '@/components/ui/BarraProgresso';
import { cores } from '@/theme/cores';
import { formatarCompacto, formatarNumero, parseNumero } from '@/utils/numero';

import { areaDisponivel, calcularAreaBoi, corOcupacao, ocupacaoGaiola } from '../calculos';
import { useVeiculos } from '../context/VeiculosContext';
import { descreverGaiola } from '../formatacao';
import type { PosicaoGaiola, Veiculo } from '../types';
import { AnimalItem } from './AnimalItem';

const HIT_SLOP = { top: 8, right: 8, bottom: 8, left: 8 };

type Props = {
    veiculoId: number;
    veiculo: Veiculo;
    posicao: PosicaoGaiola | null;
    onFechar: () => void;
};

// Detalhe de uma gaiola: ocupação, lista de animais e formulário para adicionar novos.
export function GaiolaModal({ veiculoId, veiculo, posicao, onFechar }: Props) {
    const { adicionarAnimal, excluirAnimal } = useVeiculos();
    const [peso, setPeso] = useState('');
    const [possuiChifres, setPossuiChifres] = useState(false);

    // Limpa o formulário sempre que outra gaiola é aberta.
    const [posicaoAnterior, setPosicaoAnterior] = useState(posicao);
    if (posicao !== posicaoAnterior) {
        setPosicaoAnterior(posicao);
        setPeso('');
        setPossuiChifres(false);
    }

    const gaiola = posicao
        ? veiculo.semireboques[posicao.rIdx].andares[posicao.aIdx].gaiolas[posicao.gIdx]
        : null;

    function adicionar() {
        if (!posicao || !gaiola) return;

        const pesoKg = parseNumero(peso);
        if (!Number.isFinite(pesoKg) || pesoKg <= 0) {
            Alert.alert('Atenção', 'Insira o peso do animal!');
            return;
        }

        const area_boi = calcularAreaBoi(pesoKg, possuiChifres);
        if (area_boi > areaDisponivel(gaiola)) {
            Alert.alert('Sem espaço', 'Área insuficiente nesta gaiola para este animal.');
            return;
        }

        adicionarAnimal(veiculoId, posicao, { peso: pesoKg, possuiChifres, area_boi });
        setPeso('');
        setPossuiChifres(false);
    }

    function confirmarRemocao(index: number) {
        if (!posicao) return;
        Alert.alert('Remover animal', 'Deseja remover este animal da gaiola?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Remover', style: 'destructive', onPress: () => excluirAnimal(veiculoId, posicao, index) },
        ]);
    }

    const ocupacao = gaiola ? ocupacaoGaiola(gaiola) : null;
    const cor = ocupacao ? corOcupacao(ocupacao.pct) : cores.sucesso;

    return (
        <Modal visible={!!posicao} animationType="slide" presentationStyle="pageSheet" onRequestClose={onFechar}>
            {/* O modal abre em outra janela: precisa do próprio provider para medir câmera/notch e barra de navegação. */}
            <SafeAreaProvider>
                <StatusBar style="dark" />
                <SafeAreaView style={styles.areaSegura} edges={['top', 'bottom']}>
                    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <View style={styles.container}>
                            <View style={styles.cabecalho}>
                                <TouchableOpacity onPress={onFechar} hitSlop={HIT_SLOP}>
                                    <Feather name="x" size={22} color={cores.marrom} />
                                </TouchableOpacity>
                                <View style={styles.cabecalhoTextos}>
                                    {posicao && (
                                        <Text style={styles.titulo}>
                                            Gaiola {posicao.gIdx + 1}
                                            {veiculo.semireboques.length > 1 ? ` · Reboque ${posicao.rIdx + 1}` : ''}
                                            {veiculo.semireboques[posicao.rIdx].andares.length > 1 ? `, Andar ${posicao.aIdx + 1}` : ''}
                                        </Text>
                                    )}
                                    {gaiola && <Text style={styles.subtitulo}>{descreverGaiola(gaiola)}</Text>}
                                </View>
                            </View>

                            {gaiola && ocupacao && (
                                <View style={styles.ocupacao}>
                                    <BarraProgresso percentual={ocupacao.pct} cor={cor} />
                                    <View style={styles.ocupacaoLinha}>
                                        <Text style={styles.ocupacaoTexto}>
                                            {formatarNumero(ocupacao.usado)} / {formatarCompacto(gaiola.area)} m²
                                        </Text>
                                        <Text style={[styles.ocupacaoPct, { color: cor }]}>{formatarNumero(ocupacao.pct, 1)}%</Text>
                                    </View>
                                </View>
                            )}

                            <ScrollView style={styles.lista} keyboardShouldPersistTaps="handled">
                                {gaiola && gaiola.animais.length === 0 && (
                                    <Text style={styles.vazio}>Nenhum animal nesta gaiola</Text>
                                )}
                                {gaiola?.animais.map((animal, index) => (
                                    <AnimalItem key={index} animal={animal} numero={index + 1} onRemover={() => confirmarRemocao(index)} />
                                ))}
                            </ScrollView>

                            <View style={styles.formulario}>
                                <Text style={styles.formularioTitulo}>Adicionar animal</Text>
                                <View style={styles.formularioLinha}>
                                    <TextInput
                                        style={styles.pesoInput}
                                        keyboardType="decimal-pad"
                                        placeholder="Peso (kg)"
                                        placeholderTextColor={cores.placeholder}
                                        value={peso}
                                        onChangeText={setPeso}
                                        returnKeyType="done"
                                        onSubmitEditing={adicionar}
                                    />
                                    <TouchableOpacity style={styles.chifres} onPress={() => setPossuiChifres(v => !v)}>
                                        <View style={[styles.checkbox, possuiChifres && styles.checkboxMarcado]}>
                                            {possuiChifres && <Feather name="check" size={13} color={cores.superficie} />}
                                        </View>
                                        <Text style={styles.chifresTexto}>Chifres</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.botao} onPress={adicionar}>
                                    <Feather name="plus" size={18} color={cores.superficie} />
                                    <Text style={styles.botaoTexto}>Adicionar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </SafeAreaProvider>
        </Modal>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    areaSegura: { flex: 1, backgroundColor: cores.superficie },
    container: { flex: 1, backgroundColor: cores.superficie },
    cabecalho: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: cores.divisor,
    },
    cabecalhoTextos: { flex: 1, marginLeft: 14 },
    titulo: { color: cores.texto, fontSize: 16, fontWeight: '700' },
    subtitulo: { color: cores.textoSuave, fontSize: 12, marginTop: 2 },
    ocupacao: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: cores.divisor,
        gap: 8,
    },
    ocupacaoLinha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    ocupacaoTexto: { color: cores.textoSuave, fontSize: 13 },
    ocupacaoPct: { fontSize: 20, fontWeight: '800' },
    lista: { flex: 1, paddingHorizontal: 20 },
    vazio: { color: cores.textoTerciario, textAlign: 'center', marginTop: 32, fontSize: 14 },
    formulario: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: cores.divisor,
        gap: 12,
        backgroundColor: cores.superficie,
    },
    formularioTitulo: { color: cores.textoSecundario, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
    formularioLinha: { flexDirection: 'row', gap: 12, alignItems: 'center' },
    pesoInput: {
        flex: 1,
        height: 48,
        backgroundColor: cores.superficieSuave,
        borderWidth: 1.5,
        borderColor: cores.borda,
        borderRadius: 10,
        paddingHorizontal: 14,
        fontSize: 16,
        color: cores.texto,
    },
    chifres: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: cores.borda,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: cores.superficie,
    },
    checkboxMarcado: { backgroundColor: cores.destaque, borderColor: cores.destaque },
    chifresTexto: { color: cores.textoSuave, fontSize: 13, fontWeight: '600' },
    botao: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: cores.destaque,
        borderRadius: 10,
        height: 48,
    },
    botaoTexto: { color: cores.superficie, fontSize: 15, fontWeight: '700' },
});
