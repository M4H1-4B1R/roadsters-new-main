interface SizeContainerProps {
    sizeLabel: string;
    selected: boolean;
}

export default function SizeContainer({ sizeLabel, selected }: SizeContainerProps) {
    return (
        <div
            className={`
        px-4 py-2 
        border 
        cursor-pointer 
        transition-all
        text-sm
        min-w-[40px]
        text-center
        ${selected
                    ? "border-black bg-black text-white"
                    : "border-gray-300 hover:border-gray-400 text-gray-700"
                }
      `}
        >
            {sizeLabel}
        </div>
    );
}
