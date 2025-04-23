import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export function ClassPerformanceChart() {
  const data = {
    labels: ["Quiz 1", "Assignment 1", "Midterm", "Quiz 2", "Assignment 2", "Project", "Final Exam"],
    datasets: [
      {
        label: "Class Average",
        data: [78, 82, 76, 80, 85, 88, 83],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        tension: 0.3,
      },
      {
        label: "Top 25%",
        data: [92, 94, 90, 93, 95, 97, 94],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.3,
      },
      {
        label: "Bottom 25%",
        data: [65, 68, 62, 67, 70, 72, 68],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.3,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 50,
        max: 100,
        title: {
          display: true,
          text: "Score (%)",
        },
      },
    },
  }

  return <Line options={options} data={data} height={300} />
}
