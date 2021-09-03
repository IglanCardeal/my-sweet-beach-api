import { BeachDTO } from '../baech-dto'

export interface BeachRepo {
  create: (beach: BeachDTO) => Promise<void>
}
