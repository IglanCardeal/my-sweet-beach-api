import { BeachDTO } from '../beach-dto'
import { GetUserBeachesService } from '../get-user-beaches-service'
import { beaches, InMemoryRepo } from './in-memory-repository'

const USER_ID = '123456'
const beach: BeachDTO = {
  user: USER_ID,
  lat: 1,
  lng: 1,
  name: 'fake beach',
  position: 'E'
}

describe('Get User Beaches', () => {
  beforeAll(() => {
    beaches.push(beach)
  })

  describe('Pre Conditions', () => {
    it('should have an "execute" method defined', () => {
      const getUserBeaches = new GetUserBeachesService(new InMemoryRepo())

      expect(getUserBeaches.execute).toBeDefined()
    })

    it('should "beachs" in memory repository have at least one beach', () => {
      expect(beaches).toHaveLength(1)
    })
  })

  it('should return at least one beach for a given user', async () => {
    const getUserBeaches = new GetUserBeachesService(new InMemoryRepo())
    const result = await getUserBeaches.execute(USER_ID)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(beach)
  })
})
