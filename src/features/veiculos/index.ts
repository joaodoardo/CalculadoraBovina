// API pública da feature de veículos, usada pelas rotas em src/app.
export { GaiolaCard } from './components/GaiolaCard';
export { GaiolaModal } from './components/GaiolaModal';
export { NovoVeiculoModal } from './components/novo-veiculo/NovoVeiculoModal';
export { VeiculoCard } from './components/VeiculoCard';
export { VeiculosProvider, useVeiculos } from './context/VeiculosContext';
export * from './calculos';
export * from './formatacao';
export type * from './types';
