import Image from "next/image";

interface Props {
  svgIcon: any;
  label: string;
  labelClass: string;
  labelColor: string;
  roundBackground: boolean;
}
const IconText: React.FC<Props> = ({
  svgIcon,
  label,
  labelClass,
  labelColor,
  roundBackground,
}): JSX.Element => {
  return (
    <div
      className="flex items-center shadow-none"
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {roundBackground ? (
        <div className="relative w-10 h-10 mr-2 flex items-center justify-center bg-white rounded-full">
          <Image src={svgIcon} alt="Icon" className="w-6 h-6" />
        </div>
      ) : (
        // for single icon without background
        <Image src={svgIcon} alt="Icon" className="w-6 h-6" />
      )}
      <span
        className={`${labelClass} truncate`}
        style={{
          color: labelColor,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default IconText;
