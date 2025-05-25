import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/authentication-context"
import { useState } from "react"
import { getTeacherGradeDistribution } from "@/services/teacher/teacherService"
// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function GradeDistributionChart() {
  const { currentUser, getAuthHeader } = useAuth()
  const { data: gradesData, isPending, error } = useQuery({
    queryKey: ["teacherGradeDistribution", currentUser?.userId],
    queryFn: () => getTeacherGradeDistribution(currentUser?.userId, getAuthHeader()),
    enabled: !!currentUser?.userId,
  })
  const labels = ["A", "B", "C", "D", "F"]
  const data = {
    labels,
    datasets: [
      {
        label: "Number of Students",
        data: labels.map((grade) => gradesData?.[grade] ?? 0),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Students",
        },
      },
    },
  }

  return <Bar options={options} data={data} height={300} />
}
