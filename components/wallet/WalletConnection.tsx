'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Check, AlertCircle, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

interface WalletConnectionProps {
  onPaymentSuccess: () => void;
  isVisible: boolean;
}

export default function WalletConnection({ onPaymentSuccess, isVisible }: WalletConnectionProps) {
  const [walletType, setWalletType] = useState<'metamask' | 'phantom' | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string>('');

  // Admin wallet addresses (testnet) - properly checksummed
  const ADMIN_WALLETS = {
    ethereum: '0x742d35Cc6634C0532925a3b8D6e8d29E94f4C0b4'.toLowerCase(), // Convert to lowercase to avoid checksum issues
    solana: 'H4ZuVr1aVfuRs6o1L8L9Z8j9J8j9J8j9J8j9J8j9J8j9J8j' // Replace with your devnet admin wallet
  };

  const PLATFORM_FEES = {
    ethereum: '0.001', // ETH
    solana: '0.01' // SOL
  };

  useEffect(() => {
    checkWalletConnections();
  }, []);

  const checkWalletConnections = async () => {
    // Check MetaMask
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletType('metamask');
          setIsConnected(true);
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking MetaMask:', error);
      }
    }

    // Check Phantom
    if (typeof window !== 'undefined' && window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect({ onlyIfTrusted: true });
        if (response.publicKey) {
          setWalletType('phantom');
          setIsConnected(true);
          setWalletAddress(response.publicKey.toString());
        }
      } catch (error) {
        console.error('Error checking Phantom:', error);
      }
    }
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setWalletType('metamask');
        setIsConnected(true);
        setWalletAddress(accounts[0]);
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      alert('Failed to connect to MetaMask');
    }
  };

  const connectPhantom = async () => {
    if (!window.solana || !window.solana.isPhantom) {
      alert('Phantom wallet is not installed. Please install Phantom to continue.');
      return;
    }

    try {
      const response = await window.solana.connect();
      if (response.publicKey) {
        setWalletType('phantom');
        setIsConnected(true);
        setWalletAddress(response.publicKey.toString());
      }
    } catch (error) {
      console.error('Error connecting to Phantom:', error);
      alert('Failed to connect to Phantom wallet');
    }
  };

  const payWithMetaMask = async () => {
    if (!window.ethereum || !walletAddress) return;

    setIsPaymentLoading(true);
    setPaymentStatus('processing');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Validate and checksum the admin address
      const adminAddress = ethers.getAddress(ADMIN_WALLETS.ethereum);

      // Create transaction
      const transaction = {
        to: adminAddress,
        value: ethers.parseEther(PLATFORM_FEES.ethereum),
        gasLimit: 21000,
      };

      // Send transaction
      const txResponse = await signer.sendTransaction(transaction);
      setTransactionHash(txResponse.hash);

      // Wait for confirmation
      await txResponse.wait();

      setPaymentStatus('success');
      setTimeout(() => {
        onPaymentSuccess();
      }, 2000);

    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('error');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const payWithPhantom = async () => {
    if (!window.solana || !walletAddress) return;

    setIsPaymentLoading(true);
    setPaymentStatus('processing');

    try {
      // This is a simplified example - in production, you'd use @solana/web3.js
      // For now, we'll simulate the payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transaction hash
      setTransactionHash('5KJp7z8X9c2B4nF8qH3xR7V9m1W5k3L2P8nQ4rT6yU9wA3sD1eF');
      setPaymentStatus('success');
      
      setTimeout(() => {
        onPaymentSuccess();
      }, 2000);

    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('error');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handlePayment = () => {
    if (walletType === 'metamask') {
      payWithMetaMask();
    } else if (walletType === 'phantom') {
      payWithPhantom();
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="w-5 h-5 mr-2" />
            Connect Wallet & Pay Fee
          </CardTitle>
          <CardDescription>
            Connect your wallet and pay the platform fee to post a job
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wallet Connection */}
          {!isConnected ? (
            <div className="space-y-4">
              <h3 className="font-medium">Choose your wallet:</h3>
              <div className="grid gap-3">
                <Button
                  onClick={connectMetaMask}
                  variant="outline"
                  className="flex items-center justify-start p-4 h-auto"
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">MetaMask</div>
                    <div className="text-sm text-gray-500">Connect using MetaMask</div>
                  </div>
                </Button>
                <Button
                  onClick={connectPhantom}
                  variant="outline"
                  className="flex items-center justify-start p-4 h-auto"
                >
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Phantom</div>
                    <div className="text-sm text-gray-500">Connect using Phantom</div>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Connected Wallet Info */}
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <div className="font-medium text-green-800">
                    {walletType === 'metamask' ? 'MetaMask' : 'Phantom'} Connected
                  </div>
                  <div className="text-sm text-green-600">
                    {formatAddress(walletAddress)}
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Platform Fee</h3>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {walletType === 'metamask' ? `${PLATFORM_FEES.ethereum} ETH` : `${PLATFORM_FEES.solana} SOL`}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  One-time fee to post a job on the platform
                </div>

                {paymentStatus === 'idle' && (
                  <Button 
                    onClick={handlePayment}
                    disabled={isPaymentLoading}
                    className="w-full"
                  >
                    {isPaymentLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      'Pay Platform Fee'
                    )}
                  </Button>
                )}

                {paymentStatus === 'processing' && (
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <Loader2 className="w-5 h-5 text-blue-600 mr-2 animate-spin" />
                    <div>
                      <div className="font-medium text-blue-800">Processing Payment</div>
                      <div className="text-sm text-blue-600">Please wait...</div>
                    </div>
                  </div>
                )}

                {paymentStatus === 'success' && (
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <Check className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <div className="font-medium text-green-800">Payment Successful!</div>
                        <div className="text-sm text-green-600">Transaction confirmed</div>
                      </div>
                    </div>
                    {transactionHash && (
                      <div className="text-sm">
                        <span className="font-medium">Transaction Hash:</span>
                        <div className="text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                          {transactionHash}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {paymentStatus === 'error' && (
                  <div className="flex items-center p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <div>
                      <div className="font-medium text-red-800">Payment Failed</div>
                      <div className="text-sm text-red-600">Please try again</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
