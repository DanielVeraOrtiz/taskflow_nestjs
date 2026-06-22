// No se utiliza ni para body de request ni para response, por lo que no se considera necesario
// utilizar class validator o ApiProperty de swagger.
export class JwtPayloadDto {
  sub!: number;
  email!: string;
}
