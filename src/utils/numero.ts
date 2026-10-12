// Converte o texto digitado em número, aceitando "," ou "." como separador decimal (ex.: "50,5" → 50.5).
// Retorna NaN para entradas inválidas, como "", "abc" ou "1,2,3".
export function parseNumero(texto: string): number {
    const normalizado = texto.trim().replace(',', '.');
    // Só dígitos com no máximo um separador; recusa formas que Number() aceitaria, como "1e3" ou "0x10".
    if (!/^(\d+\.?\d*|\.\d+)$/.test(normalizado)) return NaN;
    return Number(normalizado);
}

// Formata no padrão brasileiro, com vírgula decimal (ex.: 50.5 → "50,50").
export function formatarNumero(valor: number, casas = 2): string {
    return valor.toFixed(casas).replace('.', ',');
}

// Percentual arredondado para baixo, para não exibir "100%" antes de estar realmente cheio.
export function formatarPercentual(pct: number): string {
    return `${Math.floor(pct)}%`;
}

// Igual a formatarNumero, mas sem zeros finais desnecessários (ex.: 12 → "12", 12.5 → "12,5").
export function formatarCompacto(valor: number, casasMax = 2): string {
    return String(parseFloat(valor.toFixed(casasMax))).replace('.', ',');
}
