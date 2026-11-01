import {Fragment} from "react";
import {useLoaderData} from "react-router-dom";
import {TemplatesPageData} from "./templatesLoader.ts";
import {RetroDescription} from "../../components/retro-description/RetroDescription.tsx";
import {CountSeparator} from "../retro/components/count-separator/CountSeparator.tsx";
import styles from "./TemplatesPage.module.css";

export function TemplatesPage() {
    const {templates} = useLoaderData() as TemplatesPageData;

    return (
        <div className={styles.templatesPage}>
            <h1>Retro Templates</h1>
            {templates.map((template, index) => (
                <Fragment key={template.id}>
                    {index > 0 && <CountSeparator/>}
                    <section className={styles.template}>
                        <h2 id={template.id} className={styles.templateName}>{template.name}</h2>
                        <RetroDescription template={template}/>
                    </section>
                </Fragment>
            ))}
        </div>
    )
}
