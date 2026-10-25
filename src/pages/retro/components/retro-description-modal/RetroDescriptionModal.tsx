import {MouseEvent, useCallback, useMemo, useRef, useState} from "react";
import {Category, Template} from "../../../../services/retro-service/RetroService.ts";
import {useCategoryStyling} from "../../../../context/hooks.tsx";
import {ColumnHeader} from "../column-header/ColumnHeader.tsx";
import {ImInfo} from "react-icons/im";
import styles from "./RetroDescriptionModal.module.css";

interface Props {
    template: Template;
}

export function RetroDescriptionModal({template}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const sortedCategories = useMemo(
        () => [...template.categories].sort((a, b) => a.position - b.position),
        [template.categories]
    );

    const open = useCallback(() => {
        setIsOpen(true);
        if (!dialogRef.current?.open) dialogRef.current?.showModal();
    }, []);

    const close = useCallback(() => dialogRef.current?.close(), []);

    const closeWhenBackdropClicked = useCallback((event: MouseEvent<HTMLDialogElement>) => {
        if (event.target === dialogRef.current) close();
    }, [close]);

    return (
        <>
            <button
                className={styles.infoButton}
                onClick={open}
                aria-label="Retro description"
            >
                <ImInfo title="Retro description" fontSize={'1rem'} />
            </button>
            <dialog
                ref={dialogRef}
                className={styles.dialog}
                aria-label={`About ${template.name}`}
                onClose={() => setIsOpen(false)}
                onClick={closeWhenBackdropClicked}
            >
                {isOpen && (
                    <div className={styles.container}>
                        <div className={styles.header}>
                            <h2 className={styles.title}>{template.name}</h2>
                            <button
                                className={styles.closeButton}
                                onClick={close}
                                aria-label="Close modal"
                            >&times;</button>
                        </div>
                        <div className={styles.body}>
                            {template.description && (
                                <p className={styles.description} data-testid="retro-description">{template.description}</p>
                            )}
                            <ol className={styles.columns}>
                                {sortedCategories.map((category) => (
                                    <ColumnPreview key={`${category.name}${category.position}`} category={category} />
                                ))}
                            </ol>
                        </div>
                    </div>
                )}
            </dialog>
        </>
    );
}

function ColumnPreview({category}: {category: Category}) {
    const styling = useCategoryStyling(category);

    return (
        <li className={styles.column}>
            <ColumnHeader category={category} styling={styling} />
            <p className={styles.columnDescription}>{category.description}</p>
        </li>
    );
}
