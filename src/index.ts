import {listSources} from './listSources';
import {listTilesets} from './listTilesets';
import {publishTileset} from './publishTileset';
import {uploadRecipe} from './uploadRecipe';
import {uploadSource} from './uploadSource';
import {validateRecipe} from './validateRecipe';

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

  /// Enumerates all tilesets owned by the given account
  async listTilesets() {
    return listTilesets(this.username, this.accessToken);
  }

  /// Enumerates all tileset sources owned by the given account
  async listSources() {
    return listSources(this.username, this.accessToken);
  }

  createRecipeTemplate(sourceName: string) {
    return {sorry: 'bad template'};
  }
}
