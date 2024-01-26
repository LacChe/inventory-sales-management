import React from "react";
import Popup from "reactjs-popup";
import { AiFillDelete } from "react-icons/ai";
import DeleteConfirmation from "./DeleteConfirmation.js";

const DeleteColumn = ({ data, filePath, fields }) => {
  return (
    <div className="delete-button-column">
      <div className="column-header">
        <AiFillDelete />
      </div>
      {data.map((row) => {
        return (
          <Popup
            key={row.id}
            modal
            trigger={
              <button className="clickable-button delete-button">
                <AiFillDelete />
              </button>
            }
          >
            <DeleteConfirmation
              fields={fields}
              item={row}
              filePath={filePath}
              allItems={data}
            />
          </Popup>
        );
      })}
    </div>
  );
};

export default DeleteColumn;
