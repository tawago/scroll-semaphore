"use client";

import * as React from "react";

// import {
//   getDefaultConfig,
//   RainbowKitProvider,
//   Chain
// } from '@rainbow-me/rainbowkit';
import { http, createConfig, WagmiProvider } from 'wagmi'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'
import {
  scrollSepolia
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

export const config = createConfig({
  chains: [scrollSepolia],
  connectors: [],
  transports: {
    [scrollSepolia.id]: http(),
  },
})
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {mounted && children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
