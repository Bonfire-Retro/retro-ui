import {Retro} from "../../../../services/retro-service/RetroService.ts";
import style from "./RetroHeader.module.css";
import {Link} from "react-router-dom";
import {ShareButton} from "../share-button/ShareButton.tsx";
import {EndRetroButton} from "../end-retro-button/EndRetroButton.tsx";
import {SortToggle} from "../sort-toggle/SortToggle.tsx";
import {SortValue} from "../sort-toggle/SortValue.ts";
import {RetroDescriptionModal} from "../retro-description-modal/RetroDescriptionModal.tsx";

interface SortState {
    sortValue: SortValue;
    toggleSort: (sortValue: SortValue) => void;
}

interface RetroHeaderProps {
    isAnonymous: boolean;
    retro: Retro;
    sorting: SortState;
}

export function RetroHeader({isAnonymous, retro, sorting}: RetroHeaderProps) {
    return (<h1 className={style.retroHeaderContainer}>
        <span className={style.leftContent}>
            {!isAnonymous && <Link to={`/teams/${retro.teamId}`} className={'breadcrumb'}>&lt;</Link>}
            <span className={style.templateName}>
                {retro.template.name}
                <RetroDescriptionModal template={retro.template} />
            </span>
        </span>
        <span className={style.rightContent}>
            <SortToggle sortValue={sorting.sortValue} onToggle={sorting.toggleSort} />
            {!isAnonymous && <ShareButton teamId={retro.teamId} retroId={retro.id} />}
            {!isAnonymous && <EndRetroButton teamId={retro.teamId} retroId={retro.id} />}
        </span>
    </h1>);
}