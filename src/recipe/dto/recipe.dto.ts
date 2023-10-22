import { IsNotEmpty, IsOptional, IsString, Length, MaxLength, Min } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  // TODO: transforming/validating
  ingredients: { type: string; name: string; quantity: string }[];

  @MaxLength(90, {
    each: true,
  })
  steps: string[];

  @Min(0, { each: true })
  timers: number[];

  @IsString()
  imageURL: string;

  @IsOptional()
  @IsString()
  originalURL: string;
}
