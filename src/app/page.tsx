import { WalletConnect } from "@/components/WalletConnect";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4">OneSeed</h1>
          <p className="text-lg text-gray-600 mb-8">Save While You Transact</p>
        </div>

        <WalletConnect />

        <div className="text-center sm:text-left max-w-md">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <ol className="font-mono list-inside list-decimal text-sm/6 space-y-2">
            <li className="tracking-[-.01em]">
              Connect your wallet using the button above
            </li>
            <li className="tracking-[-.01em]">
              Start saving while you transact with gasless transactions
            </li>
            <li className="tracking-[-.01em]">
              Built on Uniswap v4 with Biconomy account abstraction
            </li>
          </ol>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <span className="text-sm text-gray-500">
          Built with Next.js, Biconomy & Uniswap v4
        </span>
      </footer>
    </div>
  );
}
