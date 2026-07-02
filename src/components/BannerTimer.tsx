"use client";

import React, { useRef, useState, useEffect } from "react";
import { animate, spring, stagger, splitText, cubicBezier } from "animejs";


interface BannerTimerProps {
  startDate?: string;
  endDate?: string;
  title?: string;
  className?: string;
}

export const BannerTimer: React.FC<BannerTimerProps> = ({
  startDate = "2025-11-04T22:00:00-05:00",
  endDate = "2025-11-04T22:00:00-05:00",
  title = "Banner",
  className,
}) => {
  const daysRef = useRef<HTMLSpanElement>(null);
  const hoursRef = useRef<HTMLSpanElement>(null);
  const minutesRef = useRef<HTMLSpanElement>(null);
  const secondsRef = useRef<HTMLSpanElement>(null);

  const titleRef = useRef<HTMLSpanElement>(null);

  const [label, setLabel] = useState("Loading");
  const [dateText, setDateText] = useState("...");
  const previousValuesRef = useRef({ d: -1, h: -1, m: -1, s: -1 });

  const setDisplay = (d: number, h: number, m: number, s: number) => {
    if (d !== previousValuesRef.current.d && daysRef.current) {
      daysRef.current.textContent = d.toString().padStart(2, "0");
      const { chars: charsDays } = splitText(daysRef.current, { chars: true });

      animate(charsDays, {
        rotateX: 360,
        opacity: [
          { to: ["0%", "90%"], ease: cubicBezier(0.367, 0.446, 0.726, 1.058) },
        ],
        duration: 500,
        ease: spring({ bounce: 0.74, duration: 422 }),
        loop: false,
      });
    }

    if (h !== previousValuesRef.current.h && hoursRef.current) {
      hoursRef.current.textContent = h.toString().padStart(2, "0");
      const { chars: charsHours } = splitText(hoursRef.current, {
        chars: true,
      });

      animate(charsHours, {
        rotateX: 360,
        opacity: [
          { to: ["0%", "90%"], ease: cubicBezier(0.367, 0.446, 0.726, 1.058) },
        ],
        duration: 500,
        ease: spring({ bounce: 0.74, duration: 422 }),
        loop: false,
      });
    }

    if (m !== previousValuesRef.current.m && minutesRef.current) {
      minutesRef.current.textContent = m.toString().padStart(2, "0");
      const { chars: charsMin } = splitText(minutesRef.current, {
        chars: true,
      });

      animate(charsMin, {
        rotateX: 360,
        opacity: [
          { to: ["0%", "90%"], ease: cubicBezier(0.367, 0.446, 0.726, 1.058) },
        ],
        duration: 300,
        ease: spring({ bounce: 0.74, duration: 422 }),
        loop: false,
      });
    }

    if (s !== previousValuesRef.current.s && secondsRef.current) {
      secondsRef.current.textContent = s.toString().padStart(2, "0");
      const { chars: charsSec } = splitText(secondsRef.current, {
        chars: true,
      });

      animate(charsSec, {
        rotateX: 360,
        opacity: [
          { to: ["0%", "90%"], ease: cubicBezier(0.367, 0.446, 0.726, 1.058) },
        ],
        duration: 300,
        delay: stagger(35),
        ease: spring({ bounce: 0.74, duration: 422 }),
        loop: true,
      });
    }

    previousValuesRef.current = { d, h, m, s };
  };

  const updateDisplay = (distance: number) => {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setDisplay(days, hours, minutes, seconds);
  };

  const updateTimer = () => {
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    const now = new Date().getTime();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const abrv = new Date()
      .toLocaleTimeString("en-US", {
        timeZoneName: "short",
      })
      .split(" ")
      .pop();

    if (now < startMs) {
      const distance = startMs - now;
      setLabel("Starts:");
      setDateText(
        new Date(startMs).toLocaleString("en-US", {
          hour12: false,
          timeZone: tz,
        }) + ` (${abrv})`,
      );
      updateDisplay(distance);
    } else if (now >= startMs && now < endMs) {
      const distance = endMs - now;
      setLabel("Ends:");
      setDateText(
        new Date(endMs).toLocaleString("en-US", {
          hour12: false,
          timeZone: tz,
        }) + ` (${abrv})`,
      );
      updateDisplay(distance);
    } else {
      setLabel("Ended:");
      setDateText(
        new Date(endMs).toLocaleString("en-US", {
          hour12: false,
          timeZone: tz,
        }) + ` (${abrv})`,
      );
      setDisplay(0, 0, 0, 0);
    }
  };

  useEffect(() => {
    updateTimer();
    const interval = window.setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return (
    <div className="justify-center flex flex-col ">
      <span
        ref={titleRef}
        id="Timer-title"
        className="text-4xl text-center text-ksecondarylight  mb-3"
      >
        {title}
      </span>
      <div className="text-center">
        <div className="inline-flex flex-row justify-center items-center gap-2 mb-3 bg-kprimarylight rounded-md px-3 py-1">
          <span id="Start-End" className="text-ksecondarylight  text-sm">
            {label}
          </span>
          <span id="Timer-Date" className="text-ksecondarylight  text-sm">
            {dateText}
          </span>
        </div>

        <div className="flex justify-center space-x-2">
          <div className="flex flex-col items-center">
            <span
              ref={daysRef}
              id="Timer-days"
              className="text-ksecondarylight  bg-kprimarylight rounded font-bold px-2 py-1 text-sm"
            >
              06
            </span>
            <span className="text-xs text-ksecondarylight  mt-0.5">D</span>
          </div>
          <span className="text-ksecondarylight  font-bold self-center">:</span>
          <div className="flex flex-col items-center">
            <span
              ref={hoursRef}
              id="Timer-hours"
              className="text-ksecondarylight  bg-kprimarylight rounded font-bold px-2 py-1 text-sm"
            >
              09
            </span>
            <span className="text-xs text-ksecondarylight  mt-0.5">H</span>
          </div>
          <span className="text-ksecondarylight  font-bold self-center">:</span>
          <div className="flex flex-col items-center">
            <span
              ref={minutesRef}
              id="Timer-minutes"
              className="text-ksecondarylight  bg-kprimarylight rounded font-bold px-2 py-1 text-sm"
            >
              45
            </span>
            <span className="text-xs text-ksecondarylight  mt-0.5">M</span>
          </div>
          <span className="text-ksecondarylight  font-bold self-center">:</span>
          <div className="flex flex-col items-center">
            <span
              ref={secondsRef}
              id="Timer-seconds"
              className="text-ksecondarylight  bg-kprimarylight rounded font-bold px-2 py-1 text-sm"
            >
              23
            </span>
            <span className="text-xs text-ksecondarylight  mt-0.5">S</span>
          </div>
        </div>
      </div>
    </div>
  );
};
