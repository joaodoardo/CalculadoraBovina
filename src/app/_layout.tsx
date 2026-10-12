import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { VeiculosProvider } from '@/features/veiculos';

export default function RootLayout() {
    return (
        <VeiculosProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false, gestureEnabled: true }} />
        </VeiculosProvider>
    );
}
