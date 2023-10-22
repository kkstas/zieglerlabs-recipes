import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type RecipeDocument = HydratedDocument<Recipe>;

@Schema()
class Ingredient extends Document {
  @Prop()
  quantity: string;

  @Prop()
  name: string;

  @Prop({ type: String })
  type: string;
}

export const ingredientSchema = SchemaFactory.createForClass(Ingredient);

@Schema({ collection: 'recipes' })
export class Recipe extends Document {
  @Prop()
  name: string;

  @Prop({ type: [ingredientSchema], _id: false })
  ingredients: Array<Ingredient>;

  @Prop([String])
  steps: string[];

  @Prop([Number])
  timers: number[];

  @Prop()
  imageURL: string;

  @Prop()
  originalURL: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
