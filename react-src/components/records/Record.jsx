import React, { Fragment, useState } from "react";
import { generateUID } from "../../utils/helpers";
import { useStateContext } from "../../utils/StateContext";
import Popup from "reactjs-popup";
import RecordSelectionDropdown from "./RecordSelectionDropdown";

const Record = ({ tableName, schema, id, record }) => {
  const { saveRecord, deleteRecord } = useStateContext();

  let defaultSelectedRecords = {};
  schema.forEach((field) => {
    if (record && field.type === "object") {
      defaultSelectedRecords = record[field.name] || {};
    }
  });
  const [selectedSubRecords, setSelectedSubRecords] = useState(
    defaultSelectedRecords
  );
  const [formRecord, setFormRecord] = useState({ ...record });
  const [recordId, setRecordId] = useState(id);

  function setSubRecordSelection(id, amount) {
    setSelectedSubRecords((prev) => {
      let newSelectedRecords = { ...prev };
      if (newSelectedRecords[id] !== undefined && amount === undefined) {
        delete newSelectedRecords[id];
      } else {
        newSelectedRecords[id] = amount || 0;
      }
      formRecord[schema.filter((field) => field.type === "object")[0].name] =
        newSelectedRecords;
      return newSelectedRecords;
    });
  }

  /**
   * Generate the input field based on the field type.
   *
   * @param {object} field - the field name and type
   * @return {JSX.Element} the input field component based on the field type
   */
  function fieldInput(field) {
    if (field.name === "notes") {
      return (
        <Fragment key={field.name}>
          <label htmlFor={field.name}>{field.name.replaceAll("_", " ")}</label>
          <textarea
            id={field.name}
            defaultValue={formRecord[field.name]}
            onChange={(e) => {
              formRecord[field.name] = e.target.value;
            }}
          />
        </Fragment>
      );
    }
    switch (field.type) {
      case "key":
        return (
          <Fragment key={field.name}>
            <div>{field.name.replaceAll("_", " ")}</div>
            <div id={field.name}>{recordId || "New Record"}</div>
          </Fragment>
        );
      case "formula":
        // dont display formula fields
        return <Fragment key={field.name}></Fragment>;
      case "number":
        return (
          <Fragment key={field.name}>
            <label htmlFor={field.name}>
              {field.name.replaceAll("_", " ")}
            </label>
            <input
              type="number"
              id={field.name}
              defaultValue={
                !isNaN(Number.parseFloat(formRecord[field.name])) &&
                Number.parseFloat(formRecord[field.name])
              }
              onChange={(e) => {
                formRecord[field.name] = Number.parseFloat(e.target.value);
              }}
            />
          </Fragment>
        );
      case "string":
        return (
          <Fragment key={field.name}>
            <label htmlFor={field.name}>
              {field.name.replaceAll("_", " ")}
            </label>
            <input
              id={field.name}
              defaultValue={formRecord[field.name]}
              onChange={(e) => {
                formRecord[field.name] = e.target.value;
              }}
            />
          </Fragment>
        );
      case "date":
        return (
          <Fragment key={field.name}>
            <label htmlFor={field.name}>
              {field.name.replaceAll("_", " ")}
            </label>
            <input
              type="date"
              id={field.name}
              defaultValue={formRecord[field.name]}
              onChange={(e) => {
                formRecord[field.name] = e.target.value;
              }}
            />
          </Fragment>
        );
      case "boolean":
        return (
          <Fragment key={field.name}>
            <label htmlFor={field.name}>
              {field.name.replaceAll("_", " ")}
            </label>
            <input
              type="checkbox"
              id={field.name}
              defaultChecked={formRecord[field.name]}
              onChange={(e) => {
                formRecord[field.name] = e.target.checked;
              }}
            />
          </Fragment>
        );
      case "object":
        return (
          <Fragment key={field.name}>
            <div>{field.name.replaceAll("_", " ")}</div>
            <Popup
              nested
              position="bottom center"
              trigger={
                <div>
                  {Object.keys(selectedSubRecords).length === 0
                    ? "Add..."
                    : JSON.stringify(selectedSubRecords)}
                </div>
              }
            >
              <RecordSelectionDropdown
                tableName={tableName}
                selectedRecords={selectedSubRecords}
                setRecordSelection={setSubRecordSelection}
              />
            </Popup>
          </Fragment>
        );
      default:
        console.error("invalid type: ", field.type);
    }
  }

  function handleDelete(e) {
    if (recordId) deleteRecord(tableName, recordId);
  }

  function handleSave() {
    // TODO check input validity
    let newId = generateUID();
    if (!recordId) {
      setRecordId(newId);
    }
    setFormRecord((prev) => {
      schema.forEach((field) => {
        if (field.type === "formula") delete prev[field.name];
      });
      return prev;
    });
    saveRecord(tableName, recordId ? recordId : newId, formRecord);
  }

  function recordForm() {
    return (
      <form onSubmit={handleSave} className="record-popup">
        <div className="record-popup-inputs">
          {schema.map((field) => fieldInput(field))}
        </div>
        <div>
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    );
  }

  return <div>{recordForm()}</div>;
};

export default Record;
