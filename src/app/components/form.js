import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";

const defaultNames = [
  "Eve", "Grace", "Alice", "John", "Michael", "Liam", "Bob", 
  "Chloe", "David", "Charlie", "Dave", "Ella", "George"
];

const colors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#A833FF"];

const TodoForm = ({ darkMode, handleInput, handleChange, title, assignee, status, end_date, isEditing, color }) => {
  const [formData, setFormData] = useState({
    title: title || "",
    assignee: Array.isArray(assignee) ? assignee : [],
    status: status || "general information",
   
    end_date: end_date || "",
    color: colors[0],
  });

  // Convert default names into selectable options
  const defaultOptions = defaultNames.map((name) => ({ value: name, label: name }));

  const [selectedOptions, setSelectedOptions] = useState(
    Array.isArray(assignee) ? assignee.map((name) => ({ value: name, label: name })) : []
  );

  useEffect(() => {
    if (Array.isArray(assignee)) {
      setSelectedOptions(assignee.map((name) => ({ value: name, label: name })));
      setFormData((prev) => ({ ...prev, assignee }));
    }
  }, [assignee]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    handleChange(e);
  };

  return (
    <div className="flex absolute justify-center text-black items-center shadow-md overflow-hidden z-10">
      <div className={`w-[350px] ml-8 p-6 shadow-2xl border rounded-lg ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>

        <form className="space-y-4" onSubmit={(e) => handleInput(e, formData)}>
          <h1>{isEditing ? "" : "Add a task"}</h1>
          
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              className="w-full text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Assignee Input */}
          <div>
            <label className="block text-sm font-medium">Assignee</label>
            <CreatableSelect
              isMulti
              required
              name="assignee"
              options={defaultOptions} // Set default names
              value={selectedOptions}
              onChange={(selected) => {
                setSelectedOptions(selected);
                setFormData((prev) => ({
                  ...prev,
                  assignee: selected.map((option) => option.value),
                }));
              }}
              className="w-full text-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium">Status</label>
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

          {/* Start Date Input */}
          <div>
            <label className="block text-sm font-medium">Starting Date</label>
            <input
              type="date"
              name="startDate"
              required
              value={formData.startDate}
              onChange={onChange}
              className="w-full text-[12px] text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date Input */}
          <div>
            <label className="block text-sm font-medium">End Date</label>
            <input
              type="date"
              name="end_date"
              required
              value={formData.end_date}
              onChange={onChange}
              className="w-full text-[12px] text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium">Select Color</label>
            <div className="flex gap-2 mt-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded-full border-2 cursor-pointer ${formData.color === color ? "border-black" : "border-gray-300"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                ></div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isEditing ? "Save" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
