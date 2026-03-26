import { TonConnectUI } from '@tonconnect/ui-react';
import { Address, beginCell, toNano } from '@ton/core';

// Placeholder for Jetton Wallet Address
const JETTON_WALLET_ADDRESS = import.meta.env.VITE_JETTON_WALLET || "YOUR-JETTON-WALLET";

export const rewardUser = async (tonConnectUI: TonConnectUI, userAddress: string) => {
  if (!tonConnectUI.connected) {
    console.log("Wallet not connected, simulating success in dev mode...");
    return new Promise((resolve) => setTimeout(resolve, 1500));
  }

  try {
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 seconds from now
      messages: [
        {
          address: JETTON_WALLET_ADDRESS,
          amount: toNano("0.05").toString(), // Small amount for gas
          payload: beginCell()
            .storeUint(0, 32) // OpCode for mint/burn simulation
            .storeStringTail(`Mint 10 ADH to ${userAddress}, Burn 2 ADH`)
            .endCell()
            .toBoc()
            .toString("base64"),
        },
      ],
    };

    const result = await tonConnectUI.sendTransaction(transaction);
    console.log("Transaction sent:", result);
    return true;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
};
