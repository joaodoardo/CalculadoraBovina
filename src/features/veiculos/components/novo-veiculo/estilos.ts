import { StyleSheet } from 'react-native';

import { cores } from '@/theme/cores';

// Estilos compartilhados entre as etapas do wizard.
export const estilosEtapa = StyleSheet.create({
    label: { color: cores.textoSecundario, fontSize: 12, fontWeight: '700', letterSpacing: 0.8, marginBottom: 12 },
});
