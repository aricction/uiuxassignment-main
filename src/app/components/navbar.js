"use client";
import { TbSortAscending } from "react-icons/tb";
import { BiCaretDown } from "react-icons/bi";
import { useState, useRef, useEffect } from "react";
import useSortStore from "../store/store"; // Zustand store

const Navbar = ({ tasks, setTasks }) => {
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
      <div className="flex justify-between items-center text-black w-full h-[100px] shadow-md bg-white px-5">
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
            <div className="absolute bg-gray-600 p-3 rounded-md w-[300px] shadow-lg top-12 z-10">
              <div className="flex flex-col space-y-2">
                <label className="text-white">Order by</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
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

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          className="lg:w-[300px] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default Navbar;
