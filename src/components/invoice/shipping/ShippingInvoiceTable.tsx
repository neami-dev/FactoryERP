import { getGroupedWeightTypesWrapping } from "@/lib/actions/wrappingWeightFish.actions";
import { formatFloat } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type ReceptionWeightDetailsParams = {
  wrappingId: number;
  showUpdateBtn: boolean;
};

export default async function ShippingInvoiceTable({
  wrappingId,
  showUpdateBtn,
}: ReceptionWeightDetailsParams) {
  const groupedWeightTypes = await getGroupedWeightTypesWrapping(wrappingId);

  if (!groupedWeightTypes) return;
  const groupedArray = Object.entries(groupedWeightTypes.grouped).map(
    ([name, items]) => ({
      name,
      items,
    })
  );

  return (
    <section className="w-full">
      <div className="flex gap-2 w-fit mx-auto justify-center mt-10 border">
        {groupedArray.map((item, index) => {
          return (
            <section key={index}>
              {showUpdateBtn && (
                <Link
                  className="bg-[#3354f4]/90 hover:bg-[#3354f4] w-fit h-fit text-white py-1 px-2  mx-auto mt-3  flex gap-2 items-center text-base font-medium rounded-md"
                  href={`/wrapping-weight-fish?wrappingId=${wrappingId}&typeName=${item.name}`}
                >
                  <Image
                    src={"/icons/white-edit.svg"}
                    width={23}
                    height={23}
                    alt=""
                  />{" "}
                  Modifier
                </Link>
              )}
              <div className="uppercase text-center py-4 text-base font-medium">
                TAILLE {item.name}
              </div>
              <table className="w-full  text-center text-gray-600  ">
                <thead className="uppercase bg-gray-300 text-base text-black">
                  <tr>
                    <th
                      scope="col"
                      className="px-2 py-3 text-sm whitespace-nowrap"
                    >
                      {" "}
                      LE POIS
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-sm whitespace-nowrap"
                    >
                      N,CAISSE
                    </th>
                    {/* <th
                      scope="col"
                      className="px-2 py-3 text-sm whitespace-nowrap"
                    >
                      Type de Boîte
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-sm whitespace-nowrap"
                    >
                      Type D'emballage
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {item.items?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="  border-b uppercase text-base font-medium   border-gray-200"
                      >
                        <td className="px-6 py-4">
                          {formatFloat(item.weight)}
                        </td>
                        <td className="px-6 py-4">{item.box}</td>
                        {/* <td className="px-6 py-4">{item.box_type}</td>
                        <td className="px-6 py-4">{item.wrapping_type}</td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {groupedWeightTypes.totalWeightsByType.map((items, index) => {
                return (
                  <div key={index}>
                    {items.type == item.name && (
                      <div key={index}>
                        <ul className="flex items-center justify-around   pr-5 text-lg font-medium py-5">
                          <li>{formatFloat(items.totalWeight ?? 0)} kg</li>
                          <li>{items.totalCrate}</li>
                          {/* <li className=" w-[120px]"></li>
                          <li> </li>
                          <li> </li> */}
                        </ul>
                        <div className="text-lg font-medium py-2 text-center bg-amber-100">
                          {formatFloat(items.totalWeight ?? 0)} kg
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </section>
  );
}
