import React from "react";
import { MdEdit } from "react-icons/md";

const Card = ({ darkMode, onEdit, id, title, img, date, status, assignee, icons, box, comment, time, attach, color }) => {
  
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <div className={`flex flex-2 ml-4 m-2 text-black lg:w-[260px] sm:w-[100%] h-[100px] p-2 pl-2 rounded-lg shadow-md mb-15 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <div className="mb-5 items-center">
        {/* Status Bar */}
        <div className=" stat-bar mt-0 gap-2 lg:w-[200px] w-[270px] sm:w-[250px] h-[8px] rounded-lg flex">
          {color?.map((col, index) => (
            <div key={index} className="h-full w-[40px] rounded-lg" style={{ backgroundColor: col }}></div>
          ))}

          <button onClick={onEdit} className="absolute lg:ml-[220px] ml-[340px] flex justify-center items-center">          
            <MdEdit size={12} />
          </button>
        </div>

        {/* Title */}
        <div className="status-heading flex items-center mt-2">
          <p className="lg:text-[13px] font-semibold">{title}</p>
        </div>

        {/* Status & Icons */}
        <div className="relative flex items-center justify-between">
          <div className="status">
            <div className="flex space-x-2 text-gray-400 lg:text-[12px] text-[15px] sm:text-[10px]">
              {icons} {attach}
              <div className="text-[12px] items-center">
                {date} {box} {comment}
              </div>
            </div>
            <p className="text-gray-400 font-semibold lg:text-[12px]">{status}</p>
          </div>

          {/* Assignee Avatars with Initials */}
          <div className="mt-3 absolute lg:ml-[205px] ml-[310px] sm:ml-[300px] avatar h-[25px] w-[25px] rounded-full flex justify-center items-center text-black font-bold text-sm">          
            {assignee.length > 0 &&
            assignee.map((name, index) => (
              <div 
                key={index} 
                style={{ zIndex: assignee.length - index, marginLeft: `-${index * 5}px` }} // Overlapping effect
                className="relative h-[25px] w-[25px]"
              >
                {img ? (
                  <img
                    src={img}
                    height="25px"
                    width="25px"
                    alt={name}
                    className="rounded-full border-2 border-white"
                  />
                ) : (
                  <div className="h-[25px] w-[25px] rounded-full bg-gray-300 flex justify-center items-center text-black font-bold text-xs border-2 border-white">
                    {getInitials(name)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
