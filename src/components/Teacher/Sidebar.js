import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IconButton } from "@mui/material";
import { Edit, Delete, LibraryBooks, Quiz, DragIndicator } from "@mui/icons-material";

const Sidebar = ({
  microCourses,
  tests,
  selectedItem,
  handleSelectItem,
  handleEditMicroCourse,
  handleEditTest,
  handleDeleteItem,
  handleDeleteTest,
  handleDragEnd,
  triggerEditMode,
  isOpen = true, // New prop for controlling sidebar visibility
}) => {
  const handleEditClick = (item) => {
    if (item.type === "micro-course") {
      triggerEditMode(item); // Use the triggerEditMode function
    } else if (item.type === "test") {
      const updatedTitle = prompt("Modifier le titre :", item.title);
      if (updatedTitle !== null && updatedTitle.trim() !== "") {
        handleEditTest(item._id, updatedTitle);
      }
    }
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="items">
        {({ droppableProps = {}, innerRef = () => {}, placeholder = null } = {}) => (
          <div className={`sidebar ${isOpen ? 'open' : 'closed'}`} {...droppableProps} ref={innerRef}>
            <h4>
              <LibraryBooks style={{ fontSize: '20px' }} />
              Micro-Cours
            </h4>
            {microCourses && microCourses.length > 0 ? (
              microCourses.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided) => (
                    <div
                      className={`microCourseItem ${
                        selectedItem && selectedItem._id === item._id ? "selected" : ""
                      }`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      onClick={() => handleSelectItem({ ...item, type: "micro-course" })}
                    >
                      <div {...provided.dragHandleProps} className="drag-handle">
                        <DragIndicator style={{ fontSize: '16px', opacity: 0.6 }} />
                      </div>
                      <span className="order-display">[{item.order}]</span>
                      <span className="microCourseItem-content">{item.title}</span>
                      <div className="itemActions">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick({ ...item, type: "micro-course" });
                          }}
                        >
                          <Edit style={{ fontSize: '16px' }} />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem({ ...item, type: "micro-course" });
                          }}
                        >
                          <Delete style={{ fontSize: '16px' }} />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <p style={{ opacity: 0.7, fontSize: '14px', textAlign: 'center', margin: '20px 0' }}>
                Aucun micro-cours disponible.
              </p>
            )}

            <h4>
              <Quiz style={{ fontSize: '20px' }} />
              Tests
            </h4>
                                      {tests && tests.length > 0 ? (
              tests.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided) => (
                    <div
                      className={`microCourseItem ${
                        selectedItem && selectedItem._id === item._id ? "selected" : ""
                      }`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      onClick={() => handleSelectItem({ ...item, type: "test" })}
                    >
                      <div {...provided.dragHandleProps} className="drag-handle">
                        <DragIndicator style={{ fontSize: '16px', opacity: 0.6 }} />
                      </div>
                      <span className="microCourseItem-content">{item.title}</span>
                      <div className="itemActions">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTest(item);
                          }}
                        >
                          <Edit style={{ fontSize: '16px' }} />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTest(item);
                          }}
                        >
                          <Delete style={{ fontSize: '16px' }} />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <p style={{ opacity: 0.7, fontSize: '14px', textAlign: 'center', margin: '20px 0' }}>
                Aucun test disponible.
              </p>
            )}
            {placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Sidebar;
