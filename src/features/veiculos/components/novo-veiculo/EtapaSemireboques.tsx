import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { cores } from '@/theme/cores';

import { OPCOES_SEMIREBOQUES } from '../../constants';
import { pluralizar } from '../../formatacao';
import { estilosEtapa } from './estilos';

type Props = {
    quantidade: number;
    onSelecionar: (quantidade: number) => void;
};

export function EtapaSemireboques({ quantidade, onSelecionar }: Props) {
    return (
        <>
            <Text style={estilosEtapa.label}>Quantos semireboques?</Text>
            <View style={styles.linha}>
                {OPCOES_SEMIREBOQUES.map(n => {
                    const selecionado = quantidade === n;
                    return (
                        <TouchableOpacity key={n} style={[styles.card, selecionado && styles.cardSel]} onPress={() => onSelecionar(n)}>
                            <Text style={[styles.numero, selecionado && styles.destaque]}>{n}</Text>
                            <Text style={[styles.legenda, selecionado && styles.destaque]}>{pluralizar(n, 'reboque', 'reboques')}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    linha: { flexDirection: 'row', gap: 12 },
    card: {
        flex: 1,
        borderWidth: 2,
        borderColor: cores.borda,
        borderRadius: 14,
        paddingVertical: 20,
        alignItems: 'center',
        gap: 4,
    },
    cardSel: { borderColor: cores.destaque, backgroundColor: cores.destaqueFundo },
    numero: { color: cores.textoSecundario, fontSize: 28, fontWeight: '800' },
    legenda: { color: cores.textoTerciario, fontSize: 12 },
    destaque: { color: cores.destaque },
});
