import { formatarCompacto } from '@/utils/numero';

import { LARGURA_GAIOLA } from './constants';
import type { Gaiola, TipoVeiculo } from './types';

export function nomeTipo(tipo: TipoVeiculo): string {
    return tipo === 'caminhao' ? 'Caminhão' : 'Carreta';
}

// Ex.: "12 m × 2,5 m = 30 m²"
export function descreverGaiola(gaiola: Gaiola): string {
    return `${formatarCompacto(gaiola.comprimento)} m × ${formatarCompacto(LARGURA_GAIOLA)} m = ${formatarCompacto(gaiola.area)} m²`;
}

export function pluralizar(quantidade: number, singular: string, plural: string): string {
    return quantidade === 1 ? singular : plural;
}
