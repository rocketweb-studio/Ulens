import style from './ConfirmedEmail.module.scss'
import {FlexContainer} from "@/src/common/components/FlexContainer";
import {Button} from "@/src/common/components/Button/Button";
import Image from "next/image";
import confirmedEmailImage from "@/public/sign-up/confirmed-email.svg"
import {useRouter} from "next/navigation";
import {Path} from "@/src/common/components/Navigation/Navigation";

export const ConfirmedEmail = () => {
    const {push} = useRouter()
    return (
        <FlexContainer direction={"column"} justify={"center"} align={"center"}>
                <h1 className={style.title}>
                    Congratulations!
                </h1>
                <p className={style.text}>
                    Your email has been confirmed
                </p>
                <Button className={style.button} type={"button"} onClick={() => push(Path.SignIn)}>Sign In</Button>
                <Image className={style.image} src={confirmedEmailImage} alt={"Image confirmed email"} width={432} height={300}></Image>
        </FlexContainer>

    );
};

