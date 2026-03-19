import { cn } from "@/utils/cn";
import { MdCheck } from "react-icons/md";
import styles from "./styles.module.scss";

type Step = {
  label: string;
};

type StepperProps = {
  steps: Step[];
  currentStep: number;
};

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className={styles.stepper}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div
            key={index}
            className={cn(styles.step, {
              [styles.completed]: isCompleted,
              [styles.active]: isActive,
            })}
          >
            <div className={styles.circle}>
              {isCompleted ? <MdCheck size={18} /> : index + 1}
            </div>
            <span className={styles.label}>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};
