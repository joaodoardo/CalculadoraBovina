import { useState } from 'react';

import { novaGaiolaRascunho, novoAndarRascunho, novoSemireboqueRascunho, validarRascunho, montarVeiculo } from '../rascunho';
import type { GaiolaRascunho, SemireboqueRascunho, TipoVeiculo, Veiculo } from '../types';

export type EtapaWizard = 1 | 2 | 3;

// Ajusta a lista à quantidade pedida, preservando o que já foi preenchido.
function redimensionar(semireboques: SemireboqueRascunho[], quantidade: number): SemireboqueRascunho[] {
    return Array.from({ length: quantidade }, (_, i) => semireboques[i] ?? novoSemireboqueRascunho());
}

// Estado e regras do wizard "Novo Veículo":
// etapa 1 = tipo, etapa 2 = quantidade de semireboques (só carreta), etapa 3 = gaiolas.
export function useNovoVeiculo() {
    const [etapa, setEtapa] = useState<EtapaWizard>(1);
    const [tipo, setTipo] = useState<TipoVeiculo>('caminhao');
    const [numSemireboques, setNumSemireboques] = useState(1);
    const [semireboques, setSemireboques] = useState<SemireboqueRascunho[]>(() => [novoSemireboqueRascunho()]);

    // Caminhão pula a etapa de quantidade de semireboques.
    const totalEtapas = tipo === 'carreta' ? 3 : 2;
    const etapaVisual = etapa === 3 ? totalEtapas : etapa;

    function reiniciar() {
        setEtapa(1);
        setTipo('caminhao');
        setNumSemireboques(1);
        setSemireboques([novoSemireboqueRascunho()]);
    }

    function avancar() {
        if (etapa === 1) {
            if (tipo === 'caminhao') {
                setSemireboques(prev => redimensionar(prev, 1));
                setEtapa(3);
            } else {
                setEtapa(2);
            }
        } else if (etapa === 2) {
            setSemireboques(prev => redimensionar(prev, numSemireboques));
            setEtapa(3);
        }
    }

    function voltar() {
        if (etapa === 3) setEtapa(tipo === 'carreta' ? 2 : 1);
        else if (etapa === 2) setEtapa(1);
    }

    function definirNumAndares(rIdx: number, numAndares: number) {
        setSemireboques(prev => prev.map((reboque, r) => {
            if (r !== rIdx || reboque.numAndares === numAndares) return reboque;
            return numAndares === 2
                ? { numAndares: 2, andares: [reboque.andares[0], novoAndarRascunho()] }
                : { numAndares: 1, andares: [reboque.andares[0]] };
        }));
    }

    function alterarGaiolas(rIdx: number, aIdx: number, alterar: (gaiolas: GaiolaRascunho[]) => GaiolaRascunho[]) {
        setSemireboques(prev => prev.map((reboque, r) => r !== rIdx ? reboque : {
            ...reboque,
            andares: reboque.andares.map((andar, a) => a !== aIdx ? andar : { gaiolas: alterar(andar.gaiolas) }),
        }));
    }

    function adicionarGaiola(rIdx: number, aIdx: number) {
        alterarGaiolas(rIdx, aIdx, gaiolas => [...gaiolas, novaGaiolaRascunho()]);
    }

    function removerGaiola(rIdx: number, aIdx: number, gIdx: number) {
        alterarGaiolas(rIdx, aIdx, gaiolas => gaiolas.filter((_, g) => g !== gIdx));
    }

    function atualizarComprimento(rIdx: number, aIdx: number, gIdx: number, comprimento: string) {
        alterarGaiolas(rIdx, aIdx, gaiolas => gaiolas.map((gaiola, g) => g !== gIdx ? gaiola : { ...gaiola, comprimento }));
    }

    // Valida o rascunho e devolve o veículo pronto, ou a mensagem de erro.
    function concluir(): { veiculo: Veiculo } | { erro: string } {
        const erro = validarRascunho(tipo, semireboques);
        return erro ? { erro } : { veiculo: montarVeiculo(tipo, semireboques) };
    }

    return {
        etapa,
        etapaVisual,
        totalEtapas,
        tipo,
        setTipo,
        numSemireboques,
        setNumSemireboques,
        semireboques,
        reiniciar,
        avancar,
        voltar,
        definirNumAndares,
        adicionarGaiola,
        removerGaiola,
        atualizarComprimento,
        concluir,
    };
}
