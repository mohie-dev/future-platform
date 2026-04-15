import { IsUUID } from "class-validator";

export class AddPrerequisiteDto {
  @IsUUID()
  prerequisiteId: string;
}