import { uploadSource } from "./uploadSource";
import { uploadRecipe } from "./uploadRecipe";

export class TilesetsAPI {
  accessToken: string;
  username: string;

  constructor(username: string, accessToken: string) {
    this.accessToken = accessToken;
    this.username = username;
  }

  /// Upload a newline-delimited geojson file for use as a data source
  uploadSource(stream: NodeJS.ReadableStream, name: string) {
    uploadSource(this.username, this.accessToken, stream, name);
  }

  /// Upload a recipe for generating tilesets
  uploadRecipe(recipe: JSON, name: string) {
    uploadRecipe(this.username, this.accessToken, recipe, name);
  }
}
