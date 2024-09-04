import React, { useEffect, useState } from "react";
import "../styles/ChatModal.css";
import { getMessages, createMessage } from "../api";

const ChatModal = ({ isModalOpen, setModalOpen, withId, withType, title, name }) => {
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = async () => {
    try {
      await createMessage({
        message: newMessage,
        participants: [{ type: withType, userId: withId }],
      });
      setNewMessage("");
    } catch (error) {
      console.error("Could not send message", error);
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await getMessages({
          withId: withId,
        });
        setMessages(response);
        setIsLoaded(true);
      } catch (error) {
        console.error("Could not load messages", error);
      }
    };

    // Load messages initially
    loadMessages();

    // Set up interval to load messages every 5 seconds
    const intervalId = setInterval(() => {
      loadMessages();
    }, 5000);

    // Clean up the interval when the component is unmounted or modal is closed
    return () => clearInterval(intervalId);
  }, [isModalOpen]); // Re-run the effect when the modal is opened or closed

  if (title == "Admin") {
    return (
      <div>
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{title}</h2>
                <button onClick={toggleModal}>&times;</button>
              </div>
              <div className="modal-content">
                <div className="chat-messages">
                  {isLoaded ? (
                    messages?.map((message) => (
                      <div
                        style={{
                          backgroundColor:
                            message?.creator?.role === "admin"
                              ? "#f1f0f0"
                              : "#e5e5e5",
                          textAlign:
                            message?.creator?.role === "admin"
                              ? "left"
                              : "right",
                          marginLeft:
                            message?.creator?.role === "admin" ? "0px" : "auto",
                          marginRight:
                            message?.creator?.role === "admin" ? "auto" : "0px",
                        }}
                        className="message"
                        key={message.id}
                      >
                        <div className="message-sender">
                          {message?.creator?.role === "admin"
                            ? "Admin"
                            : "You"}
                        </div>
                        <div className="message-text">{message?.message}</div>
                      </div>
                    ))
                  ) : (
                    <div>Loading...</div>
                  )}
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <button onClick={sendMessage}>Send</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  else if(title == "Owner" || name == "to renter"){
    return (
      <div>
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{title}</h2>
                <button onClick={toggleModal}>&times;</button>
              </div>
              <div className="modal-content">
                <div className="chat-messages">
                  { title == "Owner" ? (
                  isLoaded ? (
                    messages?.map((message) => (
                      <div
                        style={{
                          backgroundColor:
                            message?.creator?.role === "owner"
                              ? "#f1f0f0"
                              : "#e5e5e5",
                          textAlign:
                            message?.creator?.role === "owner" ? "left" : "right",
                          marginLeft:
                            message?.creator?.role === "owner" ? "0px" : "auto",
                          marginRight:
                            message?.creator?.role === "owner" ? "auto" : "0px",
                        }}
                        className="message"
                        key={message.id}
                      >
                        <div className="message-sender">
                          {message?.creator?.role === "owner"
                            ? message?.creator?.firstname
                            : "You"}
                        </div>
                        <div className="message-text">{message?.message}</div>
                      </div>
                    ))
                  ) : (
                    <div>Loading...</div>
                  )
                ) : (
                  isLoaded ? (
                    messages?.map((message) => (
                      <div
                        style={{
                          backgroundColor:
                            message?.creator?.role === "owner"
                              ? "#e5e5e5"
                              : "#f1f0f0",
                          textAlign:
                            message?.creator?.role === "owner" ? "right" : "left",
                          marginLeft:
                            message?.creator?.role === "owner" ? "auto" : "0px",
                          marginRight:
                            message?.creator?.role === "owner" ? "0px" : "auto",
                        }}
                        className="message"
                        key={message.id}
                      >
                        <div className="message-sender">
                          {message?.creator?.role === "owner"
                            ? "You"
                            : message?.creator?.firstname }
                        </div>
                        <div className="message-text">{message?.message}</div>
                      </div>
                    ))
                  ) : (
                    <div>Loading...</div>
                  )
                )
              }
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <button onClick={sendMessage}>Send</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  else{
    return (
    <div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{title}</h2>
              <button onClick={toggleModal}>&times;</button>
            </div>
            <div className="modal-content">
              <div className="chat-messages">
                {isLoaded ? (
                  messages?.map((message) => (
                    <div
                      style={{
                        backgroundColor:
                          message?.creator?.role === "admin"
                            ? "#e5e5e5"
                            : "#f1f0f0",
                        textAlign:
                          message?.creator?.role === "admin" ? "right" : "left",
                        marginLeft:
                          message?.creator?.role === "admin" ? "auto" : "0px",
                        marginRight:
                          message?.creator?.role === "admin" ? "0px" : "auto",
                      }}
                      className="message"
                      key={message.id}
                    >
                      <div className="message-sender">
                        {message?.creator?.role === "admin"
                          ? "You"
                          : message?.creator?.firstname}
                      </div>
                      <div className="message-text">{message?.message}</div>
                    </div>
                  ))
                ) : (
                  <div>Loading...</div>
                )}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  }
  // return (
  //   <div>
  //     {isModalOpen && (
  //       <div className="modal-overlay">
  //         <div className="modal">
  //           <div className="modal-header">
  //             <h2>{title}</h2>
  //             <button onClick={toggleModal}>&times;</button>
  //           </div>
  //           <div className="modal-content">
  //             <div className="chat-messages">
  //               {title == "Admin" ? (
  //                 isLoaded ? (
  //                   messages?.map((message) => (
  //                     <div
  //                       style={{
  //                         backgroundColor:
  //                           message?.creator?.role === "admin"
  //                             ? "#f1f0f0"
  //                             : "#e5e5e5",
  //                         textAlign:
  //                           message?.creator?.role === "admin"
  //                             ? "left"
  //                             : "right",
  //                         marginLeft:
  //                           message?.creator?.role === "admin" ? "0px" : "auto",
  //                         marginRight:
  //                           message?.creator?.role === "admin" ? "auto" : "0px",
  //                       }}
  //                       className="message"
  //                       key={message.id}
  //                     >
  //                       <div className="message-sender">
  //                         {message?.creator?.role === "admin"
  //                           ? "Admin"
  //                           : message?.creator?.firstname}
  //                       </div>
  //                       <div className="message-text">{message?.message}</div>
  //                     </div>
  //                   ))
  //                 ) : (
  //                   <div>Loading...</div>
  //                 )
  //               ) : isLoaded ? (
  //                 messages?.map((message) => (
  //                   <div
  //                     style={{
  //                       backgroundColor:
  //                         message?.creator?.role === "admin"
  //                           ? "#f1f0f0"
  //                           : "#e5e5e5",
  //                       textAlign:
  //                         message?.creator?.role === "admin" ? "right" : "left",
  //                       marginLeft:
  //                         message?.creator?.role === "admin" ? "auto" : "0px",
  //                       marginRight:
  //                         message?.creator?.role === "admin" ? "0px" : "auto",
  //                     }}
  //                     className="message"
  //                     key={message.id}
  //                   >
  //                     <div className="message-sender">
  //                       {message?.creator?.role === "admin"
  //                         ? "Admin"
  //                         : message?.creator?.firstname}
  //                     </div>
  //                     <div className="message-text">{message?.message}</div>
  //                   </div>
  //                 ))
  //               ) : (
  //                 <div>Loading...</div>
  //               )}
  //             </div>
  //             <div className="chat-input">
  //               <input
  //                 type="text"
  //                 value={newMessage}
  //                 onChange={(e) => setNewMessage(e.target.value)}
  //                 placeholder="Type your message..."
  //               />
  //               <button onClick={sendMessage}>Send</button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default ChatModal;
