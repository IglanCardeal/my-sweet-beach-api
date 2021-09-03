import { BeachDTO } from '../beach-dto'
import { beaches } from './in-memory-repository'

class GetUserBeachesService {
  constructor (private readonly beachRepo: unknown) {}

  public async execute (): Promise<void> {
    return
  }
}

describe('Get User Beaches', () => {
  const beach: BeachDTO = {
    user: 'fake-id',
    lat: 1,
    lng: 1,
    name: 'fake beach',
    position: 'E'
  }

  beaches.push(beach)

  describe('Pre Conditions', () => {
    it('should have an "execute" method defined', () => {
      const getUserBeaches = new GetUserBeachesService(null)

      expect(getUserBeaches.execute).toBeDefined()
    })

    it('should "beachs" in memory repository have at least one beach', () => {
      expect(beaches).toHaveLength(1)
    })
  })

  it('should return at least one beach for a given user', async () => {
    const getUserBeaches = new GetUserBeachesService(null)

    expect(getUserBeaches.execute).toBeDefined()
  })
})
