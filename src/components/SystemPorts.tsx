import { getUnfinishedReception } from "@/lib/actions/reception.actions";

import { getUnfinishedWrapping } from "@/lib/actions/wrapping.actions";
import IconButton from "./IconButton";
import { getShippingsUnfinihsed } from "@/lib/actions/shipping.actions";
import HasPermissionsServer from "./auth/HasPermissionsServer";

export default async function SystemPorts() {
  const unFinshedreception = await getUnfinishedReception();
  let receptionLink = "/reception/create";
  if (unFinshedreception?.data !== null) {
    receptionLink = "/reception/history";
  }

  const unFinshedWrapping = await getUnfinishedWrapping();

  let wrappingLink = "/wrapping/create";
  if (unFinshedWrapping?.data) {
    wrappingLink = "/wrapping/history";
  }

  const unFinshedShipping = await getShippingsUnfinihsed();

  let shippingLink = "/shipping/create";
  if (unFinshedShipping?.data && unFinshedShipping?.data.length > 0) {
    shippingLink = "/shipping/history";
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 max-w-[600px] md:max-w-[700px] px-6 mx-auto">
      <HasPermissionsServer permission="create:reception">
        <IconButton
          link={receptionLink}
          icon="Truck"
          label="Nouvelle réception"
        />
      </HasPermissionsServer>
      <HasPermissionsServer permission="create:traceability">
        <IconButton
          link="/traceability/reception"
          icon="AudioWaveform"
          label="Traçabilité"
        />
      </HasPermissionsServer>

      <IconButton
        link="/dashboard"
        icon="LayoutDashboard"
        label="Tableau de bord"
      />
      <HasPermissionsServer permission="create:wrapping">
        <IconButton
          link={wrappingLink}
          icon="PackageCheck"
          label="Nouvel emballage"
        />
      </HasPermissionsServer>
      <HasPermissionsServer permission="create:shipping">
        <IconButton
          link={shippingLink}
          icon="ArrowsUpFromLine"
          label="Nouvelle Expédition"
        />
      </HasPermissionsServer>

      <IconButton link="/" icon="Settings" label="Paramètres" />
    </div>
  );
}
