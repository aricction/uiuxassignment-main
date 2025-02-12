import { create } from "zustand";

const useSortStore = create((set) => ({
  ordering: "Completed", // Default sorting
  setOrdering: (order) => set({ ordering: order }),

  sortedTasks: (tasks, ordering) => {
    if (!Array.isArray(tasks)) return []; // Prevents TypeError

    const statusOrder = {
      Completed: 1,
      Paused: 2,
      Pending: 3,
      "": 4, // Default for empty status
    };

    return [...tasks].sort((a, b) => statusOrder[a.status?.trim() || ""] - statusOrder[b.status?.trim() || ""]);
  },
}));

export default useSortStore;
