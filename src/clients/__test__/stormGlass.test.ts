import { StormGlass } from '@src/clients/stormGlass'

import axios from 'axios'

// mockando o axios
jest.mock('axios')

describe('StormGlass Client', () => {
  it('should load StormGlass class from stormGlass.ts file', () => {
    expect(StormGlass).toBeDefined()

    // console.log('axios hoisted', axios.get)
  })

  it('should return StormGlass objects with some metadata', async () => {
    const lat = -1.4333344573775566
    const long = -48.48368604061809

    // faz o mock da resposta da API
    axios.get = jest.fn().mockResolvedValue({})

    const stormGlass = new StormGlass(axios)
    const response = await stormGlass.fetchPoints(lat, long)

    expect(response).toEqual({})
  })
})

// lat -1.4333344573775566, long -48.48368604061809
