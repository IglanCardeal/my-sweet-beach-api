/* eslint-disable no-unused-vars */
import { StormGlassHttpClient } from '@src/clients/stormglass-http-client'

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
}

interface Beach {
  lat: number
  lng: number
  name: string
  user: string
  position: BeachPosition
}

/**
 * @param  {} stormGlass - classe cliente para chamadas HTTP do Storm Glass.
 * Default: {@link StormGlassHttpClient}
 */
export class ForecastService {
  constructor (protected stormGlass = new StormGlassHttpClient()) {}

  public processForecastForBeaches (beaches: Beach[]): void {
    console.log(beaches[0], this.stormGlass)
  }
}
