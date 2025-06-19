import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const getBucketedData = (data) => {
  const buckets = {};
  data.forEach(sub => {
    const bucket = `${Math.floor(sub.rating / 200) * 200}`;
    buckets[bucket] = (buckets[bucket] || 0) + 1;
  });

  return Object.entries(buckets).map(([rating, count]) => ({
    rating: `${rating}+`,
    count
  }));
};

const RatingBarChart = ({ data }) => {
  const chartData = getBucketedData(data);

  return (
    <BarChart width={500} height={300} data={chartData}>
      <XAxis dataKey="rating" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
  );
};

export default RatingBarChart;
