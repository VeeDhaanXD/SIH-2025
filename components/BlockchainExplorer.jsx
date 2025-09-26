import React, { useState } from 'react';
import { Box, Link2, Clock, CheckCircle, Hash, FileText, X } from 'lucide-react';

// --- MOCK DATA for Blockchain Explorer ---
// This simulates a series of blocks with transaction data.
// In a real application, this would be fetched from a blockchain node.
const mockBlockchain = [
  {
    blockNumber: 102,
    timestamp: '2025-09-25T01:35:12Z',
    transactions: [
      { type: 'ID_VERIFIED', details: 'Tourist TID-78901 (Michael Chen)', txHash: '0x8a...e5' },
      { type: 'LOCATION_UPDATE', details: 'TID-78901 at Sela Pass', txHash: '0x3c...b1' },
    ],
    hash: '0xabc123def456...',
    previousHash: '0x456fed321cba...',
  },
  {
    blockNumber: 103,
    timestamp: '2025-09-25T01:40:28Z',
    transactions: [
      { type: 'ID_CREATED', details: 'Tourist TID-11223 (New Tourist)', txHash: '0x9f...a3' },
      { type: 'ITINERARY_UPDATE', details: 'TID-11223 added Gangtok', txHash: '0x7b...d9' },
      { type: 'STATUS_UPDATE', details: 'TID-55432 marked Active', txHash: '0x2d...c4' },
    ],
    hash: '0xdef456abc123...',
    previousHash: '0xabc123def456...',
  },
  {
    blockNumber: 104,
    timestamp: '2025-09-25T01:45:51Z',
    transactions: [
      { type: 'ALERT_LOGGED', details: 'Panic Button for TID-84392 (Ananya Sharma)', txHash: '0x5e...f0' },
      { type: 'LOCATION_UPDATE', details: 'TID-84392 at Tiger Hill', txHash: '0x1a...b8' },
    ],
    hash: '0x789ghi123jkl...',
    previousHash: '0xdef456abc123...',
  },
].reverse(); // Show the latest block first

// --- Sub-components ---

const TransactionDetailModal = ({ block, onClose }) => {
  if (!block) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Transactions in Block #{block.blockNumber}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <X className="w-6 h-6 text-gray-600 dark:text-slate-300" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {block.transactions.map((tx, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-blue-800 dark:text-blue-300">{tx.type}</p>
                    <p className="text-sm text-gray-700 dark:text-slate-200">{tx.details}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-mono mt-1">Tx Hash: {tx.txHash}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main BlockchainExplorer Component ---
export default function BlockchainExplorer() {
  const [selectedBlock, setSelectedBlock] = useState(null);

  return (
    <main className="flex-1 p-6 lg:p-8 bg-slate-100 dark:bg-slate-900 overflow-y-auto h-full">
      {selectedBlock && <TransactionDetailModal block={selectedBlock} onClose={() => setSelectedBlock(null)} />}
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Blockchain Log Explorer</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">A real-time, tamper-proof log of all tourist-related activities.</p>
        </div>

        <div className="relative">
          {/* Vertical line connecting the blocks */}
          <div className="absolute left-6 top-0 h-full w-0.5 bg-slate-300 dark:bg-slate-700" aria-hidden="true"></div>

          <div className="space-y-8">
            {mockBlockchain.map((block, index) => (
              <div key={block.blockNumber} className="relative pl-12">
                <div className="absolute left-0 top-1.5 flex items-center justify-center">
                   <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center ring-4 ring-slate-100 dark:ring-slate-900">
                    <Box className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                  <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-t-xl border-b dark:border-slate-200 dark:border-slate-700">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Block #{block.blockNumber}</h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-slate-400 mt-1">
                        <Clock className="w-4 h-4 mr-1.5" />
                        <span>{new Date(block.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-semibold mt-2 md:mt-0">
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      <span>Validated</span>
                    </div>
                  </header>
                  
                  <div className="p-4 space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                        <Hash className="w-4 h-4 mt-0.5 text-gray-400 dark:text-slate-500" />
                        <div className="font-mono text-gray-700 dark:text-slate-300">
                            <span className="font-semibold">Hash:</span> {block.hash}
                        </div>
                    </div>
                     <div className="flex items-start gap-2">
                        <Link2 className="w-4 h-4 mt-0.5 text-gray-400 dark:text-slate-500" />
                        <div className="font-mono text-gray-700 dark:text-slate-300">
                            <span className="font-semibold">Prev. Hash:</span> {block.previousHash}
                        </div>
                    </div>
                  </div>

                  <footer className="p-4 border-t dark:border-slate-700">
                    <button 
                      onClick={() => setSelectedBlock(block)}
                      className="w-full md:w-auto bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold py-2 px-4 rounded-lg text-sm"
                    >
                      View {block.transactions.length} Transactions
                    </button>
                  </footer>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

