import Image from "next/image";
import s from "./UserAvatar.module.scss";

type Props = {
  width: number,
  height: number,
  avatarOwner: string | null
  userName: string
};
export const UserAvatar = ({userName,avatarOwner,height,width}: Props) => {
  return (
    <>
      {avatarOwner
        ? <Image className={s.avatarImage} src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${avatarOwner}`}
                 alt={'avatar'} height={height} width={width}></Image>
        : <div className={s.avatarText} style={{height,width}}>
          {userName.slice(0, 2).toUpperCase()}
        </div>}
    </>
  );
};