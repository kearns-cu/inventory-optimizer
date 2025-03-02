'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

const DynamicChart = dynamic(() => import('../components/Chart'), { ssr: false });

interface InventoryData {
  product_id: string;
  product_name: string;
  date: string;
  inventory_level: number;
  orders: number;
  lead_time_days: number;
}

export default function Home() {
  const [data, setData] = useState<InventoryData[]>([]);
  const [thresholds, setThresholds] = useState({ low: 0, medium: 0, high: 0 });
  const [params, setParams] = useState({
    leadTime: 5,
    safetyStock: 20,
    averageDailySales: 0
  });

  const calculateThresholds = (inventoryData: InventoryData[], currentLeadTime = params.leadTime, currentSafetyStock = params.safetyStock) => {
    // Calculate average daily sales from orders
    const totalOrders = inventoryData.reduce((acc, curr) => acc + Number(curr.orders), 0);
    const avgDailySales = totalOrders / inventoryData.length;
    
    // Update average daily sales in state
    setParams(prev => ({ ...prev, averageDailySales: avgDailySales }));

    // Calculate thresholds
    const low = avgDailySales * currentLeadTime;
    const medium = low * (1 + (currentSafetyStock / 100));
    const high = medium * 1.2;

    setThresholds({
      low: Math.round(low),
      medium: Math.round(medium),
      high: Math.round(high)
    });
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedData = results.data as InventoryData[];
        setData(parsedData);
        calculateThresholds(parsedData, params.leadTime, params.safetyStock);
      }
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    }
  });

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Inventory Optimizer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div {...getRootProps()} className="border-2 border-dashed p-8 rounded-lg text-center cursor-pointer hover:bg-gray-50">
            <input {...getInputProps()} />
            <p>Drag and drop a CSV file here, or click to select one</p>
            <p className="text-sm text-gray-500 mt-2">Supported format: CSV</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Parameters</h2>
            <div className="space-y-2">
              <label className="block">
                Lead Time (days)
                <input
                  type="number"
                  value={params.leadTime}
                  onChange={(e) => {
                    const newLeadTime = Number(e.target.value);
                    setParams(prev => ({ ...prev, leadTime: newLeadTime }));
                    calculateThresholds(data, newLeadTime, params.safetyStock);
                  }}
                  className="w-full mt-1 p-2 border rounded"
                />
              </label>
              <label className="block">
                Safety Stock (%)
                <input
                  type="number"
                  value={params.safetyStock}
                  onChange={(e) => {
                    const newSafetyStock = Number(e.target.value);
                    setParams(prev => ({ ...prev, safetyStock: newSafetyStock }));
                    calculateThresholds(data, params.leadTime, newSafetyStock);
                  }}
                  className="w-full mt-1 p-2 border rounded"
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Calculated Thresholds</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-red-100 rounded">
                <p className="font-medium text-black">Low</p>
                <p className="text-black">{Math.round(thresholds.low)}</p>
              </div>
              <div className="p-4 bg-yellow-100 rounded">
                <p className="font-medium text-black">Medium</p>
                <p className="text-black">{Math.round(thresholds.medium)}</p>
              </div>
              <div className="p-4 bg-green-100 rounded">
                <p className="font-medium text-black">High</p>
                <p className="text-black">{Math.round(thresholds.high)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          {data.length > 0 && (
            <DynamicChart data={data} thresholds={thresholds} />
          )}
        </div>
      </div>
    </main>
  );
}
