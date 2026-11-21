import { useCallback, useEffect, useRef, useState } from "react";

import type {
  PetAnimationName,
  PetManifest,
  PetMotion,
  PetPoint,
  PetState,
} from "../../domain/pet.ts";
import { playBark } from "../../services/petService.ts";
import { isEmptySpace } from "./emptySpace.ts";
import {
  PET_BARK_VOLUME,
  PET_BLOCKER_SELECTOR,
  PET_BOB_FPS,
  PET_BOB_PX,
  PET_BREATHE_PERIOD_MS,
  PET_BREATHE_SCALE,
  PET_EDGE_MARGIN,
  PET_HIT_INSET,
  PET_HOP_PERIOD_MS,
  PET_HOP_PX,
  PET_INTERACTIVE_SELECTOR,
  PET_MAX_FRAME_MS,
  PET_RECOIL_DECAY_MS,
  PET_RECOIL_PX,
  PET_START_OFFSET,
} from "./petConfig.ts";
import {
  clampPetModel,
  createPetModel,
  stepPet,
  type PetInput,
  type PetModel,
} from "./petMachine.ts";
import { getPetSound } from "./petSettings.ts";

export type PetView = {
  state: PetState;
  target: PetPoint | null;
};

type Pose = { x: number; y: number; scaleY: number };

function animationFor(model: PetModel): PetAnimationName {
  switch (model.state) {
    case "run":
    case "chase":
      if (model.heading === "up") return "runUp";
      if (model.heading === "down") return "runDown";
      return "run";
    case "idle":
    case "catch":
    case "bark":
    case "sleep":
      return model.state;
  }
}

function poseFor(motion: PetMotion, elapsed: number, facing: 1 | -1): Pose {
  switch (motion) {
    case "breathe":
      return {
        x: 0,
        y: 0,
        scaleY: 1 + Math.sin((elapsed / PET_BREATHE_PERIOD_MS) * Math.PI * 2) * PET_BREATHE_SCALE,
      };
    case "bob":
      return {
        x: 0,
        y: Math.floor((elapsed * PET_BOB_FPS) / 1000) % 2 === 0 ? 0 : -PET_BOB_PX,
        scaleY: 1,
      };
    case "hop":
      return {
        x: 0,
        y: -Math.abs(Math.sin((elapsed / PET_HOP_PERIOD_MS) * Math.PI)) * PET_HOP_PX,
        scaleY: 1,
      };
    case "recoil":
      return {
        x: -facing * PET_RECOIL_PX * Math.max(0, 1 - elapsed / PET_RECOIL_DECAY_MS),
        y: 0,
        scaleY: 1,
      };
    case "none":
    default:
      return { x: 0, y: 0, scaleY: 1 };
  }
}

export function usePet(manifest: PetManifest, onFail: () => void) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const hitRef = useRef<HTMLDivElement | null>(null);
  const onFailRef = useRef(onFail);
  const frameRefs = useRef(new Map<string, HTMLImageElement>());
  const modelRef = useRef<PetModel | null>(null);
  const dispatchRef = useRef<(input: PetInput) => void>(() => undefined);
  const [view, setView] = useState<PetView>({ state: "idle", target: null });

  const setFrameRef = useCallback(
    (name: string) => (element: HTMLImageElement | null) => {
      if (element) frameRefs.current.set(name, element);
      else frameRefs.current.delete(name);
    },
    [],
  );

  useEffect(() => {
    onFailRef.current = onFail;
  }, [onFail]);

  useEffect(() => {
    const root = rootRef.current;
    const body = bodyRef.current;
    const hit = hitRef.current;
    if (!root || !body || !hit) return;

    const { width, height } = manifest.size;
    const margin = Math.max(width, height) / 2 + PET_EDGE_MARGIN;
    const animations = manifest.animations;
    const frames = frameRefs.current;

    let model =
      modelRef.current ??
      createPetModel({
        x: PET_START_OFFSET,
        y: window.innerHeight - PET_START_OFFSET,
      });
    let pointer: PetPoint | null = null;
    let raf = 0;
    let last = 0;
    let animationMs = 0;
    let animationName: PetAnimationName | null = null;
    let shownFrame: HTMLImageElement | null = null;
    let blocked = false;
    let shown = false;
    let published: PetView = { state: model.state, target: model.target };

    function setShown(next: boolean) {
      if (next === shown || !root) return;
      shown = next;
      root.style.visibility = next ? "visible" : "hidden";
    }

    function publish() {
      if (model.state === published.state && model.target === published.target) return;
      published = { state: model.state, target: model.target };
      setView(published);
    }

    function dispatch(input: PetInput) {
      model = stepPet(model, input);
      modelRef.current = model;
      publish();
    }

    dispatchRef.current = dispatch;

    function render() {
      if (!root || !body) return;
      const name = animationFor(model);
      if (name !== animationName) {
        animationName = name;
        animationMs = 0;
      }
      const animation = animations[name];
      const index = Math.floor((animationMs * animation.fps) / 1000) % animation.frames.length;
      const frame = frames.get(animation.frames[index]) ?? null;
      if (frame !== shownFrame) {
        if (shownFrame) shownFrame.style.visibility = "hidden";
        if (frame) frame.style.visibility = "visible";
        shownFrame = frame;
      }
      const elapsed = animation.motion === "recoil" ? model.stateMs : animationMs;
      const pose = poseFor(animation.motion, elapsed, model.facing);
      root.style.transform = `translate3d(${(model.x - width / 2).toFixed(2)}px, ${(model.y - height / 2).toFixed(2)}px, 0)`;
      body.style.transform = `translate(${pose.x.toFixed(2)}px, ${pose.y.toFixed(2)}px) scale(${model.facing}, ${pose.scaleY.toFixed(4)})`;
    }

    function checkBlocked() {
      blocked = document.querySelector(PET_BLOCKER_SELECTOR) !== null;
    }

    function fail() {
      stop();
      cleanup();
      onFailRef.current();
    }

    function frameLoop(now: number) {
      raf = requestAnimationFrame(frameLoop);
      try {
        step(now);
      } catch {
        fail();
      }
    }

    function step(now: number) {
      const dt = last === 0 ? 0 : Math.min(now - last, PET_MAX_FRAME_MS);
      last = now;

      if (blocked) {
        setShown(false);
        return;
      }

      model = clampPetModel(
        stepPet(model, { type: "tick", dt, pointer }),
        { width: window.innerWidth, height: window.innerHeight },
        margin,
      );
      modelRef.current = model;
      animationMs += dt;
      render();
      setShown(true);
      publish();
    }

    function start() {
      if (raf !== 0) return;
      last = 0;
      raf = requestAnimationFrame(frameLoop);
    }

    function stop() {
      if (raf !== 0) cancelAnimationFrame(raf);
      raf = 0;
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      pointer = { x: event.clientX, y: event.clientY };
      dispatch({ type: "activity" });
      updateHit(event.clientX, event.clientY);
    }

    function updateHit(x: number, y: number) {
      const rect = root!.getBoundingClientRect();
      const insetX = rect.width * PET_HIT_INSET;
      const insetY = rect.height * PET_HIT_INSET;
      const inside =
        x >= rect.left + insetX &&
        x <= rect.right - insetX &&
        y >= rect.top + insetY &&
        y <= rect.bottom - insetY;
      let clickable = inside;
      if (inside) {
        const under = document
          .elementsFromPoint(x, y)
          .find((element) => !root!.contains(element));
        clickable = !under || !under.closest(PET_INTERACTIVE_SELECTOR);
      }
      hit!.style.pointerEvents = clickable ? "auto" : "none";
    }

    function onActivity() {
      dispatch({ type: "activity" });
    }

    function onPointerLeave() {
      pointer = null;
    }

    function onDoubleClick(event: MouseEvent) {
      if (blocked || root?.contains(event.target as Node)) return;
      if (!isEmptySpace(event)) return;
      dispatch({ type: "target", point: { x: event.clientX, y: event.clientY } });
    }

    function onVisibility() {
      if (document.hidden) {
        pointer = null;
        stop();
      } else {
        checkBlocked();
        start();
      }
    }

    const observer = new MutationObserver(checkBlocked);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-modal"],
    });
    checkBlocked();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onActivity, { passive: true });
    window.addEventListener("keydown", onActivity, { passive: true });
    window.addEventListener("scroll", onActivity, { passive: true });
    window.addEventListener("wheel", onActivity, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("dblclick", onDoubleClick);
    document.addEventListener("visibilitychange", onVisibility);

    function cleanup() {
      observer.disconnect();
      dispatchRef.current = () => undefined;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("scroll", onActivity);
      window.removeEventListener("wheel", onActivity);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("dblclick", onDoubleClick);
      document.removeEventListener("visibilitychange", onVisibility);
    }

    try {
      render();
    } catch {
      fail();
      return;
    }
    if (!document.hidden) start();

    return () => {
      stop();
      cleanup();
    };
  }, [manifest]);

  const bark = useCallback(() => {
    const before = modelRef.current?.state;
    dispatchRef.current({ type: "bark" });
    const after = modelRef.current?.state;
    if (after === "bark" && before !== "bark" && getPetSound()) {
      playBark(manifest.sounds, PET_BARK_VOLUME);
    }
  }, [manifest]);

  return { rootRef, bodyRef, hitRef, setFrameRef, view, bark };
}
