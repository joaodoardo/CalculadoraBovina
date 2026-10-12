import { cores } from '@/theme/cores';

import type { Animal, Gaiola, Veiculo } from './types';

// Área ocupada pelo animal (m²) a partir do peso (kg); animais com chifres ocupam 7% a mais.
export function calcularAreaBoi(peso: number, possuiChifres: boolean): number {
    const area = 0.021 * peso ** 0.67;
    return possuiChifres ? area * 1.07 : area;
}

export function areaOcupada(animais: Animal[]): number {
    return animais.reduce((total, animal) => total + animal.area_boi, 0);
}

export function areaDisponivel(gaiola: Gaiola): number {
    return gaiola.area - areaOcupada(gaiola.animais);
}

// Percentual de ocupação limitado a 100%.
export function percentualOcupacao(usado: number, total: number): number {
    return total > 0 ? Math.min((usado / total) * 100, 100) : 0;
}

// Verde até 70%, laranja até 90%, vermelho a partir daí.
export function corOcupacao(pct: number): string {
    if (pct >= 90) return cores.perigo;
    if (pct >= 70) return cores.alerta;
    return cores.sucesso;
}

export function ocupacaoGaiola(gaiola: Gaiola) {
    const usado = areaOcupada(gaiola.animais);
    return { usado: parseFloat(usado.toFixed(3)), pct: percentualOcupacao(usado, gaiola.area) };
}

export function resumoVeiculo(veiculo: Veiculo) {
    let areaTotal = 0;
    let usado = 0;
    let numGaiolas = 0;
    for (const reboque of veiculo.semireboques) {
        for (const andar of reboque.andares) {
            for (const gaiola of andar.gaiolas) {
                areaTotal += gaiola.area;
                usado += areaOcupada(gaiola.animais);
                numGaiolas++;
            }
        }
    }
    return { areaTotal, usado, numGaiolas, pct: percentualOcupacao(usado, areaTotal) };
}
