import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe } from './model/recipe.schema';
import { CreateRecipeDto } from './dto/recipe.dto';
import * as fs from 'fs';
import * as path from 'path';
import { RecipePayload } from './model/recipe.payload';

@Injectable()
export class RecipeService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<RecipePayload>) {}

  /**
   * Returns a list of all unique ingredients
   *
   * @returns list of strings with all unique ingredients
   */
  async getUniqueIngredients(): Promise<string[]> {
    const result = await this.recipeModel.aggregate([
      { $unwind: { path: '$ingredients' } },
      { $group: { _id: '$ingredients.name' } },
      { $sort: { _id: 1 } },
    ]);
    return result.map((el) => el._id);
  }

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
  async getRecipesWithCookTimeLessThan(maxTime: number): Promise<RecipePayload[]> {
    const recipes = await this.recipeModel.aggregate([
      { $addFields: { totalTime: { $sum: '$timers' } } },
      { $match: { totalTime: { $lt: maxTime } } },
      { $unset: 'totalTime' },
    ]);
    return recipes;
  }

  /**
   * Return all recipes that use provided product(s)
   *
   * @param products - array of product(s) (e.g. salt, sugar)
   * @returns `Recipe` list
   */
  async getRecipesThatUseProvidedProducts(products: string[]): Promise<RecipePayload[]> {
    let matches = products.map((prod) => ({ $match: { 'ingredients.name': { $eq: prod } } }));
    const recipes = await this.recipeModel.aggregate([...matches]);
    return recipes;
  }

  /**
   * Returns single recipe from database.
   *
   * @param id - id of the `Recipe`
   * @returns `Recipe`
   */
  async getRecipeById(id: string): Promise<RecipePayload> {
    const recipe = await this.recipeModel.findOne({ _id: id });
    return recipe;
  }

  /**
   * Returns recipes from database.
   *
   * @param [skip=0] - number of recipes to skip
   * @param [limit=5] - limit of recipes returned
   * @returns `Recipe` list
   */
  async listRecipes(skip = 0, limit = 5): Promise<RecipePayload[]> {
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
