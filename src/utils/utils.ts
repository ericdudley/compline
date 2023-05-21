// src/utils/util.ts

import { Compensation } from "../components/CompensationItem";
import {
  addMonths,
  addYears,
  addQuarters,
  isWithinInterval,
  startOfDay,
} from "date-fns";

interface CompensationEvent {
  date: Date;
  amount: number;
}

type DateRange = { startDate: Date; endDate: Date };

export const generateCompensationEvents = (
  compensationItems: Compensation[],
  dateRange: DateRange
): CompensationEvent[] => {
  let compensationEvents: CompensationEvent[] = [];

  for (const item of compensationItems) {
    let currentDate;
    switch (item.type) {
      case "one-time":
        if (
          isWithinInterval(item.startDate, {
            start: dateRange.startDate,
            end: dateRange.endDate,
          })
        ) {
          compensationEvents.push({
            date: startOfDay(item.startDate),
            amount: item.amount,
          });
        }
        break;
      case "monthly":
        currentDate = new Date(item.startDate);
        while (currentDate <= dateRange.endDate) {
          if (
            isWithinInterval(currentDate, {
              start: dateRange.startDate,
              end: dateRange.endDate,
            })
          ) {
            compensationEvents.push({
              date: startOfDay(currentDate),
              amount: item.amount,
            });
          }
          currentDate = addMonths(currentDate, 1);
        }
        break;
      case "quarterly":
        currentDate = new Date(item.startDate);
        while (currentDate <= dateRange.endDate) {
          if (
            isWithinInterval(currentDate, {
              start: dateRange.startDate,
              end: dateRange.endDate,
            })
          ) {
            compensationEvents.push({
              date: startOfDay(currentDate),
              amount: item.amount,
            });
          }
          currentDate = addQuarters(currentDate, 1);
        }
        break;
      case "annually":
        currentDate = new Date(item.startDate);
        while (currentDate <= dateRange.endDate) {
          if (
            isWithinInterval(currentDate, {
              start: dateRange.startDate,
              end: dateRange.endDate,
            })
          ) {
            compensationEvents.push({
              date: startOfDay(currentDate),
              amount: item.amount,
            });
          }
          currentDate = addYears(currentDate, 1);
        }
        break;
      default:
        break;
    }
  }

  compensationEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

  return compensationEvents;
};

export const generateTrailingCompensation = (
  compensationEvents: CompensationEvent[],
  dateRange: DateRange,
  sampleNumber: number
): number[] => {
  const interval =
    (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
    sampleNumber;

  let currentDate = new Date(dateRange.startDate.getTime());
  const trailingTotals: number[] = [];

  for (let i = 0; i < sampleNumber; i++) {
    const trailingDateRange = {
      start: addYears(currentDate, -1),
      end: currentDate,
    };
    const eventsInTrailingYear = compensationEvents.filter((event) =>
      isWithinInterval(event.date, trailingDateRange)
    );
    const total = eventsInTrailingYear.reduce(
      (sum, event) => sum + event.amount,
      0
    );

    trailingTotals.push(total);
    currentDate = new Date(currentDate.getTime() + interval);
  }

  return trailingTotals;
};
