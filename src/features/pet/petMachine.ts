import type { PetHeading, PetPoint, PetState } from "../../domain/pet.ts";
import {
  PET_ARRIVE_DISTANCE,
  PET_BARK_MS,
  PET_CATCH_MS,
  PET_EASE,
  PET_FACING_DEADBAND,
  PET_FOLLOW_DISTANCE,
  PET_MAX_FRAME_MS,
  PET_MAX_STEP,
  PET_REFERENCE_FRAME_MS,
  PET_RUN_START_DISTANCE,
  PET_RUN_STOP_DISTANCE,
  PET_SLEEP_AFTER_MS,
  PET_VERTICAL_RATIO,
} from "./petConfig.ts";

export type PetModel = {
  state: PetState;
  resume: PetState;
  x: number;
  y: number;
  facing: 1 | -1;
  heading: PetHeading;
  target: PetPoint | null;
  stateMs: number;
  idleMs: number;
};

export type PetInput =
  | { type: "tick"; dt: number; pointer: PetPoint | null }
  | { type: "activity" }
  | { type: "bark" }
  | { type: "target"; point: PetPoint };

export function createPetModel(start: PetPoint): PetModel {
  return {
    state: "idle",
    resume: "idle",
    x: start.x,
    y: start.y,
    facing: 1,
    heading: "side",
    target: null,
    stateMs: 0,
    idleMs: 0,
  };
}

function enter(model: PetModel, state: PetState): PetModel {
  return { ...model, state, stateMs: 0, idleMs: state === "idle" ? 0 : model.idleMs };
}

function distance(from: PetPoint, to: PetPoint): number {
  return Math.hypot(to.x - from.x, to.y - from.y);
}

function approach(model: PetModel, goal: PetPoint, dt: number): PetModel {
  const scale = Math.min(dt, PET_MAX_FRAME_MS) / PET_REFERENCE_FRAME_MS;
  const dx = goal.x - model.x;
  const dy = goal.y - model.y;
  const remaining = Math.hypot(dx, dy);
  if (remaining === 0) return model;
  const step = Math.min(PET_MAX_STEP * scale, remaining * Math.min(1, PET_EASE * scale));
  const vx = (dx / remaining) * step;
  const vy = (dy / remaining) * step;
  const vertical = Math.abs(vy) > Math.abs(vx) * PET_VERTICAL_RATIO;
  const heading: PetHeading = vertical ? (vy < 0 ? "up" : "down") : "side";
  const facing =
    !vertical && Math.abs(vx) > PET_FACING_DEADBAND * scale ? (vx < 0 ? -1 : 1) : model.facing;
  return { ...model, x: model.x + vx, y: model.y + vy, heading, facing };
}

function followGoal(model: PetModel, pointer: PetPoint): PetPoint {
  const dx = pointer.x - model.x;
  const dy = pointer.y - model.y;
  const length = Math.hypot(dx, dy) || 1;
  return {
    x: pointer.x - (dx / length) * PET_FOLLOW_DISTANCE,
    y: pointer.y - (dy / length) * PET_FOLLOW_DISTANCE,
  };
}

function tick(model: PetModel, dt: number, pointer: PetPoint | null): PetModel {
  const next = { ...model, stateMs: model.stateMs + dt, idleMs: model.idleMs + dt };

  switch (next.state) {
    case "idle": {
      if (pointer && distance(next, pointer) > PET_RUN_START_DISTANCE) return enter(next, "run");
      if (next.idleMs >= PET_SLEEP_AFTER_MS) return enter(next, "sleep");
      return next;
    }
    case "run": {
      if (!pointer || distance(next, pointer) <= PET_RUN_STOP_DISTANCE) {
        return { ...enter(next, "idle"), heading: "side" };
      }
      return approach(next, followGoal(next, pointer), dt);
    }
    case "chase": {
      if (!next.target) return enter(next, "idle");
      if (distance(next, next.target) <= PET_ARRIVE_DISTANCE) {
        return { ...enter(next, "catch"), heading: "side" };
      }
      return approach(next, next.target, dt);
    }
    case "catch": {
      if (next.stateMs >= PET_CATCH_MS) return { ...enter(next, "idle"), target: null };
      return next;
    }
    case "bark": {
      if (next.stateMs >= PET_BARK_MS) {
        const resume = next.resume === "bark" || next.resume === "sleep" ? "idle" : next.resume;
        return enter(next, resume);
      }
      return next;
    }
    case "sleep":
      return next;
  }
}

export function stepPet(model: PetModel, input: PetInput): PetModel {
  switch (input.type) {
    case "tick":
      return tick(model, input.dt, input.pointer);
    case "activity": {
      if (model.state === "sleep") return enter({ ...model, idleMs: 0 }, "idle");
      return { ...model, idleMs: 0 };
    }
    case "bark": {
      if (model.state === "bark" || model.state === "catch") return model;
      return {
        ...model,
        state: "bark",
        resume: model.state === "sleep" ? "idle" : model.state,
        stateMs: 0,
        idleMs: 0,
        heading: "side",
      };
    }
    case "target": {
      if (model.state === "catch" || model.state === "bark") return model;
      return {
        ...model,
        state: "chase",
        target: input.point,
        stateMs: 0,
        idleMs: 0,
      };
    }
  }
}

export function clampPetModel(
  model: PetModel,
  bounds: { width: number; height: number },
  margin: number,
): PetModel {
  const x = Math.min(Math.max(model.x, margin), Math.max(margin, bounds.width - margin));
  const y = Math.min(Math.max(model.y, margin), Math.max(margin, bounds.height - margin));
  return x === model.x && y === model.y ? model : { ...model, x, y };
}
