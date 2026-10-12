import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { carregarVeiculos, salvarVeiculos } from '../storage';
import type { Animal, PosicaoGaiola, Veiculo } from '../types';

type VeiculosContextValue = {
    veiculos: Veiculo[];
    // true enquanto os dados salvos no aparelho ainda estão sendo lidos.
    carregando: boolean;
    adicionarVeiculo: (veiculo: Veiculo) => void;
    excluirVeiculo: (id: number) => void;
    adicionarAnimal: (id: number, posicao: PosicaoGaiola, animal: Animal) => void;
    excluirAnimal: (id: number, posicao: PosicaoGaiola, index: number) => void;
};

const VeiculosContext = createContext<VeiculosContextValue | null>(null);

// Cópia profunda para alterar estruturas aninhadas sem mutar o estado anterior.
function clonar<T>(valor: T): T {
    return JSON.parse(JSON.stringify(valor));
}

export function VeiculosProvider({ children }: { children: ReactNode }) {
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [carregando, setCarregando] = useState(true);
    // Só grava depois de uma leitura bem-sucedida; se a leitura falhar, gravar apagaria os dados que não foram lidos.
    const [podeSalvar, setPodeSalvar] = useState(false);

    useEffect(() => {
        let ativo = true;
        carregarVeiculos()
            .then(salvos => {
                if (!ativo) return;
                // Mantém veículos cadastrados enquanto a leitura ainda estava em andamento.
                setVeiculos(prev => [...salvos, ...prev]);
                setPodeSalvar(true);
            })
            .catch(erro => {
                console.warn('Não foi possível carregar os veículos salvos.', erro);
                Alert.alert(
                    'Erro ao carregar dados',
                    'Não foi possível ler os veículos salvos. As alterações feitas agora não serão salvas; reabra o app para tentar novamente.',
                );
            })
            .finally(() => { if (ativo) setCarregando(false); });
        return () => { ativo = false; };
    }, []);

    // Persiste a cada alteração, sempre depois da leitura inicial.
    useEffect(() => {
        if (!podeSalvar) return;
        salvarVeiculos(veiculos).catch(erro => console.warn('Não foi possível salvar os veículos.', erro));
    }, [veiculos, podeSalvar]);

    function adicionarVeiculo(veiculo: Veiculo) {
        setVeiculos(prev => [...prev, veiculo]);
    }

    function excluirVeiculo(id: number) {
        setVeiculos(prev => prev.filter((_, i) => i !== id));
    }

    function alterarAnimais(id: number, { rIdx, aIdx, gIdx }: PosicaoGaiola, alterar: (animais: Animal[]) => void) {
        setVeiculos(prev => {
            const next = clonar(prev);
            alterar(next[id].semireboques[rIdx].andares[aIdx].gaiolas[gIdx].animais);
            return next;
        });
    }

    function adicionarAnimal(id: number, posicao: PosicaoGaiola, animal: Animal) {
        alterarAnimais(id, posicao, animais => animais.push(animal));
    }

    function excluirAnimal(id: number, posicao: PosicaoGaiola, index: number) {
        alterarAnimais(id, posicao, animais => animais.splice(index, 1));
    }

    return (
        <VeiculosContext.Provider value={{ veiculos, carregando, adicionarVeiculo, excluirVeiculo, adicionarAnimal, excluirAnimal }}>
            {children}
        </VeiculosContext.Provider>
    );
}

export function useVeiculos() {
    const ctx = useContext(VeiculosContext);
    if (!ctx) throw new Error('useVeiculos deve ser usado dentro de VeiculosProvider');
    return ctx;
}
