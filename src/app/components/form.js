import { useState } from "react";

const TodoForm = ({ darkMode, id, handleInput, handleChange, title, assignee, status , end_date, isEditing}) => {
  const [formData, setFormData] = useState({
    title: title || "",
    assignee: assignee || "",
    status: status || "general information",
    startDate: "",
    end_date: end_date|| "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    handleChange(e); // Propagate change to parent component
  };

  return (
    <div className="flex absolute justify-center text-black items-center shadow-md overflow-hidden z-10">
      <div className={`w-[250px] ml-8 p-6 shadow-2xl border  rounded-lg shadow-md ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <form className="space-y-4" onSubmit={(e) => handleInput(e, formData)}>
          <div>
            <label className="block text-sm font-medium ">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              className="w-full text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium ">Assignee</label>
            <input
              type="text"
              name="assignee"
              value={formData.assignee}
              onChange={onChange}
              className="w-full text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium ">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={onChange}
              className="w-full text-[12px] p-2 text-black border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general information">General Information</option>
              <option value="Backlog">Backlog</option>
              <option value="in progress">In Progress</option>
              <option value="paused">Paused</option>
              <option value="ready for launch">Ready for Launch</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium ">Starting Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={onChange}
              className="w-full text-[12px] text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium ">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.end_date}
              onChange={onChange}
              className="w-full text-[12px] text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Adding ..." : isEditing ? "Save" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
