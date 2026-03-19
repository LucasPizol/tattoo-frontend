import { cn } from "@/utils/cn";
import React, { useState } from "react";
import styles from "./styles.module.scss";

type TabsProps = {
  children: React.ReactElement<TabProps>[] | React.ReactElement<TabProps>;
  activeTab?: number;
  layoutClassName?: string;
  className?: string;
  onChange?: (tab: number) => void;
};

export const Tabs = ({
  children,
  activeTab: activeTabProp,
  onChange,
  layoutClassName,
  className,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(activeTabProp || 0);

  const handleSetActiveTab = (tab: number) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  const childrenArray = Array.isArray(children) ? children : [children];

  const currentTab = activeTabProp !== undefined ? activeTabProp : activeTab;

  return (
    <div className={cn(styles.tabs, className)}>
      <div className={styles.tabsContent}>
        {Array.from({ length: childrenArray.length }).map((_, index) => (
          <div key={index} onClick={() => handleSetActiveTab(index)}>
            {React.cloneElement(childrenArray[index], {
              active: currentTab === index,
            })}
          </div>
        ))}
      </div>

      <div className={cn(styles.content, layoutClassName)}>
        {childrenArray[currentTab]?.props?.children}{" "}
      </div>
    </div>
  );
};

type TabProps = {
  children: React.ReactNode;
  label: string;
  active?: boolean;
};

const Tab = ({ label, active = false }: TabProps) => {
  return (
    <>
      <span className={cn(styles.tab, { [styles.active]: active })}>
        {label}
      </span>
    </>
  );
};

Tabs.Tab = Tab;
