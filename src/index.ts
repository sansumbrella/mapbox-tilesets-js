import { uploadSource } from "./uploadSource";
import { uploadRecipe } from "./uploadRecipe";
import { validateRecipe } from "./validateRecipe";
import { publishTileset } from "./publishTileset";

export class TilesetsAPI {
  accessToken: string;
  username: string;

  constructor(username: string, accessToken: string) {
    this.accessToken = accessToken;
    this.username = username;
  }

  /// Upload a newline-delimited geojson file for use as a data source
  async uploadSource(stream: NodeJS.ReadableStream, name: string) {
    return uploadSource(this.username, this.accessToken, stream, name);
  }

  /// Upload a recipe for generating tilesets
  async uploadRecipe(recipe: string, name: string) {
    return uploadRecipe(this.username, this.accessToken, recipe, name);
  }

  /// Validate recipe against spec
  async validateRecipe(recipe: string) {
    return validateRecipe(this.accessToken, recipe);
  }

  async publishTileset(name: string) {
    return publishTileset(this.accessToken, `${this.username}.${name}`);
  }

  createRecipeTemplate(sourceName: string) {
    return { sorry: "bad template" };
  }
}
