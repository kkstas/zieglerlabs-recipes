import { Controller, Param, Get, Query } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { PaginationParams } from './dto/pagination-params.dto';
import { ParamsWithId } from './dto/params-with-id.dto';

@Controller()
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get('/recipes')
  listRecipes(@Query() { skip, limit }: PaginationParams) {
    return this.recipeService.listRecipes(skip, limit);
  }

  @Get('/:id')
  getRecipeById(@Param() { id }: ParamsWithId) {
    return this.recipeService.getRecipeById(id);
  }
}
