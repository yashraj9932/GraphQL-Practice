import { Bar } from "react-chartjs-2";

const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 500,
  },
  Normal: {
    min: 500,
    max: 1000,
  },
  Expensive: {
    min: 1000,
    max: 10000000,
  },
};

const bookingsChart = (props) => {
  const chartData = { labels: [], datasets: [] };
  let values = [];
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      console.log(current);

      if (
        current.event.price > BOOKINGS_BUCKETS[bucket].min &&
        current.event.price < BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      // label: "My First dataset",
      fillColor: "rgba(220,220,220,0.5)",
      strokeColor: "rgba(220,220,220,0.8)",
      highlightFill: "rgba(220,220,220,0.75)",
      highlightStroke: "rgba(220,220,220,1)",
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Bar data={chartData} />
    </div>
  );
};

export default bookingsChart;
