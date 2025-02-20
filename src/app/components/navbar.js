"use client";
import { TbSortAscending } from "react-icons/tb";
import { BiCaretDown } from "react-icons/bi";
import { useState, useRef, useEffect } from "react";
import useSortStore from "../store/store"; // Zustand store
import { FaPlus, FaEdit, FaTrash, FaMoon, FaSun } from 'react-icons/fa';
import Link from "next/link";

const Navbar = ({ tasks, setTasks , darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  

  // Zustand state
  const { ordering, setOrdering, sortedTasks } = useSortStore();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (tasks && Array.isArray(tasks)) {
      setTasks(sortedTasks(tasks, ordering)); // Pass ordering state
    }
  }, [ordering, tasks, setTasks]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

 

  return (
    <div>
      <div className={`flex justify-between items-center w-full h-[100px] shadow-md px-5 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        {/* Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md"
          >
            <TbSortAscending size={20} />
            <span>Display</span>
            <BiCaretDown />
          </button>

          {isOpen && (
            <div className={`absolute  p-3 rounded-md w-[300px] shadow-lg top-12 z-10 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
              <div className="flex flex-col space-y-2">
                <label className="">Order by</label>
                <select
                  className={`w-full p-2 border border-gray-300 rounded-md ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                >
                  <option value="Completed">Completed</option>
                  <option value="Paused">Paused</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          )}
        </div>
        <Link href="/timeline">Timeline</Link>

        {/* Search Input */}
        <button onClick={toggleDarkMode}
         className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
         aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          {darkMode ? <FaSun className="text-yellow-300"/> : < FaMoon className="text-gray-700"/>}
        </button>
        <input
          type="text"
          placeholder="Search..."
          className="lg:w-[300px] text-black p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default Navbar;
