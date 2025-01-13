import { microCmsClient } from '~/modules/libs'
import { Profile } from '~/types'

export class ProfileRepository {
  private readonly client: typeof microCmsClient

  constructor(client: typeof microCmsClient) {
    this.client = client
  }

  async get(): Promise<Profile> {
    const res = await this.client.get<Profile>({
      endpoint: 'profile',
    })

    return res
  }
}
