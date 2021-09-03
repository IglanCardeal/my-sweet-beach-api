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
    await this.beachRepo.create(beach)
  }
}
