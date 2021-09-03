import { BeachDTO } from '../beach-dto'

export interface BeachRepo {
  create: (beach: BeachDTO) => Promise<void>
  findBeachesByUserId: (userId: string) => Promise<BeachDTO[]>
}
