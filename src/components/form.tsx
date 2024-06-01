import { ComponentProps, forwardRef, useEffect, useState } from "react";
import { IconArrowBack } from "@tabler/icons-react";
import cx from "@/utils/cx";

export interface Props extends ComponentProps<"form"> {
  inputProps: ComponentProps<"input">;
  buttonProps: ComponentProps<"button">;
}

const Form = ({ inputProps, buttonProps, onSubmit }: Props, ref: any) => {
  const [mode, setMode] = useState("Pemula");
  const [currentAssistant, setCurrentAssistant] = useState(0);
  const asisten = [
    {
      nama: "Riski",
      desc: "Penggiat Keuangan Anak Muda dari Jakarta",
      welcomeMessage: "Halo Aku rizki dari Jaksel",
      emoji: "👤",
    },
    {
      nama: "Sari",
      desc: "Influencer Keuangan yang sangat populer di sosmed",
      welcomeMessage: "Halo Aku helena ",
      emoji: "👸",
    },
    {
      nama: "Tito",
      desc: "Profesional yang sangat paham dengan produk keuangan di Indonesia",
      welcomeMessage: "Halo Aku Pak Yudi",
      emoji: "🕺",
    },
  ];

  useEffect(() => {
    console.log({ mode });
  }, [mode]);

  return (
    <div>
      <div className="flex justify-center my-2 items-center">
        <span className="transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
          ✨ {asisten[currentAssistant].desc}
        </span>
      </div>
      <div className="flex justify-center my-4 items-center gap-2">
        <span>Pilih Asisten AI: </span>
        {asisten.map((item, index) => {
          return (
            <button
              key={index}
              type="button"
              className={`cursor-pointer select-none text-left   font-normal
          border border-gray-200 rounded-xl p-1 md:px-2 md:py-1
          hover:bg-zinc-50 hover:border-zinc-400 ${currentAssistant == index ? "bg-gray-200" : "bg-white"}`}
              disabled={mode === "Profesional"}
              onClick={(e) => setCurrentAssistant(index)}
            >
              {item.emoji} {item.nama}
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
          placeholder="Pertanyaan anda..."
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
