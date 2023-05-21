// src/components/CompensationChart.tsx

import React, { useState } from "react";
import {
  generateTrailingCompensation,
  generateCompensationEvents,
} from "../utils/utils";
import { Compensation } from "./CompensationItem";
import { Line } from "react-chartjs-2";
import { startOfDay, formatISO, addYears } from "date-fns";

import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
Chart.register(...registerables);

type Props = {
  compensationItems: Compensation[];
};

export const CompensationChart: React.FC<Props> = ({ compensationItems }) => {
  const [autoDateRange, setAutoDateRange] = useState(true);
  const [startDate, setStartDate] = useState(addYears(new Date(), -1));
  const [endDate, setEndDate] = useState(new Date());

  const events = generateCompensationEvents(compensationItems, {
    startDate,
    endDate,
  });

  console.log(startDate, endDate);
  const data = {
    labels: events.map((event) => event.date.toISOString().split("T")[0]),
    datasets: [
      {
        label: "12 Month Trailing Compensation",
        data: generateTrailingCompensation(
          events,
          { startDate, endDate },
          events.length
        ),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  console.log(events);

  const handleAutoDateRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAutoDateRange(e.target.checked);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(startOfDay(new Date(e.target.value)));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(startOfDay(new Date(e.target.value)));
  };

  return (
    <div>
      <div className="my-4">
        <input
          type="checkbox"
          id="autoDateRange"
          checked={autoDateRange}
          onChange={handleAutoDateRangeChange}
        />
        <label htmlFor="autoDateRange">Auto Date Range</label>
      </div>

      {!autoDateRange && (
        <div className="my-4">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={formatISO(startDate, { representation: "date" })}
            onChange={handleStartDateChange}
          />
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={formatISO(endDate, { representation: "date" })}
            onChange={handleEndDateChange}
          />
        </div>
      )}

      <Line
        data={data}
        options={{
          scales: {
            x: {
              type: "time",
              time: {
                unit: "month",
              },
            },
            y: {
              type: "linear",
              ticks: {
                callback: function (value, _index, _values) {
                  return "$" + value;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};
