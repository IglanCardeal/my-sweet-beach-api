export interface BeachDTO {
  _id?: string
  lat: number
  lng: number
  name: string
  position: string
  user: string
}

export interface BeachRepo {
  create: (beach: BeachDTO) => Promise<void>
}

export class BeachService {
  private readonly beachRepo: BeachRepo

  constructor (beachRepo: BeachRepo) {
    this.beachRepo = beachRepo
  }

  public async createBeach (beach: BeachDTO): Promise<void> {
    this.validate(beach)

    await this.beachRepo.create(beach)
  }

  private validate (beach: BeachDTO) {
    this.validatePosition(beach.position)
  }

  private validatePosition (position: string): void {
    const validPositions = ['S', 'E', 'W', 'N']

    if (!validPositions.includes(position)) {
      throw new Error('')
    }
  }
}
