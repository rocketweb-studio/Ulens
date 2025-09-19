import Image from 'next/image'
import s from './userProfile.module.scss'
import photo1 from '@/src/assets/postsTmp/1.png'
import photo2 from '@/src/assets/postsTmp/2.png'
import photo3 from '@/src/assets/postsTmp/3.png'
import photo4 from '@/src/assets/postsTmp/4.png'
import photo5 from '@/src/assets/postsTmp/5.jpg'
import photo6 from '@/src/assets/postsTmp/6.png'
import photo7 from '@/src/assets/postsTmp/7.png'
import photo8 from '@/src/assets/postsTmp/8.png'
import {UserProfileActions} from "@/src/feature/userProfile/ui/UserProfile/UserProfileActions/UserProfileActions";

type Props = {
  userId: string
}

const postsArr = [
  {id: 0, image: photo1, alt: ''},
  {id: 1, image: photo2, alt: ''},
  {id: 2, image: photo3, alt: ''},
  {id: 3, image: photo4, alt: ''},
  {id: 4, image: photo5, alt: ''},
  {id: 5, image: photo6, alt: ''},
  {id: 6, image: photo7, alt: ''},
  {id: 7, image: photo8, alt: ''},
  {id: 11, image: photo4, alt: ''},
  {id: 10, image: photo3, alt: ''},
  {id: 9, image: photo2, alt: ''},
  {id: 8, image: photo1, alt: ''},
]

export const UserProfile = ({ userId }: Props) => {
  return (
      <div className={s.profileWrapper}>
        <div className={s.profileHeader}>
          <div className={s.profileAvatar}>
              <Image src={photo3} alt={'avatar'}/>
          </div>
          <div className={s.profileInfo}>
              <div className={s.nameAndFollowRow}>
                  <h1>UserName</h1>
                  <UserProfileActions/>
              </div>
              <div className={s.statisticRow}>
                  <div className={s.statisticItem}>
                      <strong>2218</strong>
                      <span>Following</span>
                  </div>
                  <div className={s.statisticItem}>
                      <strong>2358</strong>
                      <span>Followers</span>
                  </div>
                  <div className={s.statisticItem}>
                      <strong>2764</strong>
                      <span>Publications</span>
                  </div>
              </div>
              <div className={s.aboutUser}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur dolor ex hic iusto nulla optio
                  sed totam voluptatem? Adipisci aliquid amet corporis deleniti earum eligendi error ipsum iste labore
                  nobis, perferendis quas quasi rem soluta suscipit veniam vero voluptatem voluptatum? Accusamus aliquam
                  architecto facilis ipsa, maxime non quasi quis sit. Adipisci aliquid amet corporis deleniti earum
                  eligendi error ipsum iste labore nobis, perferendis quas quasi rem soluta suscipit veniam vero
                  voluptatem voluptatum? Accusamus aliquam architecto facilis ipsa, maxime non quasi quis sit.
              </div>
          </div>
        </div>
        <div className={s.profilePosts}>
          {postsArr?.map((post, index) => (
              <div key={index} className={s.postItem}>
                  <Image src={post.image} alt={post.alt} fill style={{ objectFit: 'cover' }}/>
              </div>
          ))}
        </div>
      </div>
  )
}
