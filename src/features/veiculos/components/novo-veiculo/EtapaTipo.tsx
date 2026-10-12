import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { cores } from '@/theme/cores';

import { TIPOS_VEICULO } from '../../constants';
import { nomeTipo } from '../../formatacao';
import type { TipoVeiculo } from '../../types';
import { estilosEtapa } from './estilos';

type Props = {
    tipo: TipoVeiculo;
    onSelecionar: (tipo: TipoVeiculo) => void;
};

export function EtapaTipo({ tipo, onSelecionar }: Props) {
    return (
        <>
            <Text style={estilosEtapa.label}>Tipo de veículo</Text>
            <View style={styles.linha}>
                {TIPOS_VEICULO.map(t => {
                    const selecionado = tipo === t;
                    return (
                        <TouchableOpacity key={t} style={[styles.card, selecionado && styles.cardSel]} onPress={() => onSelecionar(t)}>
                            <Feather name="truck" size={30} color={selecionado ? cores.destaque : cores.textoSecundario} />
                            <Text style={[styles.texto, selecionado && styles.textoSel]}>{nomeTipo(t)}</Text>
                            {selecionado && (
                                <View style={styles.check}>
                                    <Feather name="check" size={12} color={cores.superficie} />
                                </View>
                            )}
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
        padding: 20,
        alignItems: 'center',
        gap: 10,
    },
    cardSel: { borderColor: cores.destaque, backgroundColor: cores.destaqueFundo },
    texto: { color: cores.textoSecundario, fontSize: 15, fontWeight: '600' },
    textoSel: { color: cores.destaque },
    check: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: cores.destaque,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
