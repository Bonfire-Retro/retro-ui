import {useEffect, useMemo, useRef} from "react";
import {Category, Template} from "../../services/retro-service/RetroService.ts";
import {useCategoryStyling} from "../../context/hooks.tsx";
import {ColumnHeader} from "../../pages/retro/components/column-header/ColumnHeader.tsx";
import styles from "./RetroDescription.module.css";

interface Props {
    template: Template;
}

export function RetroDescription({template}: Props) {
    const columnsRef = useRef<HTMLOListElement>(null);

    const sortedCategories = useMemo(
        () => [...template.categories].sort((a, b) => a.position - b.position),
        [template.categories]
    );

    // Grid rows size independently, so headers on wrapped rows wouldn't match.
    // Measure the tallest header and apply it to all of them. A ResizeObserver
    // covers window resizes and the list becoming visible (e.g. a dialog opening).
    useEffect(() => {
        const list = columnsRef.current;
        if (!list) return;

        const syncHeaderHeights = () => {
            list.style.removeProperty('--header-height');
            const headers = Array.from(list.querySelectorAll<HTMLElement>('h2'));
            const tallest = Math.max(0, ...headers.map((header) => header.offsetHeight));
            if (tallest > 0) list.style.setProperty('--header-height', `${tallest}px`);
        };

        syncHeaderHeights();
        if (typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(syncHeaderHeights);
        observer.observe(list);
        return () => observer.disconnect();
    }, [sortedCategories]);

    return (
        <div className={styles.retroDescription}>
            {template.description && (
                <p className={styles.description} data-testid="retro-description">{template.description}</p>
            )}
            <ol ref={columnsRef} className={styles.columns}>
                {sortedCategories.map((category) => (
                    <ColumnPreview key={`${category.name}${category.position}`} category={category}/>
                ))}
            </ol>
        </div>
    );
}

function ColumnPreview({category}: { category: Category }) {
    const styling = useCategoryStyling(category);

    return (
        <li className={styles.column}>
            <ColumnHeader category={category} styling={styling}/>
            <p className={styles.columnDescription}>{category.description}</p>
        </li>
    );
}
