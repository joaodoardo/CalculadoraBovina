import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { cores } from '@/theme/cores';
import { formatarCompacto, formatarNumero } from '@/utils/numero';

import type { Animal } from '../types';

const HIT_SLOP = { top: 8, right: 8, bottom: 8, left: 8 };

type Props = {
    animal: Animal;
    numero: number;
    onRemover: () => void;
};

export function AnimalItem({ animal, numero, onRemover }: Props) {
    return (
        <View style={styles.linha}>
            <View style={styles.info}>
                <Text style={styles.numero}>#{numero}</Text>
                <View>
                    <Text style={styles.peso}>
                        {formatarCompacto(animal.peso)} kg{animal.possuiChifres ? ' · com chifres' : ''}
                    </Text>
                    <Text style={styles.area}>{formatarNumero(animal.area_boi, 3)} m²</Text>
                </View>
            </View>
            <TouchableOpacity onPress={onRemover} hitSlop={HIT_SLOP}>
                <Feather name="trash-2" size={17} color={cores.perigo} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    linha: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: cores.superficieSuave,
    },
    info: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    numero: { color: cores.begeMedio, fontSize: 13, fontWeight: '700', width: 28 },
    peso: { color: cores.texto, fontSize: 14, fontWeight: '600' },
    area: { color: cores.textoSuave, fontSize: 12, marginTop: 1 },
});
