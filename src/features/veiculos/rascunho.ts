import { parseNumero } from '@/utils/numero';

import { LARGURA_GAIOLA } from './constants';
import type { AndarRascunho, GaiolaRascunho, SemireboqueRascunho, TipoVeiculo, Veiculo } from './types';

let proximoUid = 0;

export const novaGaiolaRascunho = (): GaiolaRascunho => ({ comprimento: '', uid: ++proximoUid });
export const novoAndarRascunho = (): AndarRascunho => ({ gaiolas: [] });
export const novoSemireboqueRascunho = (): SemireboqueRascunho => ({ numAndares: 1, andares: [novoAndarRascunho()] });

function comprimentoValido(texto: string): boolean {
    const valor = parseNumero(texto);
    return Number.isFinite(valor) && valor > 0;
}

// Retorna a mensagem de erro do primeiro problema encontrado, ou null se o rascunho estiver válido.
export function validarRascunho(tipo: TipoVeiculo, semireboques: SemireboqueRascunho[]): string | null {
    for (let r = 0; r < semireboques.length; r++) {
        for (let a = 0; a < semireboques[r].andares.length; a++) {
            const gaiolas = semireboques[r].andares[a].gaiolas;
            if (gaiolas.length === 0) {
                const nome = tipo === 'caminhao' ? 'Caminhão' : `Semireboque ${r + 1}`;
                return `${nome}, Andar ${a + 1} precisa de pelo menos uma gaiola.`;
            }
            if (!gaiolas.every(gaiola => comprimentoValido(gaiola.comprimento))) {
                return 'Insira comprimentos válidos para todas as gaiolas.';
            }
        }
    }
    return null;
}

// Converte um rascunho já validado no veículo definitivo, calculando a área de cada gaiola.
export function montarVeiculo(tipo: TipoVeiculo, semireboques: SemireboqueRascunho[]): Veiculo {
    return {
        tipo,
        semireboques: semireboques.map(reboque => ({
            andares: reboque.andares.map(andar => ({
                gaiolas: andar.gaiolas.map(gaiola => {
                    const comprimento = parseNumero(gaiola.comprimento);
                    return {
                        comprimento,
                        area: parseFloat((comprimento * LARGURA_GAIOLA).toFixed(2)),
                        animais: [],
                    };
                }),
            })),
        })),
    };
}
