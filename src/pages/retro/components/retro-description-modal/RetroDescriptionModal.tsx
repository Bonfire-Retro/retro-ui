import {useRef} from "react";
import {Template} from "../../../../services/retro-service/RetroService.ts";
import {ImInfo} from "react-icons/im";
import styles from "./RetroDescriptionModal.module.css";
import {CgClose} from "react-icons/cg";
import {RetroDescription} from "../../../../components/retro-description/RetroDescription.tsx";

interface Props {
    template: Template;
}

export function RetroDescriptionModal({template}: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <>
            <button className={styles.infoButton} onClick={() => dialogRef.current?.showModal()} aria-label="Retro description">
                <ImInfo title="Retro description" fontSize={'1rem'}/>
            </button>
            <dialog
                ref={dialogRef}
                className={styles.dialog}
                aria-label={`About ${template.name}`}
                onKeyDown={(e) => {if (e.key === 'Escape') e.stopPropagation();}}
                onClick={(e) => {if (e.target === dialogRef.current) dialogRef.current.close();}}
            >
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>{template.name}</h2>
                        <form method="dialog">
                            <button className={styles.closeButton} aria-label="Close retro description"><CgClose /></button>
                        </form>
                    </div>
                    <div className={styles.body}>
                        <RetroDescription template={template}/>
                    </div>
                </div>
            </dialog>
        </>
    );
}
