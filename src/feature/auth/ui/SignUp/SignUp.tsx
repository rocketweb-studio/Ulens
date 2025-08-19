import {Input} from "@/src/common/components/Input/Input";
import styles from "./SignUp.module.scss"
import {Button} from "@/src/common/components/Button/Button";

export const SignUp = () => {
    return (
        <div className={styles.formWrapper}>
            <form className={styles.form}>
                <h2 className={styles.title}>Sign Up</h2>
                <div className={styles.oAuthWrapper}>
                    <Button>Google</Button>
                    <Button>Github</Button>
                </div>
                <div className={styles.inputsTextWrapper}>
                    <Input name={"Username"} placeholder={"Epam11"} label={"Username"}/>
                    <Input name={"Email"} placeholder={"Epam@epam.com"} label={"Email"}/>
                    <Input name={"Password"} label={"Password"}/>
                    <Input name={"PasswordConfirmation"} label={"Password Confirmation"}/>
                </div>
                <div className={styles.signUpWrapper}>
                    <Input name={"Privacy Policy"} label={"I agree to the Terms of Service and Privacy Policy"}
                           type={"checkbox"}/>
                    <Button>Sign Up</Button>
                </div>
                <div className={styles.signInWrapper}>
                    <p className={styles.signInText}>
                        Do you have an account?
                    </p>
                    <Button variant={"text"}>Sign In</Button>
                </div>
            </form>
        </div>
    );
};

