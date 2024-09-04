import axios from "axios";
export const createMessage = async ({ participants, message }) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const apiUrl = "http://localhost:8080/messages";
    const response = await axios.post(
      apiUrl,
      {
        participants: participants,
        message: message,
      },
      headers
    );
    console.log("Message created:", response.data);
  } catch (error) {
    console.error("Error creating message:", error.message);
  }
};

export const getMessages = async ({ withId }) => {
  try {
    const token = localStorage.getItem("token");
    let queryParams = {
      params: {
        with: withId,
      },
    };
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const apiUrl = "http://localhost:8080/messages?with=" + withId;
    const response = await axios.get(apiUrl, headers);
    console.log("Messages:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting messages:", error.message);
  }
};


export const getAllChats = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const apiUrl = "http://localhost:8080/messages/allchats";
    const response = await axios.get(apiUrl, headers);
    console.log("Messages:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting messages:", error.message);
  }
}