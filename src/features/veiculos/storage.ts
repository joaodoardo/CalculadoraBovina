import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Veiculo } from './types';

const CHAVE = '@calcbov/veiculos';

// Incrementar ao mudar o formato de Veiculo e tratar a migração em carregarVeiculos.
const VERSAO_ATUAL = 1;

type DadosSalvos = { versao: number; veiculos: Veiculo[] };

function ehNumero(valor: unknown): valor is number {
    return typeof valor === 'number' && Number.isFinite(valor);
}

// Confere a estrutura mínima antes de aceitar o que veio do armazenamento.
function ehVeiculo(valor: unknown): valor is Veiculo {
    const v = valor as Veiculo;
    return (
        !!v &&
        (v.tipo === 'caminhao' || v.tipo === 'carreta') &&
        Array.isArray(v.semireboques) &&
        v.semireboques.every(r => Array.isArray(r?.andares) && r.andares.every(a =>
            Array.isArray(a?.gaiolas) && a.gaiolas.every(g =>
                ehNumero(g?.comprimento) && ehNumero(g?.area) && Array.isArray(g?.animais) && g.animais.every(animal =>
                    ehNumero(animal?.peso) && ehNumero(animal?.area_boi) && typeof animal?.possuiChifres === 'boolean'))))
    );
}

function interpretar(json: string): Veiculo[] {
    const dados = JSON.parse(json) as Partial<DadosSalvos>;
    if (dados.versao !== VERSAO_ATUAL || !Array.isArray(dados.veiculos)) {
        throw new Error(`Formato de dados não suportado (versão ${dados.versao}).`);
    }
    return dados.veiculos.filter(ehVeiculo);
}

export async function carregarVeiculos(): Promise<Veiculo[]> {
    const json = await AsyncStorage.getItem(CHAVE);
    if (!json) return [];

    try {
        return interpretar(json);
    } catch (erro) {
        // Dados ilegíveis: guarda uma cópia antes que o próximo salvamento os sobrescreva.
        await AsyncStorage.setItem(`${CHAVE}:backup-${Date.now()}`, json);
        console.warn('Dados salvos inválidos; uma cópia de segurança foi criada.', erro);
        return [];
    }
}

export async function salvarVeiculos(veiculos: Veiculo[]): Promise<void> {
    const dados: DadosSalvos = { versao: VERSAO_ATUAL, veiculos };
    await AsyncStorage.setItem(CHAVE, JSON.stringify(dados));
}
