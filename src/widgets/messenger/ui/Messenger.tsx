import { FlexContainer } from '@rocketweb-studio/ulens-ui-kit'
import s from './messenger.module.scss'
import { PreviewList } from '@/src/widgets/messenger/ui/PreviewList/PreviewList'

export const Messenger = () => {
  return (
    <FlexContainer>
      <div className={s.messenger}>
        <div className={s.search}></div>
        <div className={s.header}></div>
        <div className={}>
          <PreviewList />
        </div>
        <div className={s.chatView}></div>
        <div className={s.sendMessage}></div>
      </div>
    </FlexContainer>
  )
}
