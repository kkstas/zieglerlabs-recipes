import { PartialType } from '@nestjs/swagger';
import { Recipe } from './recipe.schema';

export class RecipePayload extends PartialType(Recipe) {
  createdAt?: string;
  updatedAt?: string;
}
