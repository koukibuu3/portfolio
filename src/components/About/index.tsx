import Image from 'next/image'

import { Profile } from '~/types'

type Props = {
  profile: Profile
}

const PROFILE_IMAGE_SIZE = 98

export const About: React.FC<Props> = ({ profile }) => {
  return (
    <>
      <div className="flex gap-6 mt-6 m-4">
        <div className="col-span-1">
          <Image
            src={`${profile.mainImage.url}?w=${PROFILE_IMAGE_SIZE}&h=${PROFILE_IMAGE_SIZE}`}
            alt="プロフィール画像"
            width={PROFILE_IMAGE_SIZE}
            height={PROFILE_IMAGE_SIZE}
          />
        </div>
        <div className="m-4">
          <div className="text-2xl font-semibold mb-4">{profile.name}</div>
          <dl className="flex gap-1 text-base font-semibold">
            <dt>ID:</dt>
            <dd>{profile.handleName}</dd>
          </dl>
        </div>
      </div>
      <div className="m-6 font-semibold">
        <p className="text-base mb-4">{profile.body}</p>
        <dl className="grid grid-cols-4 gap-3 text-sm my-2">
          {profile.links.map((link) => (
            <>
              <dt className="col-span-1">{link.name}</dt>
              <dd className="col-span-3">
                <a
                  href={link.url}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  {link.url}
                </a>
              </dd>
            </>
          ))}
        </dl>
      </div>
    </>
  )
}
