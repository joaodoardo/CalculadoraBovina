import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { cores } from '@/theme/cores';
import { formatarCompacto } from '@/utils/numero';

import { LARGURA_GAIOLA, OPCOES_ANDARES } from '../../constants';
import type { SemireboqueRascunho } from '../../types';

type Props = {
    titulo: string;
    semireboque: SemireboqueRascunho;
    onNumAndares: (numAndares: number) => void;
    onAdicionarGaiola: (aIdx: number) => void;
    onRemoverGaiola: (aIdx: number, gIdx: number) => void;
    onComprimento: (aIdx: number, gIdx: number, comprimento: string) => void;
};

// Configuração de andares e gaiolas de um semireboque (ou do caminhão) na etapa 3 do wizard.
export function SemireboqueForm({ titulo, semireboque, onNumAndares, onAdicionarGaiola, onRemoverGaiola, onComprimento }: Props) {
    return (
        <View style={styles.bloco}>
            <View style={styles.topo}>
                <Text style={styles.titulo}>{titulo}</Text>
            </View>

            <View style={styles.andares}>
                <Text style={styles.andaresLabel}>Andares:</Text>
                {OPCOES_ANDARES.map(n => {
                    const selecionado = semireboque.numAndares === n;
                    return (
                        <TouchableOpacity key={n} style={[styles.andarBtn, selecionado && styles.andarBtnSel]} onPress={() => onNumAndares(n)}>
                            <Text style={[styles.andarBtnTexto, selecionado && styles.andarBtnTextoSel]}>{n}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {semireboque.andares.map((andar, aIdx) => (
                <View key={aIdx} style={styles.andar}>
                    {semireboque.numAndares > 1 && <Text style={styles.andarTitulo}>Andar {aIdx + 1}</Text>}

                    {andar.gaiolas.map((gaiola, gIdx) => (
                        <View key={gaiola.uid} style={styles.gaiola}>
                            <View style={styles.gaiolaLabels}>
                                <Text style={styles.gaiolaNome}>Gaiola {gIdx + 1}</Text>
                                <Text style={styles.gaiolaLargura}>× {formatarCompacto(LARGURA_GAIOLA)} m</Text>
                            </View>
                            <TextInput
                                style={styles.gaiolaInput}
                                keyboardType="decimal-pad"
                                placeholder="comp. (m)"
                                placeholderTextColor={cores.placeholder}
                                value={gaiola.comprimento}
                                onChangeText={texto => onComprimento(aIdx, gIdx, texto)}
                            />
                            <TouchableOpacity onPress={() => onRemoverGaiola(aIdx, gIdx)} style={styles.remover}>
                                <Feather name="minus-circle" size={20} color={cores.perigo} />
                            </TouchableOpacity>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.adicionar} onPress={() => onAdicionarGaiola(aIdx)}>
                        <Feather name="plus" size={15} color={cores.destaque} />
                        <Text style={styles.adicionarTexto}>Adicionar gaiola</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    bloco: { borderTopWidth: 1, borderTopColor: cores.divisor, paddingTop: 20, marginTop: 8, gap: 12 },
    topo: { flexDirection: 'row', alignItems: 'center' },
    titulo: { color: cores.marrom, fontSize: 15, fontWeight: '700' },
    andares: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    andaresLabel: { color: cores.textoSecundario, fontSize: 13, fontWeight: '600' },
    andarBtn: {
        width: 38,
        height: 38,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: cores.borda,
        justifyContent: 'center',
        alignItems: 'center',
    },
    andarBtnSel: { borderColor: cores.destaque, backgroundColor: cores.destaque },
    andarBtnTexto: { color: cores.textoSecundario, fontSize: 15, fontWeight: '700' },
    andarBtnTextoSel: { color: cores.superficie },
    andar: { gap: 8 },
    andarTitulo: { color: cores.textoSecundario, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
    gaiola: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: cores.superficieSuave,
        borderRadius: 10,
        padding: 10,
    },
    gaiolaLabels: { flex: 1 },
    gaiolaNome: { color: cores.marrom, fontSize: 13, fontWeight: '600' },
    gaiolaLargura: { color: cores.textoTerciario, fontSize: 11 },
    gaiolaInput: {
        backgroundColor: cores.superficie,
        borderWidth: 1.5,
        borderColor: cores.borda,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 15,
        color: cores.texto,
        width: 110,
        textAlign: 'center',
    },
    remover: { padding: 4 },
    adicionar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 4 },
    adicionarTexto: { color: cores.destaque, fontSize: 14, fontWeight: '600' },
});
