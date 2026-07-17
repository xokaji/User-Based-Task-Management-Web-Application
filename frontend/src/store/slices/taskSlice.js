import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";
import toast from "react-hot-toast";

const initialState = {
  tasks: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
  filters: { status: "all", search: "", sortBy: "createdAt", order: "desc" },
  status: "idle",
  error: null,
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async ({ status, search, sortBy, order, page, limit } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (status && status !== "all") params.status = status;
      if (search) params.search = search;
      if (sortBy) params.sortBy = sortBy;
      if (order) params.order = order;
      if (page) params.page = page;
      if (limit) params.limit = limit;

      const { data } = await api.get("/tasks", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch tasks");
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/tasks", taskData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create task");
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, updates);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update task");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete task");
    }
  }
);

export const toggleTaskStatus = createAsyncThunk(
  "tasks/toggleTaskStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/tasks/${id}/status`, { status });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload.tasks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
        toast.success("Task created");
      })
      .addCase(createTask.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.tasks[idx] = action.payload;
        toast.success("Task updated");
      })
      .addCase(updateTask.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
        toast.success("Task deleted");
      })
      .addCase(deleteTask.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      })
      .addCase(toggleTaskStatus.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

export const { setFilters } = taskSlice.actions;
export default taskSlice.reducer;
