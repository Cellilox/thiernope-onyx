"use client";

import React, { useState } from "react";
import Text from "@/refresh-components/texts/Text";
import { cn, noProp } from "@/lib/utils";
import { IconProps } from "@/icons";
import SvgChevronDownSmall from "@/icons/chevron-down-small";
import IconButton from "./IconButton";
import SvgX from "@/icons/x";

const buttonClasses = (transient?: boolean) =>
  ({
    active: [
      "bg-daxno",
      "hover:bg-daxno/90",
      transient && "bg-background-tint-inverted-04",
      "active:bg-background-tint-inverted-02",
    ],
    inactive: [
      "bg-background-tint-01",
      "hover:bg-background-tint-02",
      transient && "bg-background-tint-02",
      "active:bg-background-tint-00",
    ],
  }) as const;

const textClasses = (transient?: boolean) => ({
  active: ["text-white"],
  inactive: [
    "text-text-03",
    "group-hover/FilterButton:text-text-04",
    transient && "text-text-04",
    "group-active/FilterButton:text-text-05",
  ],
});

const iconClasses = (transient?: boolean) =>
  ({
    active: ["stroke-text-inverted-05"],
    inactive: [
      "stroke-daxno-muted",
      "group-hover/FilterButton:stroke-daxno",
      transient && "stroke-daxno",
      "group-active/FilterButton:stroke-daxno",
    ],
  }) as const;

export interface FilterButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Button states:
  active?: boolean;
  transient?: boolean;

  leftIcon: React.FunctionComponent<IconProps>;
  onClear?: () => void;

  children?: string;
}

export default function FilterButton({
  active,
  transient,

  leftIcon: LeftIcon,

  onClick,
  onClear,
  children,
  className,
  ...props
}: FilterButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const state = active ? "active" : "inactive";

  return (
    <button
      className={cn(
        "p-2 h-fit rounded-12 group/FilterButton flex flex-row items-center justify-center gap-1",
        buttonClasses(transient)[state],
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div className="pr-0.5">
        <LeftIcon
          className={cn("w-[1rem] h-[1rem]", iconClasses(transient)[state])}
        />
      </div>

      <Text nowrap className={cn(textClasses(transient)[state])}>
        {children}
      </Text>
      <div className="pl-0">
        {active ? (
          <IconButton
            icon={SvgX}
            onClick={noProp(onClear)}
            secondary
            className="!p-0 !rounded-04"
          />
        ) : (
          <div className="w-[1rem] h-[1rem]">
            <SvgChevronDownSmall
              className={cn(
                "w-[1rem] h-[1rem] transition-transform duration-200 ease-in-out",
                iconClasses(transient)[state],
                transient && "-rotate-180"
              )}
            />
          </div>
        )}
      </div>
    </button>
  );
}
