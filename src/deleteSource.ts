import fetch from "node-fetch";

interface Success {
  type: "success";
  message: string;
}
interface Failure {
  type: "failure";
  message: string;
}

export async function deleteSource(user: string, accessToken: string, sourceName: string): Promise<Success | Failure> {
  const url = `https://api.mapbox.com/tilesets/v1/sources/${user}/${sourceName}?access_token=${accessToken}&pluginName=RealtimeMappingArchitecture`;
  try {
    const response = await fetch(url, { method: "DELETE" });
    const text = await response.text();
    if (response.ok) {
      return { type: "success", message: text };
    } else {
      return { type: "failure", message: text };
    }
  } catch (err) {
    return { type: "failure", message: err.message };
  }
}
