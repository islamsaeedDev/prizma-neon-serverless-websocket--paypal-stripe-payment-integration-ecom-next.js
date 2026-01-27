import React from "react";

const CheckoutSteps = ({ current = 0 }: { current: number }) => {
  return (
    <div className="w-1/2 mx-auto flex-between flex-col md:flex-row mb-5">
      {["User Login", "Shipping Address", "Payment Method", "Place Order"].map(
        (step, index) => (
          <React.Fragment key={step}>
            <div className=" flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border 
                  border-green-300
               `}
              >
                {index === current || index < current ? (
                  <span className="w-8 h-8 rounded-full bg-green-300 text-secondary flex items-center justify-center">
                    {index + 1}
                  </span>
                ) : (
                  <span className="w-8 h-8 rounded-full bg-gray-400 text-secondary flex items-center justify-center">
                    {index + 1}
                  </span>
                )}
              </div>

              <div className="mt-1 text-xs text-foreground text-center">
                {step}
              </div>
            </div>

            {index !== 3 && (
              <div className="  flex-1 w-[3px] hidden md:block md:h-[3px] md:w-full ">
                <div
                  className={`h-full w-full mt-[-10px] ${
                    index < current
                      ? "bg-green-500"
                      : index === current
                        ? "bg-linear-to-b md:bg-linear-to-r from-green-500 to-gray-200 animate-pulse "
                        : "bg-gray-200"
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ),
      )}
    </div>
  );
};

export default CheckoutSteps;
