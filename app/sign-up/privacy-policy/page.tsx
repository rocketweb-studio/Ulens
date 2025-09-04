'use client'

import {FlexContainer} from "@/src/shared/components/FlexContainer";
import {PrivacyPolicy} from "@/src/feature/auth/ui/SignUp/PrivacyPolicy";

export default function PrivacyPolicyPage() {
    return <FlexContainer justify={"center"}>
        <PrivacyPolicy/>
    </FlexContainer>
}
