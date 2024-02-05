declare global {
  interface Window {
    api: any;
  }
}

export async function readFile(fileName: string) {
  let fileData;
  await window.api.readFile(fileName).then(({ error, data }: any) => {
    if (error) {
      console.log("read file error", error);
    } else {
      fileData = data;
    }
  });
  return fileData;
}
