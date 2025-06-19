import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays, format } from 'date-fns';
//import './Heatmap.css'; // Optional custom styles

const Heatmap = ({ data }) => {
  // Aggregate submission counts per day
  const countsByDate = {};

  data.forEach((item) => {
    const day = format(new Date(item.date), 'yyyy-MM-dd');
    countsByDate[day] = (countsByDate[day] || 0) + 1;
  });

  // Transform into heatmap format
  const values = Object.entries(countsByDate).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
      <CalendarHeatmap
        startDate={subDays(new Date(), 365)}
        endDate={new Date()}
        values={values}
        classForValue={(value) => {
          if (!value) return 'color-empty';
          if (value.count >= 5) return 'color-github-4';
          if (value.count >= 3) return 'color-github-3';
          if (value.count >= 2) return 'color-github-2';
          return 'color-github-1';
        }}
        showWeekdayLabels
      />
    </div>
  );
};

export default Heatmap;
