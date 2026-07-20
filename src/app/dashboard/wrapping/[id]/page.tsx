import Image from "next/image";
import { Suspense } from "react";

export default function WrappingDetails() {
  return (
    <div>
      <div className="relative overflow-x-auto ">
        <Suspense
          fallback={
            <div className="w-full h-[500px] flex justify-center items-center">
              <Image
                src="/icons/infinite-spinner-loading.svg"
                alt="loading.."
                width={100}
                height={100}
              />
            </div>
          }
        >
          {/* <ReceptionWeightDetails
                    showUpdateBtn={true}
                    receptionId={receptionId}
                  /> */}
        </Suspense>
      </div>
    </div>
  );
}
