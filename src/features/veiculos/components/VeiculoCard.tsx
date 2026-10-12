import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BarraProgresso } from '@/components/ui/BarraProgresso';
import { cores } from '@/theme/cores';
import { formatarNumero, formatarPercentual } from '@/utils/numero';

import { corOcupacao, resumoVeiculo } from '../calculos';
import { nomeTipo, pluralizar } from '../formatacao';
import type { Veiculo } from '../types';

const HIT_SLOP = { top: 8, right: 8, bottom: 8, left: 8 };

type Props = {
    veiculo: Veiculo;
    numero: number;
    onAbrir: () => void;
    onExcluir: () => void;
};

export function VeiculoCard({ veiculo, numero, onAbrir, onExcluir }: Props) {
    const { areaTotal, numGaiolas, pct } = resumoVeiculo(veiculo);
    const cor = corOcupacao(pct);
    const n = veiculo.semireboques.length;
    const infoSemireboques = veiculo.tipo === 'carreta' ? `${n} ${n > 1 ? 'semireboques' : 'semireboque'} · ` : '';

    return (
        <TouchableOpacity style={styles.card} onPress={onAbrir} activeOpacity={0.75}>
            <View style={styles.cabecalho}>
                <View style={[styles.badge, veiculo.tipo === 'carreta' && styles.badgeCarreta]}>
                    <Text style={styles.badgeTexto}>{veiculo.tipo === 'caminhao' ? 'CAMINHÃO' : 'CARRETA'}</Text>
                </View>
                <TouchableOpacity onPress={onExcluir} hitSlop={HIT_SLOP}>
                    <Feather name="trash-2" size={17} color={cores.destaque} />
                </TouchableOpacity>
            </View>
            <Text style={styles.nome}>{nomeTipo(veiculo.tipo)} #{numero}</Text>
            <Text style={styles.info}>
                {infoSemireboques}{numGaiolas} {pluralizar(numGaiolas, 'gaiola', 'gaiolas')} · {formatarNumero(areaTotal, 1)} m²
            </Text>
            <View style={styles.ocupacao}>
                <BarraProgresso percentual={pct} cor={cor} flex />
                <Text style={[styles.percentual, { color: cor }]}>{formatarPercentual(pct)}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: cores.superficie,
        borderRadius: 14,
        padding: 16,
        gap: 6,
        shadowColor: cores.marrom,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    badge: { backgroundColor: cores.borda, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
    badgeCarreta: { backgroundColor: cores.bege },
    badgeTexto: { color: cores.marrom, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
    nome: { color: cores.texto, fontSize: 17, fontWeight: '700', marginTop: 4 },
    info: { color: cores.textoSuave, fontSize: 13 },
    ocupacao: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
    percentual: { fontSize: 13, fontWeight: '700', width: 36, textAlign: 'right' },
});
