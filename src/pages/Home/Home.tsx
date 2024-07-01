import { erc20Abi, getContract, parseEther, parseUnits, zeroAddress } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import {
  useAccount,
  useConnect,
  useChainId,
  useSignMessage,
  useSwitchChain,
  useEstimateGas,
  useWalletClient,
  usePublicClient,
} from "wagmi";
import { optimism } from "wagmi/chains";

const tokenAddr = "0xe2e53a7a1a39ba52249cee280c1f5c3c70fb0d43";

const Home = () => {
  const { connectors, connect, status, error } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { switchChainAsync } = useSwitchChain();
  const chainId = useChainId();
  const signMsg = async () => {
    try {
      const res = await signMessageAsync({
        message: "hello",
      });
      console.log("res =>", res);
    } catch (error) {
      console.log(Object.entries(error as any));
    }
  };

  const switchChain = async () => {
    await switchChainAsync({ chainId: optimism.id });
  };

  const estimateGasAction = async () => {
    try {
      const contract = getContract({
        abi: erc20Abi,
        address: tokenAddr,
        client: {
          // public: publicClient!,
          wallet: walletClient!,
        },
      });
      const res = await contract.estimateGas.transfer([address!, 0n]);
      console.log("res =>", res);
    } catch (error: any) {
      console.error(Object.entries(error));
    }
  };
  const sendTx = async () => {
    const contract = getContract({
      abi: [
        {
          inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "mint",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      address: tokenAddr,
      client: {
        public: publicClient!,
        wallet: walletClient!,
      },
    });
    const hash = await contract.write.mint([address!, parseEther("1")]);
    console.log("hash =>", hash);
    const receipt = await waitForTransactionReceipt(publicClient!, { hash });
    console.log("receipt =>", receipt);
  };
  return (
    <div onClick={() => connect({ connector: connectors[0] })}>
      <p>{address ? address : "Connect"}</p>
      <p>Chain ID: {chainId}</p>
      <button onClick={signMsg}>Sign Msg</button>
      <button onClick={switchChain}>Switch Chain</button>
      <button onClick={estimateGasAction}>Estimate Gas</button>
      <button onClick={sendTx}>Send Tx</button>
    </div>
  );
};

export default Home;
