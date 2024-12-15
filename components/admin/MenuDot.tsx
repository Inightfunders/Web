interface MenuDotProps {
  active?: boolean;
}

export default function MenuDot({ active = false }: MenuDotProps) {
  if (active) {
    return (
      <div className="w-[10px] h-[10px] relative rounded-[20px] overflow-hidden border-[3px] border-[rgba(105,108,255,0.16)] bg-[#696CFF]" />
    );
  }

  return (
    <div className="w-[8px] h-[8px] bg-[rgba(50,71,92,0.38)] rounded-full" />
  );
}
