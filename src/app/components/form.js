import { useState } from "react";



const LoginForm = ({id}) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // For loading state
  

  return (
    <div className="flex absolute justify-center items-center shadow-md overflow-hidden z-10 ">
      <div  className="w-[250px] ml-8 p-6 shadow-2xl border bg-white rounded-lg shadow-md">
        
        <form  className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">Title</label>
            <input 
              type="text" 
              name="title" 
              placeholder=""       
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Assignee</label>
            <input 
              type="text" 
              name="assignee" 
              placeholder="" 
            
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
             <select  className="w-full text-[12px] p-2  text-black border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>general information</option>
                <option>Backlog</option>
                <option>in progress</option>
                <option>paused</option>
                <option>ready for launch</option>
             </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Starting date</label>
            <input type="date"  className="w-full  text-[12px] text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End date</label>
            <input type="date"  className="w-full  text-[12px] text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          {error && <p className="text-red-500 text-sm"></p>}
          <button 
            type="submit" 
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Adding ..." : "Add"}
          </button>
          <p className="">
         
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
