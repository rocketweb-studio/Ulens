import {Navigation, Path} from "@/src/common/components/Navigation/Navigation";
import s from "./Header.module.scss";
import Link from "next/link";
import {FlexContainer} from "@/src/common/components/FlexContainer";

export const Header = () => {
    return (
        <header>
            <FlexContainer justify="between">
                <div className={s.logotype}><Link href={Path.Main}>Ulens</Link></div>
                <Navigation/>
            </FlexContainer>
        </header>
    );
}
