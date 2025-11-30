import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://habittrackerbackend.up.railway.app/", 
  headers: {
    "Content-Type": "application/json",
  },
});


axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem("token");
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "/login"; 
    }

    return Promise.reject(error);
  }
);

// jab register ke liye banayega tho 
export const registerUser = async (payload) => {
  const response = await axiosClient.post("/auth/register", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await axiosClient.post("/auth/login", payload);
  return response.data; // yeh token (String) deta hai object nahi 
};

export const postHabit = async (payload) => {
  const response = await axiosClient.post("habitPost/create", payload);
  return response.data; //return sccess on the safe save
}

export const getHabits = async () => {
  try {
    const response = await axiosClient.get("habitPost/get");
    console.log(response.data);
    return response.data; //kuch array jaisa milega tho console.log karke check kar lena
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export const deleteHabit = async (id) => {
  try {
    const response = await axiosClient.delete(`habitPost/delete/${id}`);
    return response.data; //returns success on safe save
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export const getHabitCalendar = async (habitId) => {
  const res = await axiosClient.get(`/habits/logs/${habitId}/calendar`);
  return res.data;
};

export const getHabitStreak = async (habitId) => {
  const res = await axiosClient.get(`/habits/logs/${habitId}/streak`);
  return res.data;
};

export const completeHabit = async (habitId) => {
  return axiosClient.post(`/habits/logs/${habitId}/complete`);
};

export const skipHabit = async (habitId) => {
  return axiosClient.post(`/habits/logs/${habitId}/skip`);
};

export const setHabitStatus = async (habitId, status) => {
  return axiosClient.post(`/habits/logs/${habitId}/status?value=${status}`);
};

export const getTodayStatus = async (habitId) => {
  const res = await axiosClient.get(`/habits/logs/${habitId}/today`);
  return res.data;
};



export default axiosClient;
