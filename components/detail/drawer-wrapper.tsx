import { useSSRMediaquery } from "@/hooks/use-ssr-mediaquery";
import type { ReactNode } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "../ui/drawer";

type DrawerDirection = "bottom" | "left";

export default function DrawerWrapper({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  const minTablet = useSSRMediaquery(768);
  const drawerDir: DrawerDirection =
    minTablet === null ? "bottom" : minTablet ? "left" : "bottom";

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={drawerDir}
      repositionInputs={false}
    >
      <DrawerContent className="!p-4 bg-daejeon-bg h-[96%] md:h-full min-h-[96dvh] max-h-[99dvh] md:max-h-[100dvh] md:w-[480px] md:!ml-auto md:top-0 md:rounded-tr-none md:rounded-bl-[10px]">
        <DrawerTitle className="text-md" hidden>
          역 상세 패널
        </DrawerTitle>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
