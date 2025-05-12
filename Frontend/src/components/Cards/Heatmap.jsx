import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const Heatmap = () => {
  const [heatMapData, setHeatMapData] = useState([]);
  const [codeforcesData, setCodeforcesData] = useState([]);
  const [codechefData, setCodechefData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchCodeforcesData = async () => {
    try {
      const response = await axios.get('https://codeforces.com/api/user.status?handle=nagendra_bh');
      setCodeforcesData(response.data.result);
    } catch (error) {
      console.error('Error fetching Codeforces data', error);
    }
  };

  const fetchCodechefData = async () => {
    try {
      const response = await axios.get('https://codechef-api.vercel.app/handle/nagendra004');
      setCodechefData(response.data.heatMap);
    } catch (error) {
      console.error('Error fetching CodeChef data', error);
    }
  };

  useEffect(() => {
    fetchCodeforcesData();
    fetchCodechefData();
  }, []);

  useEffect(() => {
    if (codeforcesData.length > 0 || codechefData.length > 0) {
      const combinedData = [];
      codeforcesData.forEach((contest) => {
        const date = new Date(contest.creationTimeSeconds * 1000);
        const dateString = date.toISOString().split('T')[0];
        combinedData.push({ date: dateString, value: 1 });
      });
      codechefData.forEach((entry) => {
        combinedData.push({ date: entry.date, value: 1 });
      });
      setHeatMapData(combinedData);
    }
  }, [codeforcesData, codechefData]);

  const handleYearChange = (event) => {
    setYear(Number(event.target.value));
  };

  const endDate = new Date();
  const startDate = new Date(new Date().getFullYear(), 0, 2);

  return (
    <div className="heatmap-container bg-[#212124] p-5 rounded-lg">
      <h2 className="text-white text-xl mb-2">Coding Activity Heatmap</h2>
      <select onChange={handleYearChange} className="bg-[#333] text-white p-2 rounded mb-4">
        <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
        <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
      </select>

      <CalendarHeatmap
        startDate={new Date(year, 0, 1)}
        endDate={new Date(year, 11, 31)}
        values={heatMapData.map(({ date, value }) => ({ date: new Date(date), count: value }))}
        showMonthLabels={true}
        showWeekdayLabels={true}
        classForValue={(value) => {
          if (!value) return 'color-empty';
          return `color-scale-${Math.min(value.count, 4)}`;
        }}
        className="bg-[#212124]"
      />
      <style jsx>{`
        .heatmap-container { background: #212124; border-radius: 8px; }
        .color-empty { fill: #111112; }
        .color-scale-0 { fill: #006400; }
        .color-scale-1 { fill: #228B22; }
        .color-scale-2 { fill: #32CD32; }
        .color-scale-3 { fill: #7CFC00; }
        .color-scale-4 { fill: #ADFF2F; }
        select { margin-bottom: 10px; }
      `}</style>
    </div>
  );
};

export default Heatmap;