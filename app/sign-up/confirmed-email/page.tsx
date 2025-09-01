'use client'

import {ConfirmedEmail} from "@/src/feature/auth/ui/SignUp/ConfirmedEmail/ConfirmedEmail";
import {FlexContainer} from "@/src/common/components/FlexContainer";

export default function ConfirmedEmailPage() {
    return <FlexContainer justify={"center"}>
        <ConfirmedEmail/>
    </FlexContainer>
}
