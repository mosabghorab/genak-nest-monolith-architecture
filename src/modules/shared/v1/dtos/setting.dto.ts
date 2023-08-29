import { Expose } from 'class-transformer';

export class SettingDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  key: string;

  @Expose()
  value: string;

  @Expose()
  group: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
