import { BeachRepo as CreateBeachRepo } from '../create-beach-service'
import { BeachRepo as GetUserBeachRepo } from '../get-user-beaches-service'

export interface BeachRepository extends CreateBeachRepo, GetUserBeachRepo {}
