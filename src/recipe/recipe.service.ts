import { Injectable, NotFoundException } from '@nestjs/common';
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
 *  DONE - return a list of all possible unique ingredient types (baking/drinks etc)
 *
 *  DONE - return a list of all possible recipes (with support for pagination)
 *
 *  TODO: - return all of the recipes that use the provided products
 *
 *  DONE - return all of the recipes whose total cook time (sum of timers) will not exceed the provided value
 *
 *  DONE - return one recipe by provided ID
 *
 *  Tips:
 *  - You can normalize data, add IDs etc.
 *  - There should be a data migration that will sync the data from the JSON with the local DB only once (at the initial app start)
 */

@Injectable()
export class RecipeService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<Recipe>) {}

  /**
   * Returns a list of all unique ingredient types
   *
   * @returns list of strings with all unique ingredient type names
   */
  async getUniqueIngredientTypes(): Promise<string[]> {
    const result = await this.recipeModel.aggregate([
      { $unwind: { path: '$ingredients' } },
      { $group: { _id: '$ingredients.type' } },
      { $sort: { _id: 1 } },
    ]);
    return result.map((el) => el._id);
  }

  /**
   * Returns all recipes with cooking time less than `maxTime`
   *
   * @param maxTime - maximum cooking time for recipes
   * @returns `Recipe` list
   */
  async getRecipesWithCookTimeLessThan(maxTime: number): Promise<Recipe[]> {
    const recipes = await this.recipeModel.aggregate([
      { $addFields: { totalTime: { $sum: '$timers' } } },
      { $match: { totalTime: { $lt: maxTime } } },
      { $unset: 'totalTime' },
    ]);
    return recipes;
  }

  /**
   * Returns single recipe from database.
   *
   * @param id - id of the `Recipe`
   * @returns `Recipe`
   */
  async getRecipeById(id: string): Promise<Recipe> {
    const recipe = await this.recipeModel.findOne({ _id: id });
    if (!recipe) throw new NotFoundException(`Recipe with id ${id} not found`);
    return recipe;
  }

  /**
   * Returns recipes from database.
   *
   * @param [skip=0] - number of recipes to skip
   * @param [limit=5] - limit of recipes returned
   * @returns `Recipe` list
   */
  async listRecipes(skip = 0, limit = 5): Promise<Recipe[]> {
    const recipes = await this.recipeModel.find().sort({ _id: 1 }).skip(skip).limit(limit);
    return recipes;
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
