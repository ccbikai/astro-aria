import { photographyData } from '#data/PhotographyData'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  Title: string
}

const Photo = ({ Title }: Props) => {
  const data = photographyData.find(item => item.title === Title)

  if (!data) {
    return null // or render a fallback component
  }

  const { title, amount, date: PublishDate } = data
  const Year = PublishDate.slice(0, 4)
  const Url = `/photography#` + title.toLowerCase()

  return (
    <>
      {Array.from(Array(amount).keys()).map(index => {
        const number = (index + 1).toString().padStart(4, '0')
        const titleLowerCase = title.toLowerCase()

        return (
          <Image
            key={number}
            src={require(
              `public/images/photography/${PublishDate}_${titleLowerCase}/${number}.jpg`,
            )}
            alt={`Aozaki ©️ ${Year}`}
            quality={95}
            placeholder="blur"
            loading="lazy"
          />
        )
      })}
      <div className="pt-2 text-center text-sm">
        <p>Copyright © {Year} Aozaki All rights reserved.</p>
        <p>[ DO NOT REPOST ]</p>
        <p>
          For other photo works, please <Link href={Url}>Click HERE</Link>
        </p>
      </div>
    </>
  )
}

export default Photo
