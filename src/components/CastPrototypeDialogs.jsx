import { CAST_DEVICE_OPTIONS } from "../constants/castPrototypeCopy";
import { useCastPrototype } from "../context/CastPrototypeContext";
import CastToDialog from "./CastToDialog";
import CastNetworkAccessDialog from "./CastNetworkAccessDialog";
import CastLocalNetworkDialog from "./CastLocalNetworkDialog";
import CastCastingOnDialog from "./CastCastingOnDialog";

/**
 * Mount once under `CastPrototypeProvider` — all cast modals for the dumb prototype.
 */
export default function CastPrototypeDialogs() {
  const {
    castToOpen,
    networkAccessOpen,
    localNetworkOpen,
    castingOnDialogOpen,
    castDeviceName,
    closeCastTo,
    selectCastDevice,
    networkAccessOk,
    networkAccessCancel,
    localNetworkOk,
    localNetworkBlock,
    castingOnOk,
    stopCasting,
  } = useCastPrototype();

  return (
    <>
      <CastToDialog
        open={castToOpen}
        onClose={closeCastTo}
        devices={CAST_DEVICE_OPTIONS}
        onSelectDevice={selectCastDevice}
      />
      <CastNetworkAccessDialog
        open={networkAccessOpen}
        onClose={networkAccessCancel}
        onOk={networkAccessOk}
        onCancel={networkAccessCancel}
      />
      <CastLocalNetworkDialog
        open={localNetworkOpen}
        onClose={localNetworkBlock}
        onOk={localNetworkOk}
        onBlock={localNetworkBlock}
      />
      <CastCastingOnDialog
        open={castingOnDialogOpen}
        onClose={castingOnOk}
        deviceName={castDeviceName}
        onOk={castingOnOk}
        onStopCasting={stopCasting}
      />
    </>
  );
}
