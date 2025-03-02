import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

interface ChartProps {
  data: Array<{
    date: string;
    inventory_level: number;
  }>;
  thresholds: {
    low: number;
    medium: number;
    high: number;
  };
}

const Chart = ({ data, thresholds }: ChartProps) => {
  // Calculate min and max values for Y-axis domain
  const minInventory = Math.min(...data.map(d => d.inventory_level));
  const maxInventory = Math.max(...data.map(d => d.inventory_level));
  const maxThreshold = Math.max(thresholds.low, thresholds.medium, thresholds.high);
  
  // Set domain with padding
  const yMin = Math.floor(Math.min(minInventory, thresholds.low) * 0.9);
  const yMax = Math.ceil(Math.max(maxInventory, maxThreshold) * 1.1);

  return (
    <LineChart
      width={600}
      height={400}
      data={data}
      margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
    >
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis dataKey="date" />
      <YAxis domain={[yMin, yMax]} />
      <Tooltip />
      <Line 
        type="monotone" 
        dataKey="inventory_level" 
        stroke="#8884d8"
        strokeWidth={2}
        dot={false}
      />
      <ReferenceLine y={thresholds.low} stroke="red" label={{ value: "Low", position: "right" }} strokeDasharray="3 3" />
      <ReferenceLine y={thresholds.medium} stroke="orange" label={{ value: "Medium", position: "right" }} strokeDasharray="3 3" />
      <ReferenceLine y={thresholds.high} stroke="green" label={{ value: "High", position: "right" }} strokeDasharray="3 3" />
    </LineChart>
  );
};

export default Chart; 