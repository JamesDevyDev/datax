import React, { useState } from 'react';
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

type ChartType = 'chart1' | 'chart2' | 'chart3' | 'chart4';

type DataItem =
  | { name: string; value: number }
  | { name: string; sales: number }
  | { name: string; users: number };

type DataState = {
  chart1: { name: string; value: number }[];
  chart2: { name: string; sales: number }[];
  chart3: { name: string; value: number }[];
  chart4: { name: string; users: number }[];
};

const App: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<ChartType>('chart1');
  const [data, setData] = useState<DataState>({
    chart1: [
      { name: 'Jan', value: 30 },
      { name: 'Feb', value: 50 },
      { name: 'Mar', value: 80 },
    ],
    chart2: [
      { name: 'Product A', sales: 240 },
      { name: 'Product B', sales: 130 },
      { name: 'Product C', sales: 200 },
    ],
    chart3: [
      { name: 'Group A', value: 400 },
      { name: 'Group B', value: 300 },
      { name: 'Group C', value: 300 },
    ],
    chart4: [
      { name: 'Week 1', users: 200 },
      { name: 'Week 2', users: 300 },
      { name: 'Week 3', users: 400 },
    ],
  });

  const [form, setForm] = useState({ name: '', value: '' });

  const handleAddData = () => {
    if (!form.name || !form.value || isNaN(+form.value)) return;

    const newEntry: DataItem =
      selectedChart === 'chart2'
        ? { name: form.name, sales: +form.value }
        : selectedChart === 'chart4'
          ? { name: form.name, users: +form.value }
          : { name: form.name, value: +form.value };

    setData(prev => ({
      ...prev,
      [selectedChart]: [...prev[selectedChart], newEntry as any]
    }));

    setForm({ name: '', value: '' });
  };

  const handleRemoveData = (index: number) => {
    setData(prev => {
      const updated = [...prev[selectedChart]];
      updated.splice(index, 1);
      return {
        ...prev,
        [selectedChart]: updated as any,
      };
    });
  };

  const getValueLabel = (item: DataItem) => {
    if ('value' in item) return item.value;
    if ('sales' in item) return item.sales;
    if ('users' in item) return item.users;
    return '';
  };

  const renderChart = () => {
    const chart = data[selectedChart];

    switch (selectedChart) {
      case 'chart1':
        return (
          <LineChart width={500} height={300} data={chart}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" />
          </LineChart>
        );
      case 'chart2':
        return (
          <BarChart width={500} height={300} data={chart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#10b981" />
          </BarChart>
        );
      case 'chart3':
        return (
          <PieChart width={400} height={300}>
            <Pie
              data={chart}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chart.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'chart4':
        return (
          <LineChart width={500} height={300} data={chart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-[5em] font-bold mb-6 text-center">DATA X</h1>

      {/* Chart Selection */}
      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => setSelectedChart('chart1')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Line Chart</button>
        <button onClick={() => setSelectedChart('chart2')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Bar Chart</button>
        <button onClick={() => setSelectedChart('chart3')} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Pie Chart</button>
        <button onClick={() => setSelectedChart('chart4')} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Line Chart 2</button>
      </div>

      {/* Input Form */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-center">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border px-3 py-2 rounded w-48"
        />
        <input
          type="number"
          placeholder="Value"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          className="border px-3 py-2 rounded w-48"
        />
        <button
          onClick={handleAddData}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Add Data
        </button>
      </div>

      {/* Data List with Remove */}
      <div className="mb-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Current Data</h2>
        <ul className="inline-block text-left space-y-2">
          {data[selectedChart].map((item, index) => (
            <li key={index} className="flex items-center justify-between gap-4 border-b pb-1">
              <span>{item.name} - {getValueLabel(item)}</span>
              <button
                onClick={() => handleRemoveData(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chart Display */}
      <div className="flex justify-center">
        {renderChart()}
      </div>
    </div>
  );
};

export default App;

