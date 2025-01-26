import ghPagesClient from '~/modules/libs/ghPagesClient'
import { Slide } from '~/types'

export class SlideRepository {
  private client: typeof ghPagesClient

  constructor() {
    this.client = ghPagesClient
  }

  async getAll(): Promise<Slide[]> {
    return await this.client.getAll()
  }
}

export default SlideRepository
