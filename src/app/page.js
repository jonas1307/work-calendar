"use client";

import moment from "moment";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const holidays = (year) => {
  var epochDate = moment("18990101", "YYYYMMDD");
  return [
    {
      month: 1,
      day: 1,
      name: "Confraternização Universal",
      moment: moment(`${year}/01/01`, "YYYY/MM/DD"),
      epoch: moment(`${year}/01/01`, "YYYY/MM/DD").diff(epochDate, "days") + 1,
    },
    {
      month: 1,
      day: 25,
      name: "Aniversário de São Paulo",
      moment: moment(`${year}/01/25`, "YYYY/MM/DD"),
      epoch: moment(`${year}/01/25`, "YYYY/MM/DD").diff(epochDate, "days") + 1,
    },
    {
      month: 4,
      day: 20,
      name: "Tiradentes",
      moment: moment(`${year}/04/20`, "YYYY/MM/DD"),
      epoch: moment(`${year}/04/20`, "YYYY/MM/DD").diff(epochDate, "days") + 1,
    },
    {
      month: 5,
      day: 1,
      name: "Dia do Trabalho",
      moment: moment(`${year}/05/01`, "YYYY/MM/DD"),
      epoch: moment(`${year}/05/01`, "YYYY/MM/DD").diff(epochDate, "days") + 1,
    },
    {
      month: 9,
      day: 7,
      name: "Independência do Brasil",
      moment: moment(`${year}/09/07`, "YYYY/MM/DD"),
      epoch: moment(`${year}/09/07`, "YYYY/MM/DD").diff(epochDate, "days") + 1,
    },
    {
      month: 10,
      day: 12,
      name: "Nossa Senhora Aparecida",
      moment: moment(`${year}/10/12`, "YYYY/MM/DD"),
      epoch: moment(`${year}/10/12`, "YYYY/MM/DD").diff(epochDate, "days") + 1,
    },
    {
      month: 11,
      day: 2,
      name: "Finados",
      moment: moment(`${year}/11/02`, "YYYY/MM/DD"),
      epoch: moment(`${year}/11/02`, "YYYY/MM/DD").diff(epochDate, "days") + 1,
    },
    {
      month: 11,
      day: 15,
      name: "Proclamação da República",
      moment: moment(`${year}/11/15`, "YYYY/MM/DD"),
      epoch: moment(`${year}/11/15`, "YYYY/MM/DD").diff(epochDate, "days") + 1,
    },
    {
      month: 11,
      day: 20,
      name: "Consciência Negra",
      moment: moment(`${year}/11/20`, "YYYY/MM/DD"),
      epoch: moment(`${year}/11/20`, "YYYY/MM/DD").diff(epochDate, "days") + 1,
    },
    {
      month: 12,
      day: 25,
      name: "Natal",
      moment: moment(`${year}/12/25`, "YYYY/MM/DD"),
      epoch: moment(`${year}/12/25`, "YYYY/MM/DD").diff(epochDate, "days") + 1,
    },
  ];
};

const zeroPad = (num, places) => String(num).padStart(places, "0");

const calculateCalendar = (year, month) => {
  var daysInMonth = [
    31,
    year % 4 == 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  var daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  var monthIndex = month - 1;

  var monthArray = [];

  for (var i = 1; i <= daysInMonth[monthIndex]; i++) {
    var monthDate = moment(
      `${year}${zeroPad(month, 2)}${zeroPad(i, 2)}`,
      "YYYYMMDD"
    );

    var epochDate = moment("18990101", "YYYYMMDD");

    var daysSinceEpoch = monthDate.diff(epochDate, "days") + 1;

    var dayOfWeekIndex = daysSinceEpoch % 7;

    monthArray.push({
      epoch: daysSinceEpoch,
      dayOfWeek: daysOfWeek[dayOfWeekIndex],
      dayOfWeekIndex: dayOfWeekIndex,
      date: monthDate.date(),
    });
  }
  return monthArray;
};

const monthInfos = (year, month) => {
  const calendar = calculateCalendar(year, month);
  const hollidays = holidays(year).filter((x) => x.month === month);

  var weekDays = calendar.filter(
    (x) => x.dayOfWeekIndex > 0 && x.dayOfWeekIndex < 6
  );

  var weekendDays = calendar.filter(
    (x) => x.dayOfWeekIndex === 0 || x.dayOfWeekIndex === 6
  );

  const hollidaysInWeekdays = hollidays.map((x) =>
    weekDays.reduce((count, y) => {
      if (y.epoch === x.epoch) {
        return (count += 1);
      }
      return count;
    }, 0)
  );

  const hollidaysInWeekends = hollidays.map((x) =>
    weekendDays.reduce((count, y) => {
      if (y.epoch === x.epoch) {
        return (count += 1);
      }
      return count;
    }, 0)
  );

  return {
    totalDays: calendar.length,
    weekDays: weekDays.length,
    weekendDays: weekendDays.length,
    hollidays: hollidays.length,
    hollidaysInWeekdays: hollidaysInWeekdays.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ),
    hollidaysInWeekends: hollidaysInWeekends.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ),
  };
};

export default function Home() {
  let [month, setMonth] = useState(moment().month() + 1);
  let [year, setYear] = useState(moment().year());
  let [calendar, setCalendar] = useState([]);
  let [hollidays, setHollidays] = useState([]);
  let [infos, setInfos] = useState(null);
  let [displayDate, setDisplayDate] = useState("");

  useEffect(() => {
    const newDisplayDate = moment(
      `${year}${zeroPad(month, 2)}01`,
      "YYYYMMDD"
    ).format("MMMM YYYY");

    setDisplayDate(newDisplayDate);
    setCalendar(calculateCalendar(year, month));
    setInfos(monthInfos(year, month));
    setHollidays(holidays(year).filter((x) => x.month === month));
  }, [month, year]);

  function currentMonth() {
    setMonth(moment().month());
    setYear(moment().year());
  }

  function changeMonth(increment) {
    var currentMonth = month + increment;
    var currentYear = year;

    if (currentMonth < 1) {
      currentMonth = 12;
      currentYear -= 1;
    }

    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear += 1;
    }

    setMonth(currentMonth);
    setYear(currentYear);
  }

  return (
    <main className="min-h-screen items-center px-2 lg:mx-8 mx-auto">
      <div className="flex justify-between flex-col-reverse py-2 lg:flex-row gap-y-1 lg:gap-y-0 items-center mb-4">
        <h1 className="font-bold text-4xl">{displayDate}</h1>

        <div className="flex gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => changeMonth(-1)}
          >
            Previous
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => currentMonth()}
          >
            Current
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => changeMonth(1)}
          >
            Next
          </button>
        </div>
      </div>
      <div>
        {infos !== null && (
          <div className="mb-4">
            <p>Days in month: {infos.totalDays}</p>
            <p>Working days: {infos.weekDays - infos.hollidaysInWeekdays}</p>
            <p>Week days: {infos.weekDays}</p>
            <p>Weekend days: {infos.weekendDays}</p>
            <p>Hollidays during the week: {infos.hollidaysInWeekdays}</p>
            <p>Hollidays during the weekend: {infos.hollidaysInWeekends}</p>
          </div>
        )}
        {hollidays.length > 0 && (
          <div>
            <h1 className="mb-2 font-bold text-xl">Next hollidays</h1>
            {hollidays.map((x) => (
              <p key={uuidv4()}>
                {x.moment.format("DD/MM/YYYY - dddd")} - {x.name}
              </p>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
