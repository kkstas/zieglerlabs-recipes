import { Controller, Param, Get, Query, ParseIntPipe, ParseArrayPipe } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { PaginationParams } from './dto/pagination-params.dto';
import { ParamsWithId } from './dto/params-with-id.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get('/ingredients/unique')
  @ApiOperation({ summary: 'Get unique ingredients.' })
  @ApiResponse({ status: 200, description: 'list of unique ingredients' })
  getUniqueIngredients() {
    return this.recipeService.getUniqueIngredients();
  }

  @Get('/ingredients/types')
  @ApiOperation({ summary: 'Get unique ingredient types.' })
  @ApiResponse({ status: 200, description: 'list of unique ingredient type strings' })
  getUniqueIngredientTypes() {
    return this.recipeService.getUniqueIngredientTypes();
  }

  @Get('/recipes/products')
  @ApiOperation({ summary: 'List all recipes that use provided product(s) (e.g. "salt, sugar")' })
  @ApiResponse({ status: 200, description: 'list of recipes using provided product(s)' })
  getRecipesThatUseProvidedProducts(
    @Query('contains', new ParseArrayPipe({ items: String, separator: ',' }))
    contains: string[],
  ) {
    return this.recipeService.getRecipesThatUseProvidedProducts(contains);
  }

  @Get('/recipes')
  @ApiOperation({ summary: 'List all recipes (with pagination support).' })
  @ApiResponse({ status: 200, description: 'list of recipes' })
  listRecipes(@Query() { skip, limit }: PaginationParams) {
    return this.recipeService.listRecipes(skip, limit);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get recipe by id.' })
  @ApiResponse({ status: 200, description: 'recipe with matching id' })
  getRecipeById(@Param() { id }: ParamsWithId) {
    return this.recipeService.getRecipeById(id);
  }

  @Get('/')
  @ApiOperation({ summary: 'Get recipes with cooking time shorter than `maxTime`' })
  @ApiResponse({ status: 200, description: 'recipes within cooking time boundary' })
  getRecipesWithCookTimeLessThan(@Query('maxTime', ParseIntPipe) maxTime: number) {
    return this.recipeService.getRecipesWithCookTimeLessThan(maxTime);
  }
}
