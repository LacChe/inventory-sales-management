import React, { Fragment } from "react";
import { generateUID } from "../../utils/helpers";
import { useStateContext } from "../../utils/StateContext";

const Record = ({ tableName, schema, id, record }) => {
  let formRecord = { ...record };
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
          <textarea id={field.name} defaultValue={formRecord[field.name]} />
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
              defaultValue={formRecord[field.name]}
            />
          </Fragment>
        );
      case "string":
        return (
          <Fragment key={field.name}>
            <label htmlFor={field.name}>
              {field.name.replaceAll("_", " ")}
            </label>
            <input id={field.name} defaultValue={formRecord[field.name]} />
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

  function deleteRecord() {
    console.log("delete ", formRecord);
  }

  function saveRecord() {
    console.log("save ", formRecord);
  }

  function recordForm() {
    return (
      <form>
        {schema.map((field) => fieldInput(field))}
        <div>
          <button onClick={deleteRecord}>Delete</button>
          <button onClick={saveRecord}>Save</button>
        </div>
      </form>
    );
  }

  return <div>{recordForm()}</div>;
};

export default Record;
