---

name: packet manager

---

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";

import { BitcoinWalletConnectors } from "@dynamic-labs/bitcoin";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";


export default function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "193dbeff-c513-4991-b8d2-d6dc352f71f9",
        walletConnectors: [BitcoinWalletConnectors,EthereumWalletConnectors],
      }}
    >
      <DynamicWidget />
    </DynamicContextProvider>
  );

