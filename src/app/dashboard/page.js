"use client";
import React, { useRef, useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Card from "../components/card";
import { BsThreeDots } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import TodoForm from "../components/form";

// Import all required icons
import { MdNotes } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import { IoMdCheckboxOutline } from "react-icons/io";
import { GrFormAttachment } from "react-icons/gr";
import { MdAccessTime } from "react-icons/md";
import { TbCheckbox } from "react-icons/tb";

// Icon mapping object
const iconMap = {
  MdNotes,
  IoEyeOutline,
  FaRegComment,
  IoMdCheckboxOutline,
  GrFormAttachment,
  MdAccessTime,
  TbCheckbox,
};

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({ title: "", assignee: "", end_date: "" });
  const [editingTask, setEditingTask] = useState(null);
  const [openColumn, setOpenColumn] = useState(null);
  const formRef = useRef(null);
  const [darkMode , setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  
  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/data.json");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const jsonData = await response.json();

        // Ensure `tasks` is always an array
        const formattedData = jsonData.Task_Data.map((column) => ({
          ...column,
          tasks: column.tasks || [],
        }));

        setData(formattedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
       setOpenColumn(false);
      }
    }
  
    if (openColumn !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openColumn]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const toggleForm = (columnId) => {
    console.log("Toggling form for column:", columnId);
    setEditingTask(null);
    setOpenColumn((prev) => (prev === columnId ? null : columnId));
    setInput({ title: "", assignee: "", end_date: "" }); 
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };


  const handleInput = (e, columnId) => {
    e.preventDefault();
    if (input.title.trim() !== "") {
      setData((prevData) =>
        prevData.map((column) =>
          column.id === columnId
            ? {
                ...column,
                tasks: editingTask
                  ? column.tasks.map((task) =>
                      task.id === editingTask.id
                        ? { ...task, ...input, assignee: Array.isArray(input.assignee) ? input.assignee : [input.assignee] }
                        : task
                    )
                  : [
                      ...column.tasks,
                      {
                        id: Date.now(),
                        title: input.title,
                        assignee: Array.isArray(input.assignee) ? input.assignee : [input.assignee],
                        end_date: input.end_date,
                      },
                    ],
              }
            : column
        )
      );
      setInput({ title: "", assignee: [], end_date: "" });
      setEditingTask(null);
      setOpenColumn(null);
    }
  };
  


  // Handle Editing Task
  const handleEdit = (task, columnId) => {
    if (!task) return;
  
    const formattedAssignee = Array.isArray(task.assignee?.names) 
      ? task.assignee.names 
      : typeof task.assignee === "string" 
        ? [task.assignee] 
        : [];
  
    console.log("Editing Task:", task);
    console.log("Formatted Assignee:", formattedAssignee);
  
    setEditingTask(task);
    setInput({
      title: task.title,
      assignee: formattedAssignee,
      end_date: task.end_date || "",
      
    });
    setOpenColumn(columnId);
  };
  

  const filteredData = searchQuery
  ? data.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => {
        const titleMatch = task.title?.toLowerCase().includes(searchQuery.toLowerCase());

        const assigneeMatch = Array.isArray(task.assignee)
          ? task.assignee.some((name) => typeof name === "string" && name.toLowerCase().includes(searchQuery.toLowerCase()))
          : typeof task.assignee === "string" && task.assignee.toLowerCase().includes(searchQuery.toLowerCase());

        return titleMatch || assigneeMatch;
      }),
    })).filter((column) => column.tasks.length > 0)
  : data;

   
 
  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-gray-300 text-black min-h-screen"}>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        setSearchQuery={setSearchQuery} searchQuery={searchQuery}
      />
      <div className="p-4">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
  
        {searchQuery ? (
    <div className="lg:flex sm:block gap-4">
    {filteredData.length > 0 ? (
       filteredData.map((column) => (
        <div key={column.id} className="column">
          <h2 className="ml-4 font-semibold lg:text-[13px]">{column.title}</h2>
          {column.tasks.map((task) => {
            let iconsArray = [];

            if (Array.isArray(task.icon)) {
              task.icon.forEach((iconObj) => {
                Object.values(iconObj).forEach((iconDetails) => {
                  if (iconDetails.name && iconMap[iconDetails.name]) {
                    iconsArray.push(
                      <div
                        key={iconDetails.name}
                        className={`flex items-center rounded-lg p-[3px] ${
                          darkMode ? "text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {React.createElement(iconMap[iconDetails.name], {
                          className: "lg:text-[16px] mx-1",
                        })}
                        <span className="text-xs">{iconDetails.value}</span>
                      </div>
                    );
                  }
                });
              });
            }

            return (
              <Card
                key={task.id}
                title={task.title}
                status={task.status}
                assignee={
                  Array.isArray(task.assignee?.names)
                    ? task.assignee.names
                    : typeof task.assignee === "string"
                    ? [task.assignee]
                    : []
                }
                icons={iconsArray}
                box={task.box}
                comment={task.comment}
                date={task.end_date}
                img={task.img}
                attach={task.attach}
                color={task.statsbar?.colors || []}
                onEdit={() => handleEdit(task, column.id)} // Fixed columnId
                darkMode={darkMode}
              />
            );
          })}
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-center">No matching tasks found</p>
    )}
  </div>
) : (
          // Render full columns if no search query
          <div className="lg:flex sm:block gap-4">
            {data.map((column) => (
              <div key={column.id} className="column">
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`ml-4 font-semibold lg:text-[13px] ${darkMode ? "text-white" : "text-black"}`}>
                    {column.title}
                  </h2>
                  <div className="flex gap-2 justify-end" ref={formRef}>
                    <button onClick={() => toggleForm(column.id)}>
                      <FaPlus size={12} className="cursor-pointer" />
                    </button>
                    <BsThreeDots className="mr-4 cursor-pointer" size={15} />
                  </div>
                </div>
                {openColumn === column.id && (
                  <div ref={formRef}>
                    <TodoForm
                      title={input.title}
                      assignee={Array.isArray(input?.assignee) ? input.assignee : []}
                      end_date={input.end_date}
                      color = {input.color}
                      handleChange={handleChange}
                      handleInput={(e) => handleInput(e, column.id)}
                      isEditing={editingTask !== null}
                      darkMode={darkMode}
                    />
                  </div>
                )}
                {column.tasks.length > 0 ? (
                  column.tasks.map((task) => {
                    let iconsArray = [];
  
                    if (Array.isArray(task.icon)) {
                      task.icon.forEach((iconObj) => {
                        Object.values(iconObj).forEach((iconDetails) => {
                          if (iconDetails.name && iconMap[iconDetails.name]) {
                            iconsArray.push(
                              <div key={iconDetails.name} className={`flex items-center rounded-lg p-[3px] ${darkMode ? ' text-white' : 'bg-gray-100 text-gray-900'} `}>
                                {React.createElement(iconMap[iconDetails.name], {
                                  className: "lg:text-[16px] mx-1 ",
                                })}
                                <span className="text-xs ">{iconDetails.value}</span>
                              </div>
                            );
                          }
                        });
                      });
                    }
  
                    return (
                      <Card
                        key={task.id}
                        title={task.title}
                        status={task.status}
                        assignee={
                          Array.isArray(task.assignee?.names)
                           ? task.assignee.names 
                           : typeof task.assignee === "string" 
                           ? [task.assignee] 
                           : []}
                        icons={iconsArray}
                        box={task.box}
                        comment={task.comment}
                        date={task.end_date}
                        img={task.img}
                        attach={task.attach}
                        color={task.statsbar?.colors || []}
                        onEdit={() => handleEdit(task, column.id)}
                        darkMode={darkMode} 
                      />
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center">No tasks available</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}