import React, { useEffect, useState } from "react"; 
import { createClient } from "@supabase/supabase-js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [liveLevel, setLiveLevel] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch the latest water level live (poll every 5s)
  useEffect(() => {
    async function fetchLatest() {
      const { data, error } = await supabase
        .from("water_levels")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1);

      if (!error && data.length > 0) {
        setLiveLevel(data[0].level);
      }
    }

    fetchLatest();
    const interval = setInterval(fetchLatest, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch history once on mount (last 20 readings)
  useEffect(() => {
    async function fetchHistory() {
      const { data, error } = await supabase
        .from("water_levels")
        .select("*")
        .order("timestamp", { ascending: true })
        .limit(20);

      if (!error) {
        const formatted = data.map((d) => ({
          ...d,
          time: new Date(d.timestamp).toLocaleTimeString(),
        }));
        setHistory(formatted);
      }
    }

    fetchHistory();
  }, []);

  return (
    <div className="container">
      <h1>Water Tank Level Monitor</h1>

      <div className="live-value">
        Live Water Level: {liveLevel !== null ? liveLevel.toFixed(2) + " cm" : "Loading..."}
      </div>

      <h2>History (Last 20 readings)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="level" stroke="#007acc" />
        </LineChart>
      </ResponsiveContainer>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Water Level (cm)</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
                <td>{item.level.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
