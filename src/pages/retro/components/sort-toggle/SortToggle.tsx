import style from "./SortToggle.module.css";
import {SortValue} from "./SortValue.ts";

interface SortToggleProps {
    sortValue: SortValue;
    onToggle: (sortValue: SortValue) => void;
}

export function SortToggle({sortValue, onToggle}: SortToggleProps) {
    const isVotes = sortValue === SortValue.VOTES;

    return (
        <div className={style.container}>
            <span className={`${style.label} ${!isVotes ? style.labelActive : ""}`} aria-hidden="true">Time</span>
            <button
                type="button"
                role="switch"
                aria-checked={isVotes}
                aria-label={`Sort by ${sortValue}`}
                className={style.track}
                onClick={() => onToggle(isVotes ? SortValue.TIME : SortValue.VOTES)}
            >
                <span className={`${style.thumb} ${isVotes ? style.thumbRight : ""}`} />
            </button>
            <span className={`${style.label} ${isVotes ? style.labelActive : ""}`} aria-hidden="true">Votes</span>
        </div>
    );
}
