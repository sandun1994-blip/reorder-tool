"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options: any = {
  responsive: true,
  showAllTooltips: true,
  plugins: {
    legend: {
      position: "top" as const,
      display: false,
    },
    title: {
      display: true,
      text: "Last 6 Month Sales",
    },
    tooltip: {
      titleFontSize: 20,
      borderWidth: 2,
      backgroundColor: "black",
    },
  },
  datalabels: {
    color: "black",
    labels: {
      title: {
        text: "UNITS",
        display: true,
        font: {
          weight: "",
          size: 10,
          color: "green",
        },
        position: "right",
        value: {
          color: "green",
        },
      },
    },
    hover: {
      mode: "label",
    },

    tooltip: {
      trigger: "axis",
      axisPointer: {
        lineStyle: {
          color: "white",
        },
      },
    },
  },
  scales: {
    yAxes: {
      type: "linear",

      position: "right",

      font: {
        weight: "bold",
        size: 12,
      },
      title: {
        display: true,
        text: "Units",
      },
      ticks: {
        color: "black",
        source: "labels",
      },
    },
  },
};

const labels = [
  "sales0",
  "sales1",
  "sales2",
  "sales3",
  "sales4",
  "sales5",
  "sales6",
];

export function LineChartCom({ chartdata }: { chartdata: number[] }) {


  
  const data = {
    labels,
    datasets: [
      {
        // label: "Last 6 Month Sales ",
        borderColor: "#00FF00",
        data: chartdata,
        fill: true,
        radius: 5,
        tension: 0,
        pointRadius: 3,
        borderWidth: 2,
        backgroundColor: (ctx: any) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 450);

          gradient.addColorStop(0, "rgba(0,255,0, 0.5)");
          gradient.addColorStop(0.5, "rgba(0,255,0, 0.25)");
          gradient.addColorStop(1, "rgba(0,255,0, 0)");

          return gradient;
        },
      },
    ],
  };

  return <Line options={options} data={data} />;
}
