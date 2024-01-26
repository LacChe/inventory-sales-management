import React from "react";
import Record from "../RecordForm/RecordForm.js";
import { AiFillEdit } from "react-icons/ai";
import Popup from "reactjs-popup";

const EditColumn = ({ data, filePath, fields }) => {
  return (
    <div className="edit-button-column">
      <div className="column-header">
        <AiFillEdit />
      </div>
      {data.map((row) => {
        return (
          <Popup
            key={row.id}
            modal
            nested
            trigger={
              <button className="clickable-button edit-button">
                <AiFillEdit />
              </button>
            }
          >
            <Record
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

export default EditColumn;
