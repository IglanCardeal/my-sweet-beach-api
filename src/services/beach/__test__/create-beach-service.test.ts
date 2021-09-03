import { BeachDTO } from '../beach-dto'
import { CreateBeachService } from '../create-beach-service'
import { ParamError } from '../error'
import { beaches, InMemoryRepo } from './in-memory-repository'

describe('Create Beach Service', () => {
  beforeAll(() => {
    beaches.length = 0
  })

  describe('Pre Conditions', () => {
    it('should have an "execute" method defined', () => {
      const fakeRepositoy = {
        create: async () => {
          return
        }
      }
      const beachService = new CreateBeachService(fakeRepositoy)

      expect(beachService.execute).toBeDefined()
    })

    it('should "beachs" in memory repository to be empty', () => {
      expect(beaches).toHaveLength(0)
    })
  })

  it('should create a beach successfully', async () => {
    const beach: BeachDTO = {
      user: 'fake-id',
      lat: 1,
      lng: 1,
      name: 'fake beach',
      position: 'E'
    }
    const beachService = new CreateBeachService(new InMemoryRepo())

    await beachService.execute(beach)

    expect(beaches).toHaveLength(1)
  })

  it('should throw en error for an invalid beach position', async () => {
    const beach: BeachDTO = {
      user: 'fake-id',
      lat: 1,
      lng: 1,
      name: 'fake baech',
      position: 'incorrect-position'
    }
    const beachService = new CreateBeachService(new InMemoryRepo())

    await expect(beachService.execute(beach)).rejects.toThrowError()

    try {
      await beachService.execute(beach)
    } catch (error) {
      expect(error).toBeInstanceOf(ParamError)
    }
  })
})
