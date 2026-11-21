import { lazy, Suspense, useEffect, useState } from "react";

import type { PetManifest } from "../../domain/pet.ts";
import { PET_IDLE_TIMEOUT_MS } from "../../features/pet/petConfig.ts";
import {
  usePetAvailable,
  usePetEnabled,
} from "../../features/pet/petSettings.ts";
import { PET_MANIFEST_URL } from "../../features/pet/petConfig.ts";
import { disablePet, isPetDisabled, loadPet } from "../../services/petService.ts";

const Pet = lazy(() =>
  import("./Pet.tsx").then((module) => ({ default: module.Pet }))
);

function whenIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(callback, { timeout: PET_IDLE_TIMEOUT_MS });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(callback, PET_IDLE_TIMEOUT_MS);
  return () => window.clearTimeout(handle);
}

export function PetLoader() {
  const available = usePetAvailable();
  const enabled = usePetEnabled();
  const [manifest, setManifest] = useState<PetManifest | null>(null);
  const active = available && enabled;

  useEffect(() => {
    if (!active || manifest || isPetDisabled()) return;
    let cancelled = false;
    const cancelIdle = whenIdle(() => {
      loadPet(PET_MANIFEST_URL)
        .then((loaded) => {
          if (!cancelled) setManifest(loaded);
        })
        .catch(() => undefined);
    });
    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [active, manifest]);

  function handleFail() {
    disablePet();
    setManifest(null);
  }

  if (!active || !manifest || isPetDisabled()) return null;

  return (
    <Suspense fallback={null}>
      <Pet manifest={manifest} onFail={handleFail} />
    </Suspense>
  );
}
