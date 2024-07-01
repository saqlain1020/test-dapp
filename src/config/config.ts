import { http, createConfig } from "wagmi";
import { mainnet, sepolia, polygonAmoy, optimism } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, sepolia, polygonAmoy, optimism],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygonAmoy.id]: http(),
    [optimism.id]: http(),
  },
});
