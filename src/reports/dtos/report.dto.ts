import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/user.entity';

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lng: number;
  @Expose()
  lat: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  mileage: number;
  @Expose()
  approved: boolean;

  // obj is a reference to the original report entity
  // the obj line says: take the original report entity
  // look at its user property and look at that user id
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
