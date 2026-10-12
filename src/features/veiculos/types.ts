export type TipoVeiculo = 'caminhao' | 'carreta';

export type Animal = { peso: number; possuiChifres: boolean; area_boi: number };
export type Gaiola = { comprimento: number; area: number; animais: Animal[] };
export type Andar = { gaiolas: Gaiola[] };
export type Semireboque = { andares: Andar[] };
export type Veiculo = { tipo: TipoVeiculo; semireboques: Semireboque[] };

// Posição de uma gaiola dentro de um veículo.
export type PosicaoGaiola = { rIdx: number; aIdx: number; gIdx: number };

// Rascunho usado durante o cadastro: o comprimento ainda é o texto digitado.
export type GaiolaRascunho = { comprimento: string; uid: number };
export type AndarRascunho = { gaiolas: GaiolaRascunho[] };
export type SemireboqueRascunho = { numAndares: number; andares: AndarRascunho[] };
