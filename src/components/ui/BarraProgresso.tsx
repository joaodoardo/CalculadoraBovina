import { StyleSheet, View } from 'react-native';

import { cores } from '@/theme/cores';

type Props = {
    percentual: number;
    cor: string;
    altura?: number;
    corTrilha?: string;
    arredondada?: boolean;
    flex?: boolean;
};

export function BarraProgresso({ percentual, cor, altura = 8, corTrilha = cores.divisor, arredondada = true, flex = false }: Props) {
    const raio = arredondada ? altura / 2 : 0;
    return (
        <View style={[styles.trilha, { height: altura, backgroundColor: corTrilha, borderRadius: raio }, flex && styles.flex]}>
            <View style={[styles.preenchimento, { width: `${percentual}%`, backgroundColor: cor, borderRadius: raio }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    trilha: { overflow: 'hidden' },
    flex: { flex: 1 },
    preenchimento: { height: '100%' },
});
