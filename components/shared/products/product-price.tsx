import { cn } from "@/lib/utils";
import React from "react";

// price: 59.99,
const ProductPrice = ({
  value,
  classNamme,
}: {
  value: number;
  classNamme?: string;
}) => {
  const stringValue = value.toFixed(2);
  const [intValue, floatValue] = stringValue.split(".");
  return (
    <p className={cn("text-2xl", classNamme)}>
      <span className="text-xs align-super">{floatValue}</span>
      {intValue}
      <span className="text-xs align-super">$</span>
    </p>
  );
};

export default ProductPrice;
