import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

export const BudgetDoughnut = ({ needs, savings, wants }) => {
  const data = {
    labels: ["Necesidades (50%)", "Ahorro (20%)", "Gastos/Gustos (30%)"],
    datasets: [
      {
        data: [needs, savings, wants],
        backgroundColor: ["#F4B942", "#2D9E6B", "#C23616"],
        borderColor: "#251A14",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#F7E9DA", font: { family: "Nunito", size: 12 } },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-48 w-full">
      <Doughnut data={data} options={options} />
    </div>
  );
};