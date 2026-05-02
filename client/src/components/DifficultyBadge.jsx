import clsx from "clsx";
import { difficultyClass } from "../utils/formatters";

export default function DifficultyBadge({ difficulty }) {
  return <span className={clsx("difficulty-badge", difficultyClass[difficulty])}>{difficulty}</span>;
}
