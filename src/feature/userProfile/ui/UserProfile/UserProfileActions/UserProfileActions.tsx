'use client'

import { Button } from "@/src/shared/components/Button/Button"
import { FlexContainer } from "@/src/shared/components/FlexContainer"

export const UserProfileActions = () => {
    const handleFollow = () => {
        console.log('handleFollow')
    }

    const handleSendMessage = () => {
        console.log('handleSendMessage')
    }

    return (
        <FlexContainer gap={'15px'}>
            <Button size={"medium"} variant={'primary'} buttonHandler={handleFollow}>
                Follow
            </Button>
            <Button size={"medium"} variant={'secondary'} buttonHandler={handleSendMessage}>
                Send Message
            </Button>
        </FlexContainer>
    )
}