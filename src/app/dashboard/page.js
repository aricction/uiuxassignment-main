"use client";
import React, { useRef, useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Card from "../components/card";
import { BsThreeDots } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import TodoForm from "../components/form";
import {Draggable , Droppable , DragDropContext} from 'react-beautiful-dnd';

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
  const [ordering, setOrdering] = useState("progress");
  const [grouping, setGrouping] = useState("status");
  const [darkMode , setDarkMode] = useState(true);

  
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

  const toggleForm = (columnId) => {
    console.log("Toggling form for column:", columnId);
    setEditingTask(null);
    setOpenColumn((prev) => (prev === columnId ? null : columnId));
    setInput({ title: "", assignee: "", end_date: "" }); 
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Task Addition or Editing
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
                        ? { ...task, ...input }
                        : task
                    )
                  : [
                      ...column.tasks,
                      {
                        id: Date.now(),
                        title: input.title,
                        assignee: input.assignee,
                        end_date: input.end_date,
                      },
                    ],
              }
            : column
        )
      );
      setInput({ title: "", assignee: "", end_date: "" });
      setEditingTask(null);
      setOpenColumn(null);
    }
  };

  // Handle Editing Task
  const handleEdit = (task, columnId) => {
    if (!task) return;
    setEditingTask(task);
    setInput({
      title: task.title,
      assignee: task.assignee || "",
      end_date: task.end_date || "",
    });
    setOpenColumn(columnId);
  };


  const handleDragEnd = (result)=>{
    if(!result.destination) return ;
    
    const {source , destination} = result;
    setData ((prevData)=> {
      const newData = [...prevData];
      
      const sourceColumn = newData.find((col)=> col.id === source.droppableId);
      const destinationColumn = newData.find((col)=> col.id === destination.droppableId);
      
      if(!sourceColumn || !destinationColumn) return prevData;
      
      const sourceTasks = [...sourceColumn.tasks];
      const [movedTask] = sourceTasks.splice(source.index , 1);
      
      if(source.droppableId === destination.droppableId){
      sourceTasks.splice(destination.index, 0 , movedTask);
      sourceColumn.tasks = sourceTasks;
    } else {
      const destinationTasks = [...destinationColumn.tasks];
      destinationTasks.splice(destination.index, 0, movedTask);

      sourceColumn.tasks = sourceTasks;
      destinationColumn.tasks = destinationTasks;
    }
    
    return newData;
  })  
  }

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-gray-300 text-black min-h-screen"}>

      <Navbar grouping={grouping} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="p-4">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
         
        <DragDropContext onDragEnd={handleDragEnd}>
  <div className="lg:flex sm:block gap-4 ">
    {data.map((column) => (
      <Droppable key={column.id} droppableId={column.id.toString()}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="column">
            <div className="flex justify-between items-center mb-4 ">
              <h2 className={`ml-4 font-semibold lg:text-[13px] {darkMode ? "text-white " : "text-black "}`}>
                {column.title}
              </h2>
              <div className="flex gap-2 justify-end" ref={formRef}>
                <button onClick={() => toggleForm(column.id)}>
                  <FaPlus  size={12} className="cursor-pointer" />
                </button>
                <BsThreeDots className="mr-4 cursor-pointer"  size={15} />
              </div>
            </div>

            {openColumn === column.id && (
              <TodoForm
                title={input.title}
                assignee={input.assignee}
                end_date={input.end_date}
                handleChange={handleChange}
                handleInput={(e) => handleInput(e, column.id)}
                isEditing={editingTask !== null}
                darkMode={darkMode} 

              />
            )}

            {column.tasks.length > 0 ? (
              column.tasks.map((task, index) => {
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
                } else if (typeof task.icon === "string" && iconMap[task.icon]) {
                  iconsArray.push(
                    React.createElement(iconMap[task.icon], {
                      key: task.icon,
                      className: "lg:text-[15px] mx-1 text-gray-400",
                    })
                  );
                }

                return (
                  <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative"
                      >
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
                          onEdit={() => handleEdit(task, column.id)}
                          darkMode={darkMode} 
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })
            ) : (
              <p className="text-gray-500 text-center">No tasks available</p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    ))}
  </div>
</DragDropContext>

      </div>
    </div>
  );
}
