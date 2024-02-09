import React, {
  createContext,
  useContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { readFile } from "./eventHandler";

const Context = createContext(null);

export const StateContext = ({ children }) => {
  const [fileData, setFileData] = useState();
  useEffect(() => {
    let promises = new Map();
    promises.set("inventory", readFile("inventory"));
    promises.set("products", readFile("products"));
    promises.set("equipment", readFile("equipment"));
    promises.set("transactions", readFile("transactions"));
    promises.set("tableSchemas", readFile("tableSchemas"));
    promises.set("userSettings", readFile("userSettings"));

    Promise.all(promises).then((values) => {
      setFileData((prev) => {
        let newFileData = {};
        // index 0 of promiseArr is the file name
        // index 1 of promiseArr is the promise
        values.forEach((promiseArr) => {
          promiseArr[1].then((data) => {
            newFileData[promiseArr[0]] = JSON.parse(data);
          });
        });
        return newFileData;
      });
    });
  }, []);

  return (
    <Context.Provider
      value={{
        fileData,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
