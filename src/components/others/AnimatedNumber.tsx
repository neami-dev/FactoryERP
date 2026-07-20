 
import { useEffect, useState } from "react";

export default function AnimatedNumber({ value }: { value: number }) {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    const animation = setInterval(() => {
      setCurrentValue((prev) => {
        const diff = value - prev;
        if (diff === 0) {
          clearInterval(animation);
          return prev;
        }
        return prev + diff * 0.2; // Move 20% closer to the target
      });
    }, 50); // Update every 50ms for a smooth transition

    return () => clearInterval(animation); // Cleanup
  }, [value]);

  return <span>{currentValue.toFixed(2)}</span>;
}
