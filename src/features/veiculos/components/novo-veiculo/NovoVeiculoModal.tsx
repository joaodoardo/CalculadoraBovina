import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { cores } from '@/theme/cores';

import { useNovoVeiculo } from '../../hooks/useNovoVeiculo';
import type { Veiculo } from '../../types';
import { EtapaSemireboques } from './EtapaSemireboques';
import { EtapaTipo } from './EtapaTipo';
import { SemireboqueForm } from './SemireboqueForm';

const HIT_SLOP = { top: 8, right: 8, bottom: 8, left: 8 };

type Props = {
    visivel: boolean;
    onFechar: () => void;
    onSalvar: (veiculo: Veiculo) => void;
};

export function NovoVeiculoModal({ visivel, onFechar, onSalvar }: Props) {
    const wizard = useNovoVeiculo();
    const { etapa, tipo } = wizard;

    // Cada abertura começa um cadastro do zero (ajuste de estado durante a renderização, sem efeito).
    const [estavaVisivel, setEstavaVisivel] = useState(visivel);
    if (visivel !== estavaVisivel) {
        setEstavaVisivel(visivel);
        if (visivel) wizard.reiniciar();
    }

    function salvar() {
        const resultado = wizard.concluir();
        if ('erro' in resultado) {
            Alert.alert('Atenção', resultado.erro);
            return;
        }
        onSalvar(resultado.veiculo);
        onFechar();
    }

    const ultimaEtapa = etapa === 3;

    return (
        <Modal visible={visivel} animationType="slide" presentationStyle="pageSheet" onRequestClose={onFechar}>
            {/* O modal abre em outra janela: precisa do próprio provider para medir câmera/notch e barra de navegação. */}
            <SafeAreaProvider>
                <StatusBar style="dark" />
                <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <View style={styles.topo}>
                            <TouchableOpacity onPress={onFechar} hitSlop={HIT_SLOP}>
                                <Feather name="x" size={22} color={cores.marrom} />
                            </TouchableOpacity>
                            <Text style={styles.titulo}>Novo Veículo</Text>
                            <View style={styles.dots}>
                                {Array.from({ length: wizard.totalEtapas }, (_, i) => (
                                    <View key={i} style={[styles.dot, wizard.etapaVisual === i + 1 && styles.dotAtivo]} />
                                ))}
                            </View>
                        </View>

                        <ScrollView style={styles.flex} contentContainerStyle={styles.corpo} keyboardShouldPersistTaps="handled">
                            {etapa === 1 && <EtapaTipo tipo={tipo} onSelecionar={wizard.setTipo} />}

                            {etapa === 2 && <EtapaSemireboques quantidade={wizard.numSemireboques} onSelecionar={wizard.setNumSemireboques} />}

                            {etapa === 3 && wizard.semireboques.map((semireboque, rIdx) => (
                                <SemireboqueForm
                                    key={rIdx}
                                    titulo={tipo === 'caminhao' ? '— Caminhão' : `— Semireboque ${rIdx + 1}`}
                                    semireboque={semireboque}
                                    onNumAndares={n => wizard.definirNumAndares(rIdx, n)}
                                    onAdicionarGaiola={aIdx => wizard.adicionarGaiola(rIdx, aIdx)}
                                    onRemoverGaiola={(aIdx, gIdx) => wizard.removerGaiola(rIdx, aIdx, gIdx)}
                                    onComprimento={(aIdx, gIdx, texto) => wizard.atualizarComprimento(rIdx, aIdx, gIdx, texto)}
                                />
                            ))}
                        </ScrollView>

                        <View style={styles.rodape}>
                            {etapa > 1 && (
                                <TouchableOpacity style={styles.btnVoltar} onPress={wizard.voltar}>
                                    <Feather name="chevron-left" size={18} color={cores.marrom} />
                                    <Text style={styles.btnVoltarTexto}>Voltar</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={[styles.btnAvancar, etapa === 1 && styles.alinharDireita]} onPress={ultimaEtapa ? salvar : wizard.avancar}>
                                <Text style={styles.btnAvancarTexto}>{ultimaEtapa ? 'Salvar' : 'Próximo'}</Text>
                                <Feather name={ultimaEtapa ? 'check' : 'chevron-right'} size={18} color={cores.superficie} />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </SafeAreaProvider>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.superficie },
    flex: { flex: 1 },
    topo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: cores.divisor,
    },
    titulo: { color: cores.marrom, fontSize: 17, fontWeight: '700' },
    dots: { flexDirection: 'row', gap: 6 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: cores.borda },
    dotAtivo: { backgroundColor: cores.destaque, width: 20 },
    corpo: { padding: 24, gap: 8, paddingBottom: 24 },
    rodape: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: cores.divisor,
    },
    btnVoltar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: cores.borda,
    },
    btnVoltarTexto: { color: cores.marrom, fontSize: 15, fontWeight: '600' },
    btnAvancar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: cores.destaque,
    },
    alinharDireita: { marginLeft: 'auto' },
    btnAvancarTexto: { color: cores.superficie, fontSize: 15, fontWeight: '700' },
});
