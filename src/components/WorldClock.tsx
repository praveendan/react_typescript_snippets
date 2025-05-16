import React, { useEffect, useState } from "react";

type DateTime = {
  date: string;
  time: string;
};

type ClockProps = {
  headerProps?: React.ComponentPropsWithoutRef<"p">;
  dateProps?: React.ComponentPropsWithoutRef<"p">;
  timeProps?: React.ComponentPropsWithoutRef<"p">;
  text: string;
  gmtOffset: number;
  isDSTObserved?: boolean;
};

const MILISECONDS_IN_MIN = 60000;

/**
 *
 * @param dateTimeString a string in the format dd/mm/yyyy, hh:mm:ss
 * @param dateString a string in the format Fri 2 May
 * @returns
 */
const calcDST = (dateTimeString: string, dateString: string) => {
  const MAR = 3;
  const NOV = 11;
  const DST_CUTOFF = 2; // 2 AM
  const NUM_WEEK_DAYS = 7;
  const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  let isDst = false;
  const dayOfTheWeek = dateString.split(" ")[0];

  const [date, time] = dateTimeString.split(",");
  const dateArr = date.split("/");
  const dateNum = +dateArr[0];
  const monthNum = +dateArr[1];

  const timeArr = time.split(":");
  let hours = +timeArr[0];

  // if between Nov and march, It's DST
  if (MAR < monthNum && monthNum < NOV) {
    return true;
  }

  // before first sunday of november
  if (monthNum === NOV && dateNum <= NUM_WEEK_DAYS) {
    // could fall before the first sunday
    if (dayOfTheWeek.toLowerCase() === WEEKDAYS[0] && hours <= DST_CUTOFF) {
      // definitely first sunday; Check the Time to see if it's before 2:00AM
      return true;
    } else if (dateNum < WEEKDAYS.indexOf(dayOfTheWeek) + 1) {
      //the date is before the first sunday
      //DST + 1
      return true;
    }
  }

  // after second sunday of march
  if (monthNum === MAR) {
    if (NUM_WEEK_DAYS * 2 < dateNum) {
      //definitely after 2nd sunday
      return true;
    } else if (NUM_WEEK_DAYS < dateNum && dateNum < NUM_WEEK_DAYS * 2 + 1) {
      // between 7th and 15th of march
      if (dayOfTheWeek.toLowerCase() === WEEKDAYS[0] && DST_CUTOFF <= hours) {
        // definitely second sunday; Check the Time to see if it's after 2:00AM
        return true;
      }
      if (WEEKDAYS.indexOf(dayOfTheWeek) + 1 <= dateNum - NUM_WEEK_DAYS) {
        //the date is after the second sunday
        return true;
      }
    }
  }

  return isDst;
};

/**
 *
 * @param offset number for the GMT offset. ex: LK gmt is 5:30. this is represented as 5.5
 * @returns Formatted time and date
 */
const calculateDateTimeOnGMTOffset = (
  offset: number,
  isDSTObserved: boolean
) => {
  const LOCALE = "en-GB";
  const MILISECONDS_IN_HOUR = 3600000;
  // Get current UTC time in milliseconds
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * MILISECONDS_IN_MIN;

  // Create new date with the offset
  const adjustedTime = new Date(utc + MILISECONDS_IN_HOUR * offset);

  const dateString = adjustedTime
    .toLocaleDateString(LOCALE, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    .replace(",", "");

  // datetime string will be in dd/MM/yyyy, hh:mm:ss
  const dateTimeString = adjustedTime.toLocaleString(LOCALE);

  let isDst = false;
  if (isDSTObserved) {
    isDst = calcDST(dateTimeString, dateString);
  }

  const dateTimeArr = dateTimeString.split(", ");
  const timeArr = dateTimeArr[1].split(":");
  const hh = `${+timeArr[0] + (isDst ? 1 : 0)}`.padStart(2, "0");
  const mm = timeArr[1].padStart(2, "0");

  return {
    date: dateString,
    time: `${hh}:${mm}`,
  };
};

/**
 * This is a simple Clock component that calculates the current time
 * based on the GMT offset given. the offset is a number.
 * ex: LK: 5.5
 */
const WorldClock: React.FC<ClockProps> = ({
  headerProps,
  dateProps,
  timeProps,
  text,
  gmtOffset,
  isDSTObserved = false,
}) => {
  const MILLIS_SEC = 1000;
  const [currentDateTime, setCurrentDateTime] = useState<DateTime>({
    date: "",
    time: "",
  });

  useEffect(() => {
    // initial time setup
    setCurrentDateTime(calculateDateTimeOnGMTOffset(gmtOffset, isDSTObserved));

    let timer: number | undefined;
    const now = new Date();
    const seconds = now.getSeconds();

    // Synchronize timer with the system clock
    const initTimer = setTimeout((_) => {
      setCurrentDateTime(
        calculateDateTimeOnGMTOffset(gmtOffset, isDSTObserved)
      );

      // timer setup
      timer = setInterval((_) => {
        setCurrentDateTime(
          calculateDateTimeOnGMTOffset(gmtOffset, isDSTObserved)
        );
      }, MILISECONDS_IN_MIN);
    }, MILISECONDS_IN_MIN - seconds * MILLIS_SEC);

    return () => {
      clearTimeout(initTimer);
      clearInterval(timer);
    };
  }, []);
  return (
    <>
      <p tabIndex={0} aria-label={text} {...headerProps}>
        {text}
      </p>
      <p tabIndex={0} aria-label={currentDateTime.date} {...dateProps}>
        {currentDateTime.date}
      </p>
      <p tabIndex={0} aria-label={currentDateTime.time} {...timeProps}>
        {currentDateTime.time}
      </p>
    </>
  );
};

export default WorldClock;
