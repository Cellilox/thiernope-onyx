import { IconProps } from "@/icons";

const OnyxLogo = ({
  width = 24,
  height = 24,
  className,
  size,
}: IconProps) => (
  <img
    src="/cellilox-logo.png"
    alt="Cellilox Logo"
    width={size || width}
    height={size || height}
    className={className}
    style={{ objectFit: "contain" }}
  />
);
export default OnyxLogo;
