import s from "./skeleton.module.scss";

type Props = {
    width?: string,
    height?: string,
    radius?: string,
    className?: string,
    border?: string
}

export const Skeleton = ({width, height, radius, border, className} : Props) => {
    return (
        <div style={{width, height, borderRadius: radius, border}} className={`${s.skeleton} ${className}`}></div>
    );
};