import { Controller, Get, Query } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { PaginationParams } from './dto/pagination-params.dto';

@Controller()
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get('/recipes')
  listRecipes(@Query() { skip, limit }: PaginationParams) {
    return this.recipeService.listRecipes(skip, limit);
  }
}
