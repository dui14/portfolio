import { useCallback, useState } from "react";

type Bag = { order: number[]; position: number; upcoming: number[] };

function shuffled(size: number, avoidFirst: number | null): number[] {
  const order = Array.from({ length: size }, (_, index) => index);

  for (let index = order.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [order[index], order[swap]] = [order[swap], order[index]];
  }

  if (size > 1 && avoidFirst !== null && order[0] === avoidFirst) {
    const swap = 1 + Math.floor(Math.random() * (size - 1));
    [order[0], order[swap]] = [order[swap], order[0]];
  }

  return order;
}

function createBag(size: number, avoidFirst: number | null): Bag {
  const order = shuffled(size, avoidFirst);
  return {
    order,
    position: 0,
    upcoming: shuffled(size, order[order.length - 1] ?? null),
  };
}

function advance(size: number, current: Bag): Bag {
  if (current.position + 1 < current.order.length) {
    return { ...current, position: current.position + 1 };
  }

  return {
    order: current.upcoming,
    position: 0,
    upcoming: shuffled(size, current.upcoming[current.upcoming.length - 1] ?? null),
  };
}

export function useLifeShuffle(size: number) {
  const [bag, setBag] = useState<Bag>(() => createBag(size, null));

  const next = useCallback(() => {
    setBag((current) => {
      if (size < 2) return current;

      return advance(size, current);
    });
  }, [size]);

  const nextIndex =
    bag.order[bag.position + 1] ?? bag.upcoming[0] ?? -1;

  return {
    index: size > 0 ? bag.order[bag.position] : -1,
    nextIndex,
    position: bag.position + 1,
    total: size,
    next,
  };
}
