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
import { useAuth } from "@/contexts/authentication-context"
import { useQuery } from "@tanstack/react-query"
import { getClassPerformance } from "@/services/teacher/teacherService"
// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export function ClassPerformanceChart() {
  const { currentUser, getAuthHeader } = useAuth()
  const { data: classDataRaw, isPending, error } = useQuery({
    queryKey: ["classPerformance", currentUser?.userId],
    queryFn: () => getClassPerformance(currentUser?.userId, getAuthHeader()),
    enabled: !!currentUser?.userId,
  })

  // Ensure classData is always an array
  const classData = Array.isArray(classDataRaw) ? classDataRaw : []

  const labels = classData.map(item => item.assessmentType)
  const data = {
    labels,
    datasets: [
      {
        label: "Class Average",
        data: classData.map(item => item.overallAverage),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        tension: 0.3,
      },
      {
        label: "Top 25%",
        data: classData.map(item => item.topQuartileAverage),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.3,
      },
      {
        label: "Bottom 25%",
        data: classData.map(item => item.bottomQuartileAverage),
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