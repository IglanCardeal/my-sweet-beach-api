import { CreateBeachService } from '../create-beach-service'

describe('Create Beach Service', () => {
  it('should have a "execute" method defined', () => {
    const fakeRepositoy = {
      create: async () => {
        return
      }
    }
    const beachService = new CreateBeachService(fakeRepositoy)

    expect(beachService.execute).toBeDefined()
  })
})
