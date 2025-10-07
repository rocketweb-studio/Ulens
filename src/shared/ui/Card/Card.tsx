import {ComponentProps, ReactNode} from "react";
import s from "./Card.module.scss";

type Props = {
  children: ReactNode;
} & ComponentProps<'div'>
export const Card = ({children, className, ...props}: Props) => {
  return (
    <div className={`${s.cardContainer} ${className}`} {...props}>
      {children}
    </div>
  );
};