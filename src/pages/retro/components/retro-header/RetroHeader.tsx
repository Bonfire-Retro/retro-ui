import {Retro} from "../../../../services/retro-service/RetroService.ts";
import style from "../../RetroPage.module.css";
import {Link} from "react-router-dom";
import {ShareButton} from "../share-button/ShareButton.tsx";
import {EndRetroButton} from "../end-retro-button/EndRetroButton.tsx";
import {SortToggle} from "../sort-toggle/SortToggle.tsx";
import {SortValue} from "../sort-toggle/SortValue.ts";

interface RetroHeaderProps {
    isAnonymous: boolean;
    retro: Retro;
}

export function RetroHeader({isAnonymous, retro}: RetroHeaderProps) {
    return (<h1 className={style.retroHeaderContainer}>
        {!isAnonymous && <Link to={`/teams/${retro.teamId}`} className={'breadcrumb'}>&lt;</Link>}
        {retro.template.name}
        <SortToggle sortValue={SortValue.TIME} onToggle={() => {}}/>
        {!isAnonymous && <ShareButton teamId={retro.teamId} retroId={retro.id} />}
        {!isAnonymous && <EndRetroButton teamId={retro.teamId} retroId={retro.id} />}
    </h1>);
}