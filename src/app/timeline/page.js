"use client";
import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import Link from "next/link";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";


const Timeline = () => {
  const [users, setUsers] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [dayWidth, setDayWidth] = useState(120);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysToShow, setDaysToShow] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/task.json");
        if (!response.ok) throw new Error("Failed to fetch data");
        const jsonData = await response.json();
        setUsers(jsonData.Timeline_Data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;
      setDayWidth(width < 640 ? 80 : width < 1024 ? 100 : 120);
      setIsSmallScreen(width < 640);
    };

    if (typeof window !== "undefined") {
      updateWidth();
      window.addEventListener("resize", updateWidth);
    }

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const changeMonth = (offset) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const getFirstDayOfMonth = () => {
    let date = new Date(currentMonth);
    date.setDate(1);
    return date;
  };

  const getNextValidDate = (startDate, daysToAdd) => {
    let date = new Date(startDate);
    date.setDate(date.getDate() + daysToAdd);
    return date;
  };

  const timelineStartDate = getFirstDayOfMonth();
  const monthName = currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className={`h-full ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
          <h2>
            <Link href="/" className="text-blue-400">Home</Link>
          </h2>
          <div className="flex gap-2 items-center">
            <button onClick={() => changeMonth(-1)} className="p-2 bg-gray-700 text-white rounded">
              <GrFormPrevious size={20} />
            </button>
            <span className="text-lg font-bold">{monthName}</span>
            <button onClick={() => changeMonth(1)} className="p-2 bg-gray-700 text-white rounded">
              <GrFormNext size={20} />
            </button>
            <button onClick={toggleDarkMode} className="p-2 rounded-full focus:outline-none">
              {darkMode ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-gray-700" />}
            </button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row">
          <div className={`hidden mt-12 sm:block ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"} p-4 rounded-md w-auto`}>
            {users.map((user) => (
              <div key={user.id} className="text-sm font-medium mb-8 md:mb-24">
                <p>{user.name}</p>
              </div>
            ))}
          </div>

          <div className="relative min-h-[700px] h-full flex-1 overflow-x-auto overflow-y-auto border border-gray-600 rounded-lg">
            <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"} relative top-0 z-20 flex min-w-max border-b border-gray-600`}>
              {[...Array(daysToShow)].map((_, index) => {
                const baseDate = getNextValidDate(timelineStartDate, index);
                const day = baseDate.toLocaleDateString("en-US", { weekday: "short" });
                const dateNumber = baseDate.getDate();
                const key = `${baseDate.getFullYear()}-${baseDate.getMonth()}-${dateNumber}`;

                return (
                  <div key={key} className="p-2 border-r border-gray-600 text-center " style={{ minWidth: `${dayWidth}px` }}>
                    <h2 className="text-xs sm:text-sm md:text-lg font-semibold">{`${day} ${dateNumber}`}</h2>
                  </div>
                );
              })}
            </div>

            <div className="relative w-full min-w-[900px] h-[800px] pt-8 border-t border-gray-600">
              {users.map((user, userIndex) => (
                <div key={user.id} className="relative">
                  {user.tasks.map((task, taskIndex) => {
                    const taskStartDate = new Date(task.startDate);
                    const taskEndDate = new Date(task.endDate);
                    const taskDays = Math.round((taskEndDate - taskStartDate) / (1000 * 60 * 60 * 24)) + 1;
                    const startDayIndex = Math.round((taskStartDate - timelineStartDate) / (1000 * 60 * 60 * 24));

                    const taskLeftOffset = startDayIndex * dayWidth;
                    const taskWidth = isSmallScreen ? dayWidth : taskDays * dayWidth;

                    return (
                      <div key={`${user.id}-${taskIndex}`} className="absolute p-2 m-1 rounded text-center shadow-md text-white text-xs sm:text-sm" style={{ backgroundColor: task.color, left: `${taskLeftOffset}px`, width: `${taskWidth}px`, top: `${userIndex * 130 + taskIndex * 40}px` }}>
                        <div className="block sm:hidden text-[10px] font-semibold mb-1">{user.name}</div>
                        <div>{task.title}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;