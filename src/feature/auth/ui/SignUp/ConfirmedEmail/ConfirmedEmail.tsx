import styles from './ConfirmedEmail.module.scss'
import {FlexContainer} from "@/src/shared/components/FlexContainer";
import {Button} from "@/src/shared/components/Button/Button";
import Image from "next/image";
import confirmedEmailImage from "@/public/sign-up/confirmed-email.svg"
import {useRouter} from "next/navigation";
import {Path} from "@/src/shared/components/Navigation/Navigation";

export const ConfirmedEmail = () => {
    const {push} = useRouter()
    return (
        <section className={styles.section}>
            <FlexContainer direction={"column"} justify={"center"} align={"center"}>
                <h1 className={styles.title}>
                    Congratulations!
                </h1>
                <p className={styles.text}>
                    Your email has been confirmed
                </p>
                <Button className={styles.button} type={"button"} size={"large"}  onClick={() => push(Path.SignIn)}>Sign In</Button>
                <Image className={styles.image} src={confirmedEmailImage} alt={"Image confirmed email"} width={432} height={300}></Image>
            </FlexContainer>
        </section>
    );
};

