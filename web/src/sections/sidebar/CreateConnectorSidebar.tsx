"use client";

import { useFormContext } from "@/components/context/FormContext";
import { credentialTemplates } from "@/lib/connectors/credentials";
import Text from "@/refresh-components/texts/Text";
import StepSidebar from "@/sections/sidebar/StepSidebarWrapper";
import SvgSettings from "@/icons/settings";
import { useUser } from "@/components/user/UserProvider";
import { useConnectorSidebarContext } from "@/sections/sidebar/ConnectorSidebarContext";
import useScreenSize from "@/hooks/useScreenSize";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface SidebarInnerProps {
  folded: boolean;
  onFoldClick: () => void;
}

function SidebarInner({ folded, onFoldClick }: SidebarInnerProps) {
  const { formStep, setFormStep, connector, allowAdvanced, allowCreate } =
    useFormContext();
  const noCredential = credentialTemplates[connector] == null;

  const { isAdmin } = useUser();
  const buttonName = isAdmin ? "Admin Page" : "Curator Page";

  const settingSteps = [
    ...(!noCredential ? ["Credential"] : []),
    "Connector",
    ...(connector == "file" ? [] : ["Advanced (optional)"]),
  ];

  return (
    <StepSidebar
      buttonName={buttonName}
      buttonIcon={SvgSettings}
      buttonHref="/admin/add-connector"
      folded={folded}
      onFoldClick={onFoldClick}
    >
      <div className="relative">
        {connector != "file" && (
          <div className="absolute h-[85%] left-[6px] top-[8px] bottom-0 w-0.5 bg-background-tint-04"></div>
        )}
        {settingSteps.map((step, index) => {
          const allowed =
            (step == "Connector" && allowCreate) ||
            (step == "Advanced (optional)" && allowAdvanced) ||
            index <= formStep;

          return (
            <div
              key={index}
              className={`flex items-center mb-6 relative ${!allowed ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              onClick={() => {
                if (allowed) {
                  setFormStep(index - (noCredential ? 1 : 0));
                }
              }}
            >
              <div className="flex-shrink-0 mr-4 z-10">
                <div
                  className={`rounded-full h-3.5 w-3.5 flex items-center justify-center ${allowed ? "bg-blue-500" : "bg-background-tint-04"
                    }`}
                >
                  {formStep === index && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
              {!folded && (
                <Text text04={index <= formStep} text02={index > formStep}>
                  {step}
                </Text>
              )}
            </div>
          );
        })}
      </div>
    </StepSidebar>
  );
}

const MemoizedSidebarInner = memo(SidebarInner);

export default function Sidebar() {
  const { folded, setFolded } = useConnectorSidebarContext();
  const { isMobile } = useScreenSize();

  // Desktop: render sidebar normally
  if (!isMobile) {
    return (
      <MemoizedSidebarInner
        folded={folded}
        onFoldClick={() => setFolded((prev) => !prev)}
      />
    );
  }

  // Mobile: render as overlay
  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200",
          folded ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <MemoizedSidebarInner
          folded={false}
          onFoldClick={() => setFolded(true)}
        />
      </div>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-mask-03 backdrop-blur-03 transition-opacity duration-200",
          folded ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
        )}
        onClick={() => setFolded(true)}
      />
    </>
  );
}
