import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BarraProgresso } from '@/components/ui/BarraProgresso';
import {
    GaiolaCard,
    GaiolaModal,
    PosicaoGaiola,
    corOcupacao,
    nomeTipo,
    resumoVeiculo,
    useVeiculos,
} from '@/features/veiculos';
import { cores } from '@/theme/cores';
import { formatarNumero, formatarPercentual } from '@/utils/numero';

export default function VeiculoScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id: idParam } = useLocalSearchParams<{ id: string }>();
    const id = parseInt(idParam ?? '0', 10);
    const { veiculos, carregando } = useVeiculos();
    const veiculo = veiculos[id];
    const [gaiolaAberta, setGaiolaAberta] = useState<PosicaoGaiola | null>(null);

    function voltar() {
        // Aberto por link direto não há tela anterior; nesse caso vai para a lista.
        if (router.canGoBack()) router.back();
        else router.replace('/');
    }

    // Veículo inexistente (ex.: excluído): volta para a lista. Espera a leitura dos dados salvos.
    useEffect(() => {
        if (carregando || veiculo) return;
        if (router.canGoBack()) router.back();
        else router.replace('/');
    }, [carregando, veiculo, router]);

    if (!veiculo) return null;

    const { areaTotal, usado, pct } = resumoVeiculo(veiculo);
    const cor = corOcupacao(pct);

    return (
        <View style={styles.container}>
            <View style={[styles.cabecalho, { paddingTop: insets.top + 20 }]}>
                <TouchableOpacity onPress={voltar} style={styles.voltar}>
                    <Feather name="chevron-left" size={26} color={cores.bege} />
                </TouchableOpacity>
                <View style={styles.cabecalhoTextos}>
                    <Text style={styles.titulo}>{nomeTipo(veiculo.tipo)} #{id + 1}</Text>
                    <Text style={styles.subtitulo}>{formatarNumero(usado)} / {formatarNumero(areaTotal, 1)} m²</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={[styles.badgeTexto, { color: cor }]}>{formatarPercentual(pct)}</Text>
                </View>
            </View>
            <BarraProgresso percentual={pct} cor={cor} altura={6} corTrilha={cores.begeMedio} arredondada={false} />

            <ScrollView contentContainerStyle={[styles.lista, { paddingBottom: insets.bottom + 40 }]}>
                {veiculo.semireboques.map((reboque, rIdx) => (
                    <View key={rIdx}>
                        <View style={styles.secao}>
                            <View style={styles.secaoLinha} />
                            <Text style={styles.secaoTitulo}>
                                {veiculo.tipo === 'caminhao' ? 'CAMINHÃO' : `SEMIREBOQUE ${rIdx + 1}`}
                            </Text>
                            <View style={styles.secaoLinha} />
                        </View>

                        {reboque.andares.map((andar, aIdx) => (
                            <View key={aIdx}>
                                {reboque.andares.length > 1 && <Text style={styles.andarTitulo}>Andar {aIdx + 1}</Text>}
                                {andar.gaiolas.map((gaiola, gIdx) => (
                                    <GaiolaCard
                                        key={gIdx}
                                        gaiola={gaiola}
                                        numero={gIdx + 1}
                                        onPress={() => setGaiolaAberta({ rIdx, aIdx, gIdx })}
                                    />
                                ))}
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>

            <GaiolaModal veiculoId={id} veiculo={veiculo} posicao={gaiolaAberta} onFechar={() => setGaiolaAberta(null)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    cabecalho: {
        backgroundColor: cores.marrom,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    voltar: { marginRight: 8, padding: 4 },
    cabecalhoTextos: { flex: 1 },
    titulo: { color: cores.bege, fontSize: 20, fontWeight: '700' },
    subtitulo: { color: cores.begeMedio, fontSize: 12, marginTop: 2 },
    badge: { backgroundColor: cores.texto, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
    badgeTexto: { fontSize: 16, fontWeight: '800' },
    lista: { padding: 16, gap: 8 },
    secao: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, marginBottom: 8 },
    secaoLinha: { flex: 1, height: 1, backgroundColor: cores.borda },
    secaoTitulo: { color: cores.textoSecundario, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
    andarTitulo: {
        color: cores.textoTerciario,
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 6,
        marginTop: 4,
        paddingLeft: 2,
    },
});
