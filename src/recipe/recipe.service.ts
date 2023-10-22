import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe } from './model/recipe.schema';
import { CreateRecipeDto } from './dto/recipe.dto';
import * as fs from 'fs';
import * as path from 'path';

/**
 *  ## Exercise 1
 *  Please build a backend app that will be written in Nest.js and will use MongoDB.
 *
 *  API needs to be able to:
 *  TODO: - return a list of all possible unique ingredients (variations of products can be treated as unique ones)
 *
 *  TODO: - return a list of all possible unique ingredient types (baking/drinks etc)
 *
 *  TODO: - return a list of all possible recipes (with support for pagination)
 *
 *  TODO: - return all of the recipes that use the provided products
 *
 *  TODO: - return all of the recipes whose total cook time (sum of timers) will not exceed the provided value
 *
 *  TODO: - return one recipe by provided ID
 *
 *  Tips:
 *  - You can normalize data, add IDs etc.
 *  - There should be a data migration that will sync the data from the JSON with the local DB only once (at the initial app start)
 */

@Injectable()
export class RecipeService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<Recipe>) {}

  async listRecipes() {
    return await this.recipeModel.find();
  }

  /**
   * Parses and inserts data from the `mock-data.json`
   * file into the database. Contents of the file are
   * known, so data validation is not performed here.
   *
   */
  async onModuleInit(): Promise<void> {
    await this.recipeModel.deleteMany();
    const mockFile = fs
      .readFileSync(path.join(process.cwd(), './mock-data.json'), 'utf-8')
      .toString();
    const mockData = JSON.parse(mockFile);

    const recipes = mockData.map((el: CreateRecipeDto) => {
      el.name = el.name.trim();
      el.ingredients = el.ingredients.map((ingredient) => ({
        name: ingredient.name.trim(),
        quantity: ingredient.quantity.trim(),
        type: ingredient.type.trim(),
      }));
      el.steps = el.steps.map((step) => step.trim());
      return el;
    });

    await this.recipeModel.create(recipes);
  }
}
