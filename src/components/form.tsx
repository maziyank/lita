import { ComponentProps, forwardRef, useEffect, useState } from "react";
import { IconArrowBack } from "@tabler/icons-react";
import cx from "@/utils/cx";
import assistant from "@/utils/assistant";
import Image from "next/image";

export interface Props extends ComponentProps<"form"> {
  inputProps: ComponentProps<"input">;
  buttonProps: ComponentProps<"button">;
  onAssitantChanged: any;
}

const Form = (
  { inputProps, buttonProps, onSubmit, onAssitantChanged }: Props,
  ref: any,
) => {
  const [currentAssistant, setCurrentAssistant] = useState(0);

  useEffect(
    () => onAssitantChanged(currentAssistant),
    [currentAssistant, onAssitantChanged],
  );

  return (
    <div>
      <div className="flex justify-center my-2 items-center">
        <span className="transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
          ✨ {assistant[currentAssistant].desc}
        </span>
      </div>
      <div className="flex justify-center my-4 items-center gap-2">
        {assistant.map((item, index) => {
          return (
            <button
              key={index}
              type="button"
              className={`flex cursor-pointer select-none text-left font-normal
          border border-gray-200 rounded p-1 md:px-1 md:py-1
          hover:bg-zinc-50 hover:border-zinc-400 ${currentAssistant == index ? "bg-gray-200" : "bg-white"}`}
              disabled={currentAssistant === index}
              onClick={(e) => setCurrentAssistant(index)}
            >
              <Image
                className="w-12 h-12 rounded"
                src={assistant[index].avatar}
                width={20}
                height={20}
                alt="Avatar"
              />{" "}
              <div className="flex flex-col px-2 sm:px-1 gap-0">
                <span className="font-bold text-base">{item.nama}</span>
                <span className="text-base">{item.character}</span>
              </div>
            </button>
          );
        })}
      </div>

      <form
        onSubmit={onSubmit}
        className="relative m-auto flex items-center gap-4 justify-center"
        ref={ref}
      >
        <input
          placeholder="Tulis pertanyaanmu disini..."
          required
          {...inputProps}
          className={cx(
            "transition h-10 md:h-12 pl-4 pr-12 flex-1 rounded-xl",
            "border border-gray-400 text-base",
            "disabled:bg-gray-100",
            inputProps.className,
          )}
          type="text"
        />
        <button
          {...buttonProps}
          type="submit"
          tabIndex={-1}
          className={cx(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "opacity-50",
          )}
        >
          <IconArrowBack stroke={1.5} />
        </button>
      </form>
    </div>
  );
};

export default forwardRef(Form);
