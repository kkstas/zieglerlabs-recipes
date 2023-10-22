import { Controller, Get } from '@nestjs/common';
import { RecipeService } from './recipe.service';

@Controller()
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get('/recipes')
  listRecipes() {
    return this.recipeService.listRecipes();
  }
}
