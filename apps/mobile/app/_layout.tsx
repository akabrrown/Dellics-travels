import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StripeProvider } from '@stripe/stripe-react-native';
import { OfflineBanner } from '../src/components/OfflineBanner';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'}>
      <QueryClientProvider client={queryClient}>
        <OfflineBanner />
        <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="trips/voucher" options={{ presentation: 'modal' }} />
          <Stack.Screen name="search/dates" options={{ presentation: 'modal' }} />
          <Stack.Screen name="search/travelers" options={{ presentation: 'modal' }} />
        </Stack>
      </QueryClientProvider>
    </StripeProvider>
  );
}
