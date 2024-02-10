import React from "react";

const Table = ({ schema, records, userSettings }) => {
  // TODO split into components and export to default and specialized files
  return (
    <div>
      <div>buttons</div>
      <table>
        <thead>
          <tr>
            {schema.map((field) => {
              if (userSettings.hiddenFields.includes(field.name)) return;
              return <th scope="col">{field.name.replace("_", " ")}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {Object.keys(records).map((recordId) => {
            return (
              <tr>
                <th scope="row" className="recordId">
                  {recordId}
                </th>
                {schema.map((field) => {
                  if (field.name === "id") return;
                  if (userSettings.hiddenFields.includes(field.name)) return;
                  return (
                    <td className={field.name}>
                      {typeof records[recordId][field.name] === "object"
                        ? JSON.stringify(records[recordId][field.name])
                        : records[recordId][field.name]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
