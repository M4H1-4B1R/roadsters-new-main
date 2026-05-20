interface AdditionalInfoProps {
  largeText?: boolean;
  title: string;
  description: string;
}

export default function AdditionalInfo({
  largeText = false,
  title,
  description,
}: AdditionalInfoProps) {
  return (
    <div className="p-4 bg-white rounded-[18px] shadow-xs sm:shadow-sm">
      <p className="text-[#6A7282] text-xs font-normal mb-1">{title}</p>

      <p
        className={`text-[#0A0A0A] font-medium ${
          largeText ? "text-lg" : "text-sm"
        }`}
      >
        {description}
      </p>
    </div>
  );
}
