'use client'

import {SignUp} from "@/src/feature/auth/ui/SignUp";
import {FlexContainer} from "@/src/common/components/FlexContainer";

export default function SingUpPage() {
    return <div>
        <FlexContainer justify={"center"} align={"center"} style={{minHeight: "100VH"}}>
            <SignUp/>
        </FlexContainer>
    </div>
}