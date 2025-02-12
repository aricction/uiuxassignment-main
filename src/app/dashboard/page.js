"use client";
import React, { useRef, useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Card from "../components/card";
import { BsThreeDots } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import LoginForm from "../components/form";


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
  MdNotes: MdNotes,
  IoEyeOutline: IoEyeOutline,
  FaRegComment: FaRegComment,
  IoMdCheckboxOutline: IoMdCheckboxOutline,
  GrFormAttachment: GrFormAttachment,
  MdAccessTime: MdAccessTime,
  TbCheckbox: TbCheckbox,
};

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openColumn, setOpenColumn] = useState(null);
  const formRef = useRef(null);
  const [ordering , setOrdering] = useState("progress");
  const [grouping , setGrouping] = useState("status");
  const [statusMapping, setStatusMapping] = useState({});
  
  const statusKeys = ["General information", "Backlog", "In progress",
    "Paused", "Ready for launch"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/data.json");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const jsonData = await response.json();
        setData(jsonData.Task_Data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleForm = (columnId) => {
    setOpenColumn((prev) => (prev === columnId ? null : columnId));
  };

  
  const sortByTitle = (tickets)=>{
    return tickets.sort((a,b)=> a.title.localeCompare(b.title));
  };

  const groupByStatus = (tickets)=>{
    let sortedTickets = tickets;

    if(ordering == "title"){
      sortedTickets = sortByTitle(tickets); 
    }

    const grouped = sortedTickets.reduce((acc, tickets)=> {
      if(!acc[tickets.status]){
        acc[tickets.status] =[];
      }
      acc[tickets.status].push(tickets);
      return acc;
    }, {});
  
    statusKeys.forEach((key)=> {
      if(!grouped[key]){
        grouped[key] = [];
      }
    });

    if(ordering === "progress"){
      for(let key in grouped){
        grouped[key].sort((a,b)=> b.progress - a.progress);
      }
    }

    return {
      keys: statusKeys,
      ...grouped,
    };

  };


  const groupByProgress = (tickets)=> {
    let sortedTickets = tickets;

    if(ordering === "title"){
      sortedTickets = sortByTitle(tickets);
    }

    const progressObject = sortedTickets.reduce((acc, ticket)=> {
      if(!acc[ticket.progress]){
        acc[ticket.progress]= [];

      }
      acc[ticket.progress].push(ticket);
      return acc;
    },{});

    return {
      keys: Object.keys(progressObject),
      ...progressObject,
    };
  };

  //work status

  const extractStatusMapping = (data)=>{
    const statusMapping = {};

    data.tickets.forEach((ticket)=>{
      statusMapping[ticket.id]= ticket.status;
    });

    return statusMapping;
  }

  return (
    <div>
      <Navbar 
      grouping={grouping}
      />
    <div className="p-4">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="lg:flex sm:block gap-4">
        {data.map((column) => (
          <div key={column.id} className="">
            <div className="flex justify-between items-center mb-4">
              <h2 className="ml-4 text-black font-semibold lg:text-[13px]">{column.title}</h2>
              <div className="flex gap-2 justify-end" ref={formRef}>
                <button>
                  <FaPlus
                    onClick={() => toggleForm(column.id)}
                    color="black"
                    size={12}
                    className="cursor-pointer"
                  />
                </button>
                <BsThreeDots className="mr-4 cursor-pointer" color="black" size={15} />
              </div>
            </div>

            {openColumn === column.id && <LoginForm id={column.id} />}

            {column.tasks.length > 0 ? (
              column.tasks.map((task) => {
                let iconsArray = [];

                if (Array.isArray(task.icon)) {
                  task.icon.forEach((iconObj) => {
                    Object.values(iconObj).forEach((iconName) => {
                      if (iconMap[iconName]) {
                        iconsArray.push(
                          React.createElement(iconMap[iconName], {
                            key: iconName,
                            className: "lg:text-[16px] mx-1 text-gray-400",
                          })
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
                    time={task.time}
                    img={task.img}
                    attach={task.attach}
                    color={task.statsbar?.colors || []} // Pass colors array
                  />
                );
              })
            ) : (
              <p className="text-gray-500 text-center">No tasks available</p>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
} 