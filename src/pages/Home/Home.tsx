import { erc20Abi, getContract, parseEther, parseUnits, zeroAddress } from "viem";
import { verifyTypedData, waitForTransactionReceipt } from "viem/actions";
import {
  useAccount,
  useConnect,
  useChainId,
  useSignMessage,
  useSwitchChain,
  useEstimateGas,
  useWalletClient,
  usePublicClient,
  useSignTypedData,
  useDisconnect,
} from "wagmi";
import { optimism, polygonAmoy } from "wagmi/chains";

const tokenAddr = "0xe2e53a7a1a39ba52249cee280c1f5c3c70fb0d43";

const Home = () => {
  const { connectors, connect, status, error } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const chainId = useChainId();
  const { signTypedDataAsync } = useSignTypedData();
  const signMsg = async () => {
    const res = await signMessageAsync({
      message: "hello",
    });
    console.log("res =>", res);
  };

  const switchChain = async () => {
    if (chainId !== optimism.id) await switchChainAsync({ chainId: optimism.id });
    else await switchChainAsync({ chainId: polygonAmoy.id });
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
  const signTypedData = async () => {
    if (!publicClient || !walletClient || !address) return;
    const signature = await signTypedDataAsync({
      types: {
        EIP712Domain: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "version",
            type: "string",
          },
          {
            name: "chainId",
            type: "uint256",
          },
          {
            name: "verifyingContract",
            type: "address",
          },
        ],
        Person: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "wallet",
            type: "address",
          },
          {
            name: "amount",
            type: "uint256",
          },
        ],
        Mail: [
          {
            name: "from",
            type: "Person",
          },
          {
            name: "to",
            type: "Person",
          },
          {
            name: "contents",
            type: "string",
          },
        ],
      },
      primaryType: "Mail",
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: 1n,
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      },
      message: {
        from: {
          name: "Cow",
          wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
          amount: 1n,
        },
        to: {
          name: "Bob",
          wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
          amount: 1n,
        },
        contents: "Hello, Bob!",
      },
    });
    const valid = await verifyTypedData(publicClient, {
      address: address,
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: 1n,
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      },
      types: {
        EIP712Domain: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "version",
            type: "string",
          },
          {
            name: "chainId",
            type: "uint256",
          },
          {
            name: "verifyingContract",
            type: "address",
          },
        ],
        Person: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "wallet",
            type: "address",
          },
          {
            name: "amount",
            type: "uint256",
          },
        ],
        Mail: [
          {
            name: "from",
            type: "Person",
          },
          {
            name: "to",
            type: "Person",
          },
          {
            name: "contents",
            type: "string",
          },
        ],
      },
      primaryType: "Mail",
      message: {
        from: {
          name: "Cow",
          wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
          amount: 1n,
        },
        to: {
          name: "Bob",
          wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
          amount: 1n,
        },
        contents: "Hello, Bob!",
      },
      signature,
    });
    console.log("signature =>", signature);
    console.log("valid =>", valid);
  };
  return (
    <div>
      <button onClick={() => connect({ connector: connectors[0] })}>{address ? address : "Connect"}</button>
      <button onClick={() => connect({ connector: connectors[1] })}>
        {address ? address : "Connect WalletConnect"}
      </button>
      <p>Chain ID: {chainId}</p>
      <button onClick={signMsg}>Sign Msg</button>
      <button onClick={switchChain}>Switch Chain</button>
      <button onClick={estimateGasAction}>Estimate Gas</button>
      <button onClick={sendTx}>Send Tx</button>
      <button onClick={signTypedData}>Sign Typed Data</button>
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
};

export default Home;
