import { http, createConfig } from "wagmi";
import { mainnet, sepolia, polygonAmoy, optimism } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, sepolia, polygonAmoy, optimism],
  connectors: [injected(), walletConnect({ projectId: "d8fccb99f764b3d58a49f7480695d849" })],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygonAmoy.id]: http(),
    [optimism.id]: http(),
  },
});
