import Image from "next/image";
import { FormValues } from "./ReceptionWeightFishForm";
 

export default function ReceptionKeypad({
  onKeyPress,
  activeField,
}: {
  onKeyPress: (value: string) => void;
  activeField: keyof FormValues | null;
}) {
  const keys = [
    ["7", "8", "9", "del"], // "done" at the top right
    ["4", "5", "6", "done"], // Empty space for layout balance
    ["1", "2", "3", ""], // Empty space for layout balance
    [".", "0"], // "0" will span 2 columns
  ];
  const icons: Record<string, string> = {
    del: "/icons/backspace-delete.svg",
    done: "/icons/done.svg",
  };
  return (
    <div
      className={`grid grid-cols-4 grid-rows-4 gap-3 p-4 mt-5 w-fit  bg-gray-200 h-fit font-bold rounded-lg ring-white/20 shadow text-white select-none`}
    >
      {keys.flat().map(
        (key, index) =>
          key && (
            <button
              type="button"
              key={`${key}-${index}`}
              className={`flex items-center justify-center text-3xl transition-all duration-500 cursor-pointer rounded-full w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] ${
                key === "done" &&
                "bg-green-600 hover:bg-green-700 h-[115px] sm:h-[160px]"
              }  ${
                key === "del" && "bg-red-600 hover:bg-red-700"
              } bg-[#3354f4] active:scale-95 hover:bg-[#1535d8] ${
                key === "done" ? "row-span-2" : ""
              } ${key === "0" ? "col-span-2 w-[115px] sm:w-[160px]" : ""}
                                ${
                                  activeField == "crate" && key == "."
                                    ? "hidden"
                                    : ""
                                }`}
              onClick={() => onKeyPress(key)}
            >
              {icons[key] ? (
                <Image src={icons[key]} alt={key} width={30} height={30} />
              ) : activeField == "crate" && key == "." ? (
                ""
              ) : (
                key
              )}
            </button>
          )
      )}
    </div>
  );
}
