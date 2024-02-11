import React, { Fragment } from "react";
import { generateUID } from "../../utils/helpers";
import { useStateContext } from "../../utils/StateContext";

const Record = ({ tableName, schema, id, record }) => {
  const { saveRecord, deleteRecord } = useStateContext();

  let formRecord = { ...record };
  schema.forEach((field) => {
    if (field.type === "formula") delete formRecord[field.name];
  });
  if (!id) id = generateUID();

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
            <div id={field.name}>{id}</div>
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
              defaultValue={Number.parseFloat(formRecord[field.name])}
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
            <div>{JSON.stringify(formRecord[field.name])}</div>
          </Fragment>
        );
      default:
        console.error("invalid type: ", field.type);
    }
  }

  function handleDelete(e) {
    deleteRecord(tableName, id);
  }

  function handleSave() {
    // TODO check input validity
    saveRecord(tableName, id, formRecord);
  }

  function recordForm() {
    return (
      <div>
        {schema.map((field) => fieldInput(field))}
        <div>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    );
  }

  return <div>{recordForm()}</div>;
};

export default Record;
