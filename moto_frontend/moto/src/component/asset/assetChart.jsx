import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import createInstance from "../../axios/Interceptor";

export default function AssetChart({ assetCode }) {
  const [chartData, setChartData] = useState([]);

  useEffect(function() {
    const axiosInstance = createInstance();
    const serverUrl = import.meta.env.VITE_BACK_SERVER; //http://localhost:9999

    const options={};
    options.url = serverUrl + "/asset/chart?assetCode=" + encodeURIComponent(assetCode);
    options.method = 'get';

    axiosInstance(options)
      .then(function(res) {
        const closePrices = res.data.resData; // [가격, 가격, 가격...]
        const formatted = closePrices.map((p, idx) => ({ time: idx, price: p }));
        setChartData(formatted);
      });
  }, [assetCode]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis dataKey="time" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}