"use client";
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaMoon, FaSun } from 'react-icons/fa';
import Link from 'next/link';

const Timeline = () => {
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [timelineInterval, setTimelineInterval] = useState('week');

  useEffect(() => {
    const dummyTasks = [
      { id: 1, title: 'Complete Project Proposal', dueDate: '2023-06-15', completed: false },
      { id: 2, title: 'Team Meeting', dueDate: '2023-06-18', completed: false },
      { id: 3, title: 'Submit Progress Report', dueDate: '2023-06-20', completed: true },
    ];
    setTasks(dummyTasks);
  }, []);

  const formatDateWithDay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', year: 'numeric', month: 'short' });
  };

  const addTask = () => {
    const newTask = {
      id: tasks.length + 1,
      title: 'New Task',
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const editTask = (id) => {
    console.log('Edit task', id);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const changeTimelineInterval = (interval) => {
    setTimelineInterval(interval);
  };

  const getNextMonday = () => {
    let date = new Date();
    date.setDate(date.getDate() + ((1 + 7 - date.getDay()) % 7 || 7));
    return date;
  };

  const getNextValidDate = (startDate, daysToAdd) => {
    let date = new Date(startDate);
    while (daysToAdd > 0) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        daysToAdd--;
      }
    }
    return date;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}> 
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Timeline</h1>
          <h2><Link href="/">home</Link></h2>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-gray-700" />}
          </button>
        </header>

        <div className="mb-4">
          <label htmlFor="timelineInterval" className="mr-2">Timeline Interval:</label>
          <select
            id="timelineInterval"
            value={timelineInterval}
            onChange={(e) => changeTimelineInterval(e.target.value)}
            className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black">
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, index) => {
            const baseDate = getNextValidDate(getNextMonday(), index);
            const day = baseDate.toLocaleDateString('en-US', { weekday: 'long' });
            const dateNumber = String(baseDate.getDate()).padStart(2, '0');
            return (
              <div key={dateNumber} className={`p-4 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <h2 className="text-lg font-semibold mb-2">{`${day} ${dateNumber}`}</h2>
              </div>
            );
          })}
        </div>

        <div className=" text-white shadow">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-2">
            {[...Array(5)].map((_, index) => {
              const baseDate = getNextValidDate(getNextMonday(), index + 5);
              const day = baseDate.toLocaleDateString('en-US', { weekday: 'long' });
              const dateNumber = String(baseDate.getDate()).padStart(2, '0');
              return (
                <div key={dateNumber} className={`p-4 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                  <h2 className="text-lg font-semibold mb-2">{`${day} ${dateNumber}`}</h2>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={addTask}
          className={`flex items-center justify-center w-full md:w-auto px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          <FaPlus className="mr-2" /> Add Task
        </button>
      </div>
    </div>
  );
};

export default Timeline;
