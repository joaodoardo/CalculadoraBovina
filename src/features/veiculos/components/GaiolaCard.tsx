import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BarraProgresso } from '@/components/ui/BarraProgresso';
import { cores } from '@/theme/cores';
import { formatarCompacto, formatarNumero, formatarPercentual } from '@/utils/numero';

import { corOcupacao, ocupacaoGaiola } from '../calculos';
import { descreverGaiola, pluralizar } from '../formatacao';
import type { Gaiola } from '../types';

type Props = {
    gaiola: Gaiola;
    numero: number;
    onPress: () => void;
};

export function GaiolaCard({ gaiola, numero, onPress }: Props) {
    const { usado, pct } = ocupacaoGaiola(gaiola);
    const cor = corOcupacao(pct);
    const qtdAnimais = gaiola.animais.length;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
            <View style={styles.topo}>
                <View>
                    <Text style={styles.nome}>Gaiola {numero}</Text>
                    <Text style={styles.especificacao}>{descreverGaiola(gaiola)}</Text>
                </View>
                <View style={styles.direita}>
                    {pct >= 100 ? (
                        <View style={styles.cheio}>
                            <Text style={styles.cheioTexto}>CHEIO</Text>
                        </View>
                    ) : (
                        <Text style={[styles.percentual, { color: cor }]}>{formatarPercentual(pct)}</Text>
                    )}
                    <Text style={styles.legenda}>{qtdAnimais} {pluralizar(qtdAnimais, 'animal', 'animais')}</Text>
                </View>
            </View>
            <BarraProgresso percentual={pct} cor={cor} />
            <Text style={styles.legenda}>{formatarNumero(usado)} / {formatarCompacto(gaiola.area)} m² ocupados</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: cores.superficie,
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
        gap: 8,
        shadowColor: cores.marrom,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    nome: { color: cores.texto, fontSize: 15, fontWeight: '700' },
    especificacao: { color: cores.textoSuave, fontSize: 12, marginTop: 2 },
    direita: { alignItems: 'flex-end', gap: 2 },
    percentual: { fontSize: 18, fontWeight: '800' },
    legenda: { color: cores.textoTerciario, fontSize: 11 },
    cheio: { backgroundColor: cores.perigoFundo, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
    cheioTexto: { color: cores.perigo, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
});
